/* =========================================================
   FAMÍLIAS DE CHEIRO
   - titulo: as duas linhas grandes do topo da página
   - c1 / c2: cor clara do fundo e cor escura do texto
   - capa: coloque a imagem em img/capas/<id>.png (sem fundo)
           ou img/capas/<id>.jpg (com fundo). Sem capa, o site
           monta uma com as fotos dos produtos.
   ========================================================= */
window.FAMILIAS = [
  { id:"cerejeira", nome:"Cerejeira e Cereja", titulo:["Cerejeira","& cereja."], c1:"#E7A3AA", c2:"#8E2335",
    perfil:"Floral frutado", texto:"Pétalas cor-de-rosa e cerejas maduras. Um floral frutado, delicado e alegre, que deixa a casa com cara de primavera." },
  { id:"rosas-e-peonias", nome:"Rosas e Peônias", titulo:["Rosas","& peônias."], c1:"#EDBCC2", c2:"#7A2A3E",
    perfil:"Floral romântico", texto:"Peônias, rosas, tulipas e hibisco. Um jardim inteiro em flor, romântico e cheio de cor." },
  { id:"flores-brancas", nome:"Flores Brancas", titulo:["Flores","brancas."], c1:"#E4DFCF", c2:"#5A5536",
    perfil:"Floral luminoso", texto:"Jasmim, gardênia, magnólia e lírio. Florais luminosos, limpos e elegantes." },
  { id:"lavanda", nome:"Lavanda", titulo:["Campos","de lavanda."], c1:"#CDC3E2", c2:"#4F3F7E",
    perfil:"Floral herbal", texto:"Limpa, calmante e herbal. A lavanda que lembra roupa de cama recém-trocada e fim de tarde no campo." },
  { id:"baunilha", nome:"Baunilha", titulo:["Doce","baunilha."], c1:"#E9D2AF", c2:"#6B3F22",
    perfil:"Gourmand", texto:"Baunilha, mel, castanhas e especiarias doces. Aconchego em forma de cheiro." },
  { id:"frutas", nome:"Frutas", titulo:["Pomar","de frutas."], c1:"#F1B8A0", c2:"#8C2F2A",
    perfil:"Frutado", texto:"Pera, framboesa, morango, melancia e pitanga. Doce, suculento e divertido." },
  { id:"citricos", nome:"Cítricos", titulo:["Frescor","cítrico."], c1:"#E2DE9C", c2:"#56611B",
    perfil:"Cítrico", texto:"Limão, capim-limão, verbena e mandarina. Energia limpa para começar o dia." },
  { id:"verdes-e-ervas", nome:"Verdes e Ervas", titulo:["Verde","& ervas."], c1:"#C3D3AE", c2:"#2F4A2A",
    perfil:"Verde aromático", texto:"Alecrim, bambu, chá verde e hortelã. Cheiro de jardim depois da chuva." },
  { id:"madeiras", nome:"Madeiras e Âmbar", titulo:["Madeiras","& âmbar."], c1:"#C2AE96", c2:"#3A2A1F",
    perfil:"Amadeirado", texto:"Madeiras nobres, âmbar e íris. Profundo, elegante e acolhedor." },
  { id:"especiarias", nome:"Especiarias", titulo:["Especiarias","quentes."], c1:"#DDA780", c2:"#6B2A16",
    perfil:"Especiado", texto:"Canela, maçã, cardamomo e pimenta rosa. Quentinho como cozinha em dia frio." },
  { id:"frescor-e-mar", nome:"Frescor e Mar", titulo:["Brisa","do mar."], c1:"#BED7DE", c2:"#23505F",
    perfil:"Aquático", texto:"Brisa, maresia e musk marinho. Leve, arejado e com sensação de janela aberta." },
  { id:"limpinho", nome:"Limpinho e Aconchego", titulo:["Cheirinho","de limpo."], c1:"#E0DFE9", c2:"#4A4860",
    perfil:"Musk e talco", texto:"Musk, roupa lavada, coco e talco. Aquele cheiro de casa arrumada e abraço." }
];

// páginas especiais (sem família de cheiro)
window.ESPECIAIS = {
  aromaterapia: { nome:"Aromaterapia", titulo:["Aroma","terapia."], c1:"#D3DCC6", c2:"#33452E",
    texto:"Óleos essenciais puros, blends prontos e roll-ons para usar no dia a dia.", tipos:["oleo","blend","rollon","agua-at","spray-at"] },
  aparelhos: { nome:"Aromatizadores", titulo:["Aroma","tizadores."], c1:"#E3E1DA", c2:"#2F3A28",
    texto:"Aparelhos para usar com as essências: elétricos, USB, Colors, ultrassônico e kits para presente.", tipos:["aparelho","kit"] }
};
