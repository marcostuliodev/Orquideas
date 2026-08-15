import type { GrowthPhase } from "./types";

export const GROWTH_PHASES: GrowthPhase[] = [
  {
    slug: "muda-seedling",
    title: "Muda / Seedling",
    order: 1,
    durationHint: "1–3 meses",
    description: `Planta jovem recém-adquirida ou propagada, ainda com sistema radicular delicado e poucas folhas. É a fase de maior risco de perda por excesso de água ou luz forte. O foco é enraizar e estabelecer, não florir.`,
    care: {
      luz: "Luz indireta, sombra clara (sombrite 70%). Evite sol direto.",
      rega: "Substrato levemente úmido, nunca encharcado. Imersão rápida e boa drenagem.",
      adubacao:
        "Suspensa ou doses mínimas (1/4 da dose) de fórmula equilibrada, a cada 15 dias.",
      ambiente:
        "Umidade alta (70–80%) e calor estável (22–28 °C). Sem correntes de ar.",
    },
  },
  {
    slug: "crescimento-vegetativo",
    title: "Crescimento Vegetativo",
    order: 2,
    durationHint: "3–6 meses",
    description: `Período em que a planta produz novas folhas, raízes e pseudobulbos. Há grande consumo de energia e água. É quando se consolida o tamanho da próxima floração.`,
    care: {
      luz: "Luz abundante e indireta; aumente gradualmente conforme a espécie.",
      rega: "Frequente, mantendo o substrato úmido entre regas (sem encharcar).",
      adubacao:
        "Vegetativa (NPK alto em N, ex.: 30-10-10) a cada rega ou a cada 2, diluída.",
      ambiente: "Umidade 60–80%, ventilação constante, 20–30 °C.",
    },
  },
  {
    slug: "maturacao-rustificacao",
    title: "Maturação / Rustificação",
    order: 3,
    durationHint: "1–2 meses",
    description: `O pseudobulbo novo endurece e armazena reservas. A planta reduz o ritmo de brotação. É a preparação para florir: uma planta "mole" não floresce bem.`,
    care: {
      luz: "Luz forte (mas filtrada) para lignificar o pseudobulbo.",
      rega: "Mantenha, mas comece a espaçar levemente as regas.",
      adubacao:
        "Reduzir nitrogênio; mudar para fórmula balanceada e depois pausar.",
      ambiente:
        "Umidade um pouco menor; ar bem circulado evita fungos na maturação.",
    },
  },
  {
    slug: "inducao-floral",
    title: "Indução Floral",
    order: 4,
    durationHint: "2–4 semanas de estímulo",
    description: `Estímulo que faz a planta trocar o crescimento vegetativo pela formação de botões. Em Phalaenopsis, é o resfriamento noturno (15–18 °C por 2–4 semanas); em Dendrobium, uma seca leve; em Cymbidium, frio intenso. Sem o estímulo certo, a planta só faz folha.`,
    care: {
      luz: "Mantida boa; em alguns grupos, leve redução.",
      rega: "Conforme o grupo: Phalaenopsis mantém; Dendrobium reduz a água.",
      adubacao:
        "Suspender ou mínima; a planta deve sentir um 'estresse' controlado.",
      ambiente:
        "O estímulo-chave: choque de temperatura ou seca conforme a espécie.",
    },
  },
  {
    slug: "botoes-floracao",
    title: "Botões e Floração",
    order: 5,
    durationHint: "4–10 semanas",
    description: `A haste floral emerge e os botões incham. É a fase mais sensível a pragas, ressecamento e choque. A umidade e a estabilidade definem se os botões abrem ou caem.`,
    care: {
      luz: "Indireta estável; evite mudar de lugar (a haste busca luz e torce).",
      rega: "Regular, sem deixar secar; umidade do ar alta evita botões secos.",
      adubacao:
        "Fórmula de floração (10-30-20) diluída, a cada 2 regas.",
      ambiente:
        "Estável em temperatura e umidade; proteger de correntes e pragas.",
    },
  },
  {
    slug: "pos-floracao-descanso",
    title: "Pós-floração / Descanso",
    order: 6,
    durationHint: "1–3 meses",
    description: `Após as flores caírem, a planta entra em repouso e recupera reservas. A haste pode ser podada (acima de um nó em Phalaenopsis) ou deixada. É o momento de revisar o substrato e preparar o próximo ciclo.`,
    care: {
      luz: "Mantida; aproveite para luz plena filtrada.",
      rega: "Reduzir frequência; a planta consome menos.",
      adubacao: "Suspensa ou muito leve até o surgimento de novo broto.",
      ambiente:
        "Descanso térmico conforme a espécie; ventilação e secagem entre regas.",
    },
  },
];
