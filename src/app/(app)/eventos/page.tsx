import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardTitle, Button, Input, Label, Select, Textarea } from "@/components/ui";
import { saveCultivationEventAction } from "@/lib/actions/cultivation";
import { Timeline, type TimelineEvent } from "@/components/cultivation/Timeline";

const EVENT_TYPES: { value: string; label: string }[] = [
  { value: "water", label: "Regar" },
  { value: "fertilize", label: "Adubar" },
  { value: "bloom", label: "Florou" },
  { value: "treat", label: "Tratar praga" },
  { value: "repot", label: "Transplantar" },
  { value: "measure", label: "Medir" },
  { value: "photo", label: "Foto" },
  { value: "note", label: "Observação" },
];

export default async function EventosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const { error } = await searchParams;

  const orchids = await prisma.orchid.findMany({
    where: { userId: user.id },
    select: { id: true, name: true, stage: true },
    orderBy: { name: "asc" },
  });

  const orchidIds = orchids.map((o) => o.id);

  const cultivationEvents =
    orchidIds.length > 0
      ? await prisma.cultivationEvent.findMany({
          where: { orchidId: { in: orchidIds } },
          include: { orchid: { select: { name: true } } },
          orderBy: { occurredAt: "desc" },
          take: 50,
        })
      : [];

  const events: TimelineEvent[] = cultivationEvents.map((e) => ({
    id: e.id,
    type: e.type,
    occurredAt: e.occurredAt,
    note: e.note,
    orchidName: e.orchid?.name ?? "—",
    title: e.title,
  }));

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-orchid-900">Eventos de cultivo</h1>
        <p className="text-orchid-700">
          Registre e acompanhe o desenvolvimento das suas orquídeas.
        </p>
      </header>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <Card>
        <CardTitle className="text-base">Registrar evento</CardTitle>
        {orchids.length === 0 ? (
          <p className="mt-2 text-sm text-orchid-700">
            Você ainda não cadastrou nenhuma planta. Adicione uma muda para registrar eventos.
          </p>
        ) : (
          <form action={saveCultivationEventAction} className="mt-3 space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label htmlFor="orchidId">Planta</Label>
                <Select id="orchidId" name="orchidId" required defaultValue={orchids[0].id}>
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
                  {EVENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="occurredAt">Data</Label>
                <Input id="occurredAt" name="occurredAt" type="date" defaultValue={today} required />
              </div>
            </div>
            <div>
              <Label htmlFor="note">Observação</Label>
              <Textarea
                id="note"
                name="note"
                rows={2}
                placeholder="Detalhes do evento (opcional)"
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              Registrar evento
            </Button>
          </form>
        )}
      </Card>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-orchid-800">Histórico</h2>
        <Card>
          <Timeline events={events} />
        </Card>
      </section>
    </div>
  );
}
