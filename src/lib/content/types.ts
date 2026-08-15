// Contratos de conteúdo do acervo de cultivo e calendário sazonal.

export type TopicCategory =
  | "luz"
  | "rega"
  | "adubacao"
  | "pragas"
  | "doencas"
  | "ambiente"
  | "estufa"
  | "fases"
  | "fenomenos";

export type Season = "verao" | "outono" | "inverno" | "primavera";

export interface Topic {
  slug: string; // ex.: "luz"
  title: string; // ex.: "Luz e Fotossíntese"
  category: TopicCategory;
  icon: string; // emoji ou nome de ícone (uso livre)
  summary: string; // resumo de 1-2 linhas
  content: string; // corpo em Markdown
  seasonTips?: Partial<Record<Season, string>>; // dicas por estação
}

// Fases do crescimento vegetativo até a floração
export interface GrowthPhase {
  slug: string;
  title: string;
  order: number; // 1..N
  durationHint: string; // ex.: "2-4 semanas"
  description: string; // Markdown
  care: {
    luz?: string;
    rega?: string;
    adubacao?: string;
    ambiente?: string;
  };
}

// Passo a passo de cultivo (onboarding do iniciante)
export interface CultivationStep {
  order: number;
  title: string;
  summary: string;
  detail: string; // Markdown
  relatedTopicSlugs: string[];
}

export interface SeasonInfo {
  slug: Season;
  name: string; // "Verão"
  months: number[]; // [12,1,2] para verão (hemisfério Sul)
  tempRange: [number, number]; // °C típico BR
  daylight: string; // descrição de luz
  tips: string[]; // cuidados gerais da estação
  orchidTips: string[]; // cuidados específicos para orquídeas
}
