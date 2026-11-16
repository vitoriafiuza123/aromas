/* NATAL
   Tudo o que aparece no Natal fica aqui. Depois de "fim" a página e os avisos somem sozinhos.
   - ate: último dia para pedir e receber antes do Natal (aviso no topo some depois desse dia)
   - aromas: os "cheiros da época" (ids da lista AROMAS em js/data.js)
   - kits: cada kit soma o preço dos itens e tira o desconto (0.05 = 5%), arredondado para ,90
     Foto do kit: img/<id-do-kit>.jpg */
window.NATAL = {
  ate: "2026-12-12",
  fim: "2026-12-25",
  c1: "#EADBD3", c2: "#7A2E2A",
  texto: "Canela, maçã, baunilha e especiarias. Os cheiros que deixam a casa com cara de Natal, e kits prontos para presentear.",
  // Presentes por preço: os kits de Natal + estes produtos, separados pelas faixas abaixo
  faixas: [[0, 30, "Até R$ 30"], [30, 60, "R$ 30 a 60"], [60, 100, "R$ 60 a 100"], [100, 99999, "Acima de R$ 100"]],
  presentes: {
    aromas: ["classica-bamboo", "classica-lavanda-francesa", "classica-flor-de-cerejeira", "classica-black-vanilla",
             "classica-vanilla", "classica-breeze", "classica-maca-com-canela", "caszulo-canela-e-maca"],
    tipos: ["difusor", "agua", "hidratante", "spray"],   // home spray só o de 200 ml
    outros: ["aromat-via-aroma-standard", "aromat-via-aroma-standard-black", "aromat-via-aroma-original", "aromat-via-aroma-matte-black",
             "aromat-via-aroma-stone-black", "aromat-via-aroma-stone-white", "aromat-via-aroma-usb", "aromat-via-aroma-colors-candy-rosa",
             "aromat-via-aroma-colors-terracota-laranja", "aromat-via-aroma-standard-c-bamboo", "aromat-via-aroma-standard-c-vanilla",
             "aromat-via-aroma-original-c-lavanda", "aromat-kit-presente-original-bamboo-lavanda", "aromat-kit-presente-original-flor-de-cerejeira-vanilla",
             "aromat-kit-presente-standard-bamboo-lavanda", "aromat-kit-presente-standard-flor-de-cerejeira-vanilla"]
  },
  aromas: [
    "classica-maca-com-canela", "caszulo-canela-e-maca", "classica-canela-da-india",
    "classica-black-vanilla", "vanilla-lovers-vanilla-spice", "mundo-punta-cana-ameixa-e-vanilla", "caszulo-ameixa-negra"
  ],
  kits: [
    { id: "kit-casa-de-natal", nome: "Kit Casa de Natal", desconto: 0.05,
      texto: "Maçã com Canela em todos os cantos: difusor na sala, spray para receber visita, sachê no armário e essência para o aromatizador.",
      itens: ["dif-de-varetas-200ml-classica-maca-com-canela", "home-spray-200ml-via-aroma-classica-maca-c-canela", "sache-via-aroma-10g-classica-maca-c-canela", "essencia-via-aroma-10ml-classica-maca-c-canela"] },
    { id: "kit-aconchego", nome: "Kit Aconchego", desconto: 0.05,
      texto: "Aromatizador elétrico com quatro essências clássicas para trocar de cheiro quando quiser.",
      itens: ["aromat-via-aroma-standard", "essencia-via-aroma-10ml-classica-maca-c-canela", "essencia-via-aroma-10ml-classica-bamboo", "essencia-via-aroma-10ml-classica-black-vanilla", "essencia-via-aroma-10ml-classica-lavanda-francesa"] },
    { id: "kit-bamboo", nome: "Kit Bamboo", desconto: 0.05,
      texto: "O cheiro mais pedido da Via Aroma, fresco e limpinho, para a casa e para as roupas.",
      itens: ["dif-de-varetas-200ml-classica-bamboo", "agua-perf-via-aroma-500ml-classica-bamboo", "home-spray-200ml-via-aroma-classica-bamboo", "sache-via-aroma-10g-classica-bamboo"] },
    { id: "kit-lavanda-francesa", nome: "Kit Lavanda Francesa", desconto: 0.05,
      texto: "Lavanda para relaxar: difusor, água perfumada para os lençóis, hidratante e sachê.",
      itens: ["dif-de-varetas-200ml-classica-lavanda-francesa", "agua-perf-via-aroma-500ml-classica-lavanda-francesa", "hidratante-classica-provence-200-ml-lavanda-francesa", "sache-via-aroma-25g-classica-lavanda-francesa"] },
    { id: "kit-flor-de-cerejeira", nome: "Kit Flor de Cerejeira", desconto: 0.05,
      texto: "Floral delicado da casa ao corpo, para quem ama um cheiro romântico.",
      itens: ["dif-de-varetas-200ml-classica-flor-de-cerejeira", "home-spray-200ml-via-aroma-classica-flor-de-cerejeira", "hidratante-classica-garden-200-ml-flor-de-cerejeira", "sache-via-aroma-10g-classica-flor-de-cerejeira"] },
    { id: "kit-black-vanilla", nome: "Kit Black Vanilla", desconto: 0.05,
      texto: "Baunilha intensa e envolvente, a cara das noites de dezembro.",
      itens: ["dif-de-varetas-200ml-classica-black-vanilla", "agua-perf-via-aroma-500ml-classica-black-vanilla", "home-spray-200ml-via-aroma-classica-black-vanilla", "sache-via-aroma-25g-classica-black-vanilla"] },
    { id: "kit-classicos", nome: "Kit Clássicos", desconto: 0.05,
      texto: "Seis essências dos cheiros mais amados, para quem já tem aromatizador ou quer conhecer vários.",
      itens: ["essencia-via-aroma-10ml-classica-bamboo", "essencia-via-aroma-10ml-classica-lavanda-francesa", "essencia-via-aroma-10ml-classica-flor-de-cerejeira", "essencia-via-aroma-10ml-classica-black-vanilla", "essencia-via-aroma-10ml-classica-vanilla", "essencia-via-aroma-10ml-classica-breeze"] },
    { id: "kit-lembrancinha", nome: "Kit Lembrancinha", desconto: 0.05,
      texto: "Pequeno e caprichado, perfeito para amigo secreto.",
      itens: ["home-spray-60ml-via-aroma-classica-vanilla", "sache-via-aroma-10g-classica-vanilla", "essencia-via-aroma-10ml-classica-vanilla"] }
  ]
};
