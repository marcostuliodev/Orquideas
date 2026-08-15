import { Badge, Button } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";
import { deleteCultivationEventAction } from "@/lib/actions/cultivation";

export interface TimelineEvent {
  id: string;
  type: string;
  occurredAt: Date | string;
  note?: string | null;
  orchidName: string;
  title?: string | null;
}

type Tone = "neutral" | "green" | "bloom" | "amber" | "red";

const EVENT_META: Record<string, { label: string; icon: string; tone: Tone }> = {
  water: { label: "Regar", icon: "💧", tone: "bloom" },
  fertilize: { label: "Adubar", icon: "🌱", tone: "green" },
  bloom: { label: "Florou", icon: "🌸", tone: "bloom" },
  treat: { label: "Tratar praga", icon: "🛡️", tone: "red" },
  repot: { label: "Transplantar", icon: "🪴", tone: "amber" },
  measure: { label: "Medir", icon: "📏", tone: "neutral" },
  photo: { label: "Foto", icon: "📷", tone: "neutral" },
  note: { label: "Observação", icon: "📝", tone: "neutral" },
};

/**
 * Timeline vertical de eventos de cultivo (server component, reutilizável).
 * Cada item traz ícone/label por tipo, cor (Badge) e botão de exclusão.
 */
export function Timeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-orchid-700">Nenhum evento registrado ainda.</p>;
  }

  return (
    <ol className="relative space-y-5 border-l border-orchid-100 pl-6">
      {events.map((e) => {
        const meta = EVENT_META[e.type] ?? { label: e.type, icon: "•", tone: "neutral" as Tone };
        return (
          <li key={e.id} className="relative">
            <span
              aria-hidden
              className="absolute -left-[2.05rem] flex h-8 w-8 items-center justify-center rounded-full bg-orchid-50 text-base ring-1 ring-orchid-100"
            >
              {meta.icon}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={meta.tone}>{meta.label}</Badge>
              <span className="text-sm font-medium text-orchid-800">{e.orchidName}</span>
              <span className="text-xs text-orchid-600">{formatDateTime(e.occurredAt)}</span>
              <form action={deleteCultivationEventAction} className="ml-auto">
                <input type="hidden" name="id" value={e.id} />
                <Button
                  variant="ghost"
                  type="submit"
                  className="px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  Excluir
                </Button>
              </form>
            </div>
            {e.title && <p className="mt-1 text-sm font-semibold text-orchid-900">{e.title}</p>}
            {e.note && <p className="mt-0.5 text-sm text-orchid-700">{e.note}</p>}
          </li>
        );
      })}
    </ol>
  );
}
