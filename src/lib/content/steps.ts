import type { CultivationStep } from "./types";

export const CULTIVATION_STEPS: CultivationStep[] = [
  {
    order: 1,
    title: "Escolher a Orquídea",
    summary: "Comece pela espécie certa para o seu clima e espaço.",
    detail: `Para iniciantes, **Phalaenopsis** é a mais tolerante e florífera. Se tiver sol da manhã, experimente **Cattleya** ou **Oncidium**. Evite comprar planta com folhas murchas, raízes podres ou pragas visíveis. Prefira vaso transparente (Phalaenopsis) para enxergar as raízes.`,
    relatedTopicSlugs: ["fases", "ambiente"],
  },
  {
    order: 2,
    title: "Preparar o Ambiente",
    summary: "Defina um cantinho com umidade, ventilação e sem correntes.",
    detail: `Escolha um local com luz indireta e ar circulando. Use umidificador ou bandeja com pedras e água se o ar estiver seco. Mantenha a planta longe de saídas de ar-condicionado e de janelas que congelam no inverno. Agrupe vasos para criar microclima.`,
    relatedTopicSlugs: ["ambiente", "estufa"],
  },
  {
    order: 3,
    title: "Posicionar a Luz",
    summary: "A luz certa é o segredo entre folha e flor.",
    detail: `Coloque Phalaenopsis em janela de leste/norte (hemisfério Sul) ou sob sombrite 50%. Cattleya tolera mais sol da manhã. Use o app de lux para conferir: 10–15 mil lux para Phalaenopsis, 25–35 mil para Cattleya. Se a folha ficar avermelhada nas bordas, tire da luz direta.`,
    relatedTopicSlugs: ["luz"],
  },
  {
    order: 4,
    title: "Estabelecer a Rega",
    summary: "Rega por necessidade, não por calendário.",
    detail: `Mergulhe o vaso em água por 10–15 min e deixe escorrer. No verão, 2–3x por semana; no inverno, 1x ou menos. Levante o vaso: leve = seco. Nunca deixe água no "coração" da planta. Regue pela manhã para as folhas secarem no dia.`,
    relatedTopicSlugs: ["rega"],
  },
  {
    order: 5,
    title: "Adubar com Critério",
    summary: "Pouco e frequente vence muito e raro.",
    detail: `Durante o crescimento, adube a cada rega com 1/4 da dose (fórmula 30-10-10 ou 20-20-20). Próximo à floração, troque para 10-30-20. Intercale uma rega só com água para lavar sais. No inverno/descanso, suspenda.`,
    relatedTopicSlugs: ["adubacao", "fases"],
  },
  {
    order: 6,
    title: "Vigiar Pragas e Doenças",
    summary: "Inspeção semanal evita infestação e podridão.",
    detail: `Olhe folhas (frente e verso) e raízes toda semana. Cochonilha, pulgão e ácaro aparecem em calor úmido. Comece com água + sabão neutro + neem; isole a planta. Para podridão, corte a raiz morta e replante seca. Quarentene novas plantas por 15 dias.`,
    relatedTopicSlugs: ["pragas", "doencas"],
  },
  {
    order: 7,
    title: "Acompanhar a Floração",
    summary: "Estabilidade e umidade mantêm os botões abertos.",
    detail: `Quando a haste aparecer, não mude a planta de lugar. Mantenha umidade alta e rega regular. Use adubo de floração diluído. Proteja de correntes e pragas. Após cair as flores, podar a haste (Phalaenopsis acima de um nó) e descansar.`,
    relatedTopicSlugs: ["fases", "ambiente"],
  },
  {
    order: 8,
    title: "Registrar no App",
    summary: "Anotar regas, adubações e floração acelera o aprendizado.",
    detail: `Use o app para registrar cada rega, adubação e mudança de ambiente, além de fotos da floração. O histórico revela padrões (ex.: botões caem sempre no inverno) e sugere o melhor calendário para o seu microclima. Compare com as dicas sazonais do acervo.`,
    relatedTopicSlugs: ["fases", "rega", "adubacao"],
  },
];
