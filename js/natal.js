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
  texto: "Canela, maçã, baunilha e especiarias. Os cheiros que deixam a casa com cara de Natal, e um kit pronto para presentear.",
  aromas: [
    "classica-maca-com-canela", "caszulo-canela-e-maca", "classica-canela-da-india",
    "classica-black-vanilla", "vanilla-lovers-vanilla-spice", "mundo-punta-cana-ameixa-e-vanilla", "caszulo-ameixa-negra"
  ],
  kits: [
    { id: "kit-casa-de-natal", nome: "Kit Casa de Natal", desconto: 0.05,
      texto: "Difusor para perfumar sem parar e home spray para dar aquele toque na hora de receber.",
      itens: ["dif-de-varetas-200ml-classica-maca-com-canela", "home-spray-200ml-via-aroma-classica-maca-c-canela"] }
  ]
};
