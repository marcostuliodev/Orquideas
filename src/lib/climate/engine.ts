// Motor de clima e alertas — 100% local, sem API/token externo.
// Usa as normais climáticas em data.ts para orientar o cultivo de orquídeas.

import { REGION_CLIMATES, CITY_REFS } from "./data";
import type {
  BrazilianRegion,
  ClimateAlert,
  MonthlyNorm,
  RegionClimate,
  Season,
} from "./types";
import { seasonOfMonth } from "../utils";

export function getRegionClimate(region: BrazilianRegion): RegionClimate | undefined {
  return REGION_CLIMATES.find((r) => r.region === region);
}

export function getMonthlyNorm(
  region: BrazilianRegion,
  month: number,
): MonthlyNorm | undefined {
  const climate = getRegionClimate(region);
  if (!climate) return undefined;
  return climate.months[(month - 1 + 12) % 12];
}

export function getCityRegion(city: string, state?: string): BrazilianRegion | undefined {
  const match = CITY_REFS.find(
    (c) => c.city.toLowerCase() === city.toLowerCase() && (!state || c.state === state),
  );
  return match?.region;
}

export function seasonLabel(season: Season): string {
  return {
    verao: "Verão",
    outono: "Outono",
    inverno: "Inverno",
    primavera: "Primavera",
  }[season];
}

// Gera alertas de cultivo com base nas normais do mês e (opcional) nas
// observações registradas pelo usuário.
export function generateAlerts(
  region: BrazilianRegion,
  month: number,
  observation?: { tempMax?: number | null; humidity?: number | null; rainfall?: number | null },
): ClimateAlert[] {
  const norm = getMonthlyNorm(region, month);
  if (!norm) return [];
  const alerts: ClimateAlert[] = [];
  const season = seasonOfMonth(month);

  // Calor excessivo
  if (norm.tempMax >= 33) {
    alerts.push({
      level: "alerta",
      title: "Calor intenso",
      message: `Máxima média de ${norm.tempMax}°C. Use sombrite 50–70%, ventile e regue pela manhã para evitar queima e fungos.`,
      topicSlug: "estufa",
    });
  }

  // Frio / risco de geada (Sul e áreas altas no inverno)
  if (norm.tempMin <= 8) {
    alerts.push({
      level: "alerta",
      title: "Risco de frio/geada",
      message: `Mínima média de ${norm.tempMin}°C. Proteja as plantas à noite, abrigue do vento e evite regar no fim do dia.`,
      topicSlug: "ambiente",
    });
  }

  // Umidade baixa
  if (norm.humidity < 55) {
    alerts.push({
      level: "atencao",
      title: "Umidade baixa",
      message: `UR média de ${norm.humidity}%. Aumente a umidificação (bandeja com pedras/água ou nebulizador) para não ressecar raízes e botões.`,
      topicSlug: "ambiente",
    });
  }

  // Estação seca (pouca chuva no mês)
  if (norm.rainfallMm < 60 && season !== "inverno") {
    alerts.push({
      level: "atencao",
      title: "Período seco",
      message: `Chuva média de apenas ${norm.rainfallMm}mm. Acompanhe a umidade do substrato e regue conforme a necessidade da espécie.`,
      topicSlug: "rega",
    });
  }

  // Pragas proliferam com calor + umidade
  if (norm.tempMax >= 30 && norm.humidity >= 75) {
    alerts.push({
      level: "atencao",
      title: "Pragas em alta",
      message: "Calor e umidade favorecem cochonilha, ácaro e tripes. Faça inspeção semanal e mantenha o ambiente arejado.",
      topicSlug: "pragas",
    });
  }

  // Comparação com observação do usuário
  if (observation?.tempMax != null && observation.tempMax > norm.tempMax + 3) {
    alerts.push({
      level: "alerta",
      title: "Temperatura acima da média",
      message: `Você registrou ${observation.tempMax}°C, acima dos ${norm.tempMax}°C esperados para a região. Redobre a sombra e a ventilação.`,
      topicSlug: "luz",
    });
  }
  if (observation?.humidity != null && observation.humidity < 40) {
    alerts.push({
      level: "atencao",
      title: "Umidade local muito baixa",
      message: `Você registrou ${observation.humidity}% de UR. Abaixo de 40% as pontas das raízes e botões ressecam — umidifique.`,
      topicSlug: "ambiente",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      level: "info",
      title: "Condições favoráveis",
      message: `Clima típico de ${seasonLabel(season)} para a região (${norm.tempMin}–${norm.tempMax}°C, ${norm.humidity}% UR). Mantenha a rotina de cuidados.`,
      topicSlug: "fases",
    });
  }

  return alerts;
}
