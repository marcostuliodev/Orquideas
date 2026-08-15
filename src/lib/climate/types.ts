// Contratos de dados climáticos — sem dependência de API/token externa.
// Base: normais climáticas históricas do Brasil por macro-região (hemisfério Sul).

export type BrazilianRegion =
  | "norte"
  | "nordeste"
  | "centro-oeste"
  | "sudeste"
  | "sul";

export type Season = "verao" | "outono" | "inverno" | "primavera";

export interface MonthlyNorm {
  month: number; // 1-12
  tempMin: number; // °C
  tempMax: number; // °C
  humidity: number; // % UR média
  rainfallMm: number; // precipitação média (mm)
  daylightHours: number; // horas de luz/dia médias
}

export interface RegionClimate {
  region: BrazilianRegion;
  label: string; // nome legível
  climateType: string; // ex.: "Equatorial", "Tropical", "Subtropical", "Semiárido"
  months: MonthlyNorm[]; // exatamente 12, índice 0 = janeiro
}

// Mapeamento de capitais/cidades BR -> região (para o seletor de clima)
export interface CityRef {
  city: string;
  state: string;
  region: BrazilianRegion;
}

export interface ClimateAlert {
  level: "info" | "atencao" | "alerta";
  title: string;
  message: string;
  topicSlug: string; // liga ao conteúdo do acervo
}
