import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  Card,
  CardTitle,
  Badge,
  Button,
  Input,
  Label,
  Select,
  Textarea,
} from "@/components/ui";
import {
  addCareLogAction,
  addReminderAction,
  toggleReminderAction,
  deleteOrchidAction,
} from "@/lib/actions/orchids";
import { saveCultivationEventAction } from "@/lib/actions/cultivation";
import { uploadPhotosAction, removePhotoAction } from "@/lib/actions/uploads";
import { Timeline, type TimelineEvent } from "@/components/cultivation/Timeline";

const STAGE_LABELS: Record<string, string> = {
  seedling: "Muda",
  juvenile: "Jovem",
  adult: "Adulta",
  blooming: "Florida",
};
const CARE_LABELS: Record<string, string> = {
  water: "Rega",
  fertilize: "Adubação",
  treat: "Tratamento",
  observe: "Observação",
  repot: "Transplante",
};
const REMINDER_LABELS: Record<string, string> = {
  water: "Regar",
  fertilize: "Adubar",
  treat: "Tratar",
  repot: "Transplantar",
  custom: "Personalizado",
};

export default async function MudaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const orchid = await prisma.orchid.findFirst({
    where: { id, userId: user.id },
    include: {
      careLogs: { orderBy: { date: "desc" }, take: 20 },
      reminders: { orderBy: { dueDate: "asc" } },
    },
  });
  if (!orchid) notFound();

  const photos = Array.isArray(orchid.photos) ? (orchid.photos as { url: string }[]) : [];

  const cultivationEvents = await prisma.cultivationEvent.findMany({
    where: { orchidId: orchid.id },
    include: { orchid: { select: { name: true } } },
    orderBy: { occurredAt: "desc" },
    take: 20,
  });
  const mudaEvents: TimelineEvent[] = cultivationEvents.map((e) => ({
    id: e.id,
    type: e.type,
    occurredAt: e.occurredAt,
    note: e.note,
    orchidName: e.orchid?.name ?? orchid.name,
    title: e.title,
  }));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/mudas" className="text-sm text-orchid-600 hover:underline">
          ← Voltar
        </Link>
        <div className="flex gap-2">
          <Link href={`/mudas/${orchid.id}/edit`}>
            <Button variant="secondary">Editar</Button>
          </Link>
          <form action={deleteOrchidAction}>
            <input type="hidden" name="id" value={orchid.id} />
            <Button variant="danger" type="submit">
              Excluir
            </Button>
          </form>
        </div>
      </div>

      <header className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-orchid-900">{orchid.name}</h1>
        <Badge tone="green">{STAGE_LABELS[orchid.stage] ?? orchid.stage}</Badge>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardTitle className="text-base">Detalhes</CardTitle>
          <dl className="mt-2 grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-orchid-600">Espécie</dt>
            <dd>{orchid.species || "—"}</dd>
            <dt className="text-orchid-600">Híbrido</dt>
            <dd>{orchid.hybrid || "—"}</dd>
            <dt className="text-orchid-600">Origem</dt>
            <dd>{orchid.origin || "—"}</dd>
            <dt className="text-orchid-600">Aquisição</dt>
            <dd>{formatDate(orchid.acquiredAt)}</dd>
            <dt className="text-orchid-600">Local</dt>
            <dd>{orchid.location || "—"}</dd>
            <dt className="text-orchid-600">Lote</dt>
            <dd>{orchid.batch || "—"}</dd>
            <dt className="text-orchid-600">Genealogia</dt>
            <dd>{orchid.parentInfo || "—"}</dd>
          </dl>
          {orchid.notes && (
            <p className="mt-3 text-sm text-orchid-700">
              <span className="font-medium text-orchid-600">Obs: </span>
              {orchid.notes}
            </p>
          )}
        </Card>

        <Card>
          <CardTitle className="text-base">Fotos</CardTitle>
          {photos.length === 0 ? (
            <p className="mt-2 text-sm text-orchid-700">Sem fotos.</p>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {photos.map((p, i) => (
                <div key={i} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={`Foto ${i + 1}`}
                    className="h-24 w-full rounded-lg object-cover"
                  />
                  <form
                    action={removePhotoAction}
                    className="absolute right-1 top-1"
                  >
                    <input type="hidden" name="orchidId" value={orchid.id} />
                    <input type="hidden" name="index" value={i} />
                    <button
                      type="submit"
                      className="rounded-full bg-black/60 px-2 text-xs text-white"
                      aria-label="Remover foto"
                    >
                      ×
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
          <form action={uploadPhotosAction} className="mt-3 space-y-2">
            <input type="hidden" name="orchidId" value={orchid.id} />
            <Input type="file" name="photos" accept="image/*" multiple />
            <Button type="submit" variant="secondary" className="w-full">
              Enviar fotos
            </Button>
          </form>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardTitle className="text-base">Histórico de cuidados</CardTitle>
          <form action={addCareLogAction} className="mt-3 space-y-2">
            <input type="hidden" name="orchidId" value={orchid.id} />
            <div className="grid grid-cols-2 gap-2">
              <Select name="type" defaultValue="water">
                {Object.entries(CARE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </Select>
              <Input name="date" type="datetime-local" defaultValue={new Date().toISOString().slice(0, 16)} />
            </div>
            <Textarea name="note" rows={2} placeholder="Observação" />
            <Button type="submit" className="w-full">
              Registrar cuidado
            </Button>
          </form>
          <ul className="mt-3 space-y-1 text-sm">
            {orchid.careLogs.map((log) => (
              <li key={log.id} className="flex justify-between border-b border-orchid-50 py-1">
                <span>
                  <Badge tone="neutral">{CARE_LABELS[log.type] ?? log.type}</Badge>{" "}
                  {log.note || ""}
                </span>
                <span className="text-orchid-600">{formatDateTime(log.date)}</span>
              </li>
            ))}
            {orchid.careLogs.length === 0 && (
              <li className="text-orchid-700">Nenhum registro ainda.</li>
            )}
          </ul>
        </Card>

        <Card>
          <CardTitle className="text-base">Lembretes</CardTitle>
          <form action={addReminderAction} className="mt-3 space-y-2">
            <input type="hidden" name="orchidId" value={orchid.id} />
            <div className="grid grid-cols-2 gap-2">
              <Select name="type" defaultValue="water">
                {Object.entries(REMINDER_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </Select>
              <Input name="dueDate" type="date" />
            </div>
            <Textarea name="note" rows={2} placeholder="Observação" />
            <Button type="submit" className="w-full">
              Criar lembrete
            </Button>
          </form>
          <ul className="mt-3 space-y-1 text-sm">
            {orchid.reminders.map((r) => (
              <li key={r.id} className="flex items-center justify-between border-b border-orchid-50 py-1">
                <form action={toggleReminderAction} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="orchidId" value={orchid.id} />
                  <input type="checkbox" defaultChecked={r.done} />
                  <button type="submit" className="text-left">
                    <span className={r.done ? "line-through text-orchid-400" : ""}>
                      <Badge tone={r.done ? "neutral" : "amber"}>
                        {REMINDER_LABELS[r.type] ?? r.type}
                      </Badge>{" "}
                      {formatDate(r.dueDate)} {r.note || ""}
                    </span>
                  </button>
                </form>
              </li>
            ))}
            {orchid.reminders.length === 0 && (
              <li className="text-orchid-700">Nenhum lembrete.</li>
            )}
          </ul>
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-orchid-800">Eventos desta muda</h2>
        <Card>
          <CardTitle className="text-base">Registrar evento rápido</CardTitle>
          <form action={saveCultivationEventAction} className="mt-3 space-y-3">
            <input type="hidden" name="orchidId" value={orchid.id} />
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label htmlFor="m-event-type">Tipo</Label>
                <Select id="m-event-type" name="type" defaultValue="water">
                  <option value="water">Regar</option>
                  <option value="fertilize">Adubar</option>
                  <option value="bloom">Florou</option>
                  <option value="treat">Tratar praga</option>
                  <option value="repot">Transplantar</option>
                  <option value="measure">Medir</option>
                  <option value="photo">Foto</option>
                  <option value="note">Observação</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="m-event-date">Data</Label>
                <Input
                  id="m-event-date"
                  name="occurredAt"
                  type="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="m-event-note">Observação</Label>
                <Input id="m-event-note" name="note" placeholder="Opcional" />
              </div>
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              Registrar evento
            </Button>
          </form>
        </Card>
        <Card>
          <Timeline events={mudaEvents} />
        </Card>
      </section>
    </div>
  );
}
