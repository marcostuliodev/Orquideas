import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardTitle, Badge, Button, Input, Label, Select, Textarea } from "@/components/ui";
import { expandRecurringReminders } from "@/lib/reminders/scheduler";
import {
  saveRecurringReminderAction,
  toggleRecurringReminderAction,
  deleteRecurringReminderAction,
} from "@/lib/actions/reminders";
import { formatDate, formatDateTime } from "@/lib/utils";

const REMINDER_TYPES: { value: string; label: string }[] = [
  { value: "water", label: "Regar" },
  { value: "fertilize", label: "Adubar" },
  { value: "treat", label: "Tratar" },
  { value: "repot", label: "Transplantar" },
  { value: "custom", label: "Personalizado" },
];
const FREQS: { value: string; label: string }[] = [
  { value: "daily", label: "Diário" },
  { value: "weekly", label: "Semanal" },
  { value: "monthly", label: "Mensal" },
  { value: "custom", label: "Personalizado" },
];

const REMINDER_LABELS: Record<string, string> = Object.fromEntries(
  REMINDER_TYPES.map((t) => [t.value, t.label]),
);
const FREQ_LABELS: Record<string, string> = Object.fromEntries(
  FREQS.map((f) => [f.value, f.label]),
);

export default async function LembretesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const { error } = await searchParams;

  // Best-effort: gera ocorrências pendentes antes de buscar (não bloqueia a página).
  try {
    await expandRecurringReminders();
  } catch {
    // falhas de agendamento são ignoradas silenciosamente
  }

  const orchids = await prisma.orchid.findMany({
    where: { userId: user.id },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const recurring = await prisma.recurringReminder.findMany({
    where: { userId: user.id },
    include: { orchid: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  const occurrences = await prisma.reminder.findMany({
    where: {
      recurringReminderId: { not: null },
      orchid: { userId: user.id },
      dueDate: { gte: now },
    },
    include: { orchid: { select: { name: true } } },
    orderBy: { dueDate: "asc" },
  });

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-orchid-900">Lembretes recorrentes</h1>
        <p className="text-orchid-700">
          Automatize regas, adubações e tratamentos. O sistema gera as ocorrências conforme a
          frequência.
        </p>
      </header>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <Card>
        <CardTitle className="text-base">Novo lembrete recorrente</CardTitle>
        <form action={saveRecurringReminderAction} className="mt-3 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="orchidId">Planta (opcional)</Label>
              <Select id="orchidId" name="orchidId" defaultValue="">
                <option value="">Geral (todas)</option>
                {orchids.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select id="type" name="type" defaultValue="water">
                {REMINDER_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="freq">Frequência</Label>
              <Select id="freq" name="freq" defaultValue="weekly">
                {FREQS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="intervalN">Intervalo (nº de dias/semanas/meses)</Label>
              <Input id="intervalN" name="intervalN" type="number" min={1} defaultValue={1} />
            </div>
            <div>
              <Label htmlFor="anchorDate">Data de início</Label>
              <Input id="anchorDate" name="anchorDate" type="date" defaultValue={today} />
            </div>
          </div>
          <div>
            <Label htmlFor="note">Observação</Label>
            <Textarea id="note" name="note" rows={2} placeholder="Detalhes (opcional)" />
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Criar lembrete recorrente
          </Button>
        </form>
      </Card>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-orchid-800">Seus lembretes</h2>
        <Card>
          {recurring.length === 0 ? (
            <p className="text-sm text-orchid-700">Nenhum lembrete recorrente cadastrado.</p>
          ) : (
            <ul className="space-y-2">
              {recurring.map((rr) => (
                <li
                  key={rr.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-orchid-100 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="neutral">{REMINDER_LABELS[rr.type] ?? rr.type}</Badge>
                      <span className="text-sm font-medium text-orchid-800">
                        {FREQ_LABELS[rr.freq] ?? rr.freq}
                      </span>
                      <Badge tone={rr.active ? "green" : "neutral"}>
                        {rr.active ? "Ativo" : "Pausado"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-orchid-600">
                      Próxima: {formatDateTime(rr.nextDueAt)}
                      {rr.orchid ? ` · ${rr.orchid.name}` : " · Geral"}
                      {rr.note ? ` · ${rr.note}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <form action={toggleRecurringReminderAction}>
                      <input type="hidden" name="id" value={rr.id} />
                      <Button variant="secondary" type="submit" className="px-3 py-1.5 text-xs">
                        {rr.active ? "Pausar" : "Ativar"}
                      </Button>
                    </form>
                    <form action={deleteRecurringReminderAction}>
                      <input type="hidden" name="id" value={rr.id} />
                      <Button variant="danger" type="submit" className="px-3 py-1.5 text-xs">
                        Excluir
                      </Button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-orchid-800">Próximas ocorrências</h2>
        <Card>
          {occurrences.length === 0 ? (
            <p className="text-sm text-orchid-700">Nenhuma ocorrência gerada ainda.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {occurrences.map((r) => (
                <li
                  key={r.id}
                  className="flex justify-between border-b border-orchid-50 py-1"
                >
                  <span>
                    <Badge tone="amber">{REMINDER_LABELS[r.type] ?? r.type}</Badge>{" "}
                    {r.orchid?.name ?? "—"}
                    {r.note ? ` — ${r.note}` : ""}
                  </span>
                  <span className="text-orchid-600">{formatDate(r.dueDate)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}
