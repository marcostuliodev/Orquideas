"use client";

import { useEffect, useRef, useState } from "react";
import type { LiveWeather, Forecast, HistoricalAverages } from "@/lib/climate/live";

interface Props {
  city: string;
  initialLive: LiveWeather | null;
  initialForecast: Forecast | null;
  initialHistorical: HistoricalAverages | null;
}

const REFRESH_MS = 5 * 60 * 1000; // 5 minutos

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.max(0, Math.round(diff / 60000));
  if (min < 1) return "agora";
  if (min === 1) return "há 1 min";
  return `há ${min} min`;
}

const WD = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MON = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
function weekday(dateStr: string): string {
  // Determinístico (sem toLocaleDateString) para evitar hydration mismatch Node x browser.
  return WD[new Date(dateStr + "T00:00:00").getDay()];
}
function dayNum(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${String(d.getDate()).padStart(2, "0")} ${MON[d.getMonth()]}`;
}

export function LocalClimatePanel({ city, initialLive, initialForecast, initialHistorical }: Props) {
  const [live, setLive] = useState<LiveWeather | null>(initialLive);
  const [forecast, setForecast] = useState<Forecast | null>(initialForecast);
  const [historical, setHistorical] = useState<HistoricalAverages | null>(initialHistorical);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string>(initialLive?.fetchedAt ?? new Date().toISOString());
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  async function refresh() {
    if (!city) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/clima/live?city=${encodeURIComponent(city)}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setLive(data.live ?? null);
        setForecast(data.forecast ?? null);
        setHistorical(data.historical ?? null);
        setUpdatedAt(new Date().toISOString());
      }
    } catch {
      // mantém último estado conhecido em caso de falha de rede
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!city) return;
    timer.current = setInterval(refresh, REFRESH_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  if (!city) {
    return (
      <div className="rounded-lg border border-orchid-100 bg-orchid-50 p-4 text-sm text-orchid-700">
        Informe uma cidade no campo acima para ver as condições climáticas ao vivo, a previsão
        dos próximos dias e a média histórica do mês.
      </div>
    );
  }

  if (!live) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Não foi possível obter o clima ao vivo para <strong>{city}</strong> (verifique o nome da
        cidade ou a conexão). As normais da região e os alertas abaixo continuam disponíveis.
      </div>
    );
  }

  const loc = live.location;

  return (
    <div className="space-y-4">
      {/* Cabeçalho do local */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-orchid-900">
            {live.conditionEmoji} {loc.city}
            {loc.state ? <span className="text-orchid-600">, {loc.state}</span> : null}
          </h2>
          <p className="text-xs text-orchid-600">
            {loc.latitude.toFixed(3)}°, {loc.longitude.toFixed(3)}°
            {loc.timezone ? ` · ${loc.timezone}` : ""}
            {loc.elevation != null ? ` · ${loc.elevation} m` : ""}
          </p>
        </div>
        <div className="text-right">
          <button
            onClick={refresh}
            disabled={loading}
            className="rounded-lg border border-orchid-300 px-3 py-1 text-xs font-medium text-orchid-700 hover:bg-orchid-50 disabled:opacity-50"
          >
            {loading ? "Atualizando…" : "↻ Atualizar"}
          </button>
          <p className="mt-1 text-[11px] text-orchid-500" suppressHydrationWarning>
            Atualiza sozinho a cada 5 min · {timeAgo(updatedAt)}
          </p>
        </div>
      </div>

      {/* Condição atual */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-orchid-200 bg-gradient-to-br from-orchid-50 to-leaf-500/10 p-4 md:col-span-1">
          <div className="text-5xl font-bold text-orchid-900">{live.temp}°C</div>
          <div className="mt-1 text-sm text-orchid-700">
            {live.condition}
            {live.apparentTemp != null ? ` · sensação ${live.apparentTemp}°C` : ""}
          </div>
          <div className="mt-1 text-xs text-orchid-600">
            {live.isDay ? "☀️ Dia" : "🌙 Noite"}
          </div>
        </div>

        <div className="rounded-xl border border-orchid-100 bg-white p-4 md:col-span-2">
          <div className="grid grid-cols-2 gap-y-2 text-sm sm:grid-cols-3">
            <Metric label="Umidade" value={`${live.humidity}%`} />
            <Metric label="Chuva agora" value={`${live.rainfall} mm`} />
            <Metric label="Nebulosidade" value={live.cloudCover != null ? `${live.cloudCover}%` : "—"} />
            <Metric
              label="Vento"
              value={
                live.windSpeed != null
                  ? `${live.windSpeed} km/h ${live.windDirLabel ?? ""}`
                  : "—"
              }
            />
            <Metric label="Pressão" value={undefined} raw={live.pressureMsl != null ? `${live.pressureMsl} hPa` : "—"} />
            <Metric label="Fonte" value={undefined} raw="Open-Meteo" />
          </div>
        </div>
      </div>

      {/* Previsão de 5 dias */}
      {forecast && forecast.days.length > 0 && (
        <div className="rounded-xl border border-orchid-100 bg-white p-4">
          <div className="mb-2 text-sm font-semibold text-orchid-800">Previsão — próximos dias</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {forecast.days.map((d) => (
              <div key={d.date} className="rounded-lg border border-orchid-100 p-2 text-center">
                <div className="text-xs font-medium text-orchid-700">{weekday(d.date)}</div>
                <div className="text-[11px] text-orchid-500">{dayNum(d.date)}</div>
                <div className="my-1 text-2xl">{d.conditionEmoji}</div>
                <div className="text-sm text-orchid-900">
                  {d.tempMax}° / {d.tempMin}°
                </div>
                <div className="text-[11px] text-orchid-500">💧 {d.precipitationSum} mm</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparação histórica */}
      {historical && (
        <div className="rounded-xl border border-leaf-500/40 bg-leaf-500/5 p-4">
          <div className="text-sm font-semibold text-leaf-500">
            📈 Média histórica — {historical.city} (últimos {historical.years} anos)
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-orchid-700 sm:grid-cols-3">
            <Metric label="Temp. média do mês" value={`${historical.tempAvg}°C`} />
            <Metric label="Chuva média do mês" value={`${historical.rainfallAvg} mm`} />
            <Metric
              label="Hoje vs média"
              value={undefined}
              raw={
                live.temp > historical.tempAvg
                  ? `acima ${Math.round((live.temp - historical.tempAvg) * 10) / 10}°`
                  : live.temp < historical.tempAvg
                    ? `abaixo ${Math.round((historical.tempAvg - live.temp) * 10) / 10}°`
                    : "na média"
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  raw,
}: {
  label: string;
  value?: string;
  raw?: string;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-orchid-500">{label}</div>
      <div className="font-medium text-orchid-900">{raw ?? value ?? "—"}</div>
    </div>
  );
}
