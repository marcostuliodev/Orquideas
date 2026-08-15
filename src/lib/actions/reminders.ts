"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const REMINDER_TYPES = ["water", "fertilize", "treat", "repot", "custom"];
const FREQS = ["daily", "weekly", "monthly", "custom"];

const recurringReminderSchema = z.object({
  orchidId: z.string().optional().or(z.literal("")),
  type: z.enum(REMINDER_TYPES as [string, ...string[]]),
  freq: z.enum(FREQS as [string, ...string[]]),
  intervalN: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => {
      const n = Number(v);
      return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
    }),
  anchorDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => {
      if (!v) return new Date();
      const d = new Date(v);
      return Number.isNaN(d.getTime()) ? new Date() : d;
    }),
  note: z.string().max(500).optional().or(z.literal("")),
});

export async function saveRecurringReminderAction(formData: FormData) {
  const user = await requireUser();
  const parsed = recurringReminderSchema.safeParse({
    orchidId: formData.get("orchidId") || "",
    type: formData.get("type"),
    freq: formData.get("freq"),
    intervalN: (formData.get("intervalN") as string) || "",
    anchorDate: formData.get("anchorDate") || "",
    note: formData.get("note") || "",
  });

  if (!parsed.success) {
    redirect(`/lembretes?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados inválidos")}`);
  }
  const d = parsed.data;

  // Se informou planta, ela deve pertencer ao usuário.
  let orchidId: string | null = null;
  if (d.orchidId) {
    const orchid = await prisma.orchid.findFirst({
      where: { id: d.orchidId, userId: user.id },
      select: { id: true },
    });
    if (!orchid) redirect("/lembretes?error=Planta+não+encontrada");
    orchidId = d.orchidId;
  }

  await prisma.recurringReminder.create({
    data: {
      userId: user.id,
      orchidId,
      type: d.type,
      freq: d.freq,
      intervalN: d.intervalN,
      anchorDate: d.anchorDate,
      nextDueAt: d.anchorDate, // primeiro vencimento = anchorDate
      note: d.note || null,
    },
  });

  redirect("/lembretes");
}

export async function toggleRecurringReminderAction(formData: FormData) {
  const user = await requireUser();
  const id = (formData.get("id") as string) || "";
  if (!id) redirect("/lembretes");

  const rr = await prisma.recurringReminder.findFirst({
    where: { id, userId: user.id },
    select: { id: true, active: true },
  });
  if (rr) {
    await prisma.recurringReminder.update({
      where: { id: rr.id },
      data: { active: !rr.active },
    });
  }
  redirect("/lembretes");
}

export async function deleteRecurringReminderAction(formData: FormData) {
  const user = await requireUser();
  const id = (formData.get("id") as string) || "";
  if (!id) redirect("/lembretes");

  const rr = await prisma.recurringReminder.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (rr) {
    await prisma.recurringReminder.delete({ where: { id: rr.id } });
  }
  redirect("/lembretes");
}
