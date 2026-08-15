// Fenômenos climáticos (ENSO) e seus efeitos no Brasil.
// Sem dependência de API: modelo embutido, com o Super El Niño de 2026 em destaque.
// Os efeitos ajustam as normais climáticas regionais e geram alertas de cultivo.

import type { BrazilianRegion, ClimateAlert, MonthlyNorm } from "./types";

export type PhenomenonType = "el_nino" | "la_nina" | "neutral";

export interface RegionEffect {
  region: BrazilianRegion;
  tempDelta: number; // °C somado às normais
  rainfallFactor: number; // multiplicador da chuva mensal
  humidityDelta: number; // % somado à umidade
}

export interface ClimatePhenomenon {
  id: string;
  name: string; // "Super El Niño"
  type: PhenomenonType;
  intensity: "moderate" | "strong" | "super";
  startYear: number;
  endYear: number;
  summary: string;
  brazilImpact: string;
  orchidImpact: string;
  effects: RegionEffect[];
}

const EL_NINO_EFFECTS: RegionEffect[] = [
  { region: "norte", tempDelta: 0.5, rainfallFactor: 0.7, humidityDelta: -4 },
  { region: "nordeste", tempDelta: 0.8, rainfallFactor: 0.6, humidityDelta: -6 },
  { region: "centro-oeste", tempDelta: 0.6, rainfallFactor: 0.8, humidityDelta: -4 },
  { region: "sudeste", tempDelta: 0.3, rainfallFactor: 1.15, humidityDelta: 3 },
  { region: "sul", tempDelta: 0.3, rainfallFactor: 1.25, humidityDelta: 5 },
];

const LA_NINA_EFFECTS: RegionEffect[] = [
  { region: "norte", tempDelta: -0.3, rainfallFactor: 1.2, humidityDelta: 4 },
  { region: "nordeste", tempDelta: -0.3, rainfallFactor: 1.3, humidityDelta: 5 },
  { region: "centro-oeste", tempDelta: -0.3, rainfallFactor: 1.15, humidityDelta: 3 },
  { region: "sudeste", tempDelta: -0.2, rainfallFactor: 0.9, humidityDelta: -3 },
  { region: "sul", tempDelta: -0.4, rainfallFactor: 0.8, humidityDelta: -5 },
];

export const PHENOMENA: ClimatePhenomenon[] = [
  {
    id: "super-el-nino-2026",
    name: "Super El Niño",
    type: "el_nino",
    intensity: "super",
    startYear: 2026,
    endYear: 2026,
    summary:
      "Evento El Niño de intensidade excepcional no Oceano Pacífico equatorial, com forte aquecimento das águas superficiais. Em 2026, espera-se um dos episódios mais intensos já registrados.",
    brazilImpact:
      "No Brasil, o Super El Niño costuma trazer seca severa no Norte e Nordeste, chuvas acima da média no Sul e Sudeste, e temperaturas mais altas em boa parte do país.",
    orchidImpact:
      "Atenção redobrada: estiagem no Norte/Nordeste exige umidificação e rega controlada; no Sul/Sudeste, o excesso de chuva favorece fungos e podridão de raiz — ventile e evite encharcar.",
    effects: EL_NINO_EFFECTS,
  },
  {
    id: "el-nino-2023-2024",
    name: "El Niño",
    type: "el_nino",
    intensity: "strong",
    startYear: 2023,
    endYear: 2024,
    summary:
      "Episódio El Niño de intensidade forte, com aquecimento do Pacífico equatorial e alteração dos padrões de chuva no Brasil.",
    brazilImpact:
      "Seca no Norte/Nordeste, chuvas acima da média no Sul/Sudeste e calor em várias regiões.",
    orchidImpact:
      "Equilibre umidade nas regiões secas e previna fungos onde chove acima do normal.",
    effects: EL_NINO_EFFECTS,
  },
  {
    id: "la-nina-2020-2022",
    name: "La Niña",
    type: "la_nina",
    intensity: "moderate",
    startYear: 2020,
    endYear: 2022,
    summary:
      "Fase La Niña (resfriamento do Pacífico equatorial), com efeitos opostos ao El Niño no Brasil.",
    brazilImpact:
      "Chuvas acima da média no Norte/Nordeste e seca no Sul/Sudeste, com temperaturas levemente mais amenas.",
    orchidImpact:
      "No Sul/Sudeste, reduza rega e previna fungos pela umidade; no Norte/Nordeste, aproveite a chuva mas garanta drenagem.",
    effects: LA_NINA_EFFECTS,
  },
];

export function getPhenomena(): ClimatePhenomenon[] {
  return PHENOMENA;
}

export function getPhenomenonForYear(year: number): ClimatePhenomenon | null {
  return PHENOMENA.find((p) => year >= p.startYear && year <= p.endYear) ?? null;
}

export function applyPhenomenon(
  norm: MonthlyNorm,
  phenomenon: ClimatePhenomenon,
  region: BrazilianRegion,
): MonthlyNorm {
  const eff = phenomenon.effects.find((e) => e.region === region);
  if (!eff) return norm;
  return {
    month: norm.month,
    tempMin: Math.round((norm.tempMin + eff.tempDelta) * 10) / 10,
    tempMax: Math.round((norm.tempMax + eff.tempDelta) * 10) / 10,
    humidity: Math.max(0, Math.min(100, Math.round(norm.humidity + eff.humidityDelta))),
    rainfallMm: Math.max(0, Math.round(norm.rainfallMm * eff.rainfallFactor * 10) / 10),
    daylightHours: norm.daylightHours,
  };
}

export function phenomenonAlerts(
  phenomenon: ClimatePhenomenon,
  region: BrazilianRegion,
): ClimateAlert[] {
  const eff = phenomenon.effects.find((e) => e.region === region);
  if (!eff) return [];
  const alerts: ClimateAlert[] = [];
  const isDry = eff.rainfallFactor < 1;
  const isWet = eff.rainfallFactor > 1;

  if (phenomenon.type === "el_nino") {
    alerts.push({
      level: "alerta",
      title: `${phenomenon.name} ativo (${phenomenon.intensity})`,
      message: `${phenomenon.summary} ${phenomenon.brazilImpact} ${phenomenon.orchidImpact}`,
      topicSlug: "ambiente",
    });
  } else if (phenomenon.type === "la_nina") {
    alerts.push({
      level: "atencao",
      title: `${phenomenon.name} ativo`,
      message: `${phenomenon.brazilImpact} ${phenomenon.orchidImpact}`,
      topicSlug: "ambiente",
    });
  }

  if (isDry) {
    alerts.push({
      level: "alerta",
      title: "Estiagem pelo fenômeno",
      message: `Chuva ~${Math.round((1 - eff.rainfallFactor) * 100)}% abaixo do normal na região. Umidifique, regue conforme a necessidade e proteja as raízes da dessecação.`,
      topicSlug: "rega",
    });
  }
  if (isWet) {
    alerts.push({
      level: "atencao",
      title: "Excesso de chuva pelo fenômeno",
      message: `Chuva ~${Math.round((eff.rainfallFactor - 1) * 100)}% acima do normal na região. Previna fungos e podridão: ventile bem e não encharque o substrato.`,
      topicSlug: "doencas",
    });
  }

  return alerts;
}
