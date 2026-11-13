(function(){
"use strict";
const C = window.CONFIG, T = window.TIPOS, FAM = window.FAMILIAS, ESP = window.ESPECIAIS;
const $ = (s, el=document) => el.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ---------- Catálogo ---------- */
const AR = Object.fromEntries(window.AROMAS.map(a => [a.id, a]));
const PRODUTOS = window.PRODUTOS;
const BY_ID = Object.fromEntries(PRODUTOS.map(p => [p.id, p]));
const FAM_BY = Object.fromEntries(FAM.map(f => [f.id, f]));
const famOf = p => p.aroma ? AR[p.aroma].fam : null;
const prodsFam = id => PRODUTOS.filter(p => famOf(p) === id);
const aromasFam = id => window.AROMAS.filter(a => a.fam === id && PRODUTOS.some(p => p.aroma === a.id));
const ORDEM_TIPO = Object.keys(T);
const sortProd = (a,b) => (a.aroma && b.aroma ? AR[a.aroma].nome.localeCompare(AR[b.aroma].nome) : 0) || ORDEM_TIPO.indexOf(a.tipo) - ORDEM_TIPO.indexOf(b.tipo) || (parseInt(a.tam)||0) - (parseInt(b.tam)||0);
const aromaLabel = a => a.cidade ? `${a.nome} · ${a.cidade}` : a.nome;

/* ---------- Fotos ---------- */
const foto = id => `${C.PASTA_FOTOS}${id}${C.EXTENSAO_FOTOS}`;
const missing = new Set();
function pic(p){ return `<span class="ph" data-photo="${p.id}"><span class="ph-fallback">${esc(T[p.tipo].nome)}</span></span>`; }
function hydratePhotos(root=document){
  root.querySelectorAll(".ph[data-photo]").forEach(ph => {
    const id = ph.dataset.photo; if (missing.has(id) || ph.dataset.done) return;
    const img = new Image(); img.className = "art"; img.alt = ""; img.decoding = "async";
    img.onload = () => { ph.dataset.done = 1; ph.replaceChildren(img); };
    img.onerror = () => missing.add(id);
    img.src = foto(id);
  });
  // capas: tenta .png (sem fundo) e depois .jpg
  root.querySelectorAll("[data-capa]").forEach(el => {
    if (el.dataset.done) return; el.dataset.done = 1;
    const base = C.PASTA_CAPAS + el.dataset.capa;
    const tryLoad = (exts) => {
      if (!exts.length) return;
      const img = new Image(); img.alt = ""; img.className = "capa-img";
      img.onload = () => { el.classList.add("tem-capa", exts[0] === ".png" ? "capa-png" : "capa-jpg"); el.replaceChildren(img); };
      img.onerror = () => tryLoad(exts.slice(1));
      img.src = base + exts[0];
    };
    tryLoad([".png", ".jpg"]);
  });
}
// montagem provisória da capa: até 3 produtos de tipos diferentes
function montagem(ps){
  const pref = ["difusor","agua","spray","essencia","sache","aparelho","oleo","kit","hidro"];
  const out = [];
  for (const t of pref){ const p = ps.find(x => x.tipo === t && !out.includes(x)); if (p) out.push(p); if (out.length === 3) break; }
  if (out.length < 3) ps.forEach(p => { if (out.length < 3 && !out.includes(p)) out.push(p); });
  return `<div class="montagem">${out.map(p => pic(p)).join("")}</div>`;
}

/* ---------- Sacola ---------- */
let bag = {};
try { bag = JSON.parse(localStorage.getItem("sacola") || "{}") || {}; } catch(e) { bag = {}; }
Object.keys(bag).forEach(id => { if (!BY_ID[id]) delete bag[id]; });
const save = () => { try { localStorage.setItem("sacola", JSON.stringify(bag)); } catch(e){} };
const bagCount = () => Object.values(bag).reduce((a,b) => a+b, 0);
const nomeProd = p => p.aroma ? `${T[p.tipo].nome} ${aromaLabel(AR[p.aroma])}` : (p.tipo === "oleo" ? `Óleo essencial ${p.nome}` : p.tipo === "aparelho" ? `Aromatizador ${p.nome}` : p.nome || T[p.tipo].nome);
const detalhe = p => [p.aroma ? AR[p.aroma].linha : p.linha, p.tam].filter(Boolean).join(" · ");
function setQty(id, q){
  if (q <= 0) delete bag[id]; else bag[id] = Math.min(q, 99);
  save(); updateBadge(); refreshProd(id);
  if ($("#drawer").classList.contains("open") && !sent) renderBag();
}
function updateBadge(bump){
  const b = $("#bagCount"); b.textContent = bagCount();
  if (bump){ b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
}
/* Aviso no rodapé: mensagem + ação opcional (Desfazer, Ver sacola, Tentar de novo).
   Não rouba o foco, fica enquanto o mouse ou o foco estiver nele, pode ser fechado. */
function toast(msg, acao){
  const t = $("#toast");
  t.innerHTML = `<span class="t-msg"></span>${acao ? `<button type="button" class="t-act"></button>` : ""}<button type="button" class="t-x" aria-label="Fechar aviso">×</button>`;
  $(".t-msg", t).textContent = msg;
  if (acao){ const b = $(".t-act", t); b.textContent = acao.label; b.onclick = () => { esconder(); acao.fn(); }; }
  $(".t-x", t).onclick = esconder;
  t.classList.add("show");
  const tempo = acao ? 10000 : 3500;
  const agendar = () => { clearTimeout(toast.t); toast.t = setTimeout(esconder, tempo); };
  t.onmouseenter = t.onfocusin = () => clearTimeout(toast.t);
  t.onmouseleave = t.onfocusout = agendar;
  agendar();
  function esconder(){ clearTimeout(toast.t); t.classList.remove("show"); }
}
// tirar da sacola: acontece na hora e dá para desfazer
function tirar(id){
  const antes = bag[id] || 0, p = BY_ID[id];
  const lista = [...document.querySelectorAll("#drawer .item")], pos = lista.findIndex(li => li.dataset.id === id);
  setQty(id, 0);
  toast(`${nomeProd(p)} saiu da sacola.`, { label:"Desfazer", fn:() => { setQty(id, antes); updateBadge(true); } });
  if ($("#drawer").classList.contains("open")){
    const itens = [...document.querySelectorAll("#drawer .item .rm")];
    (itens[Math.min(pos, itens.length - 1)] || $("#drawer h2")).focus();
  }
}

/* ---------- Cartões ---------- */
function buyCtl(id){
  const q = bag[id] || 0, nome = esc(nomeProd(BY_ID[id]));
  return q
    ? `<div class="qty" role="group" aria-label="Quantidade de ${nome}"><button type="button" data-dec="${id}" aria-label="Tirar um ${nome}">−</button><span aria-live="polite">${q}</span><button type="button" data-inc="${id}" aria-label="Pôr mais um ${nome}">+</button></div><button type="button" class="btn" data-open-bag>Ver sacola</button>`
    : `<button type="button" class="btn" data-add="${id}" aria-label="Adicionar ${nome} à sacola">Adicionar</button>`;
}
function prodCard(p){
  const a = p.aroma ? AR[p.aroma] : null;
  const titulo = a ? T[p.tipo].nome : (p.nome || T[p.tipo].nome);
  const linha1 = a ? (p.tam || a.linha) : [T[p.tipo].nome, p.tam].filter(Boolean).join(" · ");
  const linha2 = a ? T[p.tipo].uso : p.linha;
  return `<article class="prod ${bag[p.id]?"in":""}" data-id="${p.id}" data-aroma="${p.aroma||""}" data-tipo="${p.tipo}">
    <div class="pic">${pic(p)}</div>
    <div class="body">
      <div class="line">${esc(linha1)}</div>
      <h3>${esc(titulo)}</h3>
      <div class="sub">${esc(linha2)}</div>
      <div class="buy">${buyCtl(p.id)}</div>
    </div></article>`;
}
function refreshProd(id){
  document.querySelectorAll(`.prod[data-id="${id}"]`).forEach(el => { el.classList.toggle("in", !!bag[id]); $(".buy", el).innerHTML = buyCtl(id); });
}
function famCard(f){
  const ps = prodsFam(f.id), n = aromasFam(f.id).length;
  return `<a class="fam" href="#familia-${f.id}" style="--c1:${f.c1};--c2:${f.c2}">
    <div class="plate"><div class="capa-slot" data-capa="${f.id}">${montagem(ps)}</div></div>
    <div class="info"><div class="meta">${esc(f.perfil)}</div><h3>${esc(f.nome)}</h3><div class="meta">${n} aromas · ${ps.length} produtos</div></div></a>`;
}

/* ---------- Ramos decorativos ---------- */
const sprig = cls => `<svg class="sprig ${cls}" viewBox="0 0 200 120" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M2 70C40 66 80 60 120 48s60-26 76-40"/><path d="M40 66c-6-12-2-22 8-28M70 60c-2-14 6-22 16-26M100 52c0-14 8-20 18-22M130 42c2-12 10-18 20-18M60 63c6 10 18 14 28 10M92 55c6 10 16 12 26 8M150 32c8 6 18 6 26 0"/></g><g fill="currentColor" opacity=".9"><circle cx="48" cy="38" r="2.4"/><circle cx="86" cy="34" r="2.4"/><circle cx="118" cy="30" r="2.4"/><circle cx="150" cy="24" r="2.4"/><circle cx="176" cy="32" r="2"/></g></svg>`;

/* ---------- Páginas ---------- */
const app = $("#app");

function heroPanel({c1, c2, titulo, badge, texto, capaId, ps, sideL, sideR, cta}){
  return `<section class="panel hero-fam" style="--panel:${c1};--panel-ink:${c2}">
    ${sideL ? `<span class="side l">${esc(sideL)}</span>` : ""}${sideR ? `<span class="side r">${esc(sideR)}</span>` : ""}
    ${sprig("a")}${sprig("b")}
    <div class="badge">${esc(badge)}</div>
    <h1 class="giant">${esc(titulo[0])}</h1>
    <div class="hero-capa"><div class="capa-slot" data-capa="${capaId}">${montagem(ps)}</div></div>
    <div class="giant giant-2" aria-hidden="true">${esc(titulo[1])}</div>
    <p class="lede">${esc(texto)}</p>
    ${cta ? `<div class="hero-cta">${cta}</div>` : ""}
  </section>`;
}

function home(){
  document.title = C.NOME_SITE;
  app.innerHTML = `
  <section class="sec" id="cheiros">
    <div class="sec-head"><h2>Escolha pelo cheiro</h2><p>Toque num cheiro para ver todos os produtos dele.</p></div>
    <div class="fam-row">${FAM.map(f => { const n = aromasFam(f.id).length;
      return `<a class="fam-c" href="#familia-${f.id}" style="--c1:${f.c1};--c2:${f.c2}">
        <span class="fam-dot" data-bg="${f.id}"></span>
        <span class="fam-nome">${esc(f.nome)}</span><span class="fam-n">${n} aromas</span></a>`; }).join("")}
    </div>
  </section>

  <section class="sec" id="busca">
    <div class="sec-head"><h2>Já sabe o aroma?</h2></div>
    <div class="search"><label for="q" class="sr">Buscar aroma pelo nome</label>
      <input id="q" type="search" placeholder="Buscar aroma: lavanda, vanilla, jasmim..." autocomplete="off" aria-describedby="q-dica">
      <p class="note center" id="q-dica">${window.AROMAS.length} aromas em ${FAM.length} famílias.</p></div>
    <div class="results" id="results" aria-live="polite"></div>
  </section>

  <section class="sec">
    <div class="gostar-row duo-2">
      ${[["aromaterapia", ESP.aromaterapia], ["aparelhos", ESP.aparelhos]].map(([id, e]) =>
        `<a class="g-card" href="#${id}" style="--c1:${e.c1}"><span class="g-img" data-bg="${id}"></span>
          <span class="g-nome">${esc(e.nome)}</span><span class="g-txt">${esc(e.texto)}</span></a>`).join("")}
    </div>
  </section>`;
  carregarBanner();
  const q = $("#q"), res = $("#results");
  const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  q.addEventListener("input", () => {
    const v = norm(q.value.trim());
    if (v.length < 2){ res.innerHTML = ""; return; }
    const hits = window.AROMAS.filter(a => norm(a.nome + " " + a.cidade + " " + a.linha).includes(v)).slice(0, 24);
    res.innerHTML = hits.length ? hits.map(a => { const f = FAM_BY[a.fam];
      return `<a class="chip-link" href="#aroma-${a.id}" style="--c1:${f.c1}"><i></i>${esc(aromaLabel(a))}<small>${esc(a.linha)} · ${esc(f.nome)}</small></a>`; }).join("")
      : `<p class="note">Nenhum aroma com "${esc(q.value.trim())}". Tente outra palavra ou escolha uma família acima.</p>`;
  });
}

function filtroBar(ps, aromas, ativoAroma){
  const tipos = [...new Set(ps.map(p => p.tipo))].sort((a,b) => ORDEM_TIPO.indexOf(a) - ORDEM_TIPO.indexOf(b));
  return `<div class="filtros">
    ${aromas ? `<div class="frow"><span class="flabel">Aroma</span><div class="chips" role="group" aria-label="Filtrar por aroma">
      <button type="button" class="fchip" data-fa="" aria-pressed="${!ativoAroma}">Todos</button>
      ${aromas.map(a => `<button type="button" class="fchip" data-fa="${a.id}" aria-pressed="${a.id===ativoAroma}">${esc(aromaLabel(a))}</button>`).join("")}</div></div>` : ""}
    <div class="frow"><span class="flabel">Produto</span><div class="chips" role="group" aria-label="Filtrar por tipo de produto">
      <button type="button" class="fchip" data-ft="" aria-pressed="true">Todos</button>
      ${tipos.map(t => `<button type="button" class="fchip" data-ft="${t}" aria-pressed="false">${esc(T[t].nome)}</button>`).join("")}</div></div>
    <div class="fcount" id="fcount"></div>
  </div>`;
}
function ligarFiltros(){
  const st = { a: $(".fchip[data-fa][aria-pressed=true]")?.dataset.fa || "", t: "" };
  const apply = () => {
    let n = 0;
    app.querySelectorAll(".prods .prod").forEach(el => { const ok = (!st.a || el.dataset.aroma === st.a) && (!st.t || el.dataset.tipo === st.t); el.hidden = !ok; if (ok) n++; });
    app.querySelectorAll(".bloco").forEach(bl => bl.hidden = !bl.querySelector(".prod:not([hidden])"));
    $("#fcount").textContent = `${n} ${n === 1 ? "produto" : "produtos"}`;
  };
  app.querySelectorAll(".fchip").forEach(b => b.onclick = () => {
    const k = b.dataset.fa !== undefined ? "fa" : "ft";
    app.querySelectorAll(`.fchip[data-${k}]`).forEach(x => x.setAttribute("aria-pressed", x === b));
    st[k === "fa" ? "a" : "t"] = b.dataset[k];
    apply();
  });
  window.__filtrarAroma = id => { const b = app.querySelector(`.fchip[data-fa="${id}"]`); if (b) b.click(); };
  apply();
}

function banner(nome, capaId, c1, c2){
  return `<section class="banner" style="--c1:${c1};--c2:${c2}">
    <div class="banner-img" data-bg="${capaId}"></div>
    <h1 class="banner-title">${esc(nome)}</h1>
    <div class="banner-img banner-front" data-recorte="${capaId}" aria-hidden="true"></div>
  </section>`;
}
// Capa: PNG sem fundo fica centralizado sobre o degradê da família; JPG ocupa a faixa toda.
function carregarBanner(root=app){
  root.querySelectorAll("[data-bg]").forEach(el => {
    const base = C.PASTA_CAPAS + el.dataset.bg;
    const tryLoad = exts => { if (!exts.length) return; const img = new Image();
      img.onload = () => {
        el.style.backgroundImage = `url("${img.src}")`;
        el.classList.add("on", exts[0] === ".png" ? "is-png" : "is-jpg");
        // capa em JPG dentro da faixa: a foto fica inteira no centro e as laterais
        // continuam com a mesma cor das bordas da foto, num degradê
        if (exts[0] === ".jpg" && el.classList.contains("banner-img")){
          el.style.setProperty("--ratio", img.naturalWidth / img.naturalHeight);
          el.classList.add("centro");
          try {
            const c = document.createElement("canvas"); c.width = 40; c.height = 40;
            const x = c.getContext("2d"); x.drawImage(img, 0, 0, 40, 40);
            const media = (x0, y0, w, h) => { const d = x.getImageData(x0, y0, w, h).data; let r=0,g=0,b=0; for (let i=0;i<d.length;i+=4){ r+=d[i]; g+=d[i+1]; b+=d[i+2]; } const n=d.length/4; return `rgb(${r/n|0},${g/n|0},${b/n|0})`; };
            const lt = media(0,0,3,8), lm = media(0,16,3,8), lb = media(0,32,3,8), rt = media(37,0,3,8), rm = media(37,16,3,8), rb = media(37,32,3,8);
            el.parentElement.style.background = `linear-gradient(180deg, ${lt}, ${lm}, ${lb}) left/50.5% 100% no-repeat, linear-gradient(180deg, ${rt}, ${rm}, ${rb}) right/50.5% 100% no-repeat`;
          } catch(e) { /* abrindo direto do computador o navegador bloqueia a leitura; no GitHub funciona */ }
          // recorte (img/capas/<id>-recorte.png): os ingredientes passam por cima das letras
          const fr = el.parentElement.querySelector("[data-recorte]");
          if (fr){ const r = new Image(); r.onload = () => { fr.style.backgroundImage = `url("${r.src}")`; fr.style.setProperty("--ratio", img.naturalWidth / img.naturalHeight); fr.classList.add("on","is-jpg","centro"); el.parentElement.classList.add("sobreposto"); }; r.src = base + "-recorte.webp"; }
        }
      };
      img.onerror = () => tryLoad(exts.slice(1)); img.src = base + exts[0]; };
    tryLoad([".png", ".jpg"]);
  });
}
function bolinha(a, f, ativo){
  return `<button type="button" class="ar-c" data-ar="${a.id}" aria-pressed="${ativo}" style="--c1:${f.c1};--c2:${f.c2}">
    <span class="ar-dot" data-aimg="${a.id}"></span>
    <span class="ar-nome">${esc(a.nome)}</span>${a.cidade ? `<span class="ar-cid">${esc(a.cidade)}</span>` : ""}
  </button>`;
}

function famPage(f, aromaAtivo){
  const ps = prodsFam(f.id).sort(sortProd);
  const aromas = aromasFam(f.id).sort((a,b) => PRODUTOS.filter(p=>p.aroma===b.id).length - PRODUTOS.filter(p=>p.aroma===a.id).length || a.nome.localeCompare(b.nome));
  const sel = aromaAtivo && aromas.some(a => a.id === aromaAtivo) ? aromaAtivo : aromas[0].id;
  const i = FAM.indexOf(f), outras = [1,2,3,4].map(k => FAM[(i + k) % FAM.length]);
  document.title = `${f.nome} · ${C.NOME_SITE}`;
  app.innerHTML = banner(f.nome, f.id, f.c1, f.c2) + `
  <p class="fam-texto">${esc(f.texto)}</p>

  <section class="ar-row" aria-label="Aromas da família ${esc(f.nome)}">
    ${aromas.map(a => bolinha(a, f, a.id === sel)).join("")}
  </section>

  <section class="ar-prods" id="produtos" style="--c1:${f.c1};--c2:${f.c2}"></section>

  <section class="gostar" style="--c1:${f.c1}">
    <h2>Você também pode gostar:</h2>
    <div class="gostar-band"><div class="gostar-row">
      ${outras.map(o => `<a class="g-card" href="#familia-${o.id}" style="--c1:${o.c1}">
        <span class="g-img" data-bg="${o.id}"></span><span class="g-nome">${esc(o.nome)}</span></a>`).join("")}
    </div></div>
  </section>`;

  const mostrar = id => {
    const a = AR[id], pa = ps.filter(p => p.aroma === id);
    app.querySelectorAll(".ar-c").forEach(b => b.setAttribute("aria-pressed", b.dataset.ar === id));
    $("#produtos").innerHTML = `<div class="ar-head"><h2>${esc(a.nome)}</h2>
      <div class="ar-sub">${esc([a.linha, a.cidade].filter(Boolean).join(" · "))} · ${pa.length} ${pa.length > 1 ? "produtos" : "produto"}</div></div>
      <div class="prods">${pa.map(prodCard).join("")}</div>`;
    hydratePhotos($("#produtos"));
  };
  app.querySelectorAll(".ar-c").forEach(b => b.onclick = () => { mostrar(b.dataset.ar); $("#produtos").scrollIntoView({block:"start"}); });
  mostrar(sel);
  // foto opcional de cada aroma: img/aromas/<id>.jpg
  // ícone de cada aroma: img/aromas/<id>.png (ou .jpg)
  app.querySelectorAll("[data-aimg]").forEach(el => {
    const tryLoad = exts => { if (!exts.length) return; const img = new Image();
      img.onload = () => { el.style.backgroundImage = `url("${img.src}")`; el.classList.add("on"); };
      img.onerror = () => tryLoad(exts.slice(1)); img.src = `${C.PASTA_ICONES}${el.dataset.aimg}${exts[0]}`; };
    tryLoad([".png", ".jpg"]);
  });
  carregarBanner();
  if (aromaAtivo) setTimeout(() => $("#produtos").scrollIntoView(), 60);
}

function especialPage(id){
  const e = ESP[id], ps = PRODUTOS.filter(p => e.tipos.includes(p.tipo)).sort((a,b) => ORDEM_TIPO.indexOf(a.tipo) - ORDEM_TIPO.indexOf(b.tipo) || (a.nome||"").localeCompare(b.nome||""));
  document.title = `${e.nome} · ${C.NOME_SITE}`;
  app.innerHTML = banner(e.nome, id, e.c1, e.c2) + `
  <p class="fam-texto">${esc(e.texto)}</p>
  <section class="sec" id="produtos">
    <div class="sec-head"><h2>Todos os produtos</h2></div>
    ${filtroBar(ps, null)}
    <div class="prods">${ps.map(prodCard).join("")}</div>
  </section>`;
  ligarFiltros(); carregarBanner();
}

function route(){
  const h = decodeURIComponent(location.hash.slice(1));
  let m;
  if ((m = h.match(/^familia-(.+)$/)) && FAM_BY[m[1]]) { famPage(FAM_BY[m[1]]); window.scrollTo(0,0); }
  else if ((m = h.match(/^aroma-(.+)$/)) && AR[m[1]]) { famPage(FAM_BY[AR[m[1]].fam], m[1]); }
  else if (ESP[h]) { especialPage(h); window.scrollTo(0,0); }
  else if (h === "cheiros" || h === "busca" || h === "produtos") {
    if (!document.getElementById(h)) home();
    hydratePhotos(); const el = document.getElementById(h); el && el.scrollIntoView(); return;
  }
  else { home(); if (!h) window.scrollTo(0,0); }
  hydratePhotos();
}
window.addEventListener("hashchange", route);

/* ---------- Gaveta / checkout ---------- */
let sent = null, enviado = null;
function openBag(){ sent = null; renderBag(); $("#scrim").hidden = false; const d=$("#drawer"); d.classList.add("open"); d.setAttribute("aria-hidden","false"); $("#closeBag").focus(); }
function closeBag(){ $("#scrim").hidden = true; const d=$("#drawer"); d.classList.remove("open"); d.setAttribute("aria-hidden","true"); $("#bagBtn").focus(); }
$("#bagBtn").onclick = openBag; $("#closeBag").onclick = closeBag; $("#scrim").onclick = closeBag;
document.addEventListener("keydown", e => { if (e.key === "Escape" && $("#drawer").classList.contains("open")) closeBag(); });

let draft = {};
try { draft = JSON.parse(localStorage.getItem("dados") || "{}") || {}; } catch(e){}
const resumo = () => Object.entries(bag).map(([id,q]) => { const p = BY_ID[id]; return `${q}x ${nomeProd(p)} (${detalhe(p)})`; }).join("\n");

function renderBag(){
  const body = $("#drawerBody");
  if (sent){
    body.innerHTML = `<div class="done"><div class="num">Pedido ${esc(sent)}</div><h3>Pedido enviado!</h3><p class="note">Recebi sua lista com ${enviado ? enviado.itens : ""} ${enviado && enviado.itens === 1 ? "item" : "itens"}. Vou chamar ${enviado ? esc(enviado.nome.split(" ")[0]) : "você"} no WhatsApp ${enviado ? esc(enviado.zap) : ""} para combinar valores e entrega.</p><div class="hero-cta"><button type="button" class="btn" id="again">Continuar olhando</button></div></div>`;
    $("#again").onclick = closeBag; return;
  }
  const ids = Object.keys(bag);
  if (!ids.length){
    body.innerHTML = `<div class="empty">Sua sacola está vazia.<br>Escolha uma família de cheiro para começar.</div><div class="hero-cta"><a class="btn" href="#cheiros" id="goAr">Ver os cheiros</a></div>`;
    $("#goAr").onclick = closeBag; return;
  }
  body.innerHTML = `
    <p class="bag-resumo">${bagCount()} ${bagCount() === 1 ? "item" : "itens"} · ${ids.length} ${ids.length === 1 ? "produto" : "produtos"}</p>
    <ul class="items">${ids.map(id => { const p = BY_ID[id], f = famOf(p) ? FAM_BY[famOf(p)] : null; return `
      <li class="item" data-id="${id}"><div class="thumb" style="--c1:${f ? f.c1 : "#EEF1E8"}">${pic(p)}</div>
        <div><div class="t">${esc(nomeProd(p))}</div><div class="s">${esc(detalhe(p))}</div><button type="button" class="rm" data-rm="${id}" aria-label="Remover ${esc(nomeProd(p))} da sacola">Remover</button></div>
        <div class="qty"><button type="button" data-dec="${id}" aria-label="Tirar um ${esc(nomeProd(p))}">−</button><span>${bag[id]}</span><button type="button" data-inc="${id}" aria-label="Pôr mais um ${esc(nomeProd(p))}">+</button></div></li>`; }).join("")}
    </ul>
    <form class="form" id="orderForm" novalidate>
      <h3>Seus dados</h3>
      ${C.PLANILHA_URL ? "" : `<div class="warn" id="warnCfg">Os pedidos ainda não podem ser enviados porque a planilha não foi ligada. Enquanto isso, copie a lista e mande pelo WhatsApp. <button type="button" class="link" id="copiarLista">Copiar lista</button></div>`}
      <div class="field"><label for="f-nome">Nome</label><input id="f-nome" name="nome" autocomplete="name" required value="${esc(draft.nome||"")}"><span class="err" id="e-nome"></span></div>
      <div class="field"><label for="f-zap">WhatsApp</label><input id="f-zap" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel" placeholder="(51) 90000-0000" required value="${esc(draft.whatsapp||"")}"><span class="err" id="e-zap"></span></div>
      <div class="field"><label for="f-local">Bairro e cidade</label><input id="f-local" name="local" autocomplete="address-level2" value="${esc(draft.local||"")}"></div>
      <div class="field"><label for="f-obs">Observação</label><textarea id="f-obs" name="obs" placeholder="É para presente? Alguma preferência?">${esc(draft.obs||"")}</textarea></div>
      <p class="note">Sem pagamento agora. Depois do pedido eu te chamo para combinar valores e entrega.</p>
      <button class="btn" type="submit" id="sendBtn" ${C.PLANILHA_URL ? "" : `aria-describedby="warnCfg"`}>Enviar pedido</button>
      <p class="err" id="e-envio" role="alert"></p>
    </form>`;
  hydratePhotos(body);
  const f = $("#orderForm");
  f.addEventListener("input", () => { draft = Object.fromEntries(new FormData(f)); try{localStorage.setItem("dados", JSON.stringify(draft));}catch(e){} });
  $("#f-nome").addEventListener("blur", vNome); $("#f-zap").addEventListener("blur", vZap);
  $("#f-nome").addEventListener("input", () => $("#e-nome").textContent = "");
  $("#f-zap").addEventListener("input", () => $("#e-zap").textContent = "");
  f.addEventListener("submit", submit);
  const cp = $("#copiarLista");
  if (cp) cp.onclick = async () => {
    const txt = `Oi! Quero fazer um pedido:\n${resumo()}`;
    try { await navigator.clipboard.writeText(txt); toast("Lista copiada. Agora é só colar no WhatsApp."); }
    catch(e){ toast("Não consegui copiar. Tire um print da sacola e me mande."); }
  };
}
function vNome(){ const ok = $("#f-nome").value.trim().length >= 2; $("#e-nome").textContent = ok ? "" : "Escreva seu nome para eu saber de quem é o pedido."; return ok; }
function vZap(){ const d = $("#f-zap").value.replace(/\D/g,""); const ok = d.length >= 10 && d.length <= 13; $("#e-zap").textContent = ok ? "" : "Coloque o número com DDD, por exemplo (51) 99999-0000."; return ok; }

async function submit(e){
  e.preventDefault();
  const a = vNome(), b = vZap();
  if (!a) return $("#f-nome").focus(); if (!b) return $("#f-zap").focus();
  if (!C.PLANILHA_URL){ $("#warnCfg").scrollIntoView({block:"center"}); $("#copiarLista").focus(); return; }
  $("#e-envio").textContent = "";
  const btn = $("#sendBtn"); btn.disabled = true; btn.textContent = "Enviando...";
  const d = new Date(), pad = n => String(n).padStart(2,"0");
  const pedido = `P${String(d.getFullYear()).slice(2)}${pad(d.getMonth()+1)}${pad(d.getDate())}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
  const payload = {
    pedido, data: d.toISOString(),
    nome: $("#f-nome").value.trim(), whatsapp: $("#f-zap").value.trim(),
    local: $("#f-local").value.trim(), obs: $("#f-obs").value.trim(),
    itens: Object.entries(bag).map(([id,q]) => { const p = BY_ID[id], ar = p.aroma ? AR[p.aroma] : null;
      return {id, produto: T[p.tipo].nome + (ar ? "" : (p.nome ? " " + p.nome : "")), aroma: ar ? aromaLabel(ar) : "", linha: ar ? ar.linha : p.linha, tamanho: p.tam || "", qtd: q}; }),
    totalItens: bagCount(), resumo: resumo()
  };
  try{
    await fetch(C.PLANILHA_URL, {method:"POST", mode:"no-cors", headers:{"Content-Type":"text/plain;charset=utf-8"}, body: JSON.stringify(payload)});
    enviado = { pedido, nome: payload.nome, zap: payload.whatsapp, itens: payload.totalItens };
    bag = {}; save(); updateBadge(); sent = pedido; renderBag(); $("#drawer h2").focus();
    document.querySelectorAll(".prod").forEach(el => refreshProd(el.dataset.id));
  } catch(err){
    btn.disabled = false; btn.textContent = "Enviar pedido";
    $("#e-envio").textContent = "Não consegui enviar o pedido. Sua lista e seus dados continuam aqui. Confira a internet e tente de novo.";
    toast("O pedido não foi enviado.", { label:"Tentar de novo", fn:() => $("#orderForm").requestSubmit() });
  }
}

/* ---------- Cliques ---------- */
document.addEventListener("click", e => {
  const t = e.target.closest("[data-add],[data-inc],[data-dec],[data-rm],[data-open-bag],[data-scroll]");
  if (!t) return;
  if (t.dataset.add){ const id = t.dataset.add; setQty(id, 1); updateBadge(true);
    toast(`${nomeProd(BY_ID[id])} está na sacola.`, { label:"Ver sacola", fn:openBag });
    const q = document.querySelector(`.prod[data-id="${id}"] [data-inc]`); q && q.focus(); }
  else if (t.dataset.inc) setQty(t.dataset.inc, (bag[t.dataset.inc]||0) + 1);
  else if (t.dataset.dec){ const id = t.dataset.dec; if ((bag[id]||0) <= 1) tirar(id); else setQty(id, bag[id] - 1); }
  else if (t.dataset.rm) tirar(t.dataset.rm);
  else if (t.hasAttribute("data-open-bag")) openBag();
  if ((t.dataset.inc || t.dataset.dec) && !t.isConnected){
    const id = t.dataset.inc || t.dataset.dec, card = document.querySelector(`.prod[data-id="${id}"]`);
    const alvo = card && (card.querySelector(t.dataset.inc ? "[data-inc]" : "[data-dec]") || card.querySelector("[data-add]"));
    alvo && alvo.focus();
  }
  else if (t.hasAttribute("data-scroll")){ e.preventDefault(); document.getElementById("produtos").scrollIntoView(); }
});

updateBadge(); route();
})();
