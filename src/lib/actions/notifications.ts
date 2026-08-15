"use server";

import { requireUser } from "@/lib/auth";
import { markRead, markAllRead } from "@/lib/notifications";
import { redirect } from "next/navigation";

export async function markNotificationReadAction(formData: FormData) {
  const user = await requireUser();
  const id = (formData.get("id") as string) || "";
  if (!id) redirect("/notificacoes");
  await markRead(id, user.id);
  redirect("/notificacoes");
}

export async function markAllNotificationsReadAction() {
  const user = await requireUser();
  await markAllRead(user.id);
  redirect("/notificacoes");
}
