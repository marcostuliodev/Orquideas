"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canAddOrchid } from "@/lib/billing";
import { redirect } from "next/navigation";

const STAGES = ["seedling", "juvenile", "adult", "blooming"];
const ORIGINS = ["compra", "troca", "seedling", "divisao", "autopolinizacao"];
const CARE_TYPES = ["water", "fertilize", "treat", "observe", "repot"];
const REMINDER_TYPES = ["water", "fertilize", "treat", "repot", "custom"];

const orchidSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Informe um nome").max(120),
  species: z.string().max(120).optional().or(z.literal("")),
  hybrid: z.string().max(120).optional().or(z.literal("")),
  origin: z.enum(ORIGINS as [string, ...string[]]).optional().or(z.literal("")),
  acquiredAt: z.string().optional().or(z.literal("")),
  stage: z.enum(STAGES as [string, ...string[]]).default("seedling"),
  parentInfo: z.string().max(300).optional().or(z.literal("")),
  batch: z.string().max(80).optional().or(z.literal("")),
  location: z.string().max(120).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export async function saveOrchidAction(formData: FormData) {
  const user = await requireUser();
  const parsed = orchidSchema.safeParse({
    id: (formData.get("id") as string) || undefined,
    name: formData.get("name"),
    species: formData.get("species") || "",
    hybrid: formData.get("hybrid") || "",
    origin: formData.get("origin") || "",
    acquiredAt: formData.get("acquiredAt") || "",
    stage: formData.get("stage") || "seedling",
    parentInfo: formData.get("parentInfo") || "",
    batch: formData.get("batch") || "",
    location: formData.get("location") || "",
    notes: formData.get("notes") || "",
  });
  if (!parsed.success) {
    redirect(`/mudas/novo?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados inválidos")}`);
  }
  const d = parsed.data;
  const count = await prisma.orchid.count({ where: { userId: user.id } });
  if (!d.id && !canAddOrchid(user.plan, count)) {
    redirect("/mudas?error=Limite+do+plano+atingido");
  }

  const data = {
    name: d.name,
    species: d.species || null,
    hybrid: d.hybrid || null,
    origin: d.origin || null,
    acquiredAt: d.acquiredAt ? new Date(d.acquiredAt) : null,
    stage: d.stage,
    parentInfo: d.parentInfo || null,
    batch: d.batch || null,
    location: d.location || null,
    notes: d.notes || null,
  };

  if (d.id) {
    // Não sobrescreve fotos: o upload é feito à parte (uploadPhotosAction).
    await prisma.orchid.update({ where: { id: d.id, userId: user.id }, data });
    redirect(`/mudas/${d.id}`);
  }
  const created = await prisma.orchid.create({
    data: { ...data, userId: user.id, photos: [] },
  });
  redirect(`/mudas/${created.id}`);
}

export async function deleteOrchidAction(formData: FormData) {
  const user = await requireUser();
  const id = formData.get("id") as string;
  await prisma.orchid.delete({ where: { id, userId: user.id } });
  redirect("/mudas");
}

const careLogSchema = z.object({
  orchidId: z.string().min(1),
  type: z.enum(CARE_TYPES as [string, ...string[]]),
  date: z.string().min(1),
  note: z.string().max(500).optional().or(z.literal("")),
});

export async function addCareLogAction(formData: FormData) {
  const user = await requireUser();
  const parsed = careLogSchema.safeParse({
    orchidId: formData.get("orchidId"),
    type: formData.get("type"),
    date: formData.get("date"),
    note: formData.get("note") || "",
  });
  if (!parsed.success) redirect(`/mudas/${formData.get("orchidId")}?error=Dados+inválidos`);
  const d = parsed.data;
  const orchid = await prisma.orchid.findFirst({ where: { id: d.orchidId, userId: user.id } });
  if (!orchid) redirect("/mudas");
  await prisma.careLog.create({
    data: { orchidId: d.orchidId, type: d.type, date: new Date(d.date), note: d.note || null },
  });
  redirect(`/mudas/${d.orchidId}`);
}

const reminderSchema = z.object({
  orchidId: z.string().min(1),
  type: z.enum(REMINDER_TYPES as [string, ...string[]]),
  dueDate: z.string().min(1),
  note: z.string().max(500).optional().or(z.literal("")),
});

export async function addReminderAction(formData: FormData) {
  const user = await requireUser();
  const parsed = reminderSchema.safeParse({
    orchidId: formData.get("orchidId"),
    type: formData.get("type"),
    dueDate: formData.get("dueDate"),
    note: formData.get("note") || "",
  });
  if (!parsed.success) redirect(`/mudas/${formData.get("orchidId")}?error=Dados+inválidos`);
  const d = parsed.data;
  const orchid = await prisma.orchid.findFirst({ where: { id: d.orchidId, userId: user.id } });
  if (!orchid) redirect("/mudas");
  await prisma.reminder.create({
    data: { orchidId: d.orchidId, type: d.type, dueDate: new Date(d.dueDate), note: d.note || null },
  });
  redirect(`/mudas/${d.orchidId}`);
}

export async function toggleReminderAction(formData: FormData) {
  const user = await requireUser();
  const id = formData.get("id") as string;
  const orchidId = formData.get("orchidId") as string;
  const reminder = await prisma.reminder.findFirst({
    where: { id, orchid: { userId: user.id } },
  });
  if (reminder) {
    await prisma.reminder.update({ where: { id }, data: { done: !reminder.done } });
  }
  redirect(`/mudas/${orchidId}`);
}
