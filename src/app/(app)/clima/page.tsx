import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { REGION_CLIMATES, CITY_REFS } from "@/lib/climate/data";
import { generateAlerts } from "@/lib/climate/engine";
import { getLiveWeather, getHistoricalAverages, getForecast } from "@/lib/climate/live";
import { LocalClimatePanel } from "@/components/climate/LocalClimatePanel";
import {
  getPhenomenonForYear,
  applyPhenomenon,
  phenomenonAlerts,
} from "@/lib/climate/phenomena";
import { currentSeason, monthLabel } from "@/lib/utils";
import { Card, CardTitle, Badge, Button, Input, Label, Select, Textarea } from "@/components/ui";
import { addObservationAction } from "@/lib/actions/observations";

const REGION_LABELS: Record<string, string> = Object.fromEntries(
  REGION_CLIMATES.map((r) => [r.region, r.label]),
);

export default async function ClimaPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; city?: string; error?: string }>;
}) {
  const user = await requireUser();
  const { region: regionParam, city, error } = await searchParams;
  const region =
    (regionParam as "norte" | "nordeste" | "centro-oeste" | "sudeste" | "sul") || "sudeste";

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const climate = REGION_CLIMATES.find((r) => r.region === region)!;
  const baseNorm = climate.months[month - 1];
  const phenomenon = getPhenomenonForYear(year);
  const norm = phenomenon ? applyPhenomenon(baseNorm, phenomenon, region) : baseNorm;
  const season = currentSeason();
  const live = city ? await getLiveWeather(city) : null;
  const historical = city ? await getHistoricalAverages(city, month) : null;
  const forecast = city ? await getForecast(city, 5) : null;
  const alerts = [
    ...(phenomenon ? phenomenonAlerts(phenomenon, region) : []),
    ...generateAlerts(
      region,
      month,
      live
        ? { tempMax: live.temp, humidity: live.humidity, rainfall: live.rainfall }
        : undefined,
    ),
  ];

  const observations = await prisma.observation.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: 10,
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-orchid-900">Clima & Alertas</h1>
          <p className="text-orchid-700">
            Normais climáticas por região e alertas de cultivo — sem dependência de API externa.
          </p>
        </div>
        <form method="get" className="flex items-end gap-2">
          <div>
            <Label htmlFor="region">Região</Label>
            <Select id="region" name="region" defaultValue={region}>
              {REGION_CLIMATES.map((r) => (
                <option key={r.region} value={r.region}>
                  {r.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="city">Cidade (clima ao vivo)</Label>
            <Input
              id="city"
              name="city"
              list="cities"
              defaultValue={city ?? ""}
              placeholder="Ex.: São Paulo"
            />
          </div>
          <Button type="submit">Ver</Button>
        </form>
      </header>

      {phenomenon && (
        <Card className="border-bloom-500/40 bg-bloom-500/5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-base text-bloom-500">
              🌊 {phenomenon.name} ({phenomenon.intensity}) — {year}
            </CardTitle>
            <Badge tone="bloom">Fenômeno climático ativo</Badge>
          </div>
          <p className="mt-2 text-sm text-orchid-700">{phenomenon.summary}</p>
          <p className="mt-1 text-sm text-orchid-700">
            <span className="font-medium text-orchid-800">Brasil:</span> {phenomenon.brazilImpact}
          </p>
          <p className="mt-1 text-sm text-orchid-700">
            <span className="font-medium text-orchid-800">Orquídeas:</span> {phenomenon.orchidImpact}
          </p>
        </Card>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardTitle className="text-base">Agora ({monthLabel(month)})</CardTitle>
          <p className="mt-2 text-sm text-orchid-700">Temp: {norm.tempMin}–{norm.tempMax}°C</p>
          <p className="text-sm text-orchid-700">Umidade: {norm.humidity}%</p>
          <p className="text-sm text-orchid-700">Chuva: {norm.rainfallMm} mm</p>
          <p className="text-sm text-orchid-700">Luz: {norm.daylightHours}h/dia</p>
          {phenomenon && (
            <Badge tone="bloom" className="mt-2">
              Ajustado: {phenomenon.name}
            </Badge>
          )}
          <Badge tone="neutral" className="mt-2">
            {season === "verao" ? "Verão" : season === "outono" ? "Outono" : season === "inverno" ? "Inverno" : "Primavera"}
          </Badge>
        </Card>

        <Card className="md:col-span-2">
          <CardTitle className="text-base">Alertas de cultivo</CardTitle>
          <div className="mt-3 space-y-2">
            {alerts.map((a, i) => (
              <div
                key={i}
                className={
                  "rounded-lg border p-3 text-sm " +
                  (a.level === "alerta"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : a.level === "atencao"
                      ? "border-amber-200 bg-amber-50 text-amber-800"
                      : "border-orchid-100 bg-orchid-50 text-orchid-700")
                }
              >
                <div className="font-semibold">{a.title}</div>
                <p>{a.message}</p>
                <Link
                  href={`/acervo/${a.topicSlug}`}
                  className="text-xs font-medium underline"
                >
                  Ver no acervo
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="border-orchid-200">
        <LocalClimatePanel
          city={city ?? ""}
          initialLive={live}
          initialForecast={forecast}
          initialHistorical={historical}
        />
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardTitle className="text-base">Registrar observação</CardTitle>
          <form action={addObservationAction} className="mt-3 space-y-3">
            <input type="hidden" name="region" value={region} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="city">Cidade (opcional)</Label>
                <Input id="city" name="city" list="cities" placeholder="Ex.: São Paulo" />
                <datalist id="cities">
                  {CITY_REFS.map((c) => (
                    <option key={c.city} value={c.city} />
                  ))}
                </datalist>
              </div>
              <div>
                <Label htmlFor="date">Data</Label>
                <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="tempMin">Temp. mín (°C)</Label>
                <Input id="tempMin" name="tempMin" type="number" step="0.1" />
              </div>
              <div>
                <Label htmlFor="tempMax">Temp. máx (°C)</Label>
                <Input id="tempMax" name="tempMax" type="number" step="0.1" />
              </div>
              <div>
                <Label htmlFor="humidity">Umidade (%)</Label>
                <Input id="humidity" name="humidity" type="number" step="0.1" />
              </div>
              <div>
                <Label htmlFor="rainfall">Chuva (mm)</Label>
                <Input id="rainfall" name="rainfall" type="number" step="0.1" />
              </div>
            </div>
            <div>
              <Label htmlFor="note">Observação</Label>
              <Textarea id="note" name="note" rows={2} placeholder="Ex.: geada pela manhã" />
            </div>
            <Button type="submit" className="w-full">
              Registrar
            </Button>
          </form>
        </Card>

        <Card>
          <CardTitle className="text-base">Suas observações</CardTitle>
          {observations.length === 0 ? (
            <p className="mt-2 text-sm text-orchid-700">Nenhuma observação registrada ainda.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {observations.map((o) => (
                <li key={o.id} className="rounded-lg border border-orchid-100 p-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-orchid-800">
                      {o.city || REGION_LABELS[o.region]?.split(" ")[0]}
                    </span>
                    <span className="text-orchid-600">
                      {new Date(o.date).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-orchid-700">
                    {o.tempMin != null && `Min ${o.tempMin}° `}
                    {o.tempMax != null && `Máx ${o.tempMax}° `}
                    {o.humidity != null && `UR ${o.humidity}% `}
                    {o.rainfall != null && `Chuva ${o.rainfall}mm`}
                  </p>
                  {o.note && <p className="text-orchid-600">{o.note}</p>}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}
