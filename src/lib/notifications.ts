import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export interface NotificationInput {
  type: string;
  title: string;
  body?: string | null;
  link?: string | null;
  data?: unknown;
}

/**
 * Cria uma notificação in-app para o usuário.
 * Função de serviço (não é server action) — pode ser chamada pelo scheduler.
 */
export async function notify(
  userId: string,
  input: NotificationInput,
): Promise<{ id: string }> {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      link: input.link ?? null,
      data: input.data == null ? Prisma.JsonNull : (input.data as Prisma.InputJsonValue),
    },
    select: { id: true },
  });
  return notification;
}

/** Notificações mais recentes do usuário (padrão: 20). */
export async function listNotifications(userId: string, take = 20) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
  });
}

/** Quantidade de notificações não lidas (readAt === null). */
export async function unreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, readAt: null },
  });
}

/** Marca uma notificação como lida (apenas se pertencer ao usuário). */
export async function markRead(id: string, userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { id, userId, readAt: null },
    data: { readAt: new Date() },
  });
}

/** Marca todas as notificações do usuário como lidas. */
export async function markAllRead(userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
}
