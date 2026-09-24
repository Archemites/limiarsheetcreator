/* LIMIAR — controlador: estado, persistência, eventos e ações. */
(function () {
  'use strict';
  const L = window.LIMIAR;
  const D = L.DATA;
  const R = L.Rules;
  const UI = L.UI;
  const Dice = L.Dice;
  const fmt = R.fmtMod;
  const $ = s => document.querySelector(s);
  const KEY_ANTIGA = 'limiar.fichas.v1';
  let KEY = KEY_ANTIGA; // vira limiar.fichas.v1.u<id> depois do login (cópia local por usuário)
  const reduzMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const defaultPrefs = () => ({
    crt: true, boot: true, pdfTema: 'escuro', pdfPapel: 'a4',
    pdfPartes: { ficha: true, equip: true, caminhos: true, revel: true, historia: true, ref: true }
  });

  const App = (L.App = {
    store: null, c: null, d: null, log: [], retratoURL: null, undo: null, pendingConfirm: null,
    ui: {
      tab: 'perito', caminho: 'eidolon', trilha: 0, regra: 'limiar', rq: '', origemBusca: '',
      catTab: 'medicinal', catBusca: '', novoItemNome: '', novoItemTipo: 'item', novoItemDano: '', novoItemEfeito: '',
      rf: { attr: 'ACU', modo: 'normal', mod: '', df: '', pen: true, sit: {} },
      pct: '', expr: '2d6', exprMax: false, sanDano: '', sanRitual: false, sanCura: '', terBonus: '',
      forcaDF: '', locoM: '', contraAttr: 'ACU', usoMembro: 'tronco', conjK: '',
      open: new Set(), lastRoll: null, cordaRoll: null, modal: null, fila: [],
      gaveta: false,   // gaveta lateral (abas + ações), aberta pelo ícone do topo
      pdfPronto: null  // PDF gerado esperando um toque para abrir o painel de compartilhar
    }
  });

  /* ------------------------------------------------------------------ */
  /* PERSISTÊNCIA                                                       */
  /* ------------------------------------------------------------------ */
  /* remotas: fichas vindas do servidor (fonte da verdade) ou null se offline. */
  function carregar(remotas) {
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { raw = null; }
    const store = { v: 1, ativo: null, fichas: {}, prefs: defaultPrefs() };
    const addFichas = lista => {
      for (const f of lista) {
        try { const c = R.normalizar(f); store.fichas[c.id] = c; } catch (e) { /* ficha corrompida: ignora */ }
      }
    };
    if (raw && typeof raw === 'object') {
      store.ativo = raw.ativo;
      const p = raw.prefs || {};
      store.prefs = Object.assign(defaultPrefs(), p, { pdfPartes: Object.assign(defaultPrefs().pdfPartes, p.pdfPartes || {}) });
    }
    if (remotas) {
      addFichas(remotas);
      for (const c of Object.values(store.fichas)) sinc.feito[c.id] = c.atualizadoEm;
      if (!remotas.length) {
        // primeira vez nesta conta: leva as fichas que já estavam neste navegador (versão sem login)
        let antigo = null;
        try { antigo = JSON.parse(localStorage.getItem(KEY_ANTIGA) || 'null'); } catch (e) { antigo = null; }
        if (antigo && antigo.fichas) addFichas(Object.values(antigo.fichas));
      }
    } else if (raw && raw.fichas && typeof raw.fichas === 'object') {
      addFichas(Object.values(raw.fichas)); // offline: usa a cópia local
    }
    if (!store.fichas[store.ativo]) {
      const ids = Object.keys(store.fichas).sort((a, b) => store.fichas[b].atualizadoEm - store.fichas[a].atualizadoEm);
      if (ids.length) store.ativo = ids[0];
      else { const c = R.novoPerito('base'); store.fichas[c.id] = c; store.ativo = c.id; }
    }
    return store;
  }

  let saveTimer = null;
  let podeSalvar = true;
  function salvar(imediato) {
    clearTimeout(saveTimer);
    const run = () => {
      try {
        localStorage.setItem(KEY, JSON.stringify(App.store));
        podeSalvar = true;
      } catch (e) {
        podeSalvar = false;
      }
      agendarSinc(imediato ? 0 : 1200);
    };
    if (imediato) run(); else saveTimer = setTimeout(run, 350);
  }

  /* ---------- nuvem: envia fichas alteradas e apaga as removidas ---------- */
  const sinc = { feito: {}, timer: null, rodando: false, denovo: false };
  const hora = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  function agendarSinc(ms) { clearTimeout(sinc.timer); sinc.timer = setTimeout(sincronizar, ms); }
  async function sincronizar() {
    if (!App.usuario) return;
    if (sinc.rodando) { sinc.denovo = true; return; }
    sinc.rodando = true;
    let pendentes = 0;
    try {
      const fichas = App.store.fichas;
      for (const id of Object.keys(fichas)) {
        const t = fichas[id].atualizadoEm;
        if (sinc.feito[id] === t) continue;
        pendentes++;
        statusSalvo('SALVANDO NA NUVEM…');
        await L.API.salvar(fichas[id]);
        sinc.feito[id] = t;
      }
      for (const id of Object.keys(sinc.feito)) {
        if (fichas[id]) continue;
        await L.API.excluir(id);
        delete sinc.feito[id];
      }
      statusSalvo((pendentes ? 'SALVO NA NUVEM ' : 'SINCRONIZADO ') + hora());
    } catch (e) {
      if (e.status === 401) { toast('Sua sessão expirou. Entre novamente.', { cor: 'vig' }); setTimeout(irLogin, 1500); return; }
      statusSalvo(e.status === 0 ? 'OFFLINE · salvo só neste navegador' : 'ERRO AO SALVAR NA NUVEM', true);
      agendarSinc(10000);
    } finally {
      sinc.rodando = false;
      if (sinc.denovo) { sinc.denovo = false; agendarSinc(0); }
    }
  }
  function irLogin() { L.API.limpar(); location.replace('index.html'); }
  function statusSalvo(txt, erro) {
    const el = $('#st-save');
    if (el) { el.textContent = txt; el.style.color = erro ? '#ffd0d0' : ''; }
  }
  function mudou() {
    App.c.atualizadoEm = Date.now();
    statusSalvo('EDITANDO…');
    salvar(false);
  }
  const snapshot = () => JSON.stringify(App.c);

  function ativar(id) {
    App.store.ativo = id;
    App.c = App.store.fichas[id];
    App.log = [];
    App.ui.lastRoll = null;
    App.ui.open = new Set();
    atualizarRetrato().then(render);
    salvar(true);
    render();
  }

  /* ------------------------------------------------------------------ */
  /* RENDER                                                             */
  /* ------------------------------------------------------------------ */
  function capturarFoco() {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const ds = el.dataset || {};
    let key = null;
    if (ds.fk) key = ['data-fk', ds.fk];
    else if (ds.bind) key = ['data-bind', ds.bind];
    else if (ds.ui) key = ['data-ui', ds.ui];
    else if (ds.pref) key = ['data-pref', ds.pref];
    else if (el.id) key = ['id', el.id];
    if (!key) return null;
    let s = null, e = null;
    try { s = el.selectionStart; e = el.selectionEnd; } catch (_) { /* sem seleção */ }
    return { key, s, e, scroll: el.scrollTop || 0 };
  }
  function restaurarFoco(f) {
    if (!f) return;
    const sel = f.key[0] === 'id' ? `#${CSS.escape(f.key[1])}` : `[${f.key[0]}="${CSS.escape(f.key[1])}"]`;
    const el = document.querySelector(sel);
    if (!el || el === document.activeElement) return;
    el.focus({ preventScroll: true });
    if (f.s != null && typeof el.setSelectionRange === 'function') { try { el.setSelectionRange(f.s, f.e); } catch (_) { /* ok */ } }
    if (f.scroll) el.scrollTop = f.scroll;
  }

  function aplicarPrefs() {
    const p = App.store.prefs;
    const html = document.documentElement;
    html.classList.toggle('crt-on', !!p.crt);
    html.classList.toggle('crt-off', !p.crt);
    const b = $('#st-crt');
    if (b) b.textContent = p.crt ? 'CRT ON' : 'CRT OFF';
  }

  function cabecalho() {
    const d = App.d;
    document.documentElement.dataset.mod = App.c.modulo;
    const sel = $('#modulo');
    if (sel && sel.value !== App.c.modulo) sel.value = App.c.modulo;
    const sub = $('#brand-sub');
    if (sub) sub.innerHTML = App.c.modulo === 'passado' ? 'EM UM PASSADO DISTANTE <b>· CRIADOR DE FICHAS</b>' : '1ª EDIÇÃO · LIVRO DO JOGADOR <b>· CRIADOR DE FICHAS</b>';
    document.title = `${App.c.nome.trim() || 'Novo Perito'} · LIMIAR — Criador de Fichas`;
    // rótulo da aba atual no topo (visível no celular, onde a fileira de abas some)
    const aba = $('#aba-atual');
    const t = UI.tabList(d).find(x => x.id === App.ui.tab);
    if (aba && t) {
      const pend = d.avisos.filter(a => a.nivel !== 'info').length;
      aba.innerHTML = `<span class="kc">${t.k}</span><span class="aba-nome">${UI.esc(t.t)}</span><span class="aba-seta" aria-hidden="true">&#9662;</span>${pend ? `<span class="dot" title="${pend} pendência(s)"></span>` : ''}`;
    }
  }

  /* Gaveta lateral */
  function renderGaveta() {
    const root = $('#gaveta-root');
    if (!root) return;
    const aberta = !!App.ui.gaveta;
    document.documentElement.classList.toggle('gaveta-aberta', aberta);
    document.querySelectorAll('.logo-topo, .aba-atual').forEach(b => b.setAttribute('aria-expanded', String(aberta)));
    root.innerHTML = aberta ? UI.gaveta(App) : '';
  }
  function abrirGaveta() {
    App.ui.gaveta = true;
    renderGaveta();
    const at = $('#gaveta .gaveta-item.on') || $('#gaveta button');
    if (at) at.focus({ preventScroll: true });
  }
  function fecharGaveta(focarBotao) {
    if (!App.ui.gaveta) return;
    App.ui.gaveta = false;
    renderGaveta();
    if (focarBotao) { const b = $('.logo-topo'); if (b && b.offsetParent) b.focus({ preventScroll: true }); }
  }

  function render() {
    App.d = R.derive(App.c);
    const foco = capturarFoco();
    cabecalho();
    $('#hud').innerHTML = UI.hud(App);
    $('#tabs').innerHTML = UI.tabs(App);
    $('#view').innerHTML = UI.view(App);
    if (App.ui.tab === 'mapa' && L.Mapa) L.Mapa.montar($('#mapa-root'), App);
    renderModal();
    renderGaveta();
    restaurarFoco(foco);
  }

  function renderLeve() {
    App.d = R.derive(App.c);
    const foco = capturarFoco();
    cabecalho();
    $('#hud').innerHTML = UI.hud(App);
    $('#tabs').innerHTML = UI.tabs(App);
    restaurarFoco(foco);
  }

  function renderModal() {
    const root = $('#modal-root');
    const m = App.ui.modal;
    if (!m) { root.innerHTML = ''; return; }
    const map = {
      fichas: () => UI.modalFichas(App),
      nova: () => UI.modalNova(App),
      pdf: () => UI.modalPDF(App),
      avisos: () => UI.modalAvisos(App),
      menu: () => UI.modalMenu(App),
      corda: () => UI.modalCorda(App),
      nivel: () => UI.modalNivel(App, m.arg),
      confirm: () => UI.modalConfirm(m.titulo, m.texto, 'x', m.rotulo, m.cor),
      usarVida: () => { const it = App.c.itens.find(i => i.id === m.arg); return it ? UI.modalUsarVida(App, it) : ''; },
      conjurar: () => { const mg = App.c.magias.find(x => x.id === m.arg); return mg ? UI.modalConjurar(App, mg) : ''; }
    };
    const pdfStatus = $('#pdf-status');
    const statusTxt = pdfStatus ? pdfStatus.textContent : '';
    root.innerHTML = map[m.tipo] ? map[m.tipo]() : '';
    const novo = $('#pdf-status');
    if (novo && statusTxt) novo.textContent = statusTxt;
  }

  function abrirModal(tipo, arg, extra) {
    if (tipo === 'pdf' && L.PDF) L.PDF.carregar().catch(() => {}); // já deixa o jsPDF pronto: no celular o compartilhar precisa ser rápido
    App.ui.modalFocoAnterior = document.activeElement;
    App.ui.modal = Object.assign({ tipo, arg }, extra || {});
    renderModal();
    const first = $('#modal-root .modal input, #modal-root .modal select, #modal-root .modal button, #modal-root .modal [tabindex="0"]');
    if (first) first.focus({ preventScroll: true });
  }
  function fecharModal() {
    App.ui.modal = null;
    App.ui.cordaRoll = null;
    App.ui.pdfPronto = null;
    render();
    const prox = App.ui.fila.shift();
    if (prox) { abrirModal(prox.tipo, prox.arg); return; }
    const prev = App.ui.modalFocoAnterior;
    if (prev && document.body.contains(prev)) prev.focus({ preventScroll: true });
  }
  function confirmar(titulo, texto, rotulo, fn, cor) {
    App.pendingConfirm = fn;
    abrirModal('confirm', null, { titulo, texto, rotulo, cor });
  }

  /* ------------------------------------------------------------------ */
  /* TOASTS E REGISTRO DE ROLAGENS                                      */
  /* ------------------------------------------------------------------ */
  function toast(msg, o) {
    o = o || {};
    const root = $('#toast-root');
    const el = document.createElement('div');
    el.className = 'toast';
    if (o.cor) el.style.setProperty('--c', `var(--${o.cor})`);
    const num = o.num != null ? `<span class="tn">${UI.esc(o.num)}</span>` : '';
    const undo = o.undo ? `<button type="button" class="btn btn-s" data-act="desfazer">Desfazer</button>` : '';
    el.innerHTML = `${num}<div><span class="tt">${UI.esc(msg)}</span>${o.det ? `<span class="td">${UI.esc(o.det)}</span>` : ''}</div>${undo}`;
    if (o.undo) App.undo = o.undo;
    root.appendChild(el);
    while (root.children.length > 4) root.removeChild(root.firstChild);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, o.undo ? 7000 : (o.num != null ? 5000 : 3200));
  }

  function registrar(e) {
    e.hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).slice(0, 5);
    App.log.unshift(e);
    if (App.log.length > 100) App.log.length = 100;
    App.ui.lastRoll = e;
    if (App.ui.tab !== 'dados' || App.ui.modal) {
      toast(e.titulo, { num: e.num, det: e.det, cor: e.cls === 'crit' ? 'acu' : e.cls === 'fail' ? 'vig' : undefined });
    }
  }

  function rolarExpr(expr, titulo, o) {
    const r = Dice.roll(expr, o);
    if (!r.ok) { toast(`Expressão inválida: ${expr}`, { cor: 'vig' }); return null; }
    registrar({ titulo, num: r.total, det: r.text + (o && o.nota ? ' · ' + o.nota : '') });
    return r;
  }

  function alvoDF(df) {
    const x = D.DIFICULDADES.find(v => String(v.df) === String(df));
    return x ? x.min : null;
  }

  /* Teste d20 + atributo com penalidades e situacionais. */
  function rolarTeste(o) {
    const d = App.d;
    const k = o.attr;
    const sub = k === 'INT' || k === 'SAP';
    const base = sub ? d.sub[k].valor : d.attr[k].efetivo;
    let mod = base;
    const partes = [`${UI.nomeAttr(k)} ${fmt(base)}`];
    if (o.pen !== false) for (const p of d.penLista(k)) { mod += p.v; partes.push(`${p.fonte} ${fmt(p.v)}`); }
    if (o.extra) { mod += o.extra; partes.push(`${o.extraNome || 'mod.'} ${fmt(o.extra)}`); }
    for (const s of o.sits || []) { mod += s.v; partes.push(`${s.fonte} ${fmt(s.v)}`); }
    let modo = o.modo || 'normal';
    if (modo === 'normal' && d.vantagemOrigem.includes(k)) { modo = 'vantagem'; partes.push(`${d.origem.nome}: vantagem`); }
    if (modo === 'normal' && o.vantagem) { modo = 'vantagem'; partes.push(o.vantagem); }
    const alvo = o.alvo != null ? o.alvo : (o.df ? alvoDF(o.df) : null);
    const r = Dice.d20(mod, modo, alvo);
    let cls = '';
    if (r.critico) cls = 'crit';
    else if (r.falhaCritica) cls = 'fail';
    else if (alvo != null) cls = r.sucesso ? 'crit' : 'fail';
    const dados = modo !== 'normal' ? `${modo} [${r.dados.join(', ')}] → ${r.nat}` : `d20 = ${r.nat}`;
    let det = `${dados} · ${partes.join(' · ')}`;
    if (alvo != null) det += ` · alvo ${alvo}+ → ${r.sucesso ? 'SUCESSO' : 'FALHA'}`;
    if (r.critico) det += ' · 20 NATURAL: CRÍTICO!';
    if (r.falhaCritica) det += ' · 1 NATURAL: FALHA CRÍTICA';
    if (o.nota) det += ' · ' + o.nota(r);
    registrar({ titulo: o.titulo || `Teste de ${UI.nomeAttr(k)}`, num: r.total, det, cls });
    return r;
  }

  /* Dano de arma: dado + VIGOR (cega/desarmado) + efeitos de Nós. */
  function rolarDano(it, critico, desarmado) {
    const d = App.d;
    const has = d.has;
    const dist = !desarmado && it.tipo === 'dist';
    const cega = desarmado || !!it.cega;
    const dado = desarmado ? (App.c.desarmado || '').trim() : UI.danoDoItem(it);
    const partes = [];
    let total = 0;
    const fisico = !dist; // armas corpo-a-corpo e desarmado
    const opts = { max: !!critico, onesTo: fisico && has('teimosia-bruta') ? 5 : 0 };
    if (dado) {
      const r = Dice.roll(dado, opts);
      if (!r.ok) { toast(`Dano inválido: ${dado}`, { cor: 'vig' }); return; }
      total += r.total; partes.push(r.text);
      if (desarmado && has('punho-de-chumbo')) { const r2 = Dice.roll(dado, opts); total += r2.total; partes.push('Punho de Chumbo ' + r2.text); }
    } else if (!desarmado) {
      toast(`${it.nome}: dano não definido — edite o item.`, { cor: 'raz' });
      return;
    }
    if (cega) {
      let v = d.attr.VIG.efetivo;
      if (critico && has('esmagamento-critico')) { v *= 2; partes.push(`VIGOR x2 ${fmt(v)} (Esmagamento Crítico)`); }
      else partes.push(`VIGOR ${fmt(v)}`);
      total += v;
      if (desarmado && !dado && has('punho-de-chumbo')) { total += v; partes.push(`Punho de Chumbo ${fmt(v)}`); }
    }
    if (dist && has('calibre-pesado')) { const r = Dice.roll('1d6'); total += r.total; partes.push('Calibre Pesado ' + r.text); }
    if (dist && critico && has('critico-sanguinario')) { const r = Dice.roll('1d6'); total += r.total; partes.push('Crítico Sanguinário ' + r.text); }
    if (has('sinfonia-de-sintomas') && d.disturbios.length) { total += d.disturbios.length; partes.push(`Sinfonia de Sintomas +${d.disturbios.length}`); }
    total = Math.max(0, total);
    const nome = desarmado ? 'Ataque desarmado' : it.nome;
    let nota = '';
    if (!desarmado && it.ref === 'facas') nota = ' · +1 Tick de Sangramento';
    if (!desarmado && it.ref === 'martelos') nota = ' · chance de Stun por 1 turno';
    if (!desarmado && it.ref === 'cadeiras') nota = ' · uso único';
    if (!desarmado && it.ref === 'objeto-cenario') nota = ' · + Teste de Integridade';
    registrar({ titulo: `${critico ? 'CRÍTICO · ' : ''}Dano: ${nome}`, num: total, det: partes.join(' + ') + nota, cls: critico ? 'crit' : '' });
  }

  /* Aplica dano de sanidade e trata Corda da Loucura / níveis. */
  function danoSanidade(valor, opts, titulo) {
    if (App.d.sanidade.max == null) { toast('Role primeiro a Sanidade (1d6) na aba Mente.', { cor: 'raz' }); return; }
    const ev = R.sofrerDanoSanidade(App.c, valor, opts || {});
    mudou();
    const det = [];
    if (ev.dobrado) det.push('Insano: dano x2');
    if (ev.lucidez) det.push('Lucidez Corrompida: sem o x2');
    if (ev.restauradora) { const r = Dice.roll('1d6'); det.push(`Loucura Restauradora: cure ${r.total} de Vida`); }
    if (ev.fio) det.push('Fio da Consciência: estabiliza em -70');
    if (ev.folego) det.push(`Combustão Mental: +${ev.folego} Fôlego`);
    if (!(opts && (opts.ritual || opts.magia))) det.push(`Conhecimento ${App.c.conhecimento}%`);
    registrar({ titulo: titulo || 'Dano de Sanidade', num: -ev.dano, det: `Sanidade ${ev.antes} → ${ev.depois}${det.length ? ' · ' + det.join(' · ') : ''}`, cls: 'fail' });
    render();
    if (ev.niveis.length) toast(`NÍVEL ${ev.niveis[ev.niveis.length - 1]}! +1 Traço, +1 ponto de atributo`, { cor: 'yel' });
    if (ev.corda) {
      if (ev.niveis.length) App.ui.fila.push({ tipo: 'nivel', arg: App.c.niveis.length - 1 });
      App.ui.cordaRoll = null;
      abrirModal('corda');
    } else if (ev.niveis.length) {
      abrirModal('nivel', App.c.niveis.length - 1);
    }
  }

  function curarTodosMembros(v) {
    const d = App.d;
    for (const m of D.MEMBROS) {
      const x = d.membros[m.id];
      if (x.perdido) continue;
      const n = Math.min(x.max, x.atual + v);
      App.c.vida[m.id] = n >= x.max ? null : n;
    }
  }

  function autoLocal(it) {
    const inv = R.avaliarInventario(App.c.itens);
    if ((it.tipo === 'cac' || it.tipo === 'dist') && !inv.porLocal.maoD.length) return 'maoD';
    if ((it.tipo === 'cac' || it.tipo === 'dist') && !inv.porLocal.maoE.length) return 'maoE';
    if (it.tipo === 'armadura') return 'armadura';
    if (R.ehConsumivel(it) && inv.contagem.rapido < 2) return 'rapido';
    if (it.tipo === 'acessorio' && inv.porLocal.acessorio.length < 3) return 'acessorio';
    return 'bagagem';
  }
  const nomeLocal = id => (D.LOCAIS.find(l => l.id === id) || {}).nome || id;

  function slug(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
  }
  function baixar(nome, conteudo, tipo) {
    const blob = conteudo instanceof Blob ? conteudo : new Blob([conteudo], { type: tipo || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = nome;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  /* ------------------------------------------------------------------ */
  /* RETRATO: guardado minúsculo (64×80, paleta ANSI32, PNG indexado ~2-4 KB).  */
  /* Filtro EGA: reduz mais ainda (32×40, 16 cores). Exibido ampliado sem borrar. */
  /* ------------------------------------------------------------------ */
  const { carregarImagem, comprimirRetrato, retratoTela, RET } = L.Retrato;
  async function atualizarRetrato() {
    const c = App.c;
    if (!c.retrato) { App.retratoURL = null; return; }
    try {
      const img = await carregarImagem(c.retrato);
      if (img.width !== RET.w || img.height !== RET.h) { // retrato antigo (grande): converte uma vez
        const novo = await comprimirRetrato(img);
        if (App.c === c) { c.retrato = novo; mudou(); }
      }
      App.retratoURL = await retratoTela(c.retrato, !!c.retratoRetro);
    } catch (e) { App.retratoURL = c.retrato; }
  }
  async function receberRetrato(file) {
    if (!file || !/^image\//.test(file.type)) { toast('Escolha um arquivo de imagem.', { cor: 'vig' }); return; }
    const url = URL.createObjectURL(file);
    try {
      const img = await carregarImagem(url);
      App.c.retrato = await comprimirRetrato(img);
      await atualizarRetrato();
      mudou();
      render();
      toast(`Retrato salvo: ${RET.w}×${RET.h}, ${(App.c.retrato.length * 0.75 / 1024).toFixed(1)} KB`, { cor: 'acu' });
    } catch (e) {
      toast('Não foi possível ler a imagem.', { cor: 'vig' });
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  /* ------------------------------------------------------------------ */
  /* IMPORTAR / EXPORTAR                                                */
  /* ------------------------------------------------------------------ */
  async function importarArquivo(file) {
    let data, texto;
    const ehPDF = /\.pdf$/i.test(file.name || '') || file.type === 'application/pdf';
    if (ehPDF) {
      try { texto = L.PDF.extrair(await file.arrayBuffer()); } catch (e) { texto = null; }
      if (!texto) { toast('Este PDF não contém uma ficha do LIMIAR.', { cor: 'vig', det: 'Só PDFs baixados por este site trazem a ficha embutida.' }); return; }
    } else texto = await file.text();
    try { data = JSON.parse(texto); } catch (e) { toast(ehPDF ? 'A ficha dentro do PDF está corrompida.' : 'Arquivo JSON inválido.', { cor: 'vig' }); return; }
    const lista = Array.isArray(data) ? data : (data && data.fichas ? Object.values(data.fichas) : [data]);
    let n = 0, ultimo = null;
    for (const raw of lista) {
      if (!raw || typeof raw !== 'object' || !raw.atributos) continue;
      const c = R.normalizar(raw);
      if (App.store.fichas[c.id]) c.id = R.uid('p');
      App.store.fichas[c.id] = c;
      ultimo = c; n++;
    }
    if (!ultimo) { toast('Nenhuma ficha de LIMIAR encontrada no arquivo.', { cor: 'vig' }); return; }
    App.ui.modal = null;
    ativar(ultimo.id);
    toast(`${n} ficha(s) importada(s).`, { cor: 'acu' });
  }

  /* ------------------------------------------------------------------ */
  /* PDF                                                                */
  /* ------------------------------------------------------------------ */
  async function exportarPDF(modo) {
    const st = $('#pdf-status');
    const set = t => { const el = $('#pdf-status'); if (el) el.textContent = t; };
    let janela = null;
    if (modo === 'ver') { try { janela = window.open('', '_blank'); if (janela) janela.document.write('<p style="font-family:monospace;background:#000;color:#3fe0ff;padding:20px">Gerando PDF…</p>'); } catch (e) { janela = null; } }
    set('Gerando PDF…');
    void st;
    try {
      await L.PDF.carregar();
      const branco = modo === 'branco';
      const c = branco ? R.novoPerito(App.c.modulo) : App.c;
      const d = R.derive(c);
      const p = App.store.prefs;
      const doc = L.PDF.gerar(c, d, { tema: p.pdfTema, papel: p.pdfPapel, partes: p.pdfPartes, retrato: branco ? null : App.retratoURL, branco });
      const nome = (slug(c.nome) || 'perito') + (branco ? '-ficha-em-branco' : '') + '.pdf';
      // PDF > ZIP com o .json dentro > PDF: continua legível e pode ser reimportado.
      const bytes = branco ? new Uint8Array(doc.output('arraybuffer')) : L.PDF.embutir(doc.output('arraybuffer'), JSON.stringify(c));
      const blob = new Blob([bytes], { type: 'application/pdf' });
      if (modo === 'ver') {
        const url = URL.createObjectURL(blob);
        if (janela) janela.location.href = url; else window.open(url, '_blank');
        set('PDF aberto em outra aba.');
      } else {
        // no celular abre o painel de compartilhar do sistema; no computador, baixa
        const arquivo = new File([bytes], nome, { type: 'application/pdf' });
        const r = await compartilharOuBaixar(arquivo, `LIMIAR · ${c.nome.trim() || 'Perito'}`, () => { App.ui.pdfPronto = arquivo; renderModal(); });
        set(r === 'compartilhado' ? 'PDF compartilhado.' : r === 'cancelado' ? 'Compartilhamento cancelado.'
          : r === 'pendente' ? 'PDF pronto: toque em "Compartilhar PDF".'
            : `PDF salvo: ${nome}${L.PDF.fontesOk ? '' : ' (fontes padrão: abra o site por um servidor para usar as fontes retrô)'}`);
      }
    } catch (e) {
      console.error(e);
      if (janela) janela.close();
      set('Erro ao gerar o PDF: ' + (e && e.message ? e.message : e));
    }
  }

  /* Compartilhar (celular) ou baixar. Se o navegador exigir um toque novo (a geração demorou),
     chama aoPedirToque para mostrar um botão "Compartilhar" com o arquivo já pronto. */
  async function compartilharOuBaixar(arquivo, titulo, aoPedirToque) {
    let pode = false;
    try { pode = UI.compartilhaArquivos() && navigator.canShare({ files: [arquivo] }); } catch (e) { pode = false; }
    if (pode) {
      try {
        await navigator.share({ files: [arquivo], title: titulo });
        return 'compartilhado';
      } catch (e) {
        if (e && e.name === 'AbortError') return 'cancelado';
        if (e && e.name === 'NotAllowedError' && aoPedirToque) { aoPedirToque(); return 'pendente'; }
        console.warn('LIMIAR: compartilhar falhou, baixando.', e);
      }
    }
    baixar(arquivo.name, arquivo);
    return 'baixado';
  }

  /* ------------------------------------------------------------------ */
  /* AÇÕES                                                              */
  /* ------------------------------------------------------------------ */
  const toInt = v => { const n = parseInt(v, 10); return Number.isFinite(n) ? n : 0; };

  const A = {
    tab(id) {
      const vemDaGaveta = App.ui.gaveta;
      App.ui.tab = id;
      App.ui.modal = null;
      App.ui.gaveta = false;
      render();
      const tabs = $('#tabs');
      if (UI.mobile()) window.scrollTo({ top: 0 }); // no celular a fileira de abas some: volta ao topo da nova aba
      else if (tabs && window.scrollY > tabs.offsetTop) window.scrollTo({ top: tabs.offsetTop - 6 });
      const t = $(`#tab-${id}`);
      if (t && t.offsetParent && document.activeElement && document.activeElement.closest && document.activeElement.closest('.modal-back')) t.focus({ preventScroll: true });
      if (vemDaGaveta) { const b = $('.aba-atual'); if (b && b.offsetParent) b.focus({ preventScroll: true }); }
    },
    'tab-rel'(passo) {
      const lista = UI.tabList(App.d);
      const i = Math.max(0, lista.findIndex(t => t.id === App.ui.tab));
      A.tab(lista[(i + toInt(passo) + lista.length) % lista.length].id);
    },
    gaveta() { if (App.ui.gaveta) fecharGaveta(true); else abrirGaveta(); },
    'gaveta-fechar'() { fecharGaveta(true); },
    'gaveta-fechar-fundo'() { fecharGaveta(true); },
    async 'pdf-compartilhar'() {
      const arquivo = App.ui.pdfPronto;
      if (!arquivo) return;
      const r = await compartilharOuBaixar(arquivo, `LIMIAR · ${App.c.nome.trim() || 'Perito'}`, null);
      App.ui.pdfPronto = null;
      renderModal();
      const el = $('#pdf-status');
      if (el) el.textContent = r === 'compartilhado' ? 'PDF compartilhado.' : r === 'cancelado' ? 'Compartilhamento cancelado.' : `PDF salvo: ${arquivo.name}`;
    },
    avisos() { abrirModal('avisos'); },
    fichas() { abrirModal('fichas'); },
    nova() { abrirModal('nova'); },
    menu() { abrirModal('menu'); },
    'pdf-modal'() { abrirModal('pdf'); },
    'modal-fechar'() { fecharModal(); },
    'modal-fechar-fundo'() { fecharModal(); },
    confirmar() { const fn = App.pendingConfirm; App.pendingConfirm = null; App.ui.modal = null; renderModal(); if (fn) fn(); render(); },
    desfazer() {
      if (!App.undo) return;
      const c = R.normalizar(JSON.parse(App.undo));
      App.undo = null;
      App.store.fichas[c.id] = c;
      App.c = c;
      mudou();
      atualizarRetrato().then(render);
      render();
      toast('Alteração desfeita.');
    },
    async sair() {
      clearTimeout(saveTimer);
      try { localStorage.setItem(KEY, JSON.stringify(App.store)); } catch (e) { /* ok */ }
      statusSalvo('SAINDO…');
      try { await sincronizar(); } catch (e) { /* ok */ }
      try { await L.API.logout(); } catch (e) { /* ok */ }
      try { sessionStorage.removeItem('limiar.boot'); } catch (e) { /* ok */ }
      location.replace('index.html');
    },
    'toggle-crt'() { App.store.prefs.crt = !App.store.prefs.crt; aplicarPrefs(); salvar(true); },
    'ficha-nova'(mod) {
      const c = R.novoPerito(mod);
      App.store.fichas[c.id] = c;
      App.ui.modal = null;
      App.ui.tab = 'perito';
      ativar(c.id);
      toast(mod === 'passado' ? 'Nova ficha: Em um Passado Distante' : 'Nova ficha: 1ª Edição', { cor: 'acu' });
    },
    'ficha-abrir'(id) { if (App.store.fichas[id]) { App.ui.modal = null; ativar(id); } },
    'ficha-duplicar'(id) {
      const src = App.store.fichas[id];
      if (!src) return;
      const c = R.normalizar(JSON.parse(JSON.stringify(src)));
      c.id = R.uid('p');
      c.nome = (c.nome || 'Sem nome') + ' (cópia)';
      c.criadoEm = c.atualizadoEm = Date.now();
      App.store.fichas[c.id] = c;
      salvar(true);
      renderModal();
      toast('Ficha duplicada.');
    },
    'ficha-excluir'(id) {
      const f = App.store.fichas[id];
      if (!f) return;
      confirmar('Excluir ficha', `Excluir a ficha <b>${UI.esc(f.nome || 'Sem nome')}</b>? Isso não pode ser desfeito (exporte em JSON antes, se quiser guardar).`, 'Excluir', () => {
        delete App.store.fichas[id];
        if (App.store.ativo === id || !App.store.fichas[App.store.ativo]) {
          const ids = Object.keys(App.store.fichas);
          if (ids.length) ativar(ids[0]);
          else { const c = R.novoPerito('base'); App.store.fichas[c.id] = c; ativar(c.id); }
        }
        salvar(true);
        toast('Ficha excluída.', { cor: 'vig' });
      }, 'vig');
    },
    'apagar-tudo'() {
      confirmar('Apagar tudo', 'Apagar <b>todas</b> as fichas salvas neste navegador? Isso não pode ser desfeito.', 'Apagar tudo', () => {
        const c = R.novoPerito('base');
        App.store.fichas = { [c.id]: c };
        ativar(c.id);
        salvar(true);
        toast('Todas as fichas foram apagadas.', { cor: 'vig' });
      }, 'vig');
    },
    importar() { $('#file-import').click(); },
    'importar-pdf'() { $('#file-pdf').click(); },
    async 'exportar-json'() {
      const arquivo = new File([JSON.stringify(App.c, null, 2)], `${slug(App.c.nome) || 'perito'}.limiar.json`, { type: 'application/json' });
      const r = await compartilharOuBaixar(arquivo, `LIMIAR · ${App.c.nome.trim() || 'Perito'}`, null);
      toast(r === 'compartilhado' ? 'Ficha compartilhada em JSON.' : r === 'cancelado' ? 'Compartilhamento cancelado.' : 'Ficha exportada em JSON.');
    },
    'pdf-baixar'() { exportarPDF('baixar'); },
    'pdf-ver'() { exportarPDF('ver'); },
    'pdf-branco'() { exportarPDF('branco'); },

    /* perito */
    'retrato-up'() { $('#file-retrato').click(); },
    'retrato-del'() { App.c.retrato = null; App.retratoURL = null; mudou(); render(); },

    /* atributos */
    'attr-base'(k, b) {
      const x = App.c.atributos.base;
      const n = x[k] + toInt(b);
      if (n < D.CRIACAO.min || n > D.CRIACAO.max) return;
      if (toInt(b) > 0 && App.d.pontos.criacao <= 0) return;
      x[k] = n; mudou(); render();
    },
    'attr-niv'(k, b) {
      const x = App.c.atributos.nivel;
      const n = x[k] + toInt(b);
      if (n < 0) return;
      if (toInt(b) > 0 && App.d.pontos.nivel <= 0) return;
      x[k] = n; mudou(); render();
    },
    'psi-prim'(k) { App.c.psiPrimario = k === 'SAP' ? 'SAP' : 'INT'; mudou(); render(); },
    'roll-attr'(k) {
      const dicas = App.d.dicasNos.filter(x => x.attr === k).map(x => x.fonte);
      rolarTeste({ attr: k, nota: dicas.length ? () => `Situacional: ${dicas.join(', ')}` : null });
      render();
    },

    /* profissão / classe */
    'origem-set'(id) {
      const atual = R.origemId(App.c);
      if (atual === id) return;
      const snap = snapshot();
      R.aplicarOrigem(App.c, id);
      mudou(); render();
      const o = R.origemDe(App.c);
      toast(`${App.d.termo}: ${o ? o.nome : 'nenhuma'}`, { det: o && (o.equip || []).length ? 'Equipamento inicial no inventário.' : '', undo: snap });
    },
    'roll-dinheiro'() {
      const o = App.d.origem;
      if (!o || App.c.rolagens.dinheiro != null) return; // só uma rolagem
      const r = rolarExpr(o.dinheiro, `Dinheiro inicial (${o.dinheiro})`);
      if (!r) return;
      App.c.rolagens.dinheiro = r.total; App.c.dinheiro = r.total; mudou(); render();
    },
    'roll-atleta'() {
      const o = App.d.origem;
      if (!o || !o.folegoDado) return;
      const r = rolarExpr(o.folegoDado, `Fôlego extra (${o.nome})`);
      if (!r) return;
      App.c.rolagens.atleta = r.total; App.c.folego = null; mudou(); render();
    },
    'roll-hab'(id) {
      const d = App.d;
      if (id === 'postura-guarda') {
        App.c.posturaGuarda = true;
        mudou();
        registrar({ titulo: 'Postura de Guarda', num: 'DF2', det: 'O próximo teste de Bloqueio (Defender) usa DF 2 e ganha +5.' });
      } else if (id === 'bater-carteira') {
        rolarTeste({ attr: 'ACU', df: 5, titulo: 'Bater Carteira (ACUIDADE DF5)', nota: r => (r.sucesso ? 'rouba algo aleatório do inimigo' : 'não consegue roubar') });
      } else if (id === 'ferir') {
        const r = Dice.roll('1d6');
        const p = Dice.pct(50);
        registrar({ titulo: 'Ferir (acerto garantido)', num: r.total, det: `${r.text} de dano · d100 ${p.dado} vs 50% → ${p.sucesso ? 'REMOVE UM MEMBRO!' : 'membro intacto'}`, cls: p.sucesso ? 'crit' : '' });
      } else if (id === 'furia-implacavel') {
        rolarTeste({ attr: 'ACU', titulo: 'Fúria Implacável · ataque 1/2', nota: () => 'ataca o inimigo com maior vida' });
        rolarTeste({ attr: 'ACU', titulo: 'Fúria Implacável · ataque 2/2' });
      } else if (id === 'corte-z') {
        let tot = 0;
        const golpes = [1, 2, 3].map(n => {
          const r = Dice.roll('1d8');
          const p = Dice.pct(33);
          tot += r.total;
          return `golpe ${n}: ${r.total}${p.sucesso ? ' CORTA UM MEMBRO!' : ''} (d100 ${p.dado})`;
        });
        registrar({ titulo: 'Corte Z · 3 golpes de 1d8', num: tot, det: golpes.join(' · ') });
        const custo = Dice.roll('1d4');
        danoSanidade(custo.total, { ritual: true }, `Corte Z: custo de Sanidade (1d4 = ${custo.total})`);
        return;
      } else if (id === 'terapia') {
        A['terapia-conduzir']();
        return;
      }
      render();
    },

    /* corpo */
    vida(m, b) {
      const x = App.d.membros[m];
      if (!x) return;
      let n = x.atual + toInt(b);
      n = Math.max(-99, Math.min(x.max, n));
      App.c.vida[m] = n >= x.max ? null : n;
      mudou(); render();
    },
    'vida-full'(m) {
      if (m === 'all') { for (const k of R.MEMBRO_KEYS) App.c.vida[k] = null; }
      else App.c.vida[m] = null;
      mudou(); render();
    },
    'roll-defesa'() {
      if (App.c.rolagens.defesa != null) return; // só uma rolagem
      const r = rolarExpr('2d4', 'Defesa (2d4)');
      if (!r) return;
      App.c.rolagens.defesa = r.total; mudou(); render();
      const d = App.d;
      toast(`Defesa: ${r.total} × VIGOR ${fmt(d.defesa.vigCriacao)} = ${d.defesa.base}%`, { cor: 'psi' });
    },
    'roll-def-pct'(m) {
      const x = App.d.membros[m];
      if (!x || x.defesa == null) return;
      const p = Dice.pct(x.defesa);
      const res = p.critico ? 'SUCESSO CRÍTICO: recebe apenas ¼ do dano' : p.sucesso ? 'SUCESSO: recebe metade do dano' : 'FALHA: dano integral';
      registrar({ titulo: `Defesa · ${x.nome} (${x.defesa}%)`, num: p.dado, det: `d100 = ${p.dado} → ${res}${x.rd ? ` · RD ${x.rd} da armadura` : ''}`, cls: p.critico ? 'crit' : p.sucesso ? '' : 'fail' });
      render();
    },
    folego(_, b) {
      const f = App.d.folego;
      const n = Math.max(0, Math.min(f.max, f.atual + toInt(b)));
      App.c.folego = n >= f.max ? null : n;
      if (n === 0 && f.max > 0 && !App.c.status.exaustao) { App.c.status.exaustao = true; toast('Fôlego zerado: EXAUSTÃO', { cor: 'vig', det: '-[VIGOR] em todos os testes' }); }
      mudou(); render();
    },
    'folego-acao'(a) {
      const d = App.d;
      const f = d.folego;
      let delta = 0, msg = '';
      if (a === 'correr') { delta = -1; msg = `Correu ${d.mov.corrida}m sem teste`; }
      else if (a === 'pular') { delta = -d.mov.pulo; msg = 'Pulou/escalou'; }
      else if (a === 'recuperar') { delta = d.mov.recupera; msg = '15 minutos de recuperação'; }
      else if (a === 'meditar') { delta = 2; msg = 'Meditação Ativa'; }
      else if (a === 'descanso') {
        App.c.folego = null;
        App.c.status.exaustao = false;
        mudou(); render();
        toast('Descanso: Fôlego restaurado, Exaustão removida.', { cor: 'acu' });
        return;
      } else if (a === 'forca') {
        const df = toInt(App.ui.forcaDF);
        if (df <= 0) { toast('Informe a DF do teste de força.', { cor: 'raz' }); return; }
        const custo = d.has('forca-descomunal') ? Math.ceil(df / 2) : df;
        if (custo > f.atual) { toast(`Fôlego insuficiente: custa ${custo}.`, { cor: 'vig' }); return; }
        delta = -custo; msg = `Teste de força DF${df} pago com ${custo} de Fôlego`;
      }
      if (delta < 0 && f.atual + delta < 0) { toast('Fôlego insuficiente.', { cor: 'vig' }); return; }
      const n = Math.max(0, Math.min(f.max, f.atual + delta));
      App.c.folego = n >= f.max ? null : n;
      if (n === 0 && f.max > 0 && !App.c.status.exaustao) { App.c.status.exaustao = true; msg += ' · EXAUSTÃO!'; }
      mudou(); render();
      toast(msg, { det: `Fôlego ${n}/${f.max}`, cor: n === 0 ? 'vig' : 'cyan' });
    },
    descanso(id) {
      const x = D.DESCANSOS.find(k => k.id === id);
      if (!x) return;
      const r = Dice.roll(x.vida);
      curarTodosMembros(r.total);
      mudou();
      registrar({ titulo: x.nome, num: '+' + r.total, det: `${r.text} de Vida em todos os membros (sem modificadores)`, cls: 'crit' });
      render();
    },
    sono(id) {
      const x = D.SONOS.find(k => k.id === id);
      if (!x) return;
      const rv = Dice.roll(x.vida), rs = Dice.roll(x.san);
      curarTodosMembros(rv.total);
      const rec = App.d.sanidade.max == null ? 0 : R.recuperarSanidade(App.c, rs.total);
      mudou();
      registrar({ titulo: x.nome, num: `+${rv.total}/+${rec}`, det: `Vida ${rv.text} em todos os membros · Sanidade ${rs.text}${rec < rs.total ? ` (recuperou ${rec}, limitado ao máximo)` : ''}`, cls: 'crit' });
      render();
    },
    fome(_, b) { App.c.fome = Math.max(0, Math.min(100, App.c.fome + toInt(b) * 5)); mudou(); render(); },
    'fome-set'(v) { App.c.fome = Math.max(0, Math.min(100, toInt(v))); mudou(); render(); toast('A Party se alimentou: Fome 100.', { cor: 'acu' }); },
    'roll-iniciativa'() {
      const d = App.d;
      rolarTeste({ attr: 'ACU', titulo: 'Iniciativa', extra: d.iniciativa.reflexos ? 2 : 0, extraNome: 'Reflexos Afiados', nota: () => d.has('premonicao') ? 'empate: você age primeiro (Premonição)' : 'empate: os Peritos decidem' });
      render();
    },
    'roll-acerto'() {
      const d = App.d;
      rolarTeste({ attr: 'ACU', titulo: 'Teste de acerto', nota: () => d.has('primeiro-golpe') ? 'Primeiro Golpe: vantagem no 1º turno' : 'se acertar, role o dano' });
      render();
    },
    'roll-defender'() {
      const d = App.d;
      const r1 = rolarTeste({ attr: 'ACU', titulo: 'Defender · reflexo (ACUIDADE)' });
      const usarAcu = d.has('leitura-de-movimento') && d.modTeste('ACU') > d.modTeste('VIG');
      const k = usarAcu ? 'ACU' : 'VIG';
      const postura = App.c.posturaGuarda;
      if (postura) { App.c.posturaGuarda = false; mudou(); }
      rolarTeste({
        attr: k, alvo: alvoDF(postura ? 2 : 6), titulo: `Defender · redução (${D.ATTR[k].nome} DF${postura ? 2 : 6})`,
        extra: (d.has('bloqueio-perfeito') ? 2 : 0) + (postura ? 5 : 0), extraNome: postura ? 'Postura de Guarda' + (d.has('bloqueio-perfeito') ? ' + Bloqueio Perfeito' : '') : 'Bloqueio Perfeito',
        nota: r => (r.critico || (r.sucesso && d.has('defesa-absoluta')) ? 'ANULA todo o dano' : r.sucesso ? 'recebe METADE do dano' : 'dano integral') + (usarAcu ? ' · Leitura de Movimento' : '')
      });
      void r1;
      render();
    },
    'roll-contra'(a) {
      const d = App.d;
      const k = a || App.ui.contraAttr || 'ACU';
      const df = k === 'RAZ' ? d.contra.dfRazao : d.contra.df;
      let vant = '';
      if (k === 'ACU' && d.has('contra-acao-precisa')) vant = 'Contra-ação Precisa: vantagem';
      if (k === 'VIG' && d.has('muralha-de-carne')) vant = 'Muralha de Carne: vantagem';
      rolarTeste({
        attr: k, df, titulo: `Contra-ação (${D.ATTR[k].nome} DF${df})`, vantagem: vant,
        nota: r => r.critico ? `20 natural: +${d.has('janela-aberta') ? 2 : 1} Ação Bônus${d.has('reflexo-ofensivo') ? ' (pode disparar já)' : ''}` : (r.sucesso ? 'escapa dos efeitos' : 'não escapa')
      });
      render();
    },
    'roll-locomocao'() {
      const d = App.d;
      const m = Math.max(1, toInt(App.ui.locoM) || 1);
      if (d.mov.marcha) { toast(`Marcha Infinita: anda +${m}m sem teste.`, { cor: 'acu' }); return; }
      rolarTeste({ attr: 'VIG', alvo: alvoDF(1) + m, titulo: `Locomoção: 5m + ${m}m (VIGOR DF1 +${m})` });
      render();
    },
    'roll-desarmado'() { rolarDano(null, false, true); render(); },

    /* mente */
    san(_, b) {
      const s = App.d.sanidade;
      if (s.max == null) return;
      const n = Math.max(-100, Math.min(s.max, s.atual + toInt(b)));
      App.c.sanidade = n >= s.max ? null : n;
      mudou(); render();
    },
    'roll-sanidade'() {
      if (App.c.rolagens.sanidade != null) return; // só uma rolagem
      const r = rolarExpr('1d6', 'Sanidade (RAZÃO + 1d6)');
      if (!r) return;
      App.c.rolagens.sanidade = r.total;
      App.c.sanidade = null;
      mudou(); render();
      toast(`Sanidade Total: ${App.d.sanidade.max}`, { cor: 'raz' });
    },
    'san-dano'() {
      const expr = String(App.ui.sanDano || '1').trim() || '1';
      const r = Dice.roll(expr);
      if (!r.ok) { toast(`Dano inválido: ${expr}`, { cor: 'vig' }); return; }
      danoSanidade(r.total, { ritual: !!App.ui.sanRitual }, `Dano de Sanidade${expr !== String(r.total) ? ' (' + expr + ')' : ''}`);
    },
    'san-cura'() {
      const expr = String(App.ui.sanCura || '1').trim() || '1';
      const r = Dice.roll(expr);
      if (!r.ok) { toast(`Valor inválido: ${expr}`, { cor: 'vig' }); return; }
      const rec = R.recuperarSanidade(App.c, r.total);
      mudou();
      registrar({ titulo: 'Recuperou Sanidade', num: '+' + rec, det: `${r.text}${rec < r.total ? ' (limitado ao máximo)' : ''}`, cls: 'crit' });
      render();
    },
    'san-full'() { App.c.sanidade = null; mudou(); render(); },
    'fim-combate'() {
      const res = R.fimDeCombate(App.c);
      mudou(); render();
      if (res.recuperado) toast(`Fim do combate: +${res.recuperado} de Sanidade das magias.`, { cor: 'acu' });
      else if (res.perdido) toast(`Fim do combate: ${res.perdido} de Sanidade das magias perdida (ficou em 0 ou menos).`, { cor: 'vig' });
    },
    'roll-corda'() { App.ui.cordaRoll = null; abrirModal('corda'); },
    'corda-rolar'() {
      const d = App.d;
      const r = rolarTeste({ attr: 'RAZ', titulo: 'Corda da Loucura (RAZÃO)', vantagem: d.has('equilibrista-nato') ? 'Equilibrista Nato: vantagem' : '' });
      App.ui.cordaRoll = App.log[0];
      void r;
      renderModal();
    },
    'corda-passou'() { fecharModal(); toast('Equilibrou-se: fica em 0 de Sanidade.', { cor: 'acu' }); },
    'corda-falhou'() {
      App.c.status.insano = true;
      if (App.d.has('lucidez-corrompida')) App.c.lucidezPendente = true;
      mudou();
      fecharModal();
      toast('INSANO: passa a tomar 2x dano de Sanidade.', { cor: 'vig' });
    },
    nivel(_, b) {
      if (toInt(b) > 0) {
        R.registrarNivel(App.c);
        mudou(); render();
        abrirModal('nivel', App.c.niveis.length - 1);
      } else if (App.c.nivel > 0) {
        const snap = snapshot();
        R.removerNivel(App.c);
        mudou(); render();
        toast(`Nível reduzido para ${App.c.nivel}.`, { undo: snap });
      }
    },
    'roll-nivel'(idx, key) {
      const h = App.c.niveis[toInt(idx)];
      if (!h || h[key] != null) return; // só uma rolagem
      const d = App.d;
      const dado = key === 'san' ? d.dadoSanNivel : '1d4';
      const nomes = { vida: 'Vida', vidaExtra: 'Vida extra (Crescimento Anômalo)', san: 'Sanidade', sanExtra: 'Sanidade extra (Clareza Crescente)' };
      const r = rolarExpr(dado, `Nível ${h.nivel} · ${nomes[key]} (${dado})`);
      if (!r) return;
      h[key] = r.total;
      const modo = key.startsWith('vida') ? h.vidaModo : h.sanModo;
      if (modo === 'cura') {
        if (key.startsWith('vida')) curarTodosMembros(r.total);
        else R.recuperarSanidade(App.c, r.total);
      }
      mudou(); render();
    },
    'roll-epifania'(idx) {
      const h = App.c.niveis[toInt(idx)];
      if (!h) return;
      const d = App.d;
      const chance = d.has('catarse') ? 100 : 50;
      const p = Dice.pct(chance);
      if (p.sucesso) { App.c.sanidade = null; h.epifania = 'Curou a Sanidade'; }
      else if (d.has('mente-ancorada')) { R.recuperarSanidade(App.c, Math.floor((d.sanidade.max || 0) / 2)); h.epifania = 'Falhou · +metade (Mente Ancorada)'; }
      else h.epifania = 'Falhou';
      registrar({ titulo: `Epifania (${chance}%)`, num: p.dado, det: `d100 = ${p.dado} → ${h.epifania}`, cls: p.sucesso ? 'crit' : 'fail' });
      mudou(); render();
    },
    'roll-revelacao'() {
      const d = App.d;
      const p = Dice.pct(d.revelacao);
      registrar({ titulo: `Iluminação · revelação (${d.revelacao}%)`, num: p.dado, det: `d100 = ${p.dado} → ${p.sucesso ? 'aprende uma Magia ou Ritual (o Espectador revela qual)' : 'nenhuma magia ou ritual desta vez'}`, cls: p.sucesso ? 'crit' : 'fail' });
      render();
    },
    'roll-sonho'() {
      const p = Dice.pct(5);
      registrar({ titulo: 'Revelação em sonho (5%)', num: p.dado, det: `d100 = ${p.dado} → ${p.sucesso ? 'o Espectador concede uma Revelação' : 'sono sem revelações'}`, cls: p.sucesso ? 'crit' : '' });
      render();
    },
    terapia() {
      const bonus = toInt(App.ui.terBonus);
      const r = Dice.roll('1d6');
      const total = r.total + bonus;
      const rec = R.recuperarSanidade(App.c, total);
      mudou();
      registrar({ titulo: 'Sessão de terapia recebida', num: '+' + rec, det: `${r.text}${bonus ? ' ' + fmt(bonus) + ' (terapeuta)' : ''} = ${total}${rec < total ? ' (limitado ao máximo)' : ''}`, cls: 'crit' });
      render();
    },
    'terapia-conduzir'() {
      const d = App.d;
      const r = Dice.roll('1d6');
      let face = r.total;
      const notas = [];
      if (d.terapia.empatia && face <= 2) { notas.push(`Empatia Terapêutica: ${face}→3`); face = 3; }
      const bonus = toInt(d.bonus.terapia) + (d.has('escuta-ativa') ? 2 : 0);
      if (d.has('alta-medica') && r.total === 6) notas.push('Alta Médica: remove 1 Distúrbio do paciente');
      if (d.has('ancoragem')) notas.push('+2 para pacientes ansiosos (Ancoragem)');
      if (d.has('respiro-coletivo')) notas.push('+2 Fôlego (Respiro Coletivo)');
      registrar({ titulo: 'Sessão de terapia conduzida', num: face + bonus, det: `1d6 [${r.total}]${bonus ? ' +' + bonus : ''}${notas.length ? ' · ' + notas.join(' · ') : ''}` });
      render();
    },
    'limiar-imagem'() {
      const expr = App.d.has('iluminacao-traumatica') ? '3d20kl2' : '2d20';
      const r = Dice.roll(expr);
      danoSanidade(r.total, {}, `Imagem do LIMIAR (${expr}: ${r.text})`);
    },
    'limiar-exposicao'() { danoSanidade(1, {}, 'Exposição ao LIMIAR'); },
    'limiar-golpe'() { danoSanidade(1, {}, 'Golpe de um Indizível'); },
    atordoado(_, b) { App.c.status.atordoado = Math.max(0, Math.min(3, App.c.status.atordoado + toInt(b))); mudou(); render(); },
    amaldicoado(_, b) {
      const n = Math.max(0, App.c.status.amaldicoadoTurnos + toInt(b));
      App.c.status.amaldicoadoTurnos = n;
      mudou(); render();
      if (n === 3 && toInt(b) > 0) toast('Amaldiçoado por 3 turnos: fica com 1 de Vida e 1 de Sanidade (se tiver mais que zero nas duas).', { cor: 'eso' });
    },

    /* equipamento */
    'cat-tab'(id) { App.ui.catTab = id; App.ui.catBusca = ''; render(); },
    'item-add'(ref) {
      const it = R.itemDoCatalogo(ref, { origem: 'catalogo' });
      it.local = autoLocal(it);
      App.c.itens.push(it);
      mudou(); render();
      toast(`${it.nome} → ${nomeLocal(it.local)}`, { cor: 'acu' });
    },
    'catalogo-criar'() {
      const nome = String(App.ui.novoItemNome || '').trim();
      if (!nome) { toast('Dê um nome ao item.', { cor: 'raz' }); return; }
      const tipo = App.ui.novoItemTipo || 'item';
      const arma = tipo === 'cac' || tipo === 'dist';
      App.c.catalogo.push({ id: R.uid('k'), nome, tipo, dano: arma ? String(App.ui.novoItemDano || '').trim() : '', efeito: String(App.ui.novoItemEfeito || '').trim() });
      App.ui.novoItemNome = ''; App.ui.novoItemDano = ''; App.ui.novoItemEfeito = '';
      mudou(); render();
      toast(`${nome} adicionado ao catálogo.`, { cor: 'eso', det: 'Use [+] para colocar no inventário.' });
    },
    'catalogo-add'(id) {
      const x = App.c.catalogo.find(k => k.id === id);
      if (!x) return;
      const it = R.normalizarItem({ nome: x.nome, tipo: x.tipo, dano: x.dano, efeito: x.efeito, origem: 'manual' });
      it.local = autoLocal(it);
      App.c.itens.push(it);
      mudou(); render();
      toast(`${it.nome} → ${nomeLocal(it.local)}`, { cor: 'acu' });
    },
    'catalogo-del'(id) {
      const x = App.c.catalogo.find(k => k.id === id);
      if (!x) return;
      const snap = snapshot();
      App.c.catalogo = App.c.catalogo.filter(k => k.id !== id);
      mudou(); render();
      toast(`${x.nome} removido do catálogo.`, { undo: snap });
    },
    'item-criar'() {
      const nome = String(App.ui.novoItemNome || '').trim() || 'Novo item';
      const tipo = App.ui.novoItemTipo || 'item';
      const it = R.normalizarItem({ nome, tipo, origem: 'manual' });
      it.local = autoLocal(it);
      App.c.itens.push(it);
      App.ui.open.add('it:' + it.id);
      App.ui.novoItemNome = '';
      mudou(); render();
      toast(`${nome} criado → ${nomeLocal(it.local)}`, { cor: 'acu' });
    },
    'item-del'(id) {
      const it = App.c.itens.find(i => i.id === id);
      if (!it) return;
      const snap = snapshot();
      App.c.itens = App.c.itens.filter(i => i.id !== id);
      mudou(); render();
      toast(`${it.nome} removido.`, { undo: snap });
    },
    'item-qtd'(id, b) {
      const it = App.c.itens.find(i => i.id === id);
      if (!it) return;
      it.qtd = Math.max(1, it.qtd + toInt(b));
      mudou(); render();
    },
    'item-usar'(id) {
      const it = App.c.itens.find(i => i.id === id);
      if (!it) return;
      const ref = it.ref ? D.CATALOGO_MAP[it.ref] : null;
      if (ref && ref.cura && ref.cura.alvo === 'vida') { abrirModal('usarVida', it.id); return; }
      const det = [];
      let num = '';
      if (ref && ref.cura && ref.cura.alvo === 'sanidade') {
        if (App.d.sanidade.max == null) { toast('Role primeiro a Sanidade (1d6).', { cor: 'raz' }); return; }
        if (ref.cura.total) { App.c.sanidade = null; det.push('Sanidade restaurada por inteiro'); num = 'MAX'; }
        else {
          const r = Dice.roll(ref.cura.dado);
          const bonus = it.tipo === 'psicoativo' ? toInt(App.d.bonus.psicoativos) : 0;
          const rec = R.recuperarSanidade(App.c, r.total + bonus);
          det.push(`${r.text}${bonus ? ' +' + bonus + ' (' + App.d.origem.nome + ')' : ''} → +${rec} Sanidade`);
          num = '+' + rec;
        }
      }
      if (ref && ref.risco) {
        const p = Dice.pct(ref.risco.chance);
        det.push(`risco ${ref.risco.chance}%: d100 ${p.dado} → ${p.sucesso ? ref.risco.nome.toUpperCase() + '!' : 'nada'}`);
        if (p.sucesso && ref.risco.status) App.c.status[ref.risco.status] = true;
      }
      if (ref && ref.remove) { App.c.status[ref.remove] = false; det.push(`remove ${D.STATUS_MAP[ref.remove].nome}`); }
      if (ref && ref.dano) {
        const r = Dice.roll(ref.dano);
        const alvo = App.c.status.infeccaoMembro || 'tronco';
        const x = App.d.membros[alvo];
        App.c.vida[alvo] = x.atual - r.total;
        det.push(`-${r.total} de Vida (${x.nome})`);
      }
      if (ref && ['lsd', 'cocaina', 'crack', 'md', 'adesivo-nicotina', 'bebidas', 'fentanila'].includes(ref.id)) det.push(ref.efeito.split(';').slice(1).join(';').trim() || ref.efeito);
      if (!ref || (!ref.cura && !ref.risco && !ref.remove && !ref.dano)) det.push(it.efeito || 'usado');
      it.qtd -= 1;
      if (it.qtd <= 0) App.c.itens = App.c.itens.filter(i => i.id !== it.id);
      mudou();
      registrar({ titulo: `Usou ${it.nome}`, num: num || '·', det: det.filter(Boolean).join(' · '), cls: 'crit' });
      render();
    },
    'item-usar-vida'(id) {
      const it = App.c.itens.find(i => i.id === id);
      if (!it) return;
      const ref = D.CATALOGO_MAP[it.ref];
      const m = App.ui.usoMembro || 'tronco';
      const x = App.d.membros[m];
      const r = Dice.roll(ref.cura.dado);
      const n = Math.min(x.max, x.atual + r.total);
      App.c.vida[m] = n >= x.max ? null : n;
      it.qtd -= 1;
      if (it.qtd <= 0) App.c.itens = App.c.itens.filter(i => i.id !== it.id);
      mudou();
      App.ui.modal = null;
      registrar({ titulo: `Usou ${it.nome} · ${x.nome}`, num: '+' + (n - x.atual), det: `${r.text} de Vida (${x.atual} → ${n})`, cls: 'crit' });
      render();
    },
    'item-dano'(id, b) {
      const it = App.c.itens.find(i => i.id === id);
      if (!it) return;
      rolarDano(it, b === 'crit', false);
      render();
    },

    /* caminhos */
    caminho(id) { App.ui.caminho = id; App.ui.trilha = 0; render(); },
    trilha(i) { App.ui.trilha = toInt(i); render(); },
    'no-add'(id) {
      const st = R.statusNo(App.c, App.d, id);
      if (st.estado !== 'available') { toast(st.motivos.join(' · '), { cor: 'raz' }); return; }
      App.c.nos.push(id);
      mudou(); render();
      toast(`Nó adquirido: ${D.NOS[id].no.nome}`, { cor: 'eso', det: D.NOS[id].no.desc });
    },
    'no-del'(id) {
      const st = R.statusNo(App.c, App.d, id);
      if (!st.podeRemover) return;
      const snap = snapshot();
      App.c.nos = App.c.nos.filter(x => x !== id);
      mudou(); render();
      toast(`Nó removido: ${D.NOS[id].no.nome}`, { undo: snap });
    },

    /* revelações */
    'palavra-add'() {
      const d = App.d;
      const tipo = d.magia.nV <= d.magia.nP && d.magia.nV <= d.magia.nI ? 'verbal' : (d.magia.nP <= d.magia.nI ? 'poder' : 'impulso');
      App.c.palavras.push({ id: R.uid('w'), texto: '', tipo, classe: 1, significado: '', origem: 'manual' });
      mudou(); render();
    },
    'palavra-qtd'(tipo, b) {
      const [cl, delta] = String(b || '').split(':').map(toInt);
      if (!['verbal', 'poder', 'impulso'].includes(tipo) || cl < 1 || cl > 5) return;
      if (delta > 0) App.c.palavras.push({ id: R.uid('w'), texto: '', tipo, classe: cl, significado: '', origem: 'manual' });
      else {
        const lista = App.c.palavras.filter(p => p.tipo === tipo && Number(p.classe) === cl);
        const alvo = lista.find(p => p.origem !== 'inicial') || lista[0];
        if (!alvo) return;
        App.c.palavras = App.c.palavras.filter(p => p !== alvo);
      }
      mudou(); render();
    },
    'palavra-conjunto'() {
      for (const tipo of ['verbal', 'poder', 'impulso']) App.c.palavras.push({ id: R.uid('w'), texto: '', tipo, classe: 1, significado: '', origem: 'manual' });
      mudou(); render();
    },
    'palavra-del'(id) {
      const snap = snapshot();
      App.c.palavras = App.c.palavras.filter(p => p.id !== id);
      mudou(); render();
      toast('Palavra removida.', { undo: snap });
    },
    'magia-add'() { App.c.magias.push({ id: R.uid('m'), nome: '', palavras: '', traducao: '', classe: 1, conjuntos: 1, gatilho: 'palavras', efeito: '', duracao: '', notas: '' }); mudou(); render(); },
    'magia-del'(id) {
      const snap = snapshot();
      App.c.magias = App.c.magias.filter(m => m.id !== id);
      mudou(); render();
      toast('Magia removida.', { undo: snap });
    },
    'magia-conjurar'(id) { App.ui.conjK = ''; abrirModal('conjurar', id); },
    'magia-pagar'(id) {
      const m = App.c.magias.find(x => x.id === id);
      if (!m) return;
      const d = App.d;
      const cu = R.custoMagia(m, d);
      const k = Math.max(cu.conjuntos, toInt(App.ui.conjK) || cu.conjuntos);
      const custo = cu.porConjunto * k;
      const extras = k - cu.conjuntos;
      App.ui.modal = null;
      if (extras > 0) {
        const r = Dice.roll(`${extras}${d.magia.bonusDado.slice(1)}`);
        registrar({ titulo: `${m.nome || 'Magia'} · ${extras} conjunto(s) extra`, num: '+' + r.total, det: `${r.text} no efeito · ${k} turno(s) de preparação` });
      }
      danoSanidade(custo, { magia: true }, `Conjurou ${m.nome || 'magia'} (${custo} SAN)`);
    },
    'ritual-add'() { App.c.rituais.push({ id: R.uid('r'), nome: '', nivel: 1, custo: 1, etapas: '', componentes: '', efeito: '', duracao: '', notas: '' }); mudou(); render(); },
    'ritual-del'(id) {
      const snap = snapshot();
      App.c.rituais = App.c.rituais.filter(r => r.id !== id);
      mudou(); render();
      toast('Ritual removido.', { undo: snap });
    },
    'ritual-realizar'(id) {
      const rt = App.c.rituais.find(x => x.id === id);
      if (!rt) return;
      const d = App.d;
      const ri = R.ritualInfo(rt, d);
      if (ri.acima && !ri.alem) toast('Perigo: ritual de nível acima do seu ESOTERISMO.', { cor: 'vig' });
      if (ri.custo > 0) danoSanidade(ri.custo, { ritual: true }, `Ritual: ${rt.nome || 'sem nome'} (${ri.custo} SAN)`);
      if (d.has('bencao-enferrujada')) {
        const r = Dice.roll('1d6');
        registrar({ titulo: 'Bênção Enferrujada', num: '+' + r.total, det: `${r.text} de Vida a todos os participantes (se o ritual for bem sucedido)`, cls: 'crit' });
      }
      render();
    },

    /* dados */
    'roll-teste'() {
      const rf = App.ui.rf;
      const d = App.d;
      const sits = d.situacionais.filter((s, i) => rf.sit[i]);
      rolarTeste({ attr: rf.attr, modo: rf.modo, extra: toInt(rf.mod), df: rf.df, pen: rf.pen, sits });
      render();
    },
    'roll-pct'() {
      const chance = toInt(App.ui.pct) || 50;
      const p = Dice.pct(chance);
      registrar({ titulo: `Teste de porcentagem (${chance}%)`, num: p.dado, det: `d100 = ${p.dado} → ${p.critico ? 'ACERTO CRÍTICO' : p.falhaCritica ? 'FALHA CRÍTICA' : p.sucesso ? 'SUCESSO' : 'FALHA'}`, cls: p.critico || p.sucesso ? 'crit' : 'fail' });
      render();
    },
    'roll-die'(n) { rolarExpr('1d' + n, 'd' + n); render(); },
    'roll-expr'() { rolarExpr(App.ui.expr || '1d20', App.ui.expr || '1d20', { max: !!App.ui.exprMax }); render(); },
    'log-limpar'() { App.log = []; App.ui.lastRoll = null; render(); },

    /* regras */
    'mapa-limpar'() {
      if (!App.c.mapa) return;
      confirmar('Limpar mapa', 'Apagar todo o desenho do mapa deste Perito? Dá para desfazer logo em seguida.', 'Limpar', () => {
        const snap = snapshot();
        App.c.mapa = null;
        mudou();
        toast('Mapa apagado.', { undo: snap, cor: 'vig' });
      }, 'vig');
    },
    regra(id) {
      App.ui.regra = id;
      App.ui.rq = '';
      render();
      const v = $('#view');
      if (v && window.scrollY > v.offsetTop) window.scrollTo({ top: v.offsetTop - 6 });
    }
  };

  /* Mudanças de <select data-chg> */
  const CHG = {
    'item-escolher'(el) {
      const it = App.c.itens.find(i => i.id === el.dataset.a);
      if (!it || !el.value) return;
      const novo = R.itemDoCatalogo(el.value, { origem: it.origem, local: it.local });
      novo.id = it.id;
      if (novo.tipo === 'cac' || novo.tipo === 'dist') novo.local = it.local === 'bagagem' ? autoLocal(novo) : it.local;
      Object.keys(it).forEach(k => delete it[k]);
      Object.assign(it, novo);
      mudou(); render();
    }
  };

  /* Hooks depois de alterar um campo ligado à ficha */
  function depoisDeBind(path) {
    if (path === 'retratoRetro') atualizarRetrato().then(render);
    if (path === 'conhecimento') {
      if (App.c.conhecimento >= 100) {
        let n = 0;
        while (App.c.conhecimento >= 100) { App.c.conhecimento -= 100; R.registrarNivel(App.c); n++; }
        render();
        toast(`Conhecimento completo: +${n} nível(is)!`, { cor: 'yel' });
        abrirModal('nivel', App.c.niveis.length - 1);
      } else if (App.c.conhecimento < 0) App.c.conhecimento = 0;
    }
    if (path === 'status.insano' && !App.c.status.insano) App.c.lucidezPendente = false;
    if (/^itens#.+\.tipo$/.test(path)) {
      const id = path.split('#')[1].split('.')[0];
      const it = App.c.itens.find(i => i.id === id);
      if (it) { const ok = R.locaisPermitidos(it); if (!ok.includes(it.local)) it.local = ok.includes('bagagem') ? 'bagagem' : ok[0]; }
    }
  }

  /* ------------------------------------------------------------------ */
  /* LIGAÇÃO DE CAMPOS                                                  */
  /* ------------------------------------------------------------------ */
  function passo(o, seg) {
    if (o == null) return undefined;
    const h = seg.indexOf('#');
    if (h >= 0) { const arr = o[seg.slice(0, h)]; const id = seg.slice(h + 1); return Array.isArray(arr) ? arr.find(x => x && x.id === id) : undefined; }
    return o[seg];
  }
  function setPath(obj, path, val) {
    const segs = path.split('.');
    let o = obj;
    for (let i = 0; i < segs.length - 1; i++) { o = passo(o, segs[i]); if (o == null) return false; }
    o[segs[segs.length - 1]] = val;
    return true;
  }
  function lerValor(el) {
    const t = el.dataset.t;
    if (t === 'bool') return el.checked;
    const raw = String(el.value);
    if (t === 'int') { if (!/^\s*-?\d+\s*$/.test(raw)) return undefined; return parseInt(raw, 10); }
    if (t === 'intn') { if (raw.trim() === '') return null; if (!/^\s*-?\d+\s*$/.test(raw)) return undefined; return parseInt(raw, 10); }
    return raw;
  }
  const UI_RENDER_AO_DIGITAR = new Set(['origemBusca', 'catBusca', 'rq', 'conjK']);
  const ENTER = { sanDano: 'san-dano', sanCura: 'san-cura', expr: 'roll-expr', pct: 'roll-pct', novoItemNome: 'catalogo-criar', novoItemEfeito: 'catalogo-criar', novoItemDano: 'catalogo-criar', 'rf.mod': 'roll-teste', terBonus: 'terapia', locoM: 'roll-locomocao' };

  function onInput(e) {
    const el = e.target;
    if (!el.dataset) return;
    if (el.dataset.bind) {
      const v = lerValor(el);
      if (v === undefined) return;
      if (el.type === 'checkbox' || el.tagName === 'SELECT') return; // tratados no change
      setPath(App.c, el.dataset.bind, v);
      mudou();
      const numerico = el.dataset.t === 'int' || el.dataset.t === 'intn';
      if (numerico && v !== null) { depoisDeBind(el.dataset.bind); render(); }
      else renderLeve();
    } else if (el.dataset.ui) {
      if (el.type === 'checkbox' || el.tagName === 'SELECT') return;
      setPath(App.ui, el.dataset.ui, el.value);
      if (UI_RENDER_AO_DIGITAR.has(el.dataset.ui)) {
        if (el.dataset.ui === 'conjK') renderModal(); else render();
        restaurarFoco({ key: ['data-ui', el.dataset.ui], s: el.selectionStart, e: el.selectionEnd });
      }
    }
  }

  function onChange(e) {
    const el = e.target;
    if (el.id === 'modulo' || (el.dataset && el.dataset.modulo !== undefined)) { trocarModulo(el.value); return; }
    if (el.id === 'file-pdf') { const f = el.files && el.files[0]; el.value = ''; if (f) importarArquivo(f); return; }
    if (el.id === 'file-import') { const f = el.files && el.files[0]; el.value = ''; if (f) importarArquivo(f); return; }
    if (el.id === 'file-retrato') { const f = el.files && el.files[0]; el.value = ''; if (f) receberRetrato(f); return; }
    if (!el.dataset) return;
    if (el.dataset.chg && CHG[el.dataset.chg]) { CHG[el.dataset.chg](el); return; }
    if (el.dataset.pref) {
      const p = App.store.prefs;
      const key = el.dataset.pref;
      if (key.startsWith('pdfPartes.')) p.pdfPartes[key.split('.')[1]] = el.checked;
      else if (el.type === 'checkbox') p[key] = el.checked;
      else p[key] = el.value;
      aplicarPrefs();
      salvar(true);
      return;
    }
    if (el.dataset.bind) {
      const v = lerValor(el);
      const escolha = el.type === 'checkbox' || el.type === 'radio' || el.tagName === 'SELECT';
      if (v !== undefined) setPath(App.c, el.dataset.bind, v);
      depoisDeBind(el.dataset.bind);
      mudou();
      if (escolha) render();
      else if ((el.dataset.t === 'intn' && v === null) || v === undefined) setTimeout(render, 0);
      else renderLeve();
      return;
    }
    if (el.dataset.ui) {
      setPath(App.ui, el.dataset.ui, el.type === 'checkbox' ? el.checked : el.value);
      if (el.dataset.ui === 'rf.attr') App.ui.rf.sit = {};
      if (el.type === 'checkbox' || el.tagName === 'SELECT') { if (App.ui.modal) renderModal(); else render(); }
    }
  }

  function onClick(e) {
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const act = el.dataset.act;
    if (act.endsWith('-fundo') && e.target !== el) return; // clique no fundo escuro, não no conteúdo
    const fn = A[act];
    if (!fn) return;
    e.preventDefault();
    // ações escolhidas dentro da gaveta fecham a gaveta antes (menos o CRT, que só alterna)
    const naGaveta = !!el.closest('#gaveta') && !act.startsWith('gaveta') && act !== 'tab';
    if (naGaveta && act !== 'toggle-crt') { App.ui.gaveta = false; renderGaveta(); }
    fn(el.dataset.a, el.dataset.b, el, e);
    if (naGaveta && act === 'toggle-crt') renderGaveta();
  }

  function onKey(e) {
    const t = e.target;
    if ((e.key === 'Enter' || e.key === ' ') && t && t.getAttribute && t.getAttribute('role') === 'button' && t.dataset.act) {
      e.preventDefault();
      t.click();
      return;
    }
    if (e.key === 'Enter' && t && t.dataset && t.dataset.ui && ENTER[t.dataset.ui]) {
      e.preventDefault();
      const [act, arg] = ENTER[t.dataset.ui].split(':');
      A[act](arg);
      return;
    }
    if (e.key === 'Escape' && App.ui.modal) { e.preventDefault(); fecharModal(); return; }
    if (App.ui.gaveta) {
      if (e.key === 'Escape') { e.preventDefault(); fecharGaveta(true); return; }
      if (e.key === 'Tab') { // mantém o foco dentro da gaveta
        const foc = [...document.querySelectorAll('#gaveta button, #gaveta select')].filter(x => !x.disabled);
        if (foc.length) {
          const i = foc.indexOf(document.activeElement);
          const prox = e.shiftKey ? (i <= 0 ? foc[foc.length - 1] : foc[i - 1]) : (i === -1 || i === foc.length - 1 ? foc[0] : foc[i + 1]);
          e.preventDefault();
          prox.focus();
        }
        return;
      }
    }
    if (e.altKey && !e.ctrlKey && /^Digit[0-9]$/.test(e.code)) {
      const k = e.code.slice(5);
      const tab = UI.tabList(App.d).find(x => x.k === k);
      if (tab) { e.preventDefault(); A.tab(tab.id); const b = $(`#tab-${tab.id}`); if (b) b.focus({ preventScroll: true }); }
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) { e.preventDefault(); salvar(true); toast('Ficha salva neste navegador.', { cor: 'acu' }); return; }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) { e.preventDefault(); abrirModal('pdf'); return; }
    if (t && t.getAttribute && t.getAttribute('role') === 'tab' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      const irmaos = [...t.parentElement.querySelectorAll('[role="tab"]')];
      const i = irmaos.indexOf(t);
      const prox = irmaos[(i + (e.key === 'ArrowRight' ? 1 : irmaos.length - 1)) % irmaos.length];
      if (prox) { e.preventDefault(); prox.click(); const novo = document.querySelector(`[data-fk="${CSS.escape(prox.dataset.fk)}"]`); if (novo) novo.focus(); }
    }
  }

  function trocarModulo(mod) {
    if (mod !== 'base' && mod !== 'passado') return;
    if (mod === App.c.modulo) return;
    const snap = snapshot();
    App.c.modulo = mod;
    const id = R.origemId(App.c);
    App.c.itens = App.c.itens.filter(i => i.origem !== 'inicial');
    App.c.palavras = App.c.palavras.filter(p => p.origem !== 'inicial');
    if (id) R.aplicarOrigem(App.c, id);
    if (App.ui.tab === 'regras' && App.ui.regra === 'passado' && mod !== 'passado') App.ui.regra = 'limiar';
    mudou();
    render();
    toast(mod === 'passado' ? 'Extensão: Em um Passado Distante' : 'Livro base: 1ª Edição', { det: mod === 'passado' ? 'As Classes substituem as Profissões.' : 'Profissões do Livro do Jogador.', undo: snap, cor: mod === 'passado' ? 'yel' : 'cyan' });
  }

  /* ------------------------------------------------------------------ */
  /* BOOT                                                               */
  /* ------------------------------------------------------------------ */
  function boot() {
    const tela = $('#screen');
    let visto = false;
    try { visto = sessionStorage.getItem('limiar.boot') === '1'; } catch (e) { visto = false; }
    if (!App.store.prefs.boot || visto || reduzMovimento) return;
    try { sessionStorage.setItem('limiar.boot', '1'); } catch (e) { /* ok */ }
    const el = $('#boot');
    const pre = el.querySelector('pre');
    const linhas = UI.bootText(App.c.modulo);
    el.hidden = false;
    let i = 0, fim = false;
    const terminar = () => {
      if (fim) return;
      fim = true;
      el.classList.add('off');
      setTimeout(() => { el.hidden = true; el.classList.remove('off'); tela.classList.add('power-on'); }, 430);
      document.removeEventListener('keydown', terminar, true);
    };
    el.addEventListener('click', terminar);
    document.addEventListener('keydown', terminar, true);
    const tick = () => {
      if (fim) return;
      pre.innerHTML = linhas.slice(0, i + 1).join('\n') + '<span class="cursor"></span>';
      i++;
      if (i < linhas.length) setTimeout(tick, i === 4 ? 260 : 110);
      else setTimeout(terminar, 500);
    };
    tick();
  }

  function relogio() {
    const el = $('#st-clock');
    if (el) el.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  /* ------------------------------------------------------------------ */
  /* INÍCIO                                                             */
  /* ------------------------------------------------------------------ */
  /* Confere a sessão, baixa as fichas do usuário e só então monta o app. */
  async function entrar() {
    const s = L.API.sessao();
    if (!s || !s.token) { irLogin(); return; }
    try {
      App.usuario = await L.API.me();
    } catch (e) {
      if (e.status === 401) { irLogin(); return; }
      App.usuario = s.usuario || null; // offline: segue com a cópia local
    }
    if (!App.usuario) { irLogin(); return; }
    KEY = `${KEY_ANTIGA}.u${App.usuario.id}`;
    let remotas = null;
    try { remotas = await L.API.listar(); } catch (e) { if (e.status === 401) { irLogin(); return; } remotas = null; }
    iniciar(remotas);
    if (!remotas) statusSalvo('OFFLINE · salvo só neste navegador', true);
    const st = $('#st-save');
    if (st && !$('#st-user')) {
      st.insertAdjacentHTML('beforebegin', `<span id="st-user" class="hide-s">${UI.esc(App.usuario.login)} #${App.usuario.id}</span><button type="button" id="st-sair" data-act="sair" data-fk="st:sair">SAIR</button>`);
    }
  }

  function iniciar(remotas) {
    App.mudou = mudou; // usados pelo módulo do mapa
    App.toast = toast;
    App.store = carregar(remotas);
    App.c = App.store.fichas[App.store.ativo];
    const logo = $('#logo');
    if (logo) logo.innerHTML = UI.logoSVG('LIMIAR');
    const sel = $('#modulo');
    if (sel) sel.innerHTML = D.MODULOS.map(m => `<option value="${m.id}">${UI.esc(m.nome)}</option>`).join('');
    aplicarPrefs();
    render();
    atualizarRetrato().then(() => { if (App.c.retrato) render(); });
    document.addEventListener('click', onClick);
    document.addEventListener('input', onInput);
    document.addEventListener('change', onChange);
    document.addEventListener('keydown', onKey);
    // ao cruzar a largura de celular (girar a tela, redimensionar), refaz o layout; a gaveta fecha no computador
    if (window.matchMedia) {
      const mq = window.matchMedia('(max-width: 760px)');
      const trocou = () => { render(); };
      if (mq.addEventListener) mq.addEventListener('change', trocou); else if (mq.addListener) mq.addListener(trocou);
    }
    document.addEventListener('toggle', e => {
      const el = e.target;
      if (el && el.dataset && el.dataset.openKey) {
        if (el.open) App.ui.open.add(el.dataset.openKey); else App.ui.open.delete(el.dataset.openKey);
      }
    }, true);
    window.addEventListener('storage', e => {
      if (e.key !== KEY) return;
      statusSalvo('ALTERADO EM OUTRA ABA');
    });
    relogio();
    setInterval(relogio, 20000);
    salvar(true);
    if (!podeSalvar) toast('Este navegador não permite salvar localmente. Use Exportar JSON.', { cor: 'raz' });
    boot();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', entrar);
  else entrar();
})();
