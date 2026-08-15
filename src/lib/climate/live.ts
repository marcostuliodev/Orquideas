// Camada de clima AO VIVO, HISTÓRICO e PREVISÃO sobre o motor local — sem API key/token.
// Usa Open-Meteo (geocoding + forecast + archive), que não exige credenciais.
// Toda falha cai graciosamente para o modelo de normais embutido.

import type { BrazilianRegion } from "./types";

// Cache em memória (TTL) para reduzir chamadas externas repetidas à mesma cidade.
const CACHE_TTL = 5 * 60 * 1000;
const _cache = new Map<string, { ts: number; value: unknown }>();
function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = _cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return Promise.resolve(hit.value as T);
  return fn().then((v) => {
    _cache.set(key, { ts: Date.now(), value: v });
    return v;
  });
}

// ---- Mapeamento de códigos de tempo (WMO) ----
const WMO: Record<number, { label: string; emoji: string }> = {
  0: { label: "Céu limpo", emoji: "☀️" },
  1: { label: "Maiormente limpo", emoji: "🌤️" },
  2: { label: "Parcialmente nublado", emoji: "⛅" },
  3: { label: "Nublado", emoji: "☁️" },
  45: { label: "Neblina", emoji: "🌫️" },
  48: { label: "Neblina gelada", emoji: "🌫️" },
  51: { label: "Garoa leve", emoji: "🌦️" },
  53: { label: "Garoa moderada", emoji: "🌦️" },
  55: { label: "Garoa intensa", emoji: "🌦️" },
  56: { label: "Garoa congelante", emoji: "🌧️" },
  57: { label: "Garoa congelante", emoji: "🌧️" },
  61: { label: "Chuva fraca", emoji: "🌧️" },
  63: { label: "Chuva moderada", emoji: "🌧️" },
  65: { label: "Chuva forte", emoji: "🌧️" },
  66: { label: "Chuva congelante", emoji: "🌧️" },
  67: { label: "Chuva congelante", emoji: "🌧️" },
  71: { label: "Neve fraca", emoji: "🌨️" },
  73: { label: "Neve moderada", emoji: "🌨️" },
  75: { label: "Neve forte", emoji: "🌨️" },
  77: { label: "Grãos de neve", emoji: "🌨️" },
  80: { label: "Pancadas leves", emoji: "🌦️" },
  81: { label: "Pancadas moderadas", emoji: "🌦️" },
  82: { label: "Pancadas fortes", emoji: "⛈️" },
  85: { label: "Pancadas de neve", emoji: "🌨️" },
  86: { label: "Pancadas de neve", emoji: "🌨️" },
  95: { label: "Tempestade", emoji: "⛈️" },
  96: { label: "Tempestade com granizo", emoji: "⛈️" },
  99: { label: "Tempestade com granizo", emoji: "⛈️" },
};

export function describeWeatherCode(code?: number | null): { label: string; emoji: string } {
  if (code == null) return { label: "—", emoji: "🌡️" };
  return WMO[code] ?? { label: "Desconhecido", emoji: "🌡️" };
}

function windDirLabel(deg?: number): string {
  if (deg == null) return "—";
  const dirs = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO",
  ];
  return dirs[Math.round(deg / 22.5) % 16];
}

// ---- Tipos ----
export interface LiveLocation {
  city: string;
  state?: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  elevation?: number;
}

export interface LiveWeather {
  temp: number;
  apparentTemp?: number;
  humidity: number;
  rainfall: number;
  windSpeed?: number;
  windDirection?: number;
  windDirLabel?: string;
  cloudCover?: number;
  pressureMsl?: number;
  isDay?: boolean;
  weatherCode?: number;
  condition: string;
  conditionEmoji: string;
  location: LiveLocation;
  source: "open-meteo";
  fetchedAt: string;
}

export interface ForecastDay {
  date: string;
  tempMin: number;
  tempMax: number;
  precipitationSum: number;
  weatherCode: number;
  condition: string;
  conditionEmoji: string;
}

export interface Forecast {
  city: string;
  days: ForecastDay[];
  source: "open-meteo";
  fetchedAt: string;
}

export interface HistoricalAverages {
  city: string;
  month: number;
  years: number;
  tempAvg: number;
  rainfallAvg: number;
  source: "open-meteo-archive";
}

interface GeoResult {
  lat: number;
  lon: number;
  name: string;
  state?: string;
  country?: string;
  timezone?: string;
  elevation?: number;
}

async function geocodeCity(city: string): Promise<GeoResult | null> {
  return cached("geo:" + city, async () => {
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city,
        )}&count=1&language=pt&country=BR`,
        { signal: AbortSignal.timeout(5000) },
      );
      const geo = (await geoRes.json()) as {
        results?: {
          latitude: number;
          longitude: number;
          name: string;
          admin1?: string;
          country?: string;
          timezone?: string;
          elevation?: number;
        }[];
      };
      const r = geo.results?.[0];
      if (!r) return null;
      return {
        lat: r.latitude,
        lon: r.longitude,
        name: r.name,
        state: r.admin1,
        country: r.country,
        timezone: r.timezone,
        elevation: r.elevation,
      };
    } catch {
      return null;
    }
  });
}

export async function getLiveWeather(city: string): Promise<LiveWeather | null> {
  try {
    const geo = await geocodeCity(city);
    if (!geo) return null;

    const wRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${geo.lat}&longitude=${geo.lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,` +
        `weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day`,
      { signal: AbortSignal.timeout(5000) },
    );
    const w = (await wRes.json()) as {
      current?: {
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature?: number;
        precipitation?: number;
        rain?: number;
        weather_code?: number;
        cloud_cover?: number;
        pressure_msl?: number;
        wind_speed_10m?: number;
        wind_direction_10m?: number;
        wind_gusts_10m?: number;
        is_day?: number;
      };
    };
    const cur = w.current;
    if (!cur) return null;
    const cond = describeWeatherCode(cur.weather_code);

    return {
      temp: Math.round(cur.temperature_2m),
      apparentTemp: cur.apparent_temperature != null ? Math.round(cur.apparent_temperature) : undefined,
      humidity: Math.round(cur.relative_humidity_2m),
      rainfall: Math.round((cur.precipitation ?? cur.rain ?? 0) * 10) / 10,
      windSpeed: cur.wind_speed_10m != null ? Math.round(cur.wind_speed_10m) : undefined,
      windDirection: cur.wind_direction_10m,
      windDirLabel: windDirLabel(cur.wind_direction_10m),
      cloudCover: cur.cloud_cover != null ? Math.round(cur.cloud_cover) : undefined,
      pressureMsl: cur.pressure_msl != null ? Math.round(cur.pressure_msl) : undefined,
      isDay: cur.is_day === 1,
      weatherCode: cur.weather_code,
      condition: cond.label,
      conditionEmoji: cond.emoji,
      location: {
        city: geo.name,
        state: geo.state,
        country: geo.country,
        latitude: geo.lat,
        longitude: geo.lon,
        timezone: geo.timezone,
        elevation: geo.elevation,
      },
      source: "open-meteo",
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function getForecast(city: string, days = 5): Promise<Forecast | null> {
  try {
    const geo = await geocodeCity(city);
    if (!geo) return null;

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${geo.lat}&longitude=${geo.lon}` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code` +
        `&forecast_days=${days}&timezone=America%2FSao_Paulo`,
      { signal: AbortSignal.timeout(6000) },
    );
    const data = (await res.json()) as {
      daily?: {
        time?: string[];
        temperature_2m_max?: (number | null)[];
        temperature_2m_min?: (number | null)[];
        precipitation_sum?: (number | null)[];
        weather_code?: (number | null)[];
      };
    };
    const d = data.daily;
    if (!d?.time || d.time.length === 0) return null;

    const dayList: ForecastDay[] = d.time.map((date, i) => {
      const code = d.weather_code?.[i] ?? 0;
      const c = describeWeatherCode(code);
      return {
        date,
        tempMax: Math.round(d.temperature_2m_max?.[i] ?? 0),
        tempMin: Math.round(d.temperature_2m_min?.[i] ?? 0),
        precipitationSum: Math.round((d.precipitation_sum?.[i] ?? 0) * 10) / 10,
        weatherCode: code,
        condition: c.label,
        conditionEmoji: c.emoji,
      };
    });

    return {
      city: geo.name,
      days: dayList,
      source: "open-meteo",
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

// Busca a média histórica do mês para os últimos `span` anos (Open-Meteo Archive).
// A API de arquivo não aceita um intervalo multi-anos em uma única chamada, então
// buscamos cada ano separadamente e agregamos as médias.
export async function getHistoricalAverages(
  city: string,
  month: number,
  span = 5,
): Promise<HistoricalAverages | null> {
  try {
    const coords = await geocodeCity(city);
    if (!coords) return null;

    const now = new Date();
    const y = now.getFullYear();
    const mm = String(month).padStart(2, "0");
    const lastDay = new Date(y, month, 0).getDate();
    const endDay = String(lastDay).padStart(2, "0");

    const years = Array.from({ length: span }, (_, i) => y - (span - 1) + i);

    const results = await Promise.all(
      years.map(async (yr) => {
        const res = await fetch(
          `https://archive-api.open-meteo.com/v1/archive?latitude=${coords.lat}&longitude=${coords.lon}` +
            `&start_date=${yr}-${mm}-01&end_date=${yr}-${mm}-${endDay}` +
            `&daily=temperature_2m_mean,precipitation_sum&timezone=America%2FSao_Paulo`,
          { signal: AbortSignal.timeout(8000) },
        );
        const data = (await res.json()) as {
          daily?: {
            temperature_2m_mean?: (number | null)[];
            precipitation_sum?: (number | null)[];
          };
        };
        return {
          temps: (data.daily?.temperature_2m_mean ?? []).filter(
            (t): t is number => typeof t === "number",
          ),
          prec: (data.daily?.precipitation_sum ?? []).filter(
            (p): p is number => typeof p === "number",
          ),
        };
      }),
    );

    const temps = results.flatMap((r) => r.temps);
    const prec = results.flatMap((r) => r.prec);
    if (temps.length === 0) return null;

    const tempAvg = temps.reduce((a, b) => a + b, 0) / temps.length;
    const rainfallAvg = prec.reduce((a, b) => a + b, 0) / span;

    return {
      city,
      month,
      years: span,
      tempAvg: Math.round(tempAvg * 10) / 10,
      rainfallAvg: Math.round(rainfallAvg * 10) / 10,
      source: "open-meteo-archive",
    };
  } catch {
    return null;
  }
}
