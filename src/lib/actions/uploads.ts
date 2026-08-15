"use server";

import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function uploadPhotosAction(formData: FormData) {
  const user = await requireUser();
  const orchidId = formData.get("orchidId") as string;
  const orchid = await prisma.orchid.findFirst({ where: { id: orchidId, userId: user.id } });
  if (!orchid) redirect("/mudas");

  const files = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length > 0) {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const existing = Array.isArray(orchid.photos)
      ? (orchid.photos as { url: string }[])
      : [];
    const added: { url: string }[] = [];
    for (const file of files) {
      if (!ALLOWED.includes(file.type) || file.size > MAX_SIZE) continue;
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const filename = `${randomUUID()}.${ext}`;
      const buf = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(UPLOAD_DIR, filename), buf);
      added.push({ url: `/uploads/${filename}` });
    }
    if (added.length > 0) {
      await prisma.orchid.update({
        where: { id: orchid.id },
        data: { photos: [...existing, ...added] },
      });
    }
  }
  redirect(`/mudas/${orchid.id}`);
}

export async function removePhotoAction(formData: FormData) {
  const user = await requireUser();
  const orchidId = formData.get("orchidId") as string;
  const index = Number(formData.get("index"));
  const orchid = await prisma.orchid.findFirst({ where: { id: orchidId, userId: user.id } });
  if (orchid) {
    const photos = Array.isArray(orchid.photos)
      ? (orchid.photos as { url: string }[])
      : [];
    const next = photos.filter((_, i) => i !== index);
    await prisma.orchid.update({ where: { id: orchid.id }, data: { photos: next } });
  }
  redirect(`/mudas/${orchidId}`);
}
