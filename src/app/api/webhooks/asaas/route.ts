import { prisma } from "@/lib/db";

// Webhook do Asaas para confirmação/atualização de status de assinaturas e pagamentos.
// Sempre responde 200 em caso de erro de parsing/processamento para evitar o
// loop de retry do Asaas; apenas falhas de autenticação retornam 401.

interface AsaasPayload {
  event?: string;
  subscription?: { id?: string };
  payment?: { subscription?: string; subscriptionId?: string };
}

export async function POST(req: Request): Promise<Response> {
  // --- Segurança: validação do token ---
  const url = new URL(req.url);
  const token =
    url.searchParams.get("token") ?? req.headers.get("asaas-webhook-token");

  const expected = process.env.ASAAS_WEBHOOK_TOKEN;
  if (!expected || token !== expected) {
    return new Response("unauthorized", { status: 401 });
  }

  // --- Parse do body (qualquer erro -> 200 para não reenviar) ---
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return new Response("ok", { status: 200 });
  }

  try {
    const data = payload as AsaasPayload | null;
    const event = data?.event;

    // --- Mapeamento de evento -> status da assinatura ---
    let status: string | null = null;
    switch (event) {
      case "SUBSCRIPTION_CREATED":
      case "PAYMENT_RECEIVED":
      case "PAYMENT_CONFIRMED":
        status = "active";
        break;
      case "PAYMENT_OVERDUE":
        status = "past_due";
        break;
      case "SUBSCRIPTION_CANCELED":
      case "PAYMENT_DELETED":
      case "SUBSCRIPTION_DELETED":
        status = "canceled";
        break;
      default:
        // Evento não mapeado: confirma recebimento e ignora.
        return new Response("ok", { status: 200 });
    }

    // --- Identificação da assinatura Asaas ---
    const asaasSubId: string | null =
      data?.subscription?.id ??
      data?.payment?.subscription ??
      data?.payment?.subscriptionId ??
      null;

    if (asaasSubId) {
      const sub = await prisma.subscription.findFirst({
        where: { externalId: asaasSubId },
      });

      if (sub) {
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status },
        });

        if (status === "active") {
          await prisma.user.update({
            where: { id: sub.userId },
            data: { plan: sub.plan },
          });
        } else if (status === "canceled") {
          await prisma.user.update({
            where: { id: sub.userId },
            data: { plan: "free" },
          });
        }
      }
    }
  } catch {
    // Erro de processamento: retorna 200 para não causar loop de retry.
    return new Response("ok", { status: 200 });
  }

  return new Response("ok", { status: 200 });
}
