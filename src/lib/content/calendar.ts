import type { SeasonInfo } from "./types";

export const SEASONS: SeasonInfo[] = [
  {
    slug: "verao",
    name: "Verão",
    months: [12, 1, 2],
    tempRange: [25, 38],
    daylight: "Dias longos, sol forte e intenso (mais de 13h de luz).",
    tips: [
      "Hidrate-se e evite exposição prolongada ao sol.",
      "Proteja plantas e animais do calor excessivo.",
      "Verifique sombrite e ventilação de estufas e varandas.",
    ],
    orchidTips: [
      "Dobre o sombrite (50–70%) e ventile a estufa para não abafar.",
      "Regue pela manhã cedo e evite folhas molhadas à tarde.",
      "Inspecione pragas 2x por semana: calor úmido favorece fungos.",
    ],
  },
  {
    slug: "outono",
    name: "Outono",
    months: [3, 4, 5],
    tempRange: [18, 30],
    daylight: "Dias encurtando, luz mais suave e ângulo mais baixo.",
    tips: [
      "Aproveite para podas e limpeza do jardim.",
      "Prepare mudas e vasos para a chegada do frio.",
      "Reduza regas e adubações gradualmente.",
    ],
    orchidTips: [
      "Transição para fórmula de floração e reduza nitrogênio.",
      "Diminua a frequência de rega conforme esfria.",
      "Phalaenopsis: prepare o resfriamento noturno para induzir flores.",
    ],
  },
  {
    slug: "inverno",
    name: "Inverno",
    months: [6, 7, 8],
    tempRange: [5, 22],
    daylight: "Dias curtos, sol baixo e fraco (menos de 11h de luz).",
    tips: [
      "Cuidado com geada no Sul e em áreas altas do Sudeste.",
      "Mantenha ambientes secos e arejados.",
      "Proteja tubérculos, bulbos e mudas sensíveis.",
    ],
    orchidTips: [
      "Risco de geada no Sul: proteja ou abrigue as plantas.",
      "Reduza a rega e regue em dia ensolarado, pela manhã.",
      "Aproveite o sol direto da manhã, tire plantas da luz fraca.",
      "Evite água acumulada no frio — principal causa de podridão.",
    ],
  },
  {
    slug: "primavera",
    name: "Primavera",
    months: [9, 10, 11],
    tempRange: [18, 30],
    daylight: "Dias alongando, luz crescente e bem equilibrada.",
    tips: [
      "Época ideal de plantio e replantio.",
      "Atenção redobrada a pragas em brotos novos.",
      "Retome adubações e irrigações regulares.",
    ],
    orchidTips: [
      "Retomada da adubação vegetativa conforme os brotos aparecem.",
      "Aparecimento de botões: mantenha estabilidade e umidade alta.",
      "Replante após a floração se o substrato estiver velho.",
      "Pulgão e tripes atacam brotos tenros — neem preventivo.",
    ],
  },
];
