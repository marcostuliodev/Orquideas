// Camada de billing/assinatura.
// Gateway padrão: Asaas (BR). Chaves ficam em env (server-side, nunca no client).
// Sem chave configurada, o fluxo roda em "modo simulação" para o MVP funcionar
// localmente; a integração real é ativada preenchendo ASAAS_API_KEY no .env.

export type PlanId = "free" | "pro" | "premium";

export interface Plan {
  id: PlanId;
  name: string;
  priceBRL: number; // mensal
  description: string;
  features: string[];
  limits: { orchids: number | null }; // null = ilimitado
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Iniciante",
    priceBRL: 0,
    description: "Para quem está começando com poucas plantas.",
    features: [
      "Até 10 mudas/plantas",
      "Acervo de cultivo completo",
      "Calendário sazonal",
      "Clima por região (normais)",
    ],
    limits: { orchids: 10 },
  },
  {
    id: "pro",
    name: "Cultivador Pro",
    priceBRL: 29.9,
    description: "Para hobbistas dedicados e pequenos produtores.",
    features: [
      "Até 200 mudas/plantas",
      "Tudo do Iniciante +",
      "Lembretes e histórico de cuidados",
      "Observações meteorológicas ilimitadas",
      "Alertas inteligentes de cultivo",
    ],
    limits: { orchids: 200 },
  },
  {
    id: "premium",
    name: "Produtor Premium",
    priceBRL: 79.9,
    description: "Para produtores comerciais e coleções grandes.",
    features: [
      "Mudas/plantas ilimitadas",
      "Tudo do Pro +",
      "Lotes, genealogia e origem",
      "Relatórios e exportação",
      "Suporte prioritário",
    ],
    limits: { orchids: null },
  },
];

export function getPlan(id: string): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

export function planOrchidLimit(plan: string): number | null {
  return getPlan(plan).limits.orchids;
}

export function canAddOrchid(plan: string, currentCount: number): boolean {
  const limit = planOrchidLimit(plan);
  if (limit === null) return true;
  return currentCount < limit;
}

// ---- Cliente Asaas (lazy) ----
// Só é usado quando ASAAS_API_KEY está presente. Mantém o MVP funcional sem
// dependência externa obrigatória.
interface AsaasConfig {
  apiUrl: string;
  apiKey: string;
  sandbox: boolean;
}

export function getAsaasConfig(): AsaasConfig | null {
  const apiKey = process.env.ASAAS_API_KEY;
  if (!apiKey) return null;
  const sandbox = (process.env.ASAAS_SANDBOX ?? "true") === "true";
  return {
    apiKey,
    sandbox,
    apiUrl: process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3",
  };
}

export async function asaasCreateCustomer(input: {
  name: string;
  email: string;
  cpfCnpj?: string;
}): Promise<{ id: string } | null> {
  const cfg = getAsaasConfig();
  if (!cfg) return null;
  const res = await fetch(`${cfg.apiUrl}/customers`, {
    method: "POST",
    headers: {
      access_token: cfg.apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { id: string };
  return { id: data.id };
}

export async function asaasCreateSubscription(input: {
  customerId: string;
  planId: PlanId;
  cycle: "MONTHLY" | "YEARLY";
}): Promise<{ id: string; status: string } | null> {
  const cfg = getAsaasConfig();
  if (!cfg) return null;
  // Em produção, mapeie planId -> valor/ciclo no Asaas. Aqui criamos a cobrança.
  const plan = getPlan(input.planId);
  const res = await fetch(`${cfg.apiUrl}/subscriptions`, {
    method: "POST",
    headers: {
      access_token: cfg.apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer: input.customerId,
      billingType: "PIX",
      value: plan.priceBRL,
      cycle: input.cycle,
      description: `Assinatura ${plan.name}`,
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { id: string; status: string };
  return { id: data.id, status: data.status };
}
