import type { Topic } from "./types";

export const TOPICS: Topic[] = [
  {
    slug: "luz",
    title: "Luz e Fotossíntese",
    category: "luz",
    icon: "☀️",
    summary:
      "A luz é o combustível da orquídea. Entenda intensidade, direção e como evitar queimaduras.",
    content: `## O papel da luz
A luz é o principal "combustível" da orquídea. Por meio da fotossíntese, as folhas convertem energia luminosa, água e CO₂ em açúcares que alimentam o crescimento e a floração. Pouca luz gera planta fraca e sem flores; muita luz causa queimadura e estresse.

## Luz direta vs. indireta
- **Luz direta:** raios solares incidem sem obstáculo (sol pleno). Queima facilmente as folhas das orquídeas de interior.
- **Luz indireta:** luz filtrada por cortina, tela ou copa de árvores. É o ideal para a maioria das espécies de vaso.
- **Luz difusa:** sombra luminosa e uniforme, sem sombras duras — o padrão de uma estufa com sombrite.

## Como medir
Use um luxímetro ou app de celular: Phalaenopsis prefere 10.000–15.000 lux; Cattleya e Laelia toleram 25.000–35.000 lux; Oncidium fica entre 15.000–25.000 lux. Observe também a cor da folha: verde médio indica luz boa; verde escuro sugere excesso de sombra; tom avermelhado/bronzeado nas bordas indica luz forte demais.

## Necessidades por grupo
- **Phalaenopsis:** sombra clara, janela de leste ou norte (hemisfério Sul). Nunca sol direto da tarde.
- **Cattleya:** sol da manhã ou tarde filtrado, bastante luz para florir.
- **Oncidium / Miltoniopsis:** intermediário; Miltoniopsis prefere mais sombra que o Oncidium típico.

## Sinais de queimadura
Manchas marrons ou prateadas, secas e sem contorno, geralmente no lado voltado ao sol. Retire a planta da incidência imediata; a folha não recupera, mas a planta brota novas.`,
    seasonTips: {
      verao:
        "Reduza a exposição: use sombrite de 50–70% e ventile. Evite sol direto das 11h–16h.",
      inverno:
        "Aproveite o sol direto da manhã e aproxime as plantas da janela — a luz fraca do inverno raramente queima.",
    },
  },
  {
    slug: "rega",
    title: "Rega e Umidade",
    category: "rega",
    icon: "💧",
    summary:
      "Regar por necessidade, não por calendário. Veja métodos, sinais de seca e erros comuns.",
    content: `## Frequência
Não existe regra de "todo sábado". A rega depende de substrato, vaso, temperatura e umidade. Em vaso de plástico com casca de pinus, regue quando o substrato secar; em barro, seca mais rápido. No verão, pode ser 2–3x por semana; no inverno, 1x por semana ou menos.

## Método: imersão vs. borrifo
- **Imersão:** mergulhe o vaso em água por 10–15 min e deixe escorrer bem. Hidrata todo o substrato e as raízes.
- **Borrifo / regador:** útil para manter umidade, mas raramente hidrata fundo. Use como complemento, nunca como única fonte.

## Como saber se está seca
Levante o vaso (leve = seco), espete um palito de churrasco e veja a umidade, ou observe as raízes aéreas: cinza/prateadas = sede; verdes = úmidas.

## Erros comuns
Encharcar o "coração" (centro da planta) causa podridão. Nunca deixe água acumulada no copo das folhas por dias. Evite regar à noite em clima frio.

## Água adequada
Água de chuva ou filtrada é ideal. Evite água muito clorada ou calcária (pH 5,5–6,5). Se usar água de torneira, deixe descansar 24h para o cloro evaporar.`,
    seasonTips: {
      verao:
        "Regue pela manhã bem cedo e evite molhar as folhas no calor da tarde (favorece fungos).",
      inverno:
        "Reduza a frequência e regue em dia ensolarado, pela manhã, para as raízes secarem no dia.",
    },
  },
  {
    slug: "adubacao",
    title: "Adubação",
    category: "adubacao",
    icon: "🌱",
    summary:
      "NPK, diluição e o momento certo: vegetativo vs. floração, com pausas para lavar sais.",
    content: `## O básico: NPK
N (nitrogênio) = folhas; P (fósforo) = raízes e flores; K (potássio) = resistência e qualidade floral. Orquídeas pedem pouco: "pouco e sempre" vence "muito e raro".

## Frequência e diluição
Adube a cada rega ou a cada 2 regas, sempre diluído (1/4 a 1/2 da dose da embalagem). Melhor fertigar fraco mas frequente do que concentrado.

## Vegetativo vs. floração
- **Fase vegetativa:** fórmula tipo 30-10-10 ou 20-20-20 com micros.
- **Pré-floração / botões:** mude para 10-30-20 ou 15-30-15 para estimular flores.
- **Foliar:** borrifo diluído nas folhas complementa a adubação radicular.

## Pausas e descanso
Intercale uma rega só com água limpa ("lavagem") a cada 4–6 adubações para tirar sais acumulados. No inverno/descanso, suspenda ou reduza drasticamente.

## Cuidado com sais
Excesso de adubo queima pontas de raiz e folha. Se as pontas escurecerem, lave o substrato e pause.`,
    seasonTips: {
      primavera:
        "Retome a adubação vegetativa conforme os brotos aparecem (fórmula rica em N).",
      outono:
        "Transição: reduza nitrogênio e passe para fórmula de floração antes do descanso.",
    },
  },
  {
    slug: "pragas",
    title: "Pragas",
    category: "pragas",
    icon: "🐛",
    summary:
      "Cochonilha, pulgão, ácaro, tripes e broca: identificação e controle orgânico/químico.",
    content: `## Identificação rápida
- **Cochonilha:** pequenos "cotinhos" brancos ou caroços marrons nas folhas e raízes; excreta melado.
- **Pulgão:** insetos verdes ou pretos aglomerados em brotos novos.
- **Ácaro (araíto):** folhas com pontos claros e aspecto de "fuligem"; teias finas. Gosta de calor seco.
- **Tripes:** manchas prateadas e flores deformadas.
- **Broca:** túneis ou galerias nas folhas e pseudobulbos (larvas de besouro/mosca).

## Controle orgânico
Comece sempre pelo menos agressivo: água com sabão neutro + óleo de neem em pulverização; isole a planta; remoção mecânica com algodão e álcool 70%. Repita a cada 5–7 dias por 3 ciclos.

## Controle químico
Se o orgânico falhar, use inseticidas sistêmicos (imidacloprido) ou acaricidas específicos para ácaros (não confunda inseticida com acaricida). Respeite carência e dose.

## Prevenção
Inspeção semanal, boa ventilação e não amontoar vasos. Quarentena de 15 dias para plantas novas.`,
    seasonTips: {
      verao:
        "Pragas proliferam no calor úmido: inspecione 2x por semana e mantenha o ambiente arejado.",
      primavera:
        "Brotos tenros atraem pulgão e tripes — aplique neem preventivo nos novos crescimentos.",
    },
  },
  {
    slug: "doencas",
    title: "Doenças",
    category: "doencas",
    icon: "🦠",
    summary:
      "Podridão de raiz, manchas fúngicas e vírus: prevenção, diagnóstico e tratamento.",
    content: `## Podridão de raiz (fúngica/bacteriana)
Causada por excesso de água e substrato compactado. Raízes ficam moles, escuras e com cheiro ruim; folhas murcham mesmo com substrato úmido. Tratamento: retirar a planta, cortar raiz morta com tesoura esterilizada, cinza ou canela nas feridas, replantar em substrato seco e novo.

## Manchas fúngicas
Pontos ou anéis marrons/ pretos nas folhas (Cercospora, Colletotrichum). Melhore a ventilação, remova folhas atingidas e aplique fungicida preventivo (mancozeb, azoxistrobina) em casos avançados.

## Vírus
Manchas anelares, listras amarelas ou mosaico. Não há cura; isole e descarte para não contaminar o acervo. Esterilize ferramentas após cada corte.

## Prevenção e tratamento
- Regue pela manhã para as folhas secarem no dia.
- Mantenha fluxo de ar.
- Evite ferimentos e contaminação cruzada.
- Renove o substrato (casca de pinus a cada 1–2 anos).`,
    seasonTips: {
      verao:
        "Umidade alta favorece fungos: nunca molhe as folhas à noite e garanta ventilação.",
      inverno:
        "Evite água acumulada no frio — é a causa principal de podridão nesta estação.",
    },
  },
  {
    slug: "ambiente",
    title: "Ambiente e Ventilação",
    category: "ambiente",
    icon: "🌬️",
    summary:
      "Umidade, ventilação, temperatura e como evitar o temido choque térmico.",
    content: `## Umidade
Orquídeas epífitas gostam de 50–80% de umidade relativa. Abaixo de 40% as pontas das raízes e dos botões ressecam. Use umidificador, bandeja com pedras e água, ou borrifo frequente (sem encharcar).

## Ventilação
Ar parado = fungos e pragas. Um ventilador em baixa rotação movimenta o ar sem ressecar. O objetivo é trocar o ar e secar as folhas após a rega.

## Temperatura
A maioria tolera 18–30 °C. Há grupos de clima quente (Phalaenopsis), intermediário (Cattleya, Oncidium) e frio (Cymbidium, Masdevallia). Conheça o grupo da sua planta.

## Choque térmico
Mudanças bruscas (ar-condicionado direto, porta aberta no inverno) derrubam botões e folhas. Mantenha a planta longe de correntes e de janelas que congelam.`,
    seasonTips: {
      verao:
        "Ventile sempre e evite estufa abafada — o calor parado convida pragas e fungos.",
      inverno:
        "Proteja de geada e de correntes frias; mantenha a planta estável e longe de ventos.",
    },
  },
  {
    slug: "estufa",
    title: "Estufa e Sombrite",
    category: "estufa",
    icon: "🏡",
    summary:
      "Tipos de estufa, sombrite 30/50/70%, umidificação e organização do acervo.",
    content: `## Tipos de estufa
- **Telado (madeira/metal + tela):** ótimo para sombra e ventilação, menos retenção de calor.
- **Plástico (filme PE/PC):** retém calor e umidade, exige sombrite e ventilação.
- **Vidro:** clássica, porém cara e quente demais sem controle.

## Sombrite (30/50/70%)
A porcentagem indica a sombra. 30% para espécies de sol (Cattleya); 50% para a maioria (Oncidium, Phalaenopsis); 70% para sombra pesada (Masdevallia, Miltoniopsis). Combine camadas conforme a estação.

## Umidificação
Nebulizadores ou umidificador mantêm 60–80%. Borrifo manual ajuda, mas não substitui a circulação de ar.

## Organização
Vasos em níveis/prateleiras aproveitam luz e fluxo. Separe doentes de sadias. Etiquete cada planta com espécie e data de transplantes.`,
    seasonTips: {
      verao:
        "Dobre o sombrite (50–70%) e mantenha a estufa ventilada para não abafar.",
      inverno:
        "Reduza o sombrite e capture o sol direto para compensar os dias curtos.",
    },
  },
  {
    slug: "fases",
    title: "Fases do Crescimento",
    category: "fases",
    icon: "🔄",
    summary:
      "Do vegetativo à floração: conheça as fases e ajuste cuidados no momento certo.",
    content: `## Ciclo de vida da orquídea
O cultivo segue um ciclo previsível do vegetativo à floração. Conhecer as fases ajuda a ajustar luz, rega e adubação no momento certo.

## As fases
1. **Muda / Seedling:** planta jovem, raízes finas, sensível.
2. **Crescimento Vegetativo:** brota folhas e pseudobulbos; fome de luz e nitrogênio.
3. **Maturação / Rustificação:** pseudobulbo endurece; reduz-se o adubo.
4. **Indução Floral:** estímulo (frio ou seca, conforme espécie) para iniciar botões.
5. **Botões e Floração:** emerge a haste; cuidado redobrado com umidade e pragas.
6. **Pós-floração / Descanso:** planta recupera; poda opcional da haste.

## Por que importa
Cada fase pede água, luz e nutrientes diferentes. Forçar floração sem maturação ou adubar na dormência desperdiça energia e enfraquece a planta. Veja o guia de fases para o cronograma completo.`,
    seasonTips: {
      primavera:
        "Fase de brotação e crescimento vegetativo intenso — luz e adubo voltam com força.",
      outono:
        "Maturação e indução floral: reduza nitrogênio e prepare o resfriamento noturno.",
    },
  },
  {
    slug: "fenomenos",
    title: "Fenômenos Climáticos (El Niño / La Niña)",
    category: "fenomenos",
    icon: "🌊",
    summary:
      "Como o El Niño, a La Niña e o Super El Niño mudam o clima do Brasil e o cultivo das suas orquídeas.",
    content: `## O que são fenômenos ENSO
O **ENSO** (El Niño–Southern Oscillation) é a variação de temperatura do Oceano Pacífico equatorial que reorganiza o clima global. No Brasil, isso se traduz em anos com chuva e calor bem diferentes do normal.

## El Niño
O Pacífico esquenta. No Brasil, traz **seca no Norte e Nordeste**, **chuvas acima da média no Sul e Sudeste** e temperaturas mais altas. O **Super El Niño** é a versão extrema — em 2026, esse é o fenômeno em curso no app.

## La Niña
O oposto: Pacífico mais frio, **chuvas acima da média no Norte/Nordeste** e seca no Sul/Sudeste, com temperaturas levemente mais amenas.

## O que fazer na sua coleção
- **Estiagem (El Niño no Norte/Nordeste):** umidifique (bandeja com pedras/água, nebulizador), regue conforme a necessidade e proteja as raízes da dessecação.
- **Excesso de chuva (El Niño no Sul/Sudeste, La Niña no Norte/Nordeste):** ventile bem, evite encharcar o substrato e previna fungos e podridão de raiz.
- **Calor acima do normal:** dobre o sombrite, afaste do sol das 11h–16h e inspecione pragas com mais frequência.

Na página **Clima & Alertas**, o app detecta o fenômeno do ano e já ajusta as normais e os alertas da sua região automaticamente.`,
    seasonTips: {
      verao:
        "Super El Niño potencializa o calor e a estiagem no Norte/Nordeste — umidifique e regue com critério.",
      inverno:
        "Mesmo no inverno, o fenômeno altera chuvas e temperatura: mantenha o acompanhamento na aba Clima.",
    },
  },
];
