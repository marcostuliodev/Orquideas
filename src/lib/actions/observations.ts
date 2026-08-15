"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const obsSchema = z.object({
  region: z.enum(["norte", "nordeste", "centro-oeste", "sudeste", "sul"]),
  city: z.string().max(120).optional().or(z.literal("")),
  date: z.string().min(1),
  tempMin: z.coerce.number().optional().or(z.literal("").transform(() => undefined)),
  tempMax: z.coerce.number().optional().or(z.literal("").transform(() => undefined)),
  humidity: z.coerce.number().optional().or(z.literal("").transform(() => undefined)),
  rainfall: z.coerce.number().optional().or(z.literal("").transform(() => undefined)),
  note: z.string().max(500).optional().or(z.literal("")),
});

export async function addObservationAction(formData: FormData) {
  const user = await requireUser();
  const parsed = obsSchema.safeParse({
    region: formData.get("region"),
    city: formData.get("city") || "",
    date: formData.get("date"),
    tempMin: (formData.get("tempMin") as string) || "",
    tempMax: (formData.get("tempMax") as string) || "",
    humidity: (formData.get("humidity") as string) || "",
    rainfall: (formData.get("rainfall") as string) || "",
    note: formData.get("note") || "",
  });
  if (!parsed.success) redirect("/clima?error=Dados+inválidos");
  const d = parsed.data;
  await prisma.observation.create({
    data: {
      userId: user.id,
      region: d.region,
      city: d.city || null,
      date: new Date(d.date),
      tempMin: d.tempMin ?? null,
      tempMax: d.tempMax ?? null,
      humidity: d.humidity ?? null,
      rainfall: d.rainfall ?? null,
      note: d.note || null,
    },
  });
  redirect("/clima");
}
