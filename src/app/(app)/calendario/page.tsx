import { SEASONS } from "@/lib/content/calendar";
import { currentSeason, monthLabel } from "@/lib/utils";
import { Card, CardTitle, Badge } from "@/components/ui";

export default function CalendarioPage() {
  const now = currentSeason();
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-orchid-900">Calendário Sazonal</h1>
        <p className="text-orchid-700">
          O que fazer em cada estação do ano no Brasil (hemisfério Sul).
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {SEASONS.map((season) => {
          const active = season.slug === now;
          return (
            <Card
              key={season.slug}
              className={active ? "border-orchid-400 ring-2 ring-orchid-200" : ""}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{season.name}</CardTitle>
                {active && <Badge tone="green">Estação atual</Badge>}
              </div>
              <p className="mt-1 text-sm text-orchid-700">
                Meses: {season.months.map(monthLabel).join(", ")}
              </p>
              <p className="text-sm text-orchid-700">
                Temperatura típica: {season.tempRange[0]}–{season.tempRange[1]}°C
              </p>
              <p className="text-sm text-orchid-700">{season.daylight}</p>

              <h4 className="mt-3 text-sm font-semibold text-orchid-800">Cuidados gerais</h4>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-orchid-700">
                {season.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>

              <h4 className="mt-3 text-sm font-semibold text-bloom-500">Para orquídeas</h4>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-orchid-700">
                {season.orchidTips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
