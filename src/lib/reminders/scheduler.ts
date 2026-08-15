import { prisma } from "@/lib/db";

export type Freq = "daily" | "weekly" | "monthly" | "custom";

/**
 * Calcula a próxima data de vencimento a partir de `from`.
 * Função PURA e testável (sem efeitos colaterais / sem I/O).
 * - daily / custom: soma `intervalN` dias
 * - weekly: soma `intervalN * 7` dias
 * - monthly: soma `intervalN` meses (aritmética de calendário)
 */
export function computeNextDue(freq: Freq, intervalN: number, from: Date): Date {
  const n = Math.max(1, Math.floor(intervalN || 1));
  const next = new Date(from.getTime());
  switch (freq) {
    case "weekly":
      next.setDate(next.getDate() + n * 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + n);
      break;
    case "daily":
    case "custom":
    default:
      next.setDate(next.getDate() + n);
      break;
  }
  return next;
}

const MAX_CATCHUP = 100;

/**
 * Expande os lembretes recorrentes vencidos em Reminders concretos + Notifications.
 * - Busca RecurringReminder ativos, não expirados e com nextDueAt <= now.
 * - Para cada um, faz catch-up (gera 1 item por ciclo vencido, com teto de segurança).
 * - Idempotente: não recria se já existir Reminder para aquele (recurringReminderId, dueDate).
 * - Avança nextDueAt e registra lastGenAt.
 *
 * Retorna a quantidade de notificações geradas (expanded).
 */
export async function expandRecurringReminders(): Promise<number> {
  const now = new Date();

  const due = await prisma.recurringReminder.findMany({
    where: {
      active: true,
      nextDueAt: { lte: now },
      OR: [{ endAfter: null }, { endAfter: { gt: now } }],
    },
  });

  let expanded = 0;
  for (const rr of due) {
    expanded += await processRecurringReminder(rr, now);
  }
  return expanded;
}

async function processRecurringReminder(
  rr: {
    id: string;
    userId: string;
    orchidId: string | null;
    type: string;
    freq: string;
    intervalN: number;
    note: string | null;
    nextDueAt: Date;
  },
  now: Date,
): Promise<number> {
  let generated = 0;
  let cursor = rr.nextDueAt;
  let iterations = 0;

  while (cursor <= now && iterations < MAX_CATCHUP) {
    iterations++;

    // Idempotência: se já geramos para este ciclo exato, apenas avança.
    const existing = await prisma.reminder.findFirst({
      where: { recurringReminderId: rr.id, dueDate: cursor },
      select: { id: true },
    });

    if (!existing) {
      await prisma.$transaction(async (tx) => {
        if (rr.orchidId) {
          await tx.reminder.create({
            data: {
              orchidId: rr.orchidId,
              type: rr.type,
              dueDate: cursor,
              done: false,
              note: rr.note ?? null,
              recurringReminderId: rr.id,
            },
          });
        }
        await tx.notification.create({
          data: {
            userId: rr.userId,
            type: "reminder_due",
            title: `Lembrete: ${rr.type}`,
            body: rr.note ?? null,
            link: rr.orchidId ? `/mudas/${rr.orchidId}` : "/lembretes",
            data: {
              recurringReminderId: rr.id,
              dueDate: cursor.toISOString(),
            },
          },
        });
      });
      generated++;
    }

    cursor = computeNextDue(rr.freq as Freq, rr.intervalN, cursor);
  }

  await prisma.recurringReminder.update({
    where: { id: rr.id },
    data: { nextDueAt: cursor, lastGenAt: new Date() },
  });

  return generated;
}
