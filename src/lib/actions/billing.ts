"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getPlan, asaasCreateCustomer, asaasCreateSubscription } from "@/lib/billing";
import { redirect } from "next/navigation";

const planSchema = z.object({
  planId: z.enum(["free", "pro", "premium"]),
  cpfCnpj: z
    .string()
    .max(20)
    .regex(/^[\d./-]+$/, "CPF/CNPJ inválido")
    .optional()
    .or(z.literal("")),
});

export async function subscribeAction(formData: FormData) {
  const user = await requireUser();
  const parsed = planSchema.safeParse({
    planId: formData.get("planId"),
    cpfCnpj: formData.get("cpfCnpj") || "",
  });
  if (!parsed.success) redirect("/conta?error=Plano+inválido");
  const plan = getPlan(parsed.data.planId);

  // Busca o usuário completo (CPF e cliente Asaas já criado).
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) redirect("/conta?error=Usuário+não+encontrado");

  // Persiste o CPF informado no checkout (se vier) para futuras cobranças.
  const cpfCnpj = parsed.data.cpfCnpj || dbUser.cpfCnpj || undefined;
  if (parsed.data.cpfCnpj && parsed.data.cpfCnpj !== dbUser.cpfCnpj) {
    await prisma.user.update({ where: { id: user.id }, data: { cpfCnpj: parsed.data.cpfCnpj } });
  }

  // Tenta integração real com Asaas; se não houver chave, simula localmente.
  let externalId: string | null = null;
  let status = "active";
  const asaas = await (async () => {
    if (!process.env.ASAAS_API_KEY) return null;
    // Reaproveita o cliente Asaas já criado, se existir.
    let customerId = dbUser.asaasCustomerId;
    if (!customerId) {
      const customer = await asaasCreateCustomer({
        name: dbUser.name,
        email: dbUser.email,
        cpfCnpj,
      });
      if (!customer) return null;
      customerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { asaasCustomerId: customerId } });
    }
    const sub = await asaasCreateSubscription({
      customerId,
      planId: plan.id,
      cycle: "MONTHLY",
    });
    return sub;
  })();
  if (asaas) {
    externalId = asaas.id;
    status = asaas.status === "ACTIVE" ? "active" : "pending";
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { plan: plan.id } }),
    prisma.subscription.upsert({
      where: { externalId: externalId ?? `local-${user.id}` },
      create: {
        userId: user.id,
        externalId: externalId ?? `local-${user.id}`,
        plan: plan.id,
        status,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      update: { plan: plan.id, status, currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    }),
  ]);
  redirect("/conta?success=Plano+atualizado");
}

export async function cancelSubscriptionAction() {
  const user = await requireUser();
  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { plan: "free" } }),
    prisma.subscription.updateMany({
      where: { userId: user.id, status: "active" },
      data: { status: "canceled", cancelAtPeriodEnd: true },
    }),
  ]);
  redirect("/conta?success=Assinatura+cancelada");
}
