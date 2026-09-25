/* LIMIAR — exportação da ficha em PDF (jsPDF). Tudo é desenhado em vetor, em milímetros,
   com um motor de fluxo simples: `ensure(h)` abre página nova (fundo + cabeçalho) quando falta espaço. */
(function () {
  'use strict';
  const L = (window.LIMIAR = window.LIMIAR || {});
  const D = L.DATA;
  const R = L.Rules;

  const FONTES = [
    { arq: 'VT323-Regular.ttf', fam: 'VT323', estilo: 'normal' },
    { arq: 'IBMPlexMono-Regular.ttf', fam: 'Plex', estilo: 'normal' },
    { arq: 'IBMPlexMono-Bold.ttf', fam: 'Plex', estilo: 'bold' },
    { arq: 'IBMPlexMono-Italic.ttf', fam: 'Plex', estilo: 'italic' }
  ];

  const TEMAS = {
    escuro: {
      bg: '#07080f', scan: '#0b0d18', painel: '#0e1121', painel2: '#161b33', fg: '#ebe8da', dim: '#9ba3c9', mute: '#5d6593', linha: '#2b3258',
      vig: '#ff4f64', acu: '#36e08a', psi: '#5c8dff', eso: '#e35cff', raz: '#ffae3b',
      cyan: '#3fe0ff', yel: '#ffe45e', vio: '#b48cff', sobre: '#07080f',
      logo: D.LOGO.CORES
    },
    claro: {
      bg: '#ffffff', scan: null, painel: '#f1f2f7', painel2: '#e2e5f1', fg: '#12141f', dim: '#474d6a', mute: '#8a90ab', linha: '#b9bed3',
      vig: '#d0142c', acu: '#0f9d58', psi: '#1f5fe0', eso: '#b01ec8', raz: '#d97b00',
      cyan: '#1f3fd1', yel: '#a07c00', vio: '#6b3fd0', sobre: '#ffffff',
      logo: ['#d0142c', '#d97b00', '#c9a200', '#0f9d58', '#0089a8', '#1f5fe0', '#b01ec8']
    }
  };

  const PT = 0.3528; // mm por ponto tipográfico

  /* O PDF só recebe Latin-1: troca símbolos tipográficos e descarta o resto (emoji, box-drawing…). */
  function S(v) {
    return String(v == null ? '' : v)
      .replace(/\r\n?/g, '\n').replace(/\t/g, '  ')
      .replace(/[‘’‛]/g, "'").replace(/[“”]/g, '"')
      .replace(/[–—−]/g, '-').replace(/…/g, '...')
      .replace(/→/g, '->').replace(/←/g, '<-').replace(/≤/g, '<=').replace(/≥/g, '>=')
      .replace(/[•●]/g, '·').replace(/[★☆]/g, '*')
      .replace(/[^\n -~ -ÿ]/g, '');
  }

  /* ------------------------------------------------------------------ */
  /* CARREGAMENTO (jsPDF + fontes)                                      */
  /* ------------------------------------------------------------------ */
  let carregando = null;

  function carregarScript(src) {
    return new Promise((ok, erro) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = ok;
      s.onerror = () => erro(new Error('Não foi possível carregar ' + src));
      document.head.appendChild(s);
    });
  }

  function paraBase64(buf) {
    const bytes = new Uint8Array(buf);
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }

  function carregar() {
    if (!carregando) {
      carregando = (async () => {
        if (!(window.jspdf && window.jspdf.jsPDF)) await carregarScript('vendor/jspdf.umd.min.js');
        if (!window.jspdf || !window.jspdf.jsPDF) throw new Error('jsPDF indisponível');
        if (PDF.fontes) return;
        try {
          const lista = await Promise.all(FONTES.map(async f => {
            const r = await fetch('assets/fonts/' + f.arq);
            if (!r.ok) throw new Error(f.arq + ': HTTP ' + r.status);
            return [f.arq, paraBase64(await r.arrayBuffer())];
          }));
          PDF.fontes = Object.fromEntries(lista);
          PDF.fontesOk = true;
        } catch (e) {
          // file:// não permite fetch: segue com as fontes padrão do PDF
          console.warn('LIMIAR PDF: usando fontes padrão.', e);
          PDF.fontes = null;
          PDF.fontesOk = false;
        }
      })().catch(e => { carregando = null; throw e; });
    }
    return carregando;
  }

  function registrarFontes(doc) {
    if (!PDF.fontesOk || !PDF.fontes) return false;
    try {
      for (const f of FONTES) {
        doc.addFileToVFS(f.arq, PDF.fontes[f.arq]);
        doc.addFont(f.arq, f.fam, f.estilo);
      }
      return true;
    } catch (e) {
      console.warn('LIMIAR PDF: falha ao registrar fontes.', e);
      return false;
    }
  }

  function formatoImagem(url) {
    const m = /^data:image\/(png|jpe?g|webp|gif);/i.exec(url || '');
    if (!m) return null;
    const f = m[1].toLowerCase();
    return f === 'jpg' || f === 'jpeg' ? 'JPEG' : f.toUpperCase();
  }

  /* ------------------------------------------------------------------ */
  /* GERAÇÃO                                                            */
  /* ------------------------------------------------------------------ */
  function gerar(c, d, opts) {
    opts = opts || {};
    if (!(window.jspdf && window.jspdf.jsPDF)) throw new Error('jsPDF não carregado');
    const branco = !!opts.branco;
    const P = Object.assign({ ficha: true, equip: true, caminhos: true, revel: true, historia: true, ref: true }, opts.partes || {});
    if (!Object.values(P).some(Boolean)) P.ficha = true;
    const T = TEMAS[opts.tema === 'claro' ? 'claro' : 'escuro'];
    const doc = new window.jspdf.jsPDF({ unit: 'mm', format: opts.papel === 'letter' ? 'letter' : 'a4', compress: true });
    const ok = registrarFontes(doc);
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 12, CW = W - 2 * M, TOPO = 24, FUNDO = H - 13;
    const cur = { y: TOPO };
    const fmt = R.fmtMod;
    const corAttr = k => T[D.ATTR[k].cor];
    const nomePerito = branco ? 'Ficha em branco' : (c.nome.trim() || 'Perito sem nome');

    doc.setProperties({
      title: `LIMIAR — ${nomePerito}`,
      subject: `Ficha de Perito · ${d.modulo.nome}`,
      creator: 'LIMIAR — Criador de Fichas'
    });

    /* ---------- tipografia ---------- */
    function disp(size, cor) {
      if (ok) { doc.setFont('VT323', 'normal'); doc.setFontSize(size); } else { doc.setFont('courier', 'bold'); doc.setFontSize(size * 0.74); }
      if (cor) doc.setTextColor(cor);
    }
    function txt(size, cor, estilo) {
      doc.setFont(ok ? 'Plex' : 'helvetica', estilo || 'normal');
      doc.setFontSize(size);
      if (cor) doc.setTextColor(cor);
    }
    function rot(s, x, y, cor) {
      txt(5.4, cor || T.dim, 'bold');
      doc.text(S(s).toUpperCase(), x, y);
    }
    /* Corta o texto (fonte atual) para caber na largura. */
    function caber(s, maxW) {
      s = S(s).replace(/\n+/g, ' ');
      if (doc.getTextWidth(s) <= maxW) return s;
      let a = 0, b = s.length;
      while (a < b) {
        const m = (a + b + 1) >> 1;
        if (doc.getTextWidth(s.slice(0, m) + '...') <= maxW) a = m; else b = m - 1;
      }
      return s.slice(0, a).trimEnd() + '...';
    }
    /* Reduz o corpo da fonte display até o texto caber. */
    function dispCaber(s, maxW, size, cor) {
      let sz = size;
      disp(sz, cor);
      while (sz > 8 && doc.getTextWidth(s) > maxW) disp(--sz);
      return sz;
    }

    /* ---------- páginas ---------- */
    let primeira = true;
    function logo(x, y, alt) {
      const g = D.LOGO.barras('LIMIAR');
      const u = alt / g.linhas;
      for (const b of g.barras) {
        doc.setFillColor(T.logo[b.row % T.logo.length]);
        doc.rect(x + b.x * u, y + b.y * u, b.w * u, u * 0.7, 'F');
      }
      return g.colunas * u;
    }
    function fundo() {
      doc.setFillColor(T.bg);
      doc.rect(0, 0, W, H, 'F');
      if (T.scan) {
        doc.setFillColor(T.scan);
        for (let yy = 0.5; yy < H; yy += 1.1) doc.rect(0, yy, W, 0.4, 'F');
      }
    }
    function cabecalho() {
      const y0 = 9;
      const lw = logo(M, y0, 7);
      disp(19, T.fg);
      doc.text('FICHA DE PERITO', M + lw + 5, y0 + 6.3);
      disp(13, c.modulo === 'passado' ? T.yel : T.cyan);
      doc.text(S(d.modulo.subtitulo), W - M, y0 + 3, { align: 'right' });
      txt(5.6, T.dim, 'bold');
      doc.text(caber(nomePerito.toUpperCase(), 70), W - M, y0 + 6.6, { align: 'right' });
      const sw = CW / T.logo.length;
      T.logo.forEach((cr, i) => { doc.setFillColor(cr); doc.rect(M + i * sw, y0 + 9.4, sw, 0.9, 'F'); });
    }
    function novaPagina() {
      if (!primeira) doc.addPage();
      primeira = false;
      fundo();
      cabecalho();
      cur.y = TOPO;
    }
    function ensure(h) {
      if (cur.y + h > FUNDO) { novaPagina(); return true; }
      return false;
    }
    function paginaNova() { if (cur.y > TOPO + 1) novaPagina(); }
    function rodapes() {
      const n = doc.getNumberOfPages();
      const hoje = new Date();
      const data = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`;
      for (let i = 1; i <= n; i++) {
        doc.setPage(i);
        doc.setDrawColor(T.linha);
        doc.setLineWidth(0.2);
        doc.line(M, H - 9.5, W - M, H - 9.5);
        txt(5.8, T.dim);
        doc.text(caber(`LIMIAR · ${nomePerito} · ${d.modulo.curto}`, CW * 0.45), M, H - 6);
        doc.text(branco ? 'FICHA EM BRANCO' : `GERADA EM ${data}`, W / 2, H - 6, { align: 'center' });
        doc.text(`PÁG. ${i}/${n}`, W - M, H - 6, { align: 'right' });
      }
    }

    /* ---------- blocos ---------- */
    function linha(x1, y, x2, cor, lw) {
      doc.setDrawColor(cor || T.linha);
      doc.setLineWidth(lw || 0.25);
      doc.line(x1, y, x2, y);
    }
    function caixa(x, y, s, marcado, cor) {
      doc.setDrawColor(cor || T.dim);
      doc.setLineWidth(0.3);
      doc.rect(x, y, s, s, 'S');
      if (marcado && !branco) {
        doc.setFillColor(cor || T.fg);
        doc.rect(x + s * 0.22, y + s * 0.22, s * 0.56, s * 0.56, 'F');
      }
    }
    function barra(x, y, w, h, frac, cor, seg) {
      seg = seg || 20;
      const g = 0.6, sw = (w - g * (seg - 1)) / seg;
      const on = branco ? 0 : Math.round(Math.max(0, Math.min(1, frac)) * seg);
      for (let i = 0; i < seg; i++) {
        const xx = x + i * (sw + g);
        if (i < on) { doc.setFillColor(cor); doc.rect(xx, y, sw, h, 'F'); }
        else { doc.setDrawColor(T.linha); doc.setLineWidth(0.2); doc.rect(xx, y, sw, h, 'S'); }
      }
    }
    /* Campo de formulário: rótulo, valor e linha para escrever à mão. */
    function campo(x, y, w, rotulo, valor, o) {
      o = o || {};
      rot(rotulo, x, y, o.corRot);
      const v = branco ? '' : S(valor);
      if (v) {
        if (o.disp) disp(o.size || 14, o.cor || T.fg); else txt(o.size || 8.4, o.cor || T.fg, o.estilo);
        doc.text(caber(v, w - 1), x, y + (o.dy || 4.6));
      }
      linha(x, y + 5.8, x + w);
    }
    function linhaCampos(defs) {
      ensure(8.8);
      let x = M;
      defs.forEach(([rotulo, frac, valor], i) => {
        const w = CW * frac - (i < defs.length - 1 ? 3 : 0);
        campo(x, cur.y + 2.4, w, rotulo, valor);
        x += CW * frac;
      });
      cur.y += 8.8;
    }
    function secao(titulo, cor, extra, minimo) {
      ensure(9 + (minimo == null ? 14 : minimo));
      const y = cur.y + 1;
      const t = S(titulo).toUpperCase();
      doc.setFillColor(cor);
      doc.rect(M, y, 1.8, 5, 'F');
      disp(16, cor);
      doc.text(t, M + 3.8, y + 4.4);
      const tw = doc.getTextWidth(t);
      let xr = W - M;
      if (extra) {
        txt(6, T.dim);
        const e = caber(extra, CW - tw - 12);
        doc.text(e, W - M, y + 4, { align: 'right' });
        xr = W - M - doc.getTextWidth(e) - 2.5;
      }
      if (xr > M + 3.8 + tw + 5) linha(M + 3.8 + tw + 2.5, y + 2.6, xr, T.linha, 0.3);
      cur.y = y + 8;
    }
    function subtitulo(t, cor, extra, minimo) {
      ensure(4.8 + (minimo == null ? 8 : minimo));
      txt(6.8, cor || T.cyan, 'bold');
      doc.text(S(t).toUpperCase(), M, cur.y + 3);
      if (extra) { txt(5.8, T.dim); doc.text(caber(extra, CW * 0.6), W - M, cur.y + 3, { align: 'right' }); }
      cur.y += 4.8;
    }
    function paragrafo(s, o) {
      o = o || {};
      const x = o.x != null ? o.x : M, w = o.w || CW, size = o.size || 7;
      const lh = size * PT * (o.lh || 1.32);
      txt(size, o.cor || T.fg, o.estilo);
      const linhas = doc.splitTextToSize(S(s), w);
      for (const ln of linhas) {
        if (ensure(lh)) txt(size, o.cor || T.fg, o.estilo);
        doc.text(ln, x, cur.y + lh * 0.78);
        cur.y += lh;
      }
      cur.y += o.depois != null ? o.depois : 1;
    }
    /* "Título  descrição" na mesma linha, título em negrito colorido. */
    function itemTexto(titulo, desc, o) {
      o = o || {};
      const x = o.x != null ? o.x : M, w = o.w || CW, size = o.size || 7;
      const lh = size * PT * 1.32;
      const ti = S(titulo), de = S(desc);
      txt(size, T.fg);
      const linhas = doc.splitTextToSize(ti + (de ? '  ' + de : ''), w);
      linhas.forEach((ln, i) => {
        ensure(lh);
        const base = cur.y + lh * 0.78;
        if (i === 0 && ln.startsWith(ti)) {
          txt(size, o.cor || T.cyan, 'bold');
          doc.text(ti, x, base);
          const tw = doc.getTextWidth(ti);
          txt(size, o.corTexto || T.fg);
          if (ln.length > ti.length) doc.text(ln.slice(ti.length), x + tw, base);
        } else {
          txt(size, o.corTexto || T.fg);
          doc.text(ln, x, base);
        }
        cur.y += lh;
      });
      cur.y += o.depois != null ? o.depois : 0.9;
    }
    function lista(itens, o) {
      o = o || {};
      const size = o.size || 6.6, lh = size * PT * 1.32, w = o.w || CW;
      for (const it of itens) {
        txt(size, T.fg);
        const linhas = doc.splitTextToSize(S(it), w - 4);
        linhas.forEach((ln, i) => {
          ensure(lh);
          const base = cur.y + lh * 0.78;
          if (i === 0) { txt(size, o.cor || T.cyan, 'bold'); doc.text('>', M, base); txt(size, T.fg); }
          doc.text(ln, M + 4, base);
          cur.y += lh;
        });
        cur.y += 0.5;
      }
      cur.y += 1;
    }
    function pautas(n, o) {
      o = o || {};
      const x = o.x != null ? o.x : M, w = o.w || CW, gap = o.gap || 6.2;
      for (let i = 0; i < n; i++) {
        ensure(gap);
        cur.y += gap;
        linha(x, cur.y, x + w, T.linha, 0.2);
      }
      cur.y += 1.8;
    }
    /* Tabela com quebra de texto por célula e cabeçalho repetido em página nova.
       cols: [{t, w, al:'l'|'c'|'r'}] (w proporcional) · linhas: [[string | {t, cor, estilo}]] */
    function tabela(cols, linhas, o) {
      o = o || {};
      const x0 = o.x != null ? o.x : M, tw = o.w || CW;
      const size = o.size || 6.6, lh = size * PT * 1.28, pad = 1.2;
      const soma = cols.reduce((s, cl) => s + cl.w, 0);
      const ws = cols.map(cl => cl.w * tw / soma);
      const xAl = (i, x) => (cols[i].al === 'c' ? x + ws[i] / 2 : cols[i].al === 'r' ? x + ws[i] - pad : x + pad);
      const al = i => (cols[i].al === 'c' ? 'center' : cols[i].al === 'r' ? 'right' : 'left');
      const corCab = o.corCab || T.cyan;
      function cabec() {
        doc.setFillColor(T.painel2);
        doc.rect(x0, cur.y, tw, 5, 'F');
        doc.setFillColor(corCab);
        doc.rect(x0, cur.y + 4.6, tw, 0.4, 'F');
        let x = x0;
        cols.forEach((cl, i) => {
          txt(5.3, corCab, 'bold');
          doc.text(caber(S(cl.t).toUpperCase(), ws[i] - pad * 2), xAl(i, x), cur.y + 3.4, { align: al(i) });
          x += ws[i];
        });
        cur.y += 5;
      }
      ensure(5 + lh + pad * 2 + (o.minimo || 0));
      cabec();
      linhas.forEach((ln, ri) => {
        const cel = ln.map((v, i) => {
          const cc = v !== null && typeof v === 'object' ? Object.assign({}, v) : { t: v };
          txt(cc.size || size, null, cc.estilo);
          const t = S(cc.t);
          cc.linhas = t ? (cols[i].corta ? [caber(t, ws[i] - pad * 2)] : doc.splitTextToSize(t, ws[i] - pad * 2)) : [];
          return cc;
        });
        const n = Math.max(1, ...cel.map(cc => cc.linhas.length));
        const h = Math.max(n * lh + pad * 2, o.altMin || 0);
        if (cur.y + h > FUNDO) { novaPagina(); cabec(); }
        if (ri % 2 === 1) { doc.setFillColor(T.painel); doc.rect(x0, cur.y, tw, h, 'F'); }
        let x = x0;
        cel.forEach((cc, i) => {
          txt(cc.size || size, cc.cor || T.fg, cc.estilo);
          cc.linhas.forEach((l, k) => doc.text(l, xAl(i, x), cur.y + pad + lh * 0.8 + k * lh, { align: al(i) }));
          x += ws[i];
        });
        cur.y += h;
        linha(x0, cur.y, x0 + tw, T.linha, 0.15);
      });
      cur.y += o.depois != null ? o.depois : 3;
    }
    /* Dois blocos lado a lado (reserva `h` antes para não quebrar página no meio). */
    function emColunas(h, esq, dir) {
      ensure(h);
      const y0 = cur.y, w = (CW - 5) / 2;
      esq(M, w);
      const ya = cur.y;
      cur.y = y0;
      dir(M + w + 5, w);
      cur.y = Math.max(ya, cur.y);
    }
    const vazias = (n, cols, pre) => Array.from({ length: n }, (_, i) => cols.map((_, k) => (pre && k === 0 ? pre(i) : '')));

    /* ---------- itens ---------- */
    const CAT = Object.fromEntries(D.CATEGORIAS_ITEM.map(x => [x.id, x]));
    const LOCAL = Object.fromEntries(D.LOCAIS.map(x => [x.id, x]));
    function danoItem(it) {
      if (it.ref === 'objeto-cenario' && it.tamanho) {
        const t = D.CATALOGO_MAP['objeto-cenario'].tamanhos.find(x => x.id === it.tamanho);
        if (t) return t.dano;
      }
      return it.dano;
    }
    function detalhes(it) {
      const p = [];
      if (it.tipo === 'cac' || it.tipo === 'dist') {
        p.push(`Dano ${danoItem(it) || '?'}${it.cega ? ' +VIGOR' : ''}`);
        if (it.tiros) p.push(it.tiros);
      }
      if (it.tipo === 'armadura') p.push(`${it.parte ? D.MEMBRO[it.parte].nome : 'parte?'} · Defesa +${it.defesa}`);
      if (it.tipo === 'escolha') p.push('à escolha');
      if (it.efeito) p.push(it.efeito);
      if (it.notas) p.push(it.notas);
      return p.join(' · ');
    }
    const nomeItem = it => it.nome + (it.qtd > 1 ? ` x${it.qtd}` : '');
    const catNome = it => (it.tipo === 'escolha' ? 'À escolha' : (CAT[it.tipo] || CAT.item).nome);

    /* ================================================================== */
    /* 1. FICHA PRINCIPAL                                                 */
    /* ================================================================== */
    function secIdentidade() {
      const y = cur.y;
      const rw = 40, rh = 50, lw = CW - rw - 6;
      // Nome
      rot('Nome do Perito', M, y + 2.2);
      if (!branco && c.nome.trim()) { dispCaber(S(c.nome), lw, 30, T.fg); doc.text(S(c.nome), M, y + 11.4); }
      linha(M, y + 13, M + lw, T.cyan, 0.4);
      const c3 = (lw - 8) / 3;
      campo(M, y + 18, c3, 'Jogador', c.jogador);
      campo(M + c3 + 4, y + 18, c3, 'Idade', c.idade);
      campo(M + 2 * (c3 + 4), y + 18, c3, 'Origem', c.origem);
      // Profissão / Classe + nível
      const oNome = d.origem ? d.origem.nome : '';
      const wNiv = 24;
      campo(M, y + 28.4, lw - wNiv - 4, d.termo, oNome, { cor: T.acu, estilo: 'bold' });
      campo(M + lw - wNiv, y + 28.4, wNiv, 'Nível', String(c.nivel), { disp: true, size: 16, cor: T.yel, dy: 5 });
      if (!branco && d.origem && d.origem.bonusTexto) { txt(5.6, T.dim); doc.text(caber(d.origem.bonusTexto, lw - wNiv - 4), M, y + 37); }
      // Conhecimento
      rot('Conhecimento', M, y + 42.2);
      barra(M + 23, y + 39.8, lw - 23 - 14, 3.2, c.conhecimento / 100, T.yel, 25);
      disp(13, T.yel);
      doc.text(branco ? '___%' : `${c.conhecimento}%`, M + lw, y + 42.6, { align: 'right' });
      txt(5, T.mute);
      doc.text('1 de dano de Sanidade = 1%  ·  100% = +1 Nível, +1 Traço e +1 ponto de atributo', M, y + 47.2);
      // Retrato
      const rx = W - M - rw;
      doc.setFillColor(T.painel);
      doc.rect(rx, y, rw, rh, 'F');
      const fmtImg = !branco && formatoImagem(opts.retrato);
      let desenhou = false;
      if (fmtImg) {
        try { doc.addImage(opts.retrato, fmtImg, rx, y, rw, rh); desenhou = true; } catch (e) { console.warn('LIMIAR PDF: retrato ignorado.', e); }
      }
      if (!desenhou) {
        txt(6, T.mute, 'bold');
        doc.text('RETRATO', rx + rw / 2, y + rh / 2 + 1, { align: 'center' });
      }
      doc.setDrawColor(T.cyan);
      doc.setLineWidth(0.5);
      doc.rect(rx, y, rw, rh, 'S');
      // cantoneiras
      doc.setLineWidth(0.9);
      [[rx, y, 1, 1], [rx + rw, y, -1, 1], [rx, y + rh, 1, -1], [rx + rw, y + rh, -1, -1]].forEach(([x, yy, sx, sy]) => {
        doc.line(x - sx * 1.2, yy - sy * 1.2, x + sx * 3, yy - sy * 1.2);
        doc.line(x - sx * 1.2, yy - sy * 1.2, x - sx * 1.2, yy + sy * 3);
      });
      cur.y = y + rh + 3;
    }

    function secAtributos() {
      secao('Atributos', T.cyan,
        branco ? '5 pontos na criação · mínimo -5 · máximo +10' : `pontos livres: criação ${d.pontos.criacao} · nível ${d.pontos.nivel}`, 38);
      const g = 3, bw = (CW - 4 * g) / 5, bh = 38;
      R.ATTR_KEYS.forEach((k, i) => {
        const a = d.attr[k], A = D.ATTR[k], cr = corAttr(k);
        const x = M + i * (bw + g), y = cur.y;
        doc.setFillColor(T.painel);
        doc.rect(x, y, bw, bh, 'F');
        doc.setFillColor(cr);
        doc.rect(x, y, bw, 6.4, 'F');
        dispCaber(A.nome, bw - 3, 15, T.sobre);
        doc.text(A.nome, x + bw / 2, y + 5, { align: 'center' });
        doc.setDrawColor(cr);
        doc.setLineWidth(0.5);
        doc.rect(x, y, bw, bh, 'S');
        if (branco) {
          doc.setDrawColor(T.linha);
          doc.setLineWidth(0.3);
          doc.rect(x + bw / 2 - 8, y + 9, 16, 11, 'S');
        } else {
          disp(36, cr);
          doc.text(fmt(a.valor), x + bw / 2, y + 19.5, { align: 'center' });
        }
        txt(5.2, T.dim);
        doc.text(branco ? 'CRI ___ NÍV ___ PROF ___' : `CRI ${fmt(a.base)}  NÍV ${fmt(a.niv)}  PROF ${fmt(a.prof)}`, x + bw / 2, y + 24.6, { align: 'center' });
        linha(x + 2, y + 26.3, x + bw - 2, T.linha, 0.2);
        if (k === 'PSI') {
          ['INT', 'SAP'].forEach((s, j) => {
            const sub = d.sub[s], yy = y + 29.8 + j * 4;
            caixa(x + 2, yy - 2.3, 2.6, sub.principal, cr);
            txt(6, sub.principal && !branco ? cr : T.fg, 'bold');
            doc.text(D.SUBATRIBUTOS[s].nome, x + 5.6, yy);
            doc.text(branco ? '___' : fmt(sub.valor), x + bw - 2, yy, { align: 'right' });
          });
          txt(4.6, T.mute);
          doc.text('marque o principal · outro -3', x + bw / 2, y + 36.4, { align: 'center' });
        } else {
          txt(6, T.fg, 'bold');
          doc.text('TESTE', x + 2, y + 29.8);
          doc.text(branco ? '1d20 + ___' : `1d20 ${fmt(d.modTeste(k))}`, x + bw - 2, y + 29.8, { align: 'right' });
          const notas = branco ? [] : a.notas.concat(d.penLista(k).map(p => `${p.fonte} ${p.v}`));
          txt(4.8, notas.length ? T.raz : T.mute, notas.length ? 'bold' : 'normal');
          const t = notas.length ? notas.join(' · ') : D.CAMINHO[A.caminho].nome;
          const ls = doc.splitTextToSize(S(t), bw - 4).slice(0, 2);
          ls.forEach((l, n) => doc.text(l, x + bw / 2, y + 33.4 + n * 2.2, { align: 'center' }));
        }
      });
      cur.y += bh + 3;
    }

    function secRecursos() {
      const san = d.sanidade, fol = d.folego, def = d.defesa;
      const dinheiro = c.dinheiro == null ? c.rolagens.dinheiro : c.dinheiro;
      const o = d.origem;
      const semDinheiro = o && (!o.dinheiro || o.dinheiro === '0');
      const recs = [
        { t: 'Sanidade', cr: T.raz, v: san.atual, max: san.max, sub: san.rolagem != null ? `1d6 rolado: ${san.rolagem}` : 'RAZÃO + 1d6 (mín. 2)' },
        { t: 'Fôlego', cr: T.vig, v: fol.atual, max: fol.max, sub: `1 PF = ${d.mov.corrida}m correndo` },
        { t: 'Defesa', cr: T.cyan, v: def.base, suf: '%', ph: '___%', sub: def.rolagem != null ? `2d4 (${def.rolagem}) x VIG ${fmt(def.vigCriacao)}` : '2d4 x VIGOR de criação' },
        { t: 'Iniciativa', cr: T.acu, v: fmt(d.iniciativa.mod), pre: '1d20', ph: '1d20+___', sub: d.iniciativa.reflexos ? 'ACU + Reflexos Afiados' : 'teste de ACUIDADE' },
        { t: 'Traços', cr: T.yel, v: d.tracos.disponiveis, max: d.tracos.total, sub: 'livres / total' },
        { t: 'Revelação', cr: T.vio, v: d.revelacao, suf: '%', ph: '___%', sub: d.revelacaoSonho ? '+5% ao sonhar' : '25% + 5% por Nó' },
        { t: 'Dinheiro', cr: T.acu, v: dinheiro == null && semDinheiro ? 0 : dinheiro, pre: '$', ph: '$____', sub: o ? `inicial ${o.dinheiro || '0'}` : 'inicial da ' + d.termo.toLowerCase() }
      ];
      const g = 2.5, bw = (CW - 6 * g) / 7, bh = 19;
      ensure(bh + 2);
      recs.forEach((r, i) => {
        const x = M + i * (bw + g), y = cur.y;
        doc.setFillColor(T.painel);
        doc.rect(x, y, bw, bh, 'F');
        doc.setFillColor(r.cr);
        doc.rect(x, y, bw, 0.9, 'F');
        doc.setDrawColor(T.linha);
        doc.setLineWidth(0.25);
        doc.rect(x, y, bw, bh, 'S');
        txt(5.2, r.cr, 'bold');
        doc.text(S(r.t).toUpperCase(), x + bw / 2, y + 4, { align: 'center' });
        let v = '';
        if (!branco && r.v != null && r.v !== '') v = (r.pre && r.pre !== '1d20' ? r.pre : '') + r.v + (r.max != null ? '/' + r.max : '') + (r.suf || '');
        if (!branco && r.pre === '1d20') v = '1d20' + r.v;
        if (v) { dispCaber(v, bw - 2, 22, T.fg); doc.text(v, x + bw / 2, y + 12.4, { align: 'center' }); }
        else if (r.max !== undefined) { disp(18, T.mute); doc.text('/', x + bw / 2, y + 12.2, { align: 'center' }); }
        else if (r.ph) { dispCaber(r.ph, bw - 2, 18, T.mute); doc.text(r.ph, x + bw / 2, y + 12.2, { align: 'center' }); }
        txt(4.5, T.dim);
        doc.text(caber(r.sub, bw - 1.6), x + bw / 2, y + 16.8, { align: 'center' });
      });
      cur.y += bh + 2;
    }

    /* Silhueta humana (estilo V.A.T.S.): polígonos em unidades 0..40 x 0..100, vista de frente
       (o lado direito do Perito fica à esquerda da figura). */
    const espelho = pts => pts.map(([x, y]) => [40 - x, y]).reverse();
    const elipse = (cx, cy, rx, ry, n) => Array.from({ length: n }, (_, i) => [cx + rx * Math.cos(2 * Math.PI * i / n), cy + ry * Math.sin(2 * Math.PI * i / n)]);
    const BRACO_D = [[9.6, 20.4], [7.4, 21.8], [6.1, 26], [5.6, 31], [4.7, 40], [3.4, 48], [2.2, 53], [1.8, 56.5], [3.2, 59], [5, 58.5], [5.8, 55], [6.4, 51.5], [8, 43.5], [9.4, 36], [10.6, 30.5]];
    const PERNA_D = [[12.6, 52], [19.6, 54.6], [19.3, 61], [18.8, 70], [18.4, 78], [18.2, 86], [18.5, 94], [19.4, 97.4], [14.3, 98.4], [14.1, 95.5], [14.4, 86], [13.6, 76], [12.8, 66], [12.2, 58]];
    const SILHUETA = {
      cabeca: elipse(20, 7.4, 4.7, 6.2, 22),
      tronco: [[18.2, 13.2], [21.8, 13.2], [22.4, 16.6], [26.8, 17.8], [30.4, 20.4], [29.4, 30.5], [27.8, 38.5], [27.2, 44], [27.8, 48.5], [27.4, 52], [20, 54.6], [12.6, 52], [12.2, 48.5], [12.8, 44], [12.2, 38.5], [10.6, 30.5], [9.6, 20.4], [13.2, 17.8], [17.6, 16.6]],
      bracoE: BRACO_D, // visto de costas: o lado esquerdo do Perito fica à esquerda da figura
      bracoD: espelho(BRACO_D),
      pernaE: PERNA_D,
      pernaD: espelho(PERNA_D)
    };
    /* Desenha um polígono com contorno e malha (linhas de varredura horizontais e verticais). */
    function malha(pts, cor, passo) {
      const ys = pts.map(p => p[1]), xs = pts.map(p => p[0]);
      const cortes = (eixo, v) => {
        const out = [];
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i], b = pts[(i + 1) % pts.length];
          const [a1, a2, b1, b2] = eixo === 'y' ? [a[1], a[0], b[1], b[0]] : [a[0], a[1], b[0], b[1]];
          if ((a1 <= v && b1 > v) || (b1 <= v && a1 > v)) out.push(a2 + (v - a1) / (b1 - a1) * (b2 - a2));
        }
        return out.sort((m, n) => m - n);
      };
      doc.setDrawColor(cor);
      doc.setLineWidth(0.12);
      for (let y = Math.min(...ys) + passo / 2; y < Math.max(...ys); y += passo) {
        const c = cortes('y', y);
        for (let i = 0; i + 1 < c.length; i += 2) doc.line(c[i], y, c[i + 1], y);
      }
      for (let x = Math.min(...xs) + passo / 2; x < Math.max(...xs); x += passo * 1.6) {
        const c = cortes('x', x);
        for (let i = 0; i + 1 < c.length; i += 2) doc.line(x, c[i], x, c[i + 1]);
      }
      doc.setLineWidth(0.45);
      doc.lines(pts.slice(1).map((p, i) => [p[0] - pts[i][0], p[1] - pts[i][1]]), pts[0][0], pts[0][1], [1, 1], 'S', true);
    }
    function corDoMembro(dm) {
      if (branco) return T.dim;
      if (dm.perdido) return T.mute;
      const frac = dm.max > 0 ? dm.atual / dm.max : 0;
      return dm.atual <= 0 ? T.vig : frac > 0.6 ? T.acu : frac > 0.3 ? T.raz : T.vig;
    }
    /* Versão compacta: silhueta em wireframe com uma caixinha de vida sobre cada membro. */
    const CAIXA_MEMBRO = { cabeca: [20, 7.6], tronco: [20, 32], bracoE: [3.2, 42], bracoD: [36.8, 42], pernaE: [12.4, 80], pernaD: [27.6, 80] };
    function bonecoVats(x0, y0, w, h) {
      doc.setFillColor(T.painel);
      doc.rect(x0, y0, w, h, 'F');
      doc.setDrawColor(T.acu);
      doc.setLineWidth(0.35);
      doc.rect(x0, y0, w, h, 'S');
      const esc = (h - 4) / 100, fw = 40 * esc;
      const fx = x0 + w / 2 - fw / 2, fy = y0 + 2;
      const P = ([x, y]) => [fx + x * esc, fy + y * esc];
      for (const m of D.MEMBROS) malha(SILHUETA[m.id].map(P), corDoMembro(d.membros[m.id]), 1.1);
      const bw = 7.8, bh = 5.6;
      for (const m of D.MEMBROS) {
        const dm = d.membros[m.id], cr = corDoMembro(dm);
        const [cx, cy] = P(CAIXA_MEMBRO[m.id]);
        const bx = Math.max(x0 + 0.8, Math.min(x0 + w - 0.8 - bw, cx - bw / 2)), by = cy - bh / 2;
        doc.setFillColor(branco ? T.bg : cr);
        doc.rect(bx, by, bw, bh, 'F');
        doc.setDrawColor(cr);
        doc.setLineWidth(0.35);
        doc.rect(bx, by, bw, bh, 'S');
        txt(3.6, branco ? T.dim : T.sobre, 'bold');
        doc.text(m.curto, bx + 0.7, by + 1.6);
        if (!branco) {
          dispCaber(String(dm.atual), bw - 1.5, 12, T.sobre);
          doc.text(String(dm.atual), bx + bw / 2, by + bh - 0.9, { align: 'center' });
          if (dm.perdido) {
            doc.setDrawColor(T.vig);
            doc.setLineWidth(0.4);
            doc.line(bx, by, bx + bw, by + bh);
            doc.line(bx + bw, by, bx, by + bh);
          }
        }
      }
    }
    function secCorpo() {
      const couro = d.has('couro-endurecido');
      secao('Corpo', T.vig, `Vida por membro = VIGOR + base${couro ? ' + 3 (Couro Endurecido)' : ''}`, 64);
      const y0 = cur.y;
      bonecoVats(M, y0, 50, 61);
      // tabela
      const tx = M + 54, tw = CW - 54;
      cur.y = y0;
      const linhas = D.MEMBROS.map(m => {
        const dm = d.membros[m.id];
        if (branco) return [m.nome, m.formula.replace('VIGOR', 'VIG'), { t: '     /', cor: T.mute }, '', '', ''];
        return [
          { t: m.nome + (dm.perdido ? ' (perdido)' : ''), cor: dm.perdido ? T.vig : T.fg, estilo: 'bold' },
          m.formula.replace('VIGOR', 'VIG'),
          { t: `${dm.atual} / ${dm.max}`, cor: dm.atual <= 0 ? T.vig : T.fg, estilo: 'bold' },
          dm.armadura ? dm.armadura.nome : '-',
          String(dm.rd),
          dm.defesa == null ? '-' : dm.defesa + '%'
        ];
      });
      cur.y = y0;
      tabela([{ t: 'Membro', w: 30 }, { t: 'Base', w: 17 }, { t: 'Vida', w: 18, al: 'c' }, { t: 'Armadura', w: 34 }, { t: 'RD', w: 8, al: 'c' }, { t: 'Def.', w: 11, al: 'c' }],
        linhas, { x: tx, w: tw, corCab: T.vig, altMin: 5.6, depois: 1.5 });
      const nota = (s, cr, est) => paragrafo(s, { x: tx, w: tw, size: 6, cor: cr || T.dim, estilo: est, depois: 0.5 });
      const def = d.defesa;
      nota(def.rolagem != null && !branco
        ? `DEFESA: 2d4 (${def.rolagem}) x VIGOR de criação (${fmt(def.vigCriacao)}) = ${Math.max(0, def.bruto)}%${c.ajustes.defesa ? ` ${fmt(R.int(c.ajustes.defesa))} de ajuste` : ''}. Armadura soma a Defesa da parte atingida.`
        : 'DEFESA = 2d4 x VIGOR de criação (mínimo 0). Armadura soma a Defesa da parte atingida.');
      nota('Teste de Defesa: 1d100 <= Defesa -> recebe metade do dano; crítico -> ¼ do dano. RD da armadura reduz o dano só na própria parte.');
      nota(`Desarmado: ${!branco && c.desarmado ? c.desarmado : '____'} + VIGOR de dano (armas cegas também somam VIGOR).`);
      if (!branco && d.morte) nota(`MORTE: ${d.morte}.`, T.vig, 'bold');
      else nota('Morte: cabeça arrancada ou Vida do tronco zerada.');
      cur.y = Math.max(cur.y, y0 + 61) + 2;
    }

    function secMente() {
      secao('Mente', T.psi, branco ? '' : (d.sanidade.atual == null ? 'Sanidade não rolada' : `Sanidade ${d.sanidade.atual}${d.sanidade.max != null ? ' de ' + d.sanidade.max : ''}`), 34);
      const s = d.sanidade;
      paragrafo(branco || s.rolagem == null
        ? 'Sanidade total = RAZÃO de criação + 1d6 (mínimo 2). Em 0: teste de RAZÃO na Corda da Loucura; se falhar, fica Insano (2x dano de Sanidade).'
        : 'Sanidade: ' + s.det.join(' · ') + '.', { size: 6.2, cor: T.dim });
      if (!branco) {
        if (s.faixa) paragrafo(`SANIDADE ${s.atual}: ${s.faixa.efeito}.`, { size: 6.8, cor: T.vig, estilo: 'bold' });
        if (s.riscoDisturbio) paragrafo('Sanidade entre -5 e 1: após 3 dias de jogo assim, risco de desenvolver distúrbios mentais.', { size: 6.2, cor: T.raz });
        const pens = d.pen.ALL.map(p => `${p.fonte} ${p.v} (todos os testes)`)
          .concat(R.ATTR_KEYS.flatMap(k => d.pen[k].map(p => `${p.fonte} ${p.v} (${D.ATTR[k].nome})`)))
          .concat(d.notasPen);
        if (pens.length) paragrafo('Penalidades: ' + pens.join(' · ') + '.', { size: 6.2, cor: T.raz });
      }
      // Status
      const ativos = new Set(d.statusAtivos.map(x => x.id));
      const cols = 4, cw = CW / cols, rh = 5;
      const nl = Math.ceil(D.STATUS.length / cols);
      subtitulo('Status', T.psi, '* indicador automático dos distúrbios', nl * rh + 1);
      D.STATUS.forEach((st, i) => {
        const x = M + (i % cols) * cw, y = cur.y + Math.floor(i / cols) * rh;
        const cr = T[st.cor] || T.dim;
        caixa(x, y + 0.8, 2.8, ativos.has(st.id), cr);
        let nome = st.nome + (st.auto ? ' *' : '');
        if (!branco && st.id === 'infeccao' && c.status.infeccao && c.status.infeccaoMembro && D.MEMBRO[c.status.infeccaoMembro]) nome += ` (${D.MEMBRO[c.status.infeccaoMembro].curto})`;
        if (!branco && st.id === 'amaldicoado' && c.status.amaldicoado) nome += ` (${c.status.amaldicoadoTurnos}/3 t)`;
        txt(6.2, ativos.has(st.id) && !branco ? cr : T.fg, ativos.has(st.id) && !branco ? 'bold' : 'normal');
        doc.text(caber(nome, cw - 6), x + 4.2, y + 3.1);
        if (st.id === 'atordoado') {
          const tw = doc.getTextWidth(S(nome));
          for (let k = 0; k < 3; k++) caixa(x + 4.2 + tw + 1.5 + k * 2.6, y + 1.2, 2, k < c.status.atordoado, cr);
        }
      });
      cur.y += nl * rh + 2;
      // Distúrbios
      const di = c.disturbios;
      const fams = [
        { id: 'depressao', ops: D.DISTURBIOS.depressao.graus, marc: o => di.depressao === o.id },
        { id: 'esquizofrenia', ops: D.DISTURBIOS.esquizofrenia.tipos, marc: o => !!di.esquizofrenia[o.id] },
        { id: 'ansiedade', ops: D.DISTURBIOS.ansiedade.graus, marc: o => di.ansiedade === o.id }
      ];
      subtitulo('Distúrbios', T.psi, 'tratamento: medicação + terapia', fams.length * 5.4 + 10);
      fams.forEach((f, i) => {
        const fam = D.DISTURBIOS[f.id], y = cur.y + i * 5.4;
        txt(6.2, T.psi, 'bold');
        doc.text(fam.nome, M, y + 3.1);
        f.ops.forEach((op, j) => {
          const x = M + 27 + j * 26;
          caixa(x, y + 0.8, 2.8, f.marc(op), T.psi);
          txt(6.2, T.fg);
          doc.text(op.nome, x + 4, y + 3.1);
        });
        const xm = M + 27 + 3 * 26;
        caixa(xm, y + 0.8, 2.8, !!di.medicado[f.id], T.acu);
        txt(6.2, T.fg);
        doc.text('Medicado', xm + 4, y + 3.1);
        txt(5, T.mute);
        doc.text(caber(fam.tratamento, M + CW - (xm + 24)), xm + 24, y + 3.1);
      });
      cur.y += fams.length * 5.4 + 1;
      campo(M, cur.y + 2.4, CW, 'Outros distúrbios / observações', di.outros);
      cur.y += 9;
      if (!branco) d.disturbios.forEach(x => itemTexto(x.nome + ':', x.desc, { cor: T.psi, size: 6.3 }));
      cur.y += 1;
    }

    function secProgressao() {
      secao('Progressão', T.yel, branco ? '' : `Nível ${c.nivel} · Conhecimento ${c.conhecimento}% · Traços ${d.tracos.usados}/${d.tracos.total}`, 20);
      paragrafo(`Por nível: +1d4 de Vida (em todos os membros) e +${d.dadoSanNivel} de Sanidade. "+ Máximo" soma ao máximo; "Recupera" só cura. Cada nível também dá +1 ponto de atributo e 1 Traço de Revelação.`, { size: 6.2, cor: T.dim });
      const cresc = d.has('crescimento-anomalo'), clar = d.has('clareza-crescente'), epi = d.has('epifania');
      const modo = m => (m === 'cura' ? 'Recupera' : '+ Máximo');
      const somar = (a, b) => (a == null ? '' : String(a) + (b != null && (cresc || clar) ? ' + ' + b : ''));
      const cols = [{ t: 'Nível', w: 10, al: 'c' }, { t: 'Vida' + (cresc ? ' (+extra)' : ''), w: 18, al: 'c' }, { t: 'Modo', w: 16, al: 'c' },
        { t: 'Sanidade' + (clar ? ' (+extra)' : ''), w: 18, al: 'c' }, { t: 'Modo', w: 16, al: 'c' }, { t: epi ? 'Epifania' : 'Anotações', w: 50 }];
      let linhas;
      if (branco) linhas = vazias(8, cols, i => String(i + 1));
      else if (!c.niveis.length) linhas = [[{ t: '-', cor: T.mute }, '', '', '', '', { t: 'Nenhum nível ganho ainda.', cor: T.mute }]];
      else linhas = c.niveis.map(h => [
        { t: String(h.nivel), cor: T.yel, estilo: 'bold' },
        cresc ? somar(h.vida, h.vidaExtra) : (h.vida == null ? '' : String(h.vida)),
        modo(h.vidaModo),
        clar ? somar(h.san, h.sanExtra) : (h.san == null ? '' : String(h.san)),
        modo(h.sanModo),
        h.epifania || ''
      ]);
      tabela(cols, linhas, { corCab: T.yel, altMin: branco ? 6.4 : 0 });
    }

    /* ================================================================== */
    /* 2. EQUIPAMENTO E HABILIDADES                                       */
    /* ================================================================== */
    function secEquipamento() {
      const inv = d.inv, pl = inv.porLocal, ct = inv.contagem, Lm = D.LIMITES_BAGAGEM;
      secao('Equipamento', T.raz, branco ? 'pertences · bagagem · patrimônio' : `mãos ${ct.maos}/2 · acesso rápido ${ct.rapido}/2 · acessórios ${ct.acessorios}/3`, 30);
      // Pertences
      const slots = (id, rotulo, n) => {
        const itens = branco ? [] : pl[id];
        const q = Math.max(n, itens.length);
        return Array.from({ length: q }, (_, i) => {
          const it = itens[i];
          return [{ t: rotulo + (q > 1 ? ' ' + (i + 1) : ''), cor: T.dim }, it ? { t: nomeItem(it), estilo: 'bold' } : '', it ? detalhes(it) : ''];
        });
      };
      subtitulo('Pertences', T.raz, 'trocar um item equipado gasta 1 turno');
      tabela([{ t: 'Local', w: 30 }, { t: 'Item', w: 44 }, { t: 'Detalhes', w: 90 }],
        [].concat(slots('maoE', 'Mão esquerda', 1), slots('maoD', 'Mão direita', 1), slots('rapido', 'Fácil acesso', 2), slots('acessorio', 'Acessório', 3)),
        { corCab: T.raz, altMin: 6 });
      // Armas
      const vig = d.attr.VIG.efetivo;
      const armas = branco ? [] : c.itens.filter(i => R.ehArma(i));
      const linhasArmas = armas.map(it => {
        const dano = danoItem(it);
        return [
          { t: nomeItem(it), estilo: 'bold' },
          it.tipo === 'dist' ? (it.fogo ? 'Fogo' : 'Distância') : (it.tipo === 'cac' ? 'Corpo-a-corpo' : 'À escolha'),
          { t: (dano || '?') + (it.cega ? ` + VIG (${fmt(vig)})` : ''), cor: T.vig, estilo: 'bold' },
          it.tiros || '-',
          (LOCAL[it.local] || LOCAL.bagagem).nome
        ];
      });
      if (branco) linhasArmas.push(...vazias(4, [1, 2, 3, 4, 5]));
      linhasArmas.push([{ t: 'Desarmado', estilo: 'bold' }, 'Corpo-a-corpo', { t: `${!branco && c.desarmado ? c.desarmado : '___'} + VIG${branco ? '' : ` (${fmt(vig)})`}`, cor: T.vig, estilo: 'bold' }, '-', '-']);
      subtitulo('Armas', T.raz, branco ? 'armas cegas somam VIGOR ao dano' : `na bagagem: ${ct.bagArmas}/${Lm.armas}`);
      tabela([{ t: 'Arma', w: 44 }, { t: 'Tipo', w: 22 }, { t: 'Dano', w: 30 }, { t: 'Tiros por turno', w: 40 }, { t: 'Onde', w: 28 }], linhasArmas, { corCab: T.raz, altMin: branco ? 6 : 0 });
      // Bagagem
      const bag = branco ? [] : pl.bagagem;
      const linhasBag = bag.map(it => [{ t: String(it.qtd), cor: T.yel }, { t: it.nome, estilo: 'bold' }, catNome(it), detalhes(it)]);
      if (!linhasBag.length) linhasBag.push(...vazias(branco ? 12 : 3, [1, 2, 3, 4]));
      subtitulo('Bagagem', T.raz, branco ? `limites: ${Lm.armas} armas · ${Lm.armaduraPorParte} armaduras por parte · ${Lm.consumiveis} consumíveis` : `armas ${ct.bagArmas}/${Lm.armas} · consumíveis ${ct.bagCons}/${Lm.consumiveis}`);
      tabela([{ t: 'Qtd', w: 8, al: 'c' }, { t: 'Item', w: 44 }, { t: 'Categoria', w: 30 }, { t: 'Detalhes', w: 82 }], linhasBag, { corCab: T.raz, altMin: 6 });
      // Patrimônio
      const pat = branco ? [] : pl.patrimonio;
      const linhasPat = pat.map(it => [{ t: nomeItem(it), estilo: 'bold' }, detalhes(it)]);
      if (!linhasPat.length) linhasPat.push(...vazias(branco ? 4 : 2, [1, 2]));
      subtitulo('Patrimônio', T.raz, 'o que o Perito tem, mas não carrega');
      tabela([{ t: 'Item', w: 50 }, { t: 'Detalhes', w: 114 }], linhasPat, { corCab: T.raz, altMin: 6 });
      if (!branco && inv.avisos.length) inv.avisos.forEach(a => paragrafo('! ' + a, { size: 6.2, cor: T.raz, depois: 0.3 }));
    }

    function secHabilidades() {
      secao(`${d.termo} e habilidades`, T.acu, branco ? '' : (d.origem ? d.origem.nome : ''), 20);
      if (branco) {
        linhaCampos([[d.termo, 0.45, ''], ['Bônus', 0.55, '']]);
        rot('Habilidades, vantagens e bônus situacionais', M, cur.y + 3);
        cur.y += 3;
        pautas(7);
        return;
      }
      const o = d.origem;
      if (!o) {
        paragrafo(d.origemEscolhida ? `Sem ${d.termo.toLowerCase()}: nenhum bônus, equipamento ou dinheiro inicial.` : `${d.termo} ainda não escolhida.`, { cor: T.dim });
        return;
      }
      itemTexto(o.nome, o.bonusTexto, { cor: T.acu, size: 7.4 });
      if (o.desc) paragrafo(o.desc, { size: 6.4, cor: T.dim, estilo: 'italic' });
      const equipTexto = o.equipTexto || (o.equip || []).map(e => (e.qtd > 1 ? e.qtd + 'x ' : '') + e.nome).join(', ') || 'nenhum';
      paragrafo(`Equipamento inicial: ${equipTexto} · Dinheiro inicial: ${o.dinheiro || '0'}${c.rolagens.dinheiro != null ? ` (rolado: ${c.rolagens.dinheiro})` : ''}.`, { size: 6.4, cor: T.dim });
      d.habilidades.forEach(h => itemTexto(`${h.nome} (${h.tipo}):`, h.desc, { cor: T.yel }));
      if (d.vantagemOrigem.length) itemTexto('Vantagem:', 'em testes de ' + d.vantagemOrigem.map(k => D.ATTR[k].nome).join(' e ') + '.', { cor: T.acu });
      (o.situacional || []).forEach(s => itemTexto('Bônus situacional:', s.txt + '.', { cor: T.acu }));
      if (d.terapia.conduz) itemTexto('Terapia:', `restaura ${d.terapia.dado} de Sanidade por Perito, ao fim da sessão de jogo (uma por sessão).`, { cor: T.acu });
    }

    /* ================================================================== */
    /* 3. CAMINHOS                                                        */
    /* ================================================================== */
    function secCaminhos() {
      secao('Os 5 Caminhos do Indizível', T.vio, branco ? 'marque os Nós adquiridos' : `Traços: ${d.tracos.usados} de ${d.tracos.total} usados · ${d.tracos.disponiveis} livre(s)`, 50);
      paragrafo('Cada Traço de Revelação compra 1 Nó, com efeito imediato. Na mesma Trilha a ordem é obrigatória. Cada Nó exige um Nível mínimo (NV); os Nós 5-6 exigem 3+ no atributo do Caminho e os Nós 7-8 exigem 5+.', { size: 6, cor: T.dim });
      const nomeW = 34, cw = (CW - nomeW) / 8, rh = 8.4;
      for (const cam of D.CAMINHOS) {
        const cc = T[cam.cor];
        ensure(6.4 + 4 * rh + 2);
        doc.setFillColor(cc);
        doc.rect(M, cur.y, CW, 5.4, 'F');
        disp(13, T.sobre);
        doc.text(S(`${cam.num}. ${cam.nome.toUpperCase()}`), M + 2, cur.y + 4.1);
        const qtd = cam.trilhas.reduce((s, t) => s + t.nos.filter(n => d.nos.has(n.id)).length, 0);
        txt(5.8, T.sobre, 'bold');
        doc.text(S(`${D.ATTR[cam.attr].nome}${branco ? ' ____' : ' ' + fmt(d.attr[cam.attr].valor)}${branco ? '' : ` · ${qtd}/32 Nós`}`), W - M - 2, cur.y + 3.8, { align: 'right' });
        cur.y += 6.2;
        for (const tr of cam.trilhas) {
          const y = cur.y;
          txt(6, cc, 'bold');
          doc.splitTextToSize(S(tr.nome), nomeW - 2).slice(0, 2).forEach((l, k, arr) => doc.text(l, M + 0.5, y + rh / 2 + 0.9 - (arr.length - 1) * 1.2 + k * 2.4));
          tr.nos.forEach((no, i) => {
            const x = M + nomeW + i * cw, tem = !branco && d.nos.has(no.id);
            doc.setFillColor(tem ? cc : T.painel);
            doc.rect(x + 0.4, y + 0.4, cw - 0.8, rh - 0.8, 'F');
            doc.setDrawColor(tem ? cc : T.linha);
            doc.setLineWidth(0.25);
            doc.rect(x + 0.4, y + 0.4, cw - 0.8, rh - 0.8, 'S');
            caixa(x + cw - 3.3, y + 1.1, 2, tem, tem ? T.sobre : cc);
            const req = D.REQ_ATRIBUTO_NO[i];
            txt(4.1, tem ? T.sobre : T.mute, 'bold');
            doc.text(`${i + 1} · NV${D.NIVEIS_NO[i]}${req ? ' · ' + req + '+' : ''}`, x + 1.3, y + 2.6);
            txt(4.6, tem ? T.sobre : T.fg, tem ? 'bold' : 'normal');
            doc.splitTextToSize(S(no.nome), cw - 2.2).slice(0, 2).forEach((l, k) => doc.text(l, x + 1.3, y + 4.9 + k * 1.9));
          });
          cur.y += rh;
        }
        cur.y += 2;
      }
      if (branco) return;
      secao('Nós adquiridos', T.vio, d.nos.size ? `${d.nos.size} Nó(s)` : '', 12);
      if (!d.nos.size) paragrafo('Nenhum Nó adquirido ainda.', { cor: T.dim });
      for (const cam of D.CAMINHOS) {
        const donos = [];
        cam.trilhas.forEach(tr => tr.nos.forEach((no, idx) => { if (d.nos.has(no.id)) donos.push({ no, tr, idx }); }));
        if (!donos.length) continue;
        subtitulo(cam.nome, T[cam.cor], D.ATTR[cam.attr].nome);
        donos.forEach(({ no, tr, idx }) => itemTexto(`${no.nome} (${tr.nome.replace(/^Trilha /, '')} · Nó ${idx + 1}):`, no.desc, { cor: T[cam.cor], size: 6.6 }));
        cur.y += 1;
      }
      d.nosInvalidos.forEach(n => paragrafo(`! ${n.nome}: ${n.motivos.join(', ')}.`, { size: 6.2, cor: T.vig, depois: 0.3 }));
    }

    /* ================================================================== */
    /* 4. REVELAÇÕES                                                      */
    /* ================================================================== */
    const TIPO_PAL = { verbal: 'Verbal', poder: 'Poder', impulso: 'Impulso' };
    const GATILHO = { palavras: 'Palavras', mantra: 'Mantra (isenta de repertório)', livro: 'Livro (isenta de repertório)', objeto: 'Objeto/relíquia', outro: 'Outro' };
    function tituloBloco(nome, info, cr) {
      ensure(12);
      linha(M, cur.y, W - M, cr, 0.3);
      txt(7.4, cr, 'bold');
      doc.text(caber(nome, CW * 0.5), M, cur.y + 3.8);
      txt(5.8, T.dim);
      doc.text(caber(info, CW * 0.48), W - M, cur.y + 3.8, { align: 'right' });
      cur.y += 5.4;
    }
    function secRevelacoes() {
      const mg = d.magia;
      secao('Revelações', T.eso, branco ? 'magias e rituais revelados pelo Espectador' : `Iluminação ${d.revelacao}%${d.revelacaoSonho ? ' · sonho 5%' : ''}`, 30);
      paragrafo(`Ao receber uma Iluminação: ${branco ? '25% + 5% por Nó (máx. 65%)' : d.revelacao + '% (25% + 5% por Nó, máx. 65%)'} de aprender uma Magia ou Ritual. Ao dormir com Conhecimento acima de 75%: 5%. Magias e rituais custam Sanidade e não contam para o Conhecimento.`, { size: 6.2, cor: T.dim });
      // Palavras
      subtitulo('Palavras de conjuração', T.eso, branco ? 'conjuntos: ____ · a mesma quantidade de cada tipo' : `${mg.conjuntos} conjunto(s) · Verbais ${mg.nV} · Poder ${mg.nP} · Impulso ${mg.nI}${mg.desequilibrado && c.palavras.length ? ' · DESEQUILIBRADO' : ''}`, 40);
      const qtd = (tipo, cl) => (branco ? '' : String(c.palavras.filter(p => p.tipo === tipo && Number(p.classe) === cl).length));
      const tot = tipo => (branco ? '' : String(c.palavras.filter(p => p.tipo === tipo).length));
      const cols = [{ t: 'Classe', w: 20 }].concat(Object.entries(TIPO_PAL).map(([, nome]) => ({ t: nome, w: 30, al: 'c' })));
      const linhas = [1, 2, 3, 4, 5].map(cl => [{ t: 'Classe ' + cl, cor: T.dim }].concat(Object.keys(TIPO_PAL).map(tp => ({ t: qtd(tp, cl), cor: T.eso, estilo: 'bold' }))));
      linhas.push([{ t: 'Total', estilo: 'bold' }].concat(Object.keys(TIPO_PAL).map(tp => ({ t: tot(tp), estilo: 'bold' }))));
      tabela(cols, linhas, { corCab: T.eso, altMin: 5.6 });
      // Magias
      subtitulo('Magias', T.eso, `custo = classe da palavra mais cara x conjuntos · +${mg.bonusDado} por conjunto extra`);
      const magias = branco ? [] : c.magias;
      if (!magias.length) {
        for (let i = 0; i < (branco ? 3 : 1); i++) {
          linhaCampos([['Magia', 0.46, ''], ['Classe', 0.14, ''], ['Conjuntos', 0.16, ''], ['Custo (San)', 0.24, '']]);
          linhaCampos([['Gatilho', 0.3, ''], ['Duração', 0.7, '']]);
          linhaCampos([['Efeito', 1, '']]);
          cur.y += 2;
        }
      }
      magias.forEach(m => {
        const cm = R.custoMagia(m, d);
        tituloBloco(m.nome || 'Magia sem nome', `Classe ${cm.porConjunto + (cm.barganha ? 1 : 0)} · ${cm.conjuntos} conjunto(s) · custo ${cm.total} de Sanidade${cm.barganha ? ' (Barganha)' : ''} · ${cm.turnos} turno(s)`, T.eso);
        [['Gatilho:', GATILHO[m.gatilho] || m.gatilho],
          ['Efeito:', m.efeito], ['Duração:', m.duracao], ['Notas:', m.notas]]
          .filter(([, v]) => String(v || '').trim())
          .forEach(([k, v]) => itemTexto(k, v, { cor: T.dim, size: 6.6, depois: 0.4 }));
        cur.y += 1.6;
      });
      // Rituais
      subtitulo('Rituais', T.vio, 'níveis 1-3: 5 min · 4-6: 8 min · 7+: 12 min de preparo');
      const rituais = branco ? [] : c.rituais;
      if (!rituais.length) {
        for (let i = 0; i < (branco ? 2 : 1); i++) {
          linhaCampos([['Ritual', 0.46, ''], ['Nível', 0.14, ''], ['Custo (San)', 0.2, ''], ['Preparo', 0.2, '']]);
          linhaCampos([['Etapas', 1, '']]);
          linhaCampos([['Componentes', 1, '']]);
          linhaCampos([['Efeito', 0.7, ''], ['Duração', 0.3, '']]);
          cur.y += 2;
        }
      }
      rituais.forEach(r => {
        const ri = R.ritualInfo(r, d);
        tituloBloco(r.nome || 'Ritual sem nome', `Nível ${r.nivel} (${ri.faixa}) · custo ${ri.custo} de Sanidade${ri.acima && ri.alem ? ' (dobro)' : ''} · ${String(ri.tempo).replace('.', ',')} min de preparo${ri.rapido ? ' (Canalização Rápida)' : ''}`, T.vio);
        if (ri.acima) paragrafo(ri.alem ? 'Acima do seu ESOTERISMO: permitido por Conhecimento Além, com custo dobrado.' : `Perigo: nível acima do seu ESOTERISMO (${d.attr.ESO.valor}).`, { size: 6.2, cor: T.vig, estilo: 'bold', depois: 0.4 });
        [['Etapas:', r.etapas], ['Componentes:', r.componentes], ['Efeito:', r.efeito], ['Duração:', r.duracao], ['Notas:', r.notas]]
          .filter(([, v]) => String(v || '').trim())
          .forEach(([k, v]) => itemTexto(k, v, { cor: T.dim, size: 6.6, depois: 0.4 }));
        cur.y += 1.6;
      });
    }

    /* ================================================================== */
    /* 5. HISTÓRIA                                                        */
    /* ================================================================== */
    function secHistoria() {
      secao('História e aparência', T.cyan, '', 24);
      const blocos = [
        ['De onde veio', c.historia.origem, 4],
        ['Motivações', c.historia.motivacoes, 3],
        ['Primeiro contato com o Indizível', c.historia.contato, 3],
        ['História completa', c.historia.livre, 7],
        ['Traços físicos', c.aparencia.fisico, 4],
        ['Traços mentais - manias, tiques e peculiaridades', c.aparencia.mental, 4],
        ['Notas', c.notas, 5]
      ];
      for (const [rotulo, texto, n] of blocos) {
        const vazio = branco || !String(texto || '').trim();
        ensure(vazio ? 10 : 8);
        rot(rotulo, M, cur.y + 2.6, T.cyan);
        cur.y += 3.6;
        if (vazio) pautas(branco ? n : Math.min(n, 2));
        else paragrafo(texto, { size: 7, depois: 2.4 });
      }
    }

    /* ================================================================== */
    /* 6. REFERÊNCIA RÁPIDA                                               */
    /* ================================================================== */
    function secReferencia() {
      paginaNova();
      secao('Referência rápida', T.cyan, 'Livro do Jogador · 1ª Edição', 30);
      subtitulo('Testes', T.cyan);
      lista([
        '1d20 + atributo contra a Dificuldade (DF). 20 natural = acerto crítico (sucesso pleno; em ataque, dano máximo). 1 natural = falha crítica.',
        'Vantagem: role 2d20 e fique com o maior. Desvantagem: fique com o menor.',
        'Porcentagem: 1d100 abaixo da chance = sucesso (1 = crítico, 100 = falha crítica).'
      ]);
      tabela(D.DIFICULDADES.map(x => ({ t: 'DF ' + x.df, w: 1, al: 'c' })), [D.DIFICULDADES.map(x => ({ t: String(x.min), estilo: 'bold' }))], { corCab: T.cyan, depois: 3 });
      subtitulo('Combate', T.vig);
      lista([
        'Iniciativa: todos rolam ACUIDADE; do maior para o menor. Empates: os Peritos decidem.',
        'Por turno: 1 Ação + 1 Ação Bônus, OU um turno de Movimentação (10m sem gastar Fôlego nem fazer testes).',
        'Atacar, defender e esquivar: primeiro um teste de acerto de ACUIDADE; se acertar, rola o dano.',
        `Defender: ACUIDADE para reagir e depois VIGOR DF6 para receber só metade do dano; crítico anula o dano.`,
        `Contra-ação: DF${d.contra.df} para escapar de uma ação do oponente (o oponente usa DF${d.contra.dfInimigo}). 20 natural = +1 Ação Bônus.`,
        'Defesa (%): 1d100 <= Defesa da parte atingida = metade do dano; crítico = ¼. A RD da armadura só vale na própria parte.',
        'Locomoção: até 5m sem teste; além disso, teste de VIGOR (ex.: 5m + 2m = DF1 com +2 no resultado necessário).'
      ], { cor: T.vig });
      subtitulo('Fôlego', T.vig);
      lista([
        `Correr: 1 Ponto de Fôlego a cada ${d.mov.corrida}m, sem teste. Pular/escalar: ${d.mov.pulo} PF.`,
        `Teste de força: pode pagar ${d.mov.forca} em vez de rolar (ex.: DF 4 = 4 PF).`,
        `Recupera ${d.mov.recupera} PF a cada 15 minutos, sem precisar de descanso.`,
        'Fôlego zerado = Exaustão: -[VIGOR] em todos os testes até descansar 1 hora ou mais.'
      ], { cor: T.vig });
      subtitulo('Descanso e sono', T.acu, 'sem modificadores de atributo');
      lista(D.DESCANSOS.map(x => `${x.nome}: recupera ${x.vida} de Vida.`)
        .concat(D.SONOS.map(x => `${x.nome}: recupera ${x.vida} de Vida e ${x.san} de Sanidade (dormir faz os dias passarem).`)), { cor: T.acu });
      if (c.modulo === 'passado') {
        subtitulo('Fome da Party', T.raz, 'Em um Passado Distante');
        lista(['Barra única da Party, de 100 a 0; só enche quando o grupo inteiro para para se alimentar.',
          D.FOME.map(f => `${f.nome} (${f.max}-${f.min}): ${f.pen ? f.pen + ' em todos os testes' : 'nenhum efeito'}`).join(' · ') + '. Morte ao chegar em 0.'], { cor: T.raz });
      }
      subtitulo('Sanidade', T.raz);
      lista([
        'Em 0: teste de RAZÃO para se equilibrar na Corda da Loucura. Falhou: status Insano (2x dano de Sanidade). Passou: fica em 0 e testa de novo no próximo dano.',
        'Exposto ao Indizível: -1 a cada 15 minutos fora de combate; em combate, -1 a cada golpe de um Indizível. Ver o LIMIAR: 2d20 de dano de Sanidade.',
        'Cada ponto de RAZÃO = 1 turno de combate sem perder Sanidade.',
        'Conhecimento: 1 de dano de Sanidade = 1%. Rituais e magias não contam.',
        'Recuperar: terapia (1d6, ao fim da sessão), sermões e itens psicoativos. Sanidade gasta em magia volta ao fim do combate se o conjurador ficar acima de 0.'
      ], { cor: T.raz });
      const faixas = D.FAIXAS_SANIDADE.map(f => [{ t: `${f.max} a ${f.min}`, cor: T.raz, estilo: 'bold' }, f.efeito]);
      const meioF = Math.ceil(faixas.length / 2);
      emColunas(35, (x, w) => tabela([{ t: 'Sanidade', w: 16, al: 'c' }, { t: 'Efeito', w: 50 }], faixas.slice(0, meioF), { x, w, corCab: T.raz, size: 6.2 }),
        (x, w) => tabela([{ t: 'Sanidade', w: 16, al: 'c' }, { t: 'Efeito', w: 50 }], faixas.slice(meioF), { x, w, corCab: T.raz, size: 6.2 }));
      subtitulo('Status', T.psi, '', 70);
      const sts = D.STATUS.map(s => [{ t: s.nome, cor: T[s.cor] || T.dim, estilo: 'bold' }, s.desc]);
      const meioS = Math.ceil(sts.length / 2);
      emColunas(70, (x, w) => tabela([{ t: 'Status', w: 19 }, { t: 'Efeito', w: 60 }], sts.slice(0, meioS), { x, w, corCab: T.psi, size: 5.8 }),
        (x, w) => tabela([{ t: 'Status', w: 19 }, { t: 'Efeito', w: 60 }], sts.slice(meioS), { x, w, corCab: T.psi, size: 5.8 }));
      subtitulo('Inventário', T.raz);
      lista([
        'Pertences: 1 item em cada mão, 1 peça de armadura por parte do corpo, 2 consumíveis de fácil acesso e até 3 acessórios (não saem em combate).',
        `Bagagem: ${D.LIMITES_BAGAGEM.armas} armas, ${D.LIMITES_BAGAGEM.armaduraPorParte} peças de armadura por parte e ${D.LIMITES_BAGAGEM.consumiveis} consumíveis. Patrimônio: o que não carrega, mas tem acesso.`,
        'Equipar ou desequipar gasta 1 turno.'
      ], { cor: T.raz });
      if (c.modulo === 'passado') paragrafo('Extensão "Em um Passado Distante": as Classes substituem as Profissões do Livro do Jogador. Todo o resto das regras da 1ª Edição continua valendo.', { size: 6.4, cor: T.yel, estilo: 'italic' });
    }

    /* ---------- montagem ---------- */
    novaPagina();
    if (P.ficha) {
      secIdentidade();
      secAtributos();
      secRecursos();
      secCorpo();
      secMente();
      secProgressao();
    } else {
      secIdentidade();
    }
    if (P.equip) { secEquipamento(); secHabilidades(); }
    if (P.caminhos) secCaminhos();
    if (P.revel) secRevelacoes();
    if (P.historia) secHistoria();
    if (P.ref) secReferencia();
    rodapes();
    return doc;
  }

  /* ------------------------------------------------------------------ */
  /* PDF + ZIP: o PDF continua legível e carrega um .zip com ficha.json */
  /* no fim do arquivo (leitores de PDF ignoram bytes após o %%EOF e   */
  /* leitores de ZIP procuram o diretório central pelo fim).           */
  /* ------------------------------------------------------------------ */
  const ZIP_NOME = 'ficha.json';
  let tabelaCRC = null;
  function crc32(bytes) {
    if (!tabelaCRC) {
      tabelaCRC = new Uint32Array(256);
      for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; tabelaCRC[n] = c >>> 0; }
    }
    let c = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) c = tabelaCRC[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  /* Devolve um Uint8Array: bytes do PDF + ZIP (sem compressão) com ficha.json. */
  function embutir(pdfBuf, json) {
    const pdf = new Uint8Array(pdfBuf);
    const dados = new TextEncoder().encode(json);
    const nome = new TextEncoder().encode(ZIP_NOME);
    const crc = crc32(dados);
    const base = pdf.length; // offsets do ZIP são absolutos no arquivo
    const loc = 30 + nome.length, cen = 46 + nome.length;
    const out = new Uint8Array(base + loc + dados.length + cen + 22);
    const v = new DataView(out.buffer);
    out.set(pdf, 0);
    let p = base;
    v.setUint32(p, 0x04034b50, true); v.setUint16(p + 4, 20, true); v.setUint16(p + 6, 0x0800, true); v.setUint16(p + 8, 0, true);
    v.setUint32(p + 14, crc, true); v.setUint32(p + 18, dados.length, true); v.setUint32(p + 22, dados.length, true);
    v.setUint16(p + 26, nome.length, true); v.setUint16(p + 28, 0, true);
    out.set(nome, p + 30); out.set(dados, p + loc);
    const cd = base + loc + dados.length;
    p = cd;
    v.setUint32(p, 0x02014b50, true); v.setUint16(p + 4, 20, true); v.setUint16(p + 6, 20, true); v.setUint16(p + 8, 0x0800, true);
    v.setUint32(p + 16, crc, true); v.setUint32(p + 20, dados.length, true); v.setUint32(p + 24, dados.length, true);
    v.setUint16(p + 28, nome.length, true); v.setUint32(p + 42, base, true);
    out.set(nome, p + 46);
    p = cd + cen;
    v.setUint32(p, 0x06054b50, true); v.setUint16(p + 8, 1, true); v.setUint16(p + 10, 1, true);
    v.setUint32(p + 12, cen, true); v.setUint32(p + 16, cd, true);
    return out;
  }

  /* Procura o ficha.json embutido; devolve o texto ou null. */
  function extrair(buf) {
    const b = new Uint8Array(buf);
    const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
    const dec = new TextDecoder();
    for (let p = b.length - 22; p >= Math.max(0, b.length - 22 - 65535); p--) {
      if (v.getUint32(p, true) !== 0x06054b50) continue;
      let q = v.getUint32(p + 16, true);
      const n = v.getUint16(p + 10, true);
      for (let i = 0; i < n && q + 46 <= b.length; i++) {
        if (v.getUint32(q, true) !== 0x02014b50) break;
        const metodo = v.getUint16(q + 10, true), tam = v.getUint32(q + 20, true);
        const ln = v.getUint16(q + 28, true), le = v.getUint16(q + 30, true), lc = v.getUint16(q + 32, true);
        const nome = dec.decode(b.subarray(q + 46, q + 46 + ln));
        const off = v.getUint32(q + 42, true);
        if (nome === ZIP_NOME && metodo === 0 && v.getUint32(off, true) === 0x04034b50) {
          const ini = off + 30 + v.getUint16(off + 26, true) + v.getUint16(off + 28, true);
          return dec.decode(b.subarray(ini, ini + tam));
        }
        q += 46 + ln + le + lc;
      }
    }
    return null;
  }

  const PDF = (L.PDF = { fontes: null, fontesOk: false, carregar, gerar, embutir, extrair, TEMAS });
})();
