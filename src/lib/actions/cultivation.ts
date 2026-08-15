"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const EVENT_TYPES = [
  "water",
  "fertilize",
  "bloom",
  "treat",
  "repot",
  "measure",
  "photo",
  "note",
];

const cultivationEventSchema = z.object({
  orchidId: z.string().min(1, "Planta inválida"),
  type: z.enum(EVENT_TYPES as [string, ...string[]]),
  occurredAt: z.string().min(1, "Informe a data"),
  title: z.string().max(200).optional().or(z.literal("")),
  note: z.string().max(2000).optional().or(z.literal("")),
  photos: z.string().optional().or(z.literal("")), // JSON string opcional
});

export async function saveCultivationEventAction(formData: FormData) {
  const user = await requireUser();
  const parsed = cultivationEventSchema.safeParse({
    orchidId: formData.get("orchidId"),
    type: formData.get("type"),
    occurredAt: formData.get("occurredAt"),
    title: formData.get("title") || "",
    note: formData.get("note") || "",
    photos: formData.get("photos") || "",
  });

  if (!parsed.success) {
    redirect(`/eventos?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados inválidos")}`);
  }
  const d = parsed.data;

  // A planta deve pertencer ao usuário.
  const orchid = await prisma.orchid.findFirst({
    where: { id: d.orchidId, userId: user.id },
  });
  if (!orchid) redirect("/eventos?error=Planta+não+encontrada");

  // Photos: aceita JSON array; em caso de erro/inválido, cai para [].
  let photos: Prisma.InputJsonValue = [];
  if (d.photos) {
    try {
      const parsedPhotos = JSON.parse(d.photos);
      photos = Array.isArray(parsedPhotos) ? parsedPhotos : [];
    } catch {
      photos = [];
    }
  }

  const occurredAt = new Date(d.occurredAt);
  if (Number.isNaN(occurredAt.getTime())) {
    redirect("/eventos?error=Data+inválida");
  }

  await prisma.cultivationEvent.create({
    data: {
      orchidId: d.orchidId,
      type: d.type,
      occurredAt,
      title: d.title || null,
      note: d.note || null,
      photos,
    },
  });

  redirect("/eventos");
}

export async function deleteCultivationEventAction(formData: FormData) {
  const user = await requireUser();
  const id = (formData.get("id") as string) || "";
  if (!id) redirect("/eventos");

  const event = await prisma.cultivationEvent.findFirst({
    where: { id, orchid: { userId: user.id } },
    select: { id: true },
  });
  if (event) {
    await prisma.cultivationEvent.delete({ where: { id: event.id } });
  }
  redirect("/eventos");
}
