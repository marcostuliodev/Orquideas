"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, destroySession, verifyPassword, hashPassword } from "@/lib/auth";
import { redirect } from "next/navigation";

const authSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(80).optional(),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha com ao menos 6 caracteres"),
  cpfCnpj: z
    .string()
    .max(20)
    .regex(/^[\d./-]+$/, "CPF/CNPJ inválido")
    .optional()
    .or(z.literal("")),
});

export async function registerAction(formData: FormData) {
  const parsed = authSchema.safeParse({
    name: formData.get("name") || undefined,
    email: formData.get("email"),
    password: formData.get("password"),
    cpfCnpj: formData.get("cpfCnpj") || "",
  });
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Dados inválidos";
    redirect(`/registro?error=${encodeURIComponent(msg)}`);
  }
  const { name, email, password, cpfCnpj } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) redirect("/registro?error=E-mail+já+cadastrado");
  const user = await prisma.user.create({
    data: {
      name: name ?? "Cultivador",
      email,
      passwordHash: await hashPassword(password),
      cpfCnpj: cpfCnpj || null,
    },
  });
  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    cpfCnpj: user.cpfCnpj,
  });
  redirect("/mudas");
}

export async function loginAction(formData: FormData) {
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) redirect(`/login?error=${encodeURIComponent("E-mail ou senha inválidos")}`);
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    redirect(`/login?error=${encodeURIComponent("E-mail ou senha inválidos")}`);
  }
  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    cpfCnpj: user.cpfCnpj,
  });
  const next = (formData.get("next") as string) || "/mudas";
  redirect(next);
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
