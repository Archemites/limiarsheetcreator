/* LIMIAR — aba Mapa: malha sem fim para o Perito desenhar o mundo em 16 cores (EGA).
   Na ficha fica uma matriz: c.mapa = { x, y, m: [[0, 3, 3], [0, 0, 12], …] } — x/y é a
   coordenada do canto superior esquerdo da área desenhada; cada número é uma cor
   (0 = vazio, 1 a 16 = paleta). Internamente o desenho vive em blocos de 64×64. */
(function () {
  'use strict';
  const L = (window.LIMIAR = window.LIMIAR || {});

  const PALETA = ['#000000', '#0000aa', '#00aa00', '#00aaaa', '#aa0000', '#aa00aa', '#aa5500', '#aaaaaa',
    '#555555', '#5555ff', '#55ff55', '#55ffff', '#ff5555', '#ff55ff', '#ffff55', '#ffffff'];
  const NOMES = ['Preto', 'Azul', 'Verde', 'Ciano', 'Vermelho', 'Magenta', 'Marrom', 'Cinza claro',
    'Cinza escuro', 'Azul claro', 'Verde claro', 'Ciano claro', 'Vermelho claro', 'Magenta claro', 'Amarelo', 'Branco'];
  const RGB = PALETA.map(h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)));
  const CH = 64;        // lado de cada bloco interno, em quadrados
  const LIMITE = 512;   // maior largura/altura da área desenhada (a malha em si não tem fim)
  const NIVEIS = [2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48]; // zoom: px por quadrado
  const ZMIN = NIVEIS[0], ZMAX = NIVEIS[NIVEIS.length - 1];
  const FERRAMENTAS = [
    { id: 'lapis', nome: 'Lápis', tecla: 'B' },
    { id: 'borracha', nome: 'Borracha', tecla: 'E' },
    { id: 'balde', nome: 'Balde', tecla: 'G' },
    { id: 'conta', nome: 'Conta-gotas', tecla: 'I' },
    { id: 'mover', nome: 'Mover', tecla: 'H' }
  ];
  const VIZ = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  const st = {
    ferramenta: 'lapis', cor: 3, tam: 1, grade: true,
    s: 16, ox: 0, oy: 0,            // zoom e coordenada (em quadrados) do canto superior esquerdo da vista
    blocos: new Map(), bbox: null,  // bbox = área já desenhada (para o limite)
    desfazer: [], refazer: [],
    carregado: undefined, ficha: null, hover: null, centralizar: false
  };
  let app = null, root = null, canvas = null, ctx = null, obs = null, cores = null;
  let cssW = 0, cssH = 0, dpr = 1, quadroPedido = false;
  let traco = null, arrasto = null, gesto = null, espaco = false, avisou = false;
  const ponteiros = new Map();

  const clampZ = s => Math.max(ZMIN, Math.min(ZMAX, s));
  const div = v => Math.floor(v / CH);
  const chave = (bx, by) => bx + ',' + by;

  /* ---------------- dados ---------------- */
  function bloco(bx, by, criar) {
    const k = chave(bx, by);
    let b = st.blocos.get(k);
    if (!b && criar) {
      const cv = document.createElement('canvas');
      cv.width = CH; cv.height = CH;
      const cx = cv.getContext('2d');
      b = { d: new Uint8Array(CH * CH), n: 0, cv, cx, img: cx.createImageData(CH, CH) };
      st.blocos.set(k, b);
    }
    return b;
  }
  function ler(x, y) {
    const bx = div(x), by = div(y), b = st.blocos.get(chave(bx, by));
    return b ? b.d[(y - by * CH) * CH + (x - bx * CH)] : 0;
  }
  /* Altera um quadrado sem nenhuma regra; devolve o valor antigo. */
  function gravar(x, y, v) {
    const bx = div(x), by = div(y);
    const b = bloco(bx, by, v !== 0);
    if (!b) return 0;
    const lx = x - bx * CH, ly = y - by * CH, i = ly * CH + lx;
    const antigo = b.d[i];
    if (antigo === v) return antigo;
    b.d[i] = v;
    b.n += (v ? 1 : 0) - (antigo ? 1 : 0);
    const p = i * 4, px = b.img.data;
    if (v) { const c = RGB[v - 1]; px[p] = c[0]; px[p + 1] = c[1]; px[p + 2] = c[2]; px[p + 3] = 255; } else px[p + 3] = 0;
    b.cx.putImageData(b.img, 0, 0, lx, ly, 1, 1);
    if (v) expandir(x, y);
    return antigo;
  }
  function expandir(x, y) {
    const b = st.bbox;
    if (!b) { st.bbox = { x0: x, y0: y, x1: x, y1: y }; return; }
    if (x < b.x0) b.x0 = x; if (x > b.x1) b.x1 = x;
    if (y < b.y0) b.y0 = y; if (y > b.y1) b.y1 = y;
  }
  function cabe(x, y) {
    const b = st.bbox;
    return !b || (Math.max(b.x1, x) - Math.min(b.x0, x) < LIMITE && Math.max(b.y1, y) - Math.min(b.y0, y) < LIMITE);
  }

  /* Matriz enxuta: só a área desenhada. null = mapa vazio. */
  function serializar() {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const cheios = [];
    for (const [k, b] of st.blocos) {
      if (!b.n) continue;
      const [bx, by] = k.split(',').map(Number);
      for (let i = 0; i < b.d.length; i++) {
        if (!b.d[i]) continue;
        const x = bx * CH + (i % CH), y = by * CH + Math.floor(i / CH);
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
      cheios.push([bx, by, b]);
    }
    if (x0 === Infinity) return null;
    const m = Array.from({ length: y1 - y0 + 1 }, () => new Array(x1 - x0 + 1).fill(0));
    for (const [bx, by, b] of cheios) {
      for (let i = 0; i < b.d.length; i++) if (b.d[i]) m[by * CH + Math.floor(i / CH) - y0][bx * CH + (i % CH) - x0] = b.d[i];
    }
    return { x: x0, y: y0, m };
  }
  function carregar(mapa) {
    st.blocos.clear();
    st.bbox = null;
    st.desfazer = [];
    st.refazer = [];
    if (mapa && Array.isArray(mapa.m)) {
      mapa.m.forEach((linha, j) => {
        if (!Array.isArray(linha)) return;
        linha.forEach((v, i) => { v |= 0; if (v >= 1 && v <= 16) gravar(mapa.x + i, mapa.y + j, v); });
      });
    }
    st.carregado = mapa;
  }
  function salvar() {
    const m = serializar();
    st.carregado = m;
    st.bbox = m ? { x0: m.x, y0: m.y, x1: m.x + m.m[0].length - 1, y1: m.y + m.m.length - 1 } : null;
    if (app && app.c === st.ficha) { app.c.mapa = m; if (app.mudou) app.mudou(); }
    barraAtualizar();
    status();
  }
  function aviso(msg) { if (app && app.toast) app.toast(msg, { cor: 'raz' }); }

  /* ---------------- desenho ---------------- */
  function pintar(x, y, v) {
    if (v && !cabe(x, y)) {
      if (!avisou) { avisou = true; aviso(`Limite do mapa: ${LIMITE}×${LIMITE} quadrados de área desenhada.`); }
      return;
    }
    const antigo = gravar(x, y, v);
    const k = x + ',' + y, reg = traco.mud.get(k);
    if (reg) reg[3] = v; else if (antigo !== v) traco.mud.set(k, [x, y, antigo, v]);
  }
  function pincel(x, y) {
    const v = st.ferramenta === 'borracha' ? 0 : st.cor;
    const n = st.tam, ini = -Math.floor((n - 1) / 2);
    for (let dy = 0; dy < n; dy++) for (let dx = 0; dx < n; dx++) pintar(x + ini + dx, y + ini + dy, v);
  }
  function linha(x0, y0, x1, y1) { // Bresenham: não deixa buracos no traço
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      pincel(x0, y0);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }
  function fecharTraco() {
    if (!traco) return;
    const ops = [...traco.mud.values()].filter(o => o[2] !== o[3]);
    traco = null;
    avisou = false;
    if (!ops.length) return;
    st.desfazer.push(ops);
    if (st.desfazer.length > 100) st.desfazer.shift();
    st.refazer = [];
    salvar();
  }
  function cancelarTraco() {
    if (!traco) return;
    [...traco.mud.values()].reverse().forEach(o => gravar(o[0], o[1], o[2]));
    traco = null;
    avisou = false;
    pedirQuadro();
  }
  /* Balde: preenche a região da mesma cor, só dentro da área visível (a malha é infinita). */
  function balde(x, y) {
    const alvo = ler(x, y), nova = st.cor;
    if (alvo === nova) return;
    const vx0 = Math.floor(st.ox), vy0 = Math.floor(st.oy);
    const vx1 = Math.floor(st.ox + cssW / st.s), vy1 = Math.floor(st.oy + cssH / st.s);
    const lista = [], visto = new Set([x + ',' + y]), pilha = [x, y];
    while (pilha.length) {
      const b = pilha.pop(), a = pilha.pop();
      lista.push(a, b);
      for (const [dx, dy] of VIZ) {
        const nx = a + dx, ny = b + dy;
        if (nx < vx0 || nx > vx1 || ny < vy0 || ny > vy1) continue;
        const k = nx + ',' + ny;
        if (visto.has(k)) continue;
        visto.add(k);
        if (ler(nx, ny) === alvo) pilha.push(nx, ny);
      }
    }
    let x0 = st.bbox ? st.bbox.x0 : Infinity, y0 = st.bbox ? st.bbox.y0 : Infinity;
    let x1 = st.bbox ? st.bbox.x1 : -Infinity, y1 = st.bbox ? st.bbox.y1 : -Infinity;
    for (let i = 0; i < lista.length; i += 2) {
      x0 = Math.min(x0, lista[i]); x1 = Math.max(x1, lista[i]);
      y0 = Math.min(y0, lista[i + 1]); y1 = Math.max(y1, lista[i + 1]);
    }
    if (x1 - x0 >= LIMITE || y1 - y0 >= LIMITE) { aviso(`Área grande demais para o balde (limite ${LIMITE}×${LIMITE}). Dê zoom ou feche a região.`); return; }
    traco = { mud: new Map(), ult: null };
    for (let i = 0; i < lista.length; i += 2) pintar(lista[i], lista[i + 1], nova);
    fecharTraco();
    pedirQuadro();
  }
  function desfazer() {
    const ops = st.desfazer.pop();
    if (!ops) return;
    for (let i = ops.length - 1; i >= 0; i--) gravar(ops[i][0], ops[i][1], ops[i][2]);
    st.refazer.push(ops);
    salvar();
    pedirQuadro();
  }
  function refazer() {
    const ops = st.refazer.pop();
    if (!ops) return;
    for (const o of ops) gravar(o[0], o[1], o[3]);
    st.desfazer.push(ops);
    salvar();
    pedirQuadro();
  }

  /* ---------------- vista ---------------- */
  function zoom(novo, px, py) {
    novo = clampZ(novo);
    if (px == null) { px = cssW / 2; py = cssH / 2; }
    const wx = st.ox + px / st.s, wy = st.oy + py / st.s;
    st.s = novo;
    st.ox = wx - px / novo;
    st.oy = wy - py / novo;
    pedirQuadro();
    status();
  }
  function nivel(passo) {
    if (passo > 0) return NIVEIS.find(n => n > st.s + 0.01) || ZMAX;
    return [...NIVEIS].reverse().find(n => n < st.s - 0.01) || ZMIN;
  }
  function centralizar() {
    if (!cssW) { st.centralizar = true; return; }
    const b = st.bbox;
    if (!b) {
      st.ox = -cssW / st.s / 2;
      st.oy = -cssH / st.s / 2;
    } else {
      const w = b.x1 - b.x0 + 1, h = b.y1 - b.y0 + 1;
      const cabeS = Math.min(cssW / (w + 6), cssH / (h + 6));
      st.s = [...NIVEIS].reverse().find(n => n <= cabeS) || ZMIN;
      st.ox = b.x0 + w / 2 - cssW / st.s / 2;
      st.oy = b.y0 + h / 2 - cssH / st.s / 2;
    }
    pedirQuadro();
    status();
  }
  function pedirQuadro() {
    if (quadroPedido) return;
    quadroPedido = true;
    requestAnimationFrame(desenhar);
  }
  function lerCores() {
    const cs = getComputedStyle(document.documentElement);
    const v = (n, pad) => (cs.getPropertyValue(n) || '').trim() || pad;
    cores = { fundo: v('--field', '#05060b'), linha: v('--line-2', '#3a4796'), eixo: v('--accent', '#3fe0ff'), fg: v('--fg', '#ebe6d2') };
  }
  function desenhar() {
    quadroPedido = false;
    if (!ctx || !canvas.isConnected || !cssW) return;
    if (!cores) lerCores();
    const s = st.s;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = cores.fundo;
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.imageSmoothingEnabled = false;
    const gx0 = Math.floor(st.ox), gy0 = Math.floor(st.oy);
    const gx1 = Math.ceil(st.ox + cssW / s), gy1 = Math.ceil(st.oy + cssH / s);
    for (let by = div(gy0); by <= div(gy1); by++) {
      for (let bx = div(gx0); bx <= div(gx1); bx++) {
        const b = st.blocos.get(chave(bx, by));
        if (b && b.n) ctx.drawImage(b.cv, (bx * CH - st.ox) * s, (by * CH - st.oy) * s, CH * s, CH * s);
      }
    }
    const grade = (passo, alfa) => {
      ctx.beginPath();
      for (let x = Math.ceil(gx0 / passo) * passo; x <= gx1; x += passo) { const p = Math.round((x - st.ox) * s) + 0.5; ctx.moveTo(p, 0); ctx.lineTo(p, cssH); }
      for (let y = Math.ceil(gy0 / passo) * passo; y <= gy1; y += passo) { const p = Math.round((y - st.oy) * s) + 0.5; ctx.moveTo(0, p); ctx.lineTo(cssW, p); }
      ctx.globalAlpha = alfa;
      ctx.strokeStyle = cores.linha;
      ctx.lineWidth = 1;
      ctx.stroke();
    };
    if (st.grade) {
      if (s >= 8) grade(1, 0.28);
      if (s >= 3) grade(8, 0.55);
    }
    // eixos da origem (0, 0) para se orientar na malha sem fim
    ctx.globalAlpha = 0.45;
    ctx.strokeStyle = cores.eixo;
    ctx.beginPath();
    const ex = Math.round(-st.ox * s) + 0.5, ey = Math.round(-st.oy * s) + 0.5;
    ctx.moveTo(ex, 0); ctx.lineTo(ex, cssH);
    ctx.moveTo(0, ey); ctx.lineTo(cssW, ey);
    ctx.stroke();
    ctx.globalAlpha = 1;
    // cursor: mostra onde o pincel vai pintar
    const h = st.hover;
    if (h && !arrasto && !gesto && st.ferramenta !== 'mover' && !espaco) {
      const n = st.ferramenta === 'lapis' || st.ferramenta === 'borracha' ? st.tam : 1, ini = -Math.floor((n - 1) / 2);
      const x = (h.x + ini - st.ox) * s, y = (h.y + ini - st.oy) * s, w = n * s;
      ctx.lineWidth = 1;
      ctx.strokeStyle = cores.fg;
      ctx.strokeRect(Math.round(x) - 0.5, Math.round(y) - 0.5, Math.round(w) + 1, Math.round(w) + 1);
      if (st.ferramenta === 'lapis' || st.ferramenta === 'balde') {
        ctx.fillStyle = PALETA[st.cor - 1];
        ctx.globalAlpha = 0.55;
        ctx.fillRect(Math.round(x) + 1, Math.round(y) + 1, Math.max(1, Math.round(w) - 2), Math.max(1, Math.round(w) - 2));
        ctx.globalAlpha = 1;
      }
    }
  }
  function medir() {
    if (!canvas || !canvas.isConnected) return;
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    const novoDpr = window.devicePixelRatio || 1;
    if (w !== cssW || h !== cssH || novoDpr !== dpr) {
      const cx = st.ox + cssW / st.s / 2, cy = st.oy + cssH / st.s / 2, tinha = cssW > 0;
      cssW = w; cssH = h; dpr = novoDpr;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      if (tinha) { st.ox = cx - cssW / st.s / 2; st.oy = cy - cssH / st.s / 2; }
    }
    if (st.centralizar) { st.centralizar = false; centralizar(); }
    pedirQuadro();
  }

  /* ---------------- entrada (mouse, caneta, toque) ---------------- */
  function celula(e) {
    const r = canvas.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    return { px, py, x: Math.floor(st.ox + px / st.s), y: Math.floor(st.oy + py / st.s) };
  }
  const distancia = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) || 1;
  const meio = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

  function aoApertar(e) {
    canvas.focus({ preventScroll: true });
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
    ponteiros.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ponteiros.size === 2) { // dois dedos: arrastar e dar zoom
      cancelarTraco();
      arrasto = null;
      const [a, b] = [...ponteiros.values()];
      gesto = { d: distancia(a, b), m: meio(a, b), s: st.s, ox: st.ox, oy: st.oy };
      return;
    }
    if (ponteiros.size > 2) return;
    const c = celula(e);
    if (st.ferramenta === 'mover' || espaco || e.button === 1 || e.button === 2) {
      e.preventDefault();
      arrasto = { x: e.clientX, y: e.clientY, ox: st.ox, oy: st.oy };
      canvas.classList.add('arrastando');
      return;
    }
    if (e.button !== 0) return;
    if (st.ferramenta === 'conta') {
      const v = ler(c.x, c.y);
      if (v) { st.cor = v; st.ferramenta = 'lapis'; barraAtualizar(); }
      return;
    }
    if (st.ferramenta === 'balde') { balde(c.x, c.y); return; }
    traco = { mud: new Map(), ult: c };
    pincel(c.x, c.y);
    pedirQuadro();
  }
  function aoMover(e) {
    if (ponteiros.has(e.pointerId)) ponteiros.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (gesto) {
      if (ponteiros.size < 2) return;
      const [a, b] = [...ponteiros.values()], r = canvas.getBoundingClientRect();
      const s = clampZ(gesto.s * distancia(a, b) / gesto.d), m = meio(a, b);
      const wx = gesto.ox + (gesto.m.x - r.left) / gesto.s, wy = gesto.oy + (gesto.m.y - r.top) / gesto.s;
      st.s = s;
      st.ox = wx - (m.x - r.left) / s;
      st.oy = wy - (m.y - r.top) / s;
      pedirQuadro();
      status();
      return;
    }
    const c = celula(e);
    st.hover = c;
    if (arrasto) {
      st.ox = arrasto.ox - (e.clientX - arrasto.x) / st.s;
      st.oy = arrasto.oy - (e.clientY - arrasto.y) / st.s;
    } else if (traco) {
      linha(traco.ult.x, traco.ult.y, c.x, c.y);
      traco.ult = c;
    }
    pedirQuadro();
    status(c);
  }
  function aoSoltar(e) {
    ponteiros.delete(e.pointerId);
    if (gesto) { if (ponteiros.size < 2) gesto = null; return; }
    if (arrasto) { arrasto = null; canvas.classList.remove('arrastando'); }
    if (traco) fecharTraco();
    pedirQuadro();
  }
  function aoRolar(e) {
    e.preventDefault();
    if (e.shiftKey) { // Shift + roda: anda para os lados
      st.ox += (e.deltaY || e.deltaX) / st.s;
      pedirQuadro();
      return;
    }
    const c = celula(e);
    zoom(nivel(e.deltaY < 0 ? 1 : -1), c.px, c.py);
  }
  function criarCanvas() {
    canvas = document.createElement('canvas');
    canvas.className = 'mapa-canvas';
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Mapa do mundo: malha para desenhar');
    ctx = canvas.getContext('2d');
    canvas.addEventListener('pointerdown', aoApertar);
    canvas.addEventListener('pointermove', aoMover);
    canvas.addEventListener('pointerup', aoSoltar);
    canvas.addEventListener('pointercancel', aoSoltar);
    canvas.addEventListener('pointerleave', () => { if (!traco && !arrasto) { st.hover = null; pedirQuadro(); status(); } });
    canvas.addEventListener('wheel', aoRolar, { passive: false });
    canvas.addEventListener('contextmenu', e => e.preventDefault());
  }

  const ativo = () => !!(canvas && canvas.isConnected && L.App && L.App.ui && L.App.ui.tab === 'mapa' && !L.App.ui.modal);
  document.addEventListener('keydown', e => {
    if (!ativo()) return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
    const k = (e.key || '').toLowerCase();
    if ((e.ctrlKey || e.metaKey) && !e.altKey) {
      if (k === 'z' && !e.shiftKey) { e.preventDefault(); desfazer(); }
      else if (k === 'y' || (k === 'z' && e.shiftKey)) { e.preventDefault(); refazer(); }
      return;
    }
    if (e.altKey) return;
    if (e.key === ' ') {
      e.preventDefault();
      if (!espaco) { espaco = true; canvas.classList.add('pan'); pedirQuadro(); }
      return;
    }
    const f = { b: 'lapis', e: 'borracha', g: 'balde', i: 'conta', h: 'mover' }[k];
    if (f) { st.ferramenta = f; barraAtualizar(); return; }
    if (k === '+' || k === '=') zoom(nivel(1));
    else if (k === '-' || k === '_') zoom(nivel(-1));
    else if (k === 'c') centralizar();
    else if (k === '[' || k === ']') { st.cor = ((st.cor - 1 + (k === ']' ? 1 : 15)) % 16) + 1; barraAtualizar(); }
  });
  document.addEventListener('keyup', e => {
    if (e.key === ' ' && espaco) { espaco = false; if (canvas) canvas.classList.remove('pan'); barraAtualizar(); pedirQuadro(); }
  });

  /* ---------------- barra de ferramentas ---------------- */
  function barraHTML() {
    const on = c => (c ? ' btn-pri' : '');
    const ferr = FERRAMENTAS.map(f => `<button type="button" class="btn btn-s${on(st.ferramenta === f.id)}" data-mapa="ferr" data-v="${f.id}" aria-pressed="${st.ferramenta === f.id}" title="${f.nome} (${f.tecla})">${f.nome}</button>`).join('');
    const tam = [1, 2, 3].map(n => `<button type="button" class="btn btn-s${on(st.tam === n)}" data-mapa="tam" data-v="${n}" aria-pressed="${st.tam === n}" title="Pincel ${n}×${n}">${n}</button>`).join('');
    return `
      <div class="mapa-grupo"><span class="fld-l">Ferramenta</span><div>${ferr}</div></div>
      <div class="mapa-grupo"><span class="fld-l">Pincel</span><div>${tam}</div></div>
      <div class="mapa-grupo"><span class="fld-l">Vista</span><div>
        <button type="button" class="btn btn-s" data-mapa="zoom" data-v="-1" title="Afastar (-)">-</button>
        <button type="button" class="btn btn-s" data-mapa="zoom" data-v="1" title="Aproximar (+)">+</button>
        <button type="button" class="btn btn-s" data-mapa="centro" title="Centralizar no desenho (C)">Centralizar</button>
        <button type="button" class="btn btn-s${on(st.grade)}" data-mapa="grade" aria-pressed="${st.grade}">Grade</button></div></div>
      <div class="mapa-grupo"><span class="fld-l">Edição</span><div>
        <button type="button" class="btn btn-s" data-mapa="desfazer" title="Desfazer (Ctrl+Z)"${st.desfazer.length ? '' : ' disabled'}>Desfazer</button>
        <button type="button" class="btn btn-s" data-mapa="refazer" title="Refazer (Ctrl+Y)"${st.refazer.length ? '' : ' disabled'}>Refazer</button>
        <button type="button" class="btn btn-s btn-x" data-act="mapa-limpar" data-fk="mapa:limpar"${st.bbox ? '' : ' disabled'}>Limpar mapa</button></div></div>`;
  }
  function paletaHTML() {
    return PALETA.map((h, i) => `<button type="button" class="mapa-cor${st.cor === i + 1 ? ' on' : ''}" data-mapa="cor" data-v="${i + 1}" style="--sw:${h}" title="${i + 1} · ${NOMES[i]}" aria-label="Cor ${i + 1}: ${NOMES[i]}" aria-pressed="${st.cor === i + 1}"><span>${i + 1}</span></button>`).join('');
  }
  function barraAtualizar() {
    if (!root || !root.isConnected) return;
    const b = root.querySelector('.mapa-barra');
    if (b) b.innerHTML = barraHTML();
    const p = root.querySelector('.mapa-paleta');
    if (p) p.innerHTML = paletaHTML();
    if (canvas) canvas.classList.toggle('pan', st.ferramenta === 'mover' || espaco);
  }
  function status(c) {
    const el = root && root.isConnected && root.querySelector('.mapa-status');
    if (!el) return;
    const h = c || st.hover, b = st.bbox;
    el.innerHTML = `<span>${h ? `X ${h.x} · Y ${h.y}` : 'X - · Y -'}</span>` +
      `<span>Zoom ${Math.round(st.s)}px · ${b ? `área desenhada ${b.x1 - b.x0 + 1}×${b.y1 - b.y0 + 1}` : 'mapa vazio'} (limite ${LIMITE}×${LIMITE})</span>`;
  }
  function aoClicar(e) {
    const b = e.target.closest('[data-mapa]');
    if (!b || !root || !root.contains(b)) return;
    const v = b.dataset.v;
    switch (b.dataset.mapa) {
      case 'ferr': st.ferramenta = v; break;
      case 'tam': st.tam = Number(v) || 1; break;
      case 'cor':
        st.cor = Number(v) || 1;
        if (st.ferramenta !== 'lapis' && st.ferramenta !== 'balde') st.ferramenta = 'lapis';
        break;
      case 'zoom': zoom(nivel(Number(v))); break;
      case 'centro': centralizar(); break;
      case 'grade': st.grade = !st.grade; pedirQuadro(); break;
      case 'desfazer': desfazer(); break;
      case 'refazer': refazer(); break;
      default: return;
    }
    barraAtualizar();
  }

  /* Chamado pelo app a cada render da aba: reaproveita o mesmo <canvas> (o desenho e a
     vista não se perdem) e recarrega só se a ficha ou o mapa dela mudaram por fora. */
  function montar(host, App) {
    if (!host) return;
    app = App;
    if (!canvas) criarCanvas();
    if (App.c !== st.ficha || App.c.mapa !== st.carregado) {
      if (traco) cancelarTraco();
      st.ficha = App.c;
      carregar(App.c.mapa);
      st.centralizar = true;
    }
    root = host;
    root.innerHTML = `<div class="mapa-barra">${barraHTML()}</div><div class="mapa-paleta" role="group" aria-label="Paleta de 16 cores">${paletaHTML()}</div><div class="mapa-tela"></div><div class="mapa-status"></div>`;
    root.querySelector('.mapa-tela').appendChild(canvas);
    root.addEventListener('click', aoClicar);
    canvas.classList.toggle('pan', st.ferramenta === 'mover' || espaco);
    if (obs) obs.disconnect();
    if (window.ResizeObserver) { obs = new ResizeObserver(medir); obs.observe(canvas); }
    cores = null;
    medir();
    status();
  }

  L.Mapa = { montar, PALETA, NOMES, LIMITE, estado: () => ({ s: st.s, ox: st.ox, oy: st.oy, bbox: st.bbox, cssW, cssH, blocos: st.blocos.size }) };
})();
