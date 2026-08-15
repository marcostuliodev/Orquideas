// Normais climáticas APROXIMADAS para fins de orientação de cultivo de orquídeas.
// NÃO substituem medição local, sensores ou estações meteorológicas (INMET/CPTEC).
// Valores representam médias históricas de longo prazo para cada região do Brasil
// (hemisfério Sul: verão = dez-fev, outono = mar-mai, inverno = jun-ago, primavera = set-nov).

import type {
  BrazilianRegion,
  CityRef,
  MonthlyNorm,
  RegionClimate,
} from "./types";

export const REGION_CLIMATES: RegionClimate[] = [
  {
    region: "norte",
    label: "Norte (Clima Equatorial - referência Manaus)",
    climateType: "Equatorial",
    months: [
      { month: 1, tempMin: 24.0, tempMax: 31.5, humidity: 85.0, rainfallMm: 260.0, daylightHours: 12.3 },
      { month: 2, tempMin: 24.0, tempMax: 31.5, humidity: 85.0, rainfallMm: 290.0, daylightHours: 12.2 },
      { month: 3, tempMin: 24.0, tempMax: 31.5, humidity: 86.0, rainfallMm: 310.0, daylightHours: 12.1 },
      { month: 4, tempMin: 24.0, tempMax: 31.8, humidity: 86.0, rainfallMm: 300.0, daylightHours: 12.0 },
      { month: 5, tempMin: 24.0, tempMax: 31.8, humidity: 85.0, rainfallMm: 250.0, daylightHours: 12.0 },
      { month: 6, tempMin: 23.5, tempMax: 31.5, humidity: 84.0, rainfallMm: 110.0, daylightHours: 12.0 },
      { month: 7, tempMin: 23.0, tempMax: 31.8, humidity: 82.0, rainfallMm: 80.0, daylightHours: 12.1 },
      { month: 8, tempMin: 23.5, tempMax: 32.5, humidity: 82.0, rainfallMm: 70.0, daylightHours: 12.1 },
      { month: 9, tempMin: 24.0, tempMax: 33.0, humidity: 83.0, rainfallMm: 130.0, daylightHours: 12.1 },
      { month: 10, tempMin: 24.0, tempMax: 32.8, humidity: 84.0, rainfallMm: 200.0, daylightHours: 12.2 },
      { month: 11, tempMin: 24.0, tempMax: 32.0, humidity: 85.0, rainfallMm: 230.0, daylightHours: 12.2 },
      { month: 12, tempMin: 24.0, tempMax: 31.5, humidity: 85.0, rainfallMm: 250.0, daylightHours: 12.3 },
    ],
  },
  {
    region: "nordeste",
    label: "Nordeste (Tropical de litoral/agreste - referência Recife/Fortaleza)",
    climateType: "Tropical (litoral/agreste)",
    months: [
      { month: 1, tempMin: 24.0, tempMax: 31.0, humidity: 78.0, rainfallMm: 90.0, daylightHours: 12.4 },
      { month: 2, tempMin: 24.0, tempMax: 31.0, humidity: 80.0, rainfallMm: 120.0, daylightHours: 12.3 },
      { month: 3, tempMin: 23.5, tempMax: 30.5, humidity: 82.0, rainfallMm: 160.0, daylightHours: 12.2 },
      { month: 4, tempMin: 23.0, tempMax: 30.0, humidity: 83.0, rainfallMm: 180.0, daylightHours: 12.0 },
      { month: 5, tempMin: 22.5, tempMax: 29.5, humidity: 82.0, rainfallMm: 170.0, daylightHours: 11.8 },
      { month: 6, tempMin: 21.5, tempMax: 28.5, humidity: 78.0, rainfallMm: 90.0, daylightHours: 11.7 },
      { month: 7, tempMin: 21.0, tempMax: 28.0, humidity: 74.0, rainfallMm: 60.0, daylightHours: 11.7 },
      { month: 8, tempMin: 21.0, tempMax: 28.5, humidity: 72.0, rainfallMm: 40.0, daylightHours: 11.8 },
      { month: 9, tempMin: 21.5, tempMax: 29.5, humidity: 74.0, rainfallMm: 30.0, daylightHours: 12.0 },
      { month: 10, tempMin: 22.5, tempMax: 30.0, humidity: 76.0, rainfallMm: 40.0, daylightHours: 12.2 },
      { month: 11, tempMin: 23.0, tempMax: 30.5, humidity: 77.0, rainfallMm: 50.0, daylightHours: 12.3 },
      { month: 12, tempMin: 23.5, tempMax: 30.8, humidity: 78.0, rainfallMm: 70.0, daylightHours: 12.4 },
    ],
  },
  {
    region: "centro-oeste",
    label: "Centro-Oeste (Tropical com estação seca - referência Brasília/Cuiabá)",
    climateType: "Tropical de savana (Aw)",
    months: [
      { month: 1, tempMin: 21.0, tempMax: 30.0, humidity: 78.0, rainfallMm: 230.0, daylightHours: 12.9 },
      { month: 2, tempMin: 21.0, tempMax: 30.0, humidity: 80.0, rainfallMm: 210.0, daylightHours: 12.5 },
      { month: 3, tempMin: 21.0, tempMax: 30.5, humidity: 80.0, rainfallMm: 200.0, daylightHours: 12.1 },
      { month: 4, tempMin: 19.5, tempMax: 30.5, humidity: 76.0, rainfallMm: 90.0, daylightHours: 11.7 },
      { month: 5, tempMin: 17.0, tempMax: 29.5, humidity: 68.0, rainfallMm: 30.0, daylightHours: 11.3 },
      { month: 6, tempMin: 14.5, tempMax: 28.5, humidity: 58.0, rainfallMm: 8.0, daylightHours: 11.1 },
      { month: 7, tempMin: 14.0, tempMax: 29.0, humidity: 52.0, rainfallMm: 5.0, daylightHours: 11.2 },
      { month: 8, tempMin: 15.5, tempMax: 31.0, humidity: 48.0, rainfallMm: 10.0, daylightHours: 11.5 },
      { month: 9, tempMin: 18.0, tempMax: 32.5, humidity: 52.0, rainfallMm: 45.0, daylightHours: 11.9 },
      { month: 10, tempMin: 20.0, tempMax: 32.5, humidity: 62.0, rainfallMm: 130.0, daylightHours: 12.4 },
      { month: 11, tempMin: 20.5, tempMax: 31.0, humidity: 72.0, rainfallMm: 190.0, daylightHours: 12.8 },
      { month: 12, tempMin: 21.0, tempMax: 30.0, humidity: 77.0, rainfallMm: 230.0, daylightHours: 13.0 },
    ],
  },
  {
    region: "sudeste",
    label: "Sudeste (Tropical de altitude/subtropical - referência São Paulo/Rio)",
    climateType: "Tropical de altitude (Cwa/Am)",
    months: [
      { month: 1, tempMin: 19.0, tempMax: 29.5, humidity: 80.0, rainfallMm: 240.0, daylightHours: 13.4 },
      { month: 2, tempMin: 19.0, tempMax: 29.5, humidity: 80.0, rainfallMm: 220.0, daylightHours: 12.8 },
      { month: 3, tempMin: 18.5, tempMax: 29.0, humidity: 79.0, rainfallMm: 180.0, daylightHours: 12.2 },
      { month: 4, tempMin: 16.5, tempMax: 27.0, humidity: 76.0, rainfallMm: 90.0, daylightHours: 11.5 },
      { month: 5, tempMin: 14.0, tempMax: 24.5, humidity: 72.0, rainfallMm: 55.0, daylightHours: 10.9 },
      { month: 6, tempMin: 11.5, tempMax: 23.0, humidity: 68.0, rainfallMm: 40.0, daylightHours: 10.6 },
      { month: 7, tempMin: 11.0, tempMax: 23.0, humidity: 66.0, rainfallMm: 35.0, daylightHours: 10.7 },
      { month: 8, tempMin: 12.0, tempMax: 24.5, humidity: 64.0, rainfallMm: 35.0, daylightHours: 11.1 },
      { month: 9, tempMin: 14.0, tempMax: 25.5, humidity: 68.0, rainfallMm: 70.0, daylightHours: 11.8 },
      { month: 10, tempMin: 16.0, tempMax: 27.0, humidity: 73.0, rainfallMm: 130.0, daylightHours: 12.5 },
      { month: 11, tempMin: 17.5, tempMax: 28.0, humidity: 77.0, rainfallMm: 170.0, daylightHours: 13.2 },
      { month: 12, tempMin: 18.5, tempMax: 29.0, humidity: 79.0, rainfallMm: 220.0, daylightHours: 13.5 },
    ],
  },
  {
    region: "sul",
    label: "Sul (Subtropical - referência Curitiba/Porto Alegre/Florianópolis)",
    climateType: "Subtropical (Cfa)",
    months: [
      { month: 1, tempMin: 18.0, tempMax: 28.0, humidity: 78.0, rainfallMm: 140.0, daylightHours: 13.8 },
      { month: 2, tempMin: 18.0, tempMax: 28.0, humidity: 79.0, rainfallMm: 130.0, daylightHours: 13.1 },
      { month: 3, tempMin: 16.5, tempMax: 26.5, humidity: 78.0, rainfallMm: 120.0, daylightHours: 12.3 },
      { month: 4, tempMin: 13.5, tempMax: 23.5, humidity: 76.0, rainfallMm: 100.0, daylightHours: 11.4 },
      { month: 5, tempMin: 10.5, tempMax: 20.0, humidity: 76.0, rainfallMm: 110.0, daylightHours: 10.6 },
      { month: 6, tempMin: 7.5, tempMax: 17.5, humidity: 78.0, rainfallMm: 120.0, daylightHours: 10.2 },
      { month: 7, tempMin: 6.5, tempMax: 17.0, humidity: 77.0, rainfallMm: 120.0, daylightHours: 10.4 },
      { month: 8, tempMin: 8.0, tempMax: 19.0, humidity: 74.0, rainfallMm: 110.0, daylightHours: 11.0 },
      { month: 9, tempMin: 11.0, tempMax: 20.5, humidity: 74.0, rainfallMm: 130.0, daylightHours: 11.9 },
      { month: 10, tempMin: 14.0, tempMax: 23.5, humidity: 75.0, rainfallMm: 140.0, daylightHours: 12.8 },
      { month: 11, tempMin: 16.0, tempMax: 25.5, humidity: 76.0, rainfallMm: 120.0, daylightHours: 13.6 },
      { month: 12, tempMin: 17.5, tempMax: 27.5, humidity: 77.0, rainfallMm: 130.0, daylightHours: 14.0 },
    ],
  },
];

export const CITY_REFS: CityRef[] = [
  // Norte
  { city: "Manaus", state: "AM", region: "norte" },
  { city: "Belém", state: "PA", region: "norte" },
  { city: "Rio Branco", state: "AC", region: "norte" },
  { city: "Macapá", state: "AP", region: "norte" },
  { city: "Porto Velho", state: "RO", region: "norte" },
  { city: "Boa Vista", state: "RR", region: "norte" },
  // Nordeste
  { city: "Fortaleza", state: "CE", region: "nordeste" },
  { city: "Recife", state: "PE", region: "nordeste" },
  { city: "Salvador", state: "BA", region: "nordeste" },
  { city: "Natal", state: "RN", region: "nordeste" },
  { city: "Maceió", state: "AL", region: "nordeste" },
  { city: "João Pessoa", state: "PB", region: "nordeste" },
  { city: "Aracaju", state: "SE", region: "nordeste" },
  { city: "São Luís", state: "MA", region: "nordeste" },
  { city: "Teresina", state: "PI", region: "nordeste" },
  // Centro-Oeste
  { city: "Brasília", state: "DF", region: "centro-oeste" },
  { city: "Goiânia", state: "GO", region: "centro-oeste" },
  { city: "Cuiabá", state: "MT", region: "centro-oeste" },
  // Sudeste
  { city: "São Paulo", state: "SP", region: "sudeste" },
  { city: "Rio de Janeiro", state: "RJ", region: "sudeste" },
  { city: "Belo Horizonte", state: "MG", region: "sudeste" },
  { city: "Vitória", state: "ES", region: "sudeste" },
  { city: "Campinas", state: "SP", region: "sudeste" },
  // Sul
  { city: "Curitiba", state: "PR", region: "sul" },
  { city: "Porto Alegre", state: "RS", region: "sul" },
  { city: "Florianópolis", state: "SC", region: "sul" },
  { city: "Joinville", state: "SC", region: "sul" },
];
