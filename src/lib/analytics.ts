import { prisma } from "@/lib/db";

export interface AcervoMetrics {
  total: number;
  byStage: Record<string, number>;
  bloomCount: number;
  bloomRate: number; // 0-100
  careCompliance: number; // 0-100
  eventsByMonth: { month: string; count: number }[];
}

/**
 * Métricas de analytics do acervo do usuário (leitura apenas).
 * - total: nº de plantas
 * - byStage: distribuição por estágio
 * - bloomCount / bloomRate: plantas em floração e sua taxa (%)
 * - careCompliance: % de lembretes concluídos (done) das plantas do usuário
 * - eventsByMonth: eventos de cultivo agregados por mês (últimos 6 meses)
 */
export async function getAcervoMetrics(userId: string): Promise<AcervoMetrics> {
  const total = await prisma.orchid.count({ where: { userId } });

  const stageGroups = await prisma.orchid.groupBy({
    by: ["stage"],
    where: { userId },
    _count: { _all: true },
  });
  const byStage: Record<string, number> = {};
  for (const g of stageGroups) byStage[g.stage] = g._count._all;

  const bloomCount = byStage["blooming"] ?? 0;
  const bloomRate = total > 0 ? Math.round((bloomCount / total) * 100) : 0;

  // Compliance de cuidado: % de lembretes concluídos entre os lembretes das plantas do usuário.
  const reminderAgg = await prisma.reminder.groupBy({
    by: ["done"],
    where: { orchid: { userId } },
    _count: { _all: true },
  });
  let done = 0;
  let totalReminders = 0;
  for (const g of reminderAgg) {
    totalReminders += g._count._all;
    if (g.done) done += g._count._all;
  }
  const careCompliance =
    totalReminders > 0 ? Math.round((done / totalReminders) * 100) : 100;

  // Eventos de cultivo dos últimos 6 meses (mês atual + 5 anteriores), agregados por mês.
  const since = new Date();
  since.setMonth(since.getMonth() - 5);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const events = await prisma.cultivationEvent.findMany({
    where: { orchid: { userId }, occurredAt: { gte: since } },
    select: { occurredAt: true },
  });

  const monthMap = new Map<string, number>();
  for (const e of events) {
    const d = e.occurredAt;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthMap.set(key, (monthMap.get(key) ?? 0) + 1);
  }

  // Garante que os 6 meses apareçam no eixo (mesmo com 0 eventos).
  const eventsByMonth: { month: string; count: number }[] = [];
  const cursor = new Date(since);
  for (let i = 0; i < 6; i++) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
    eventsByMonth.push({ month: key, count: monthMap.get(key) ?? 0 });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return {
    total,
    byStage,
    bloomCount,
    bloomRate,
    careCompliance,
    eventsByMonth,
  };
}
