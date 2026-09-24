/* LIMIAR — renderização (HTML em string). Estado e eventos ficam em app.js. */
(function () {
  'use strict';
  const L = (window.LIMIAR = window.LIMIAR || {});
  const D = L.DATA;
  const R = L.Rules;
  const UI = (L.UI = {});
  const fmt = R.fmtMod;

  /* ------------------------------------------------------------------ */
  /* helpers                                                            */
  /* ------------------------------------------------------------------ */
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ESC[ch]);
  const KW = /\b(VIGOR|ACUIDADE|PSICOMETRIA|ESOTERISMO|RAZÃO|LIMIAR|CONHECIMENTO|Conhecimento)\b|INDIZÍVE(?:L|IS)|Indizíve(?:l|is)/g;
  const KWC = { VIGOR: 'vig', ACUIDADE: 'acu', PSICOMETRIA: 'psi', ESOTERISMO: 'eso', 'RAZÃO': 'raz', LIMIAR: 'lim', CONHECIMENTO: 'yel', Conhecimento: 'yel' };
  const hl = s => esc(s).replace(KW, m => `<span class="kw kw-${KWC[m] || 'ind'}">${m}</span>`);
  const AC = { VIG: 'vig', ACU: 'acu', PSI: 'psi', ESO: 'eso', RAZ: 'raz', INT: 'psi', SAP: 'psi' };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pct = (a, b) => (b > 0 ? clamp(Math.round((a / b) * 100), 0, 100) : 0);
  const nomeAttr = k => (k === 'INT' || k === 'SAP' ? D.SUBATRIBUTOS[k].nome : D.ATTR[k].nome);
  UI.esc = esc;
  UI.hl = hl;
  UI.nomeAttr = nomeAttr;

  function inp(bind, value, o) {
    o = o || {};
    const num = o.t === 'int' || o.t === 'intn';
    const neg = o.neg || /^(ajustes\.|vida\.|sanidade$)/.test(bind); // aceita negativo: teclado com "-"
    return `<input type="text"${num ? (neg ? ' inputmode="text" autocomplete="off" enterkeyhint="done"' : ' inputmode="numeric" autocomplete="off" enterkeyhint="done"') : ''} data-bind="${bind}"${o.t ? ` data-t="${o.t}"` : ''} value="${esc(value == null ? '' : value)}"${o.ph ? ` placeholder="${esc(o.ph)}"` : ''}${o.cls ? ` class="${o.cls}"` : ''}${o.aria ? ` aria-label="${esc(o.aria)}"` : ''}${o.max ? ` maxlength="${o.max}"` : ''}>`;
  }
  function uiInp(key, value, o) {
    o = o || {};
    return `<input type="${o.type || 'text'}" data-ui="${key}" value="${esc(value == null ? '' : value)}"${o.num ? ' inputmode="numeric" autocomplete="off"' : ''}${o.ph ? ` placeholder="${esc(o.ph)}"` : ''}${o.cls ? ` class="${o.cls}"` : ''}${o.aria ? ` aria-label="${esc(o.aria)}"` : ''}>`;
  }
  const fld = (label, bind, value, o) => `<label class="fld ${(o && o.wrap) || ''}"><span class="fld-l">${label}</span>${inp(bind, value, o)}</label>`;
  const area = (label, bind, value, o) => {
    o = o || {};
    return `<label class="fld ${o.wrap || ''}"><span class="fld-l">${label}</span><textarea data-bind="${bind}" rows="${o.rows || 3}"${o.ph ? ` placeholder="${esc(o.ph)}"` : ''}>${esc(value || '')}</textarea></label>`;
  };
  const opts = (list, value) => list.map(op => `<option value="${esc(op.v)}"${String(op.v) === String(value == null ? '' : value) ? ' selected' : ''}>${esc(op.t)}</option>`).join('');
  const sel = (bind, value, list, o) => {
    o = o || {};
    return `<select data-bind="${bind}"${o.t ? ` data-t="${o.t}"` : ''}${o.aria ? ` aria-label="${esc(o.aria)}"` : ''}${o.cls ? ` class="${o.cls}"` : ''}>${opts(list, value)}</select>`;
  };
  const uiSel = (key, value, list, o) => {
    o = o || {};
    return `<select data-ui="${key}"${o.aria ? ` aria-label="${esc(o.aria)}"` : ''}${o.cls ? ` class="${o.cls}"` : ''}>${opts(list, value)}</select>`;
  };
  const chk = (bind, on, label, o) => {
    o = o || {};
    return `<label class="chk ${o.cls || ''}"><input type="checkbox" data-bind="${bind}" data-t="bool"${on ? ' checked' : ''}><span>${label}</span></label>`;
  };
  const uiChk = (key, on, label, o) => {
    o = o || {};
    return `<label class="chk ${o.cls || ''}"><input type="checkbox" data-ui="${key}"${on ? ' checked' : ''}><span>${label}</span></label>`;
  };
  function btn(label, act, o) {
    o = o || {};
    const fk = o.fk || `${act}:${o.a === undefined ? '' : o.a}:${o.b === undefined ? '' : o.b}`;
    return `<button type="button" class="btn ${o.cls || ''}" data-act="${act}"${o.a !== undefined ? ` data-a="${esc(o.a)}"` : ''}${o.b !== undefined ? ` data-b="${esc(o.b)}"` : ''}${o.title ? ` title="${esc(o.title)}"` : ''}${o.dis ? ' disabled' : ''} data-fk="${esc(fk)}">${label}</button>`;
  }
  function step(act, a, value, o) {
    o = o || {};
    const shown = o.raw ? esc(value) : fmt(value);
    return `<span class="step"><button type="button" data-act="${act}" data-a="${esc(a)}" data-b="-1" aria-label="Diminuir"${o.decDis ? ' disabled' : ''} data-fk="${act}:${a}:-1">-</button><span class="sv">${shown}</span><button type="button" data-act="${act}" data-a="${esc(a)}" data-b="1" aria-label="Aumentar"${o.incDis ? ' disabled' : ''} data-fk="${act}:${a}:1">+</button></span>`;
  }
  function stepInp(act, a, bind, value, o) {
    o = o || {};
    return `<span class="step"><button type="button" data-act="${act}" data-a="${esc(a)}" data-b="-1" aria-label="Diminuir" data-fk="${act}:${a}:-1"${o.decDis ? ' disabled' : ''}>-</button>${inp(bind, value, { t: o.t || 'intn', aria: o.aria })}<button type="button" data-act="${act}" data-a="${esc(a)}" data-b="1" aria-label="Aumentar" data-fk="${act}:${a}:1"${o.incDis ? ' disabled' : ''}>+</button></span>`;
  }
  const win = (title, color, body, o) => {
    o = o || {};
    const tools = o.tools ? `<div class="win-tools">${o.tools}</div>` : '';
    if (UI.mobile()) { // no celular: tocar no título recolhe a janela (e o app lembra)
      const chave = String(title).replace(/<[^>]+>/g, '').trim();
      const fechada = !!(UI.recolhidas && UI.recolhidas.has(UI.abaAtual + ':' + chave));
      return `<section class="win c-${color} ${o.cls || ''}${fechada ? ' recolhida' : ''}"${o.id ? ` id="${o.id}"` : ''}><h2 class="win-t"><button type="button" class="win-tg" data-act="win-toggle" data-a="${esc(chave)}" data-fk="win:${esc(chave)}" aria-expanded="${!fechada}">${title}</button></h2>${tools}<div class="win-corpo">${body}</div></section>`;
    }
    return `<section class="win c-${color} ${o.cls || ''}"${o.id ? ` id="${o.id}"` : ''}><h2 class="win-t">${title}</h2>${tools}${body}</section>`;
  };
  const bar = (p, color, o) => {
    o = o || {};
    return `<div class="bar c-${color}${o.neg ? ' neg' : ''}${o.lg ? ' bar-lg' : ''}" role="img" aria-label="${esc(o.label || p + '%')}"><i style="--p:${clamp(p, 0, 100)}%"></i></div>`;
  };
  /* Sanidade: positiva = barra âmbar até o máximo; negativa = barra roxa de 0 até -100. */
  const barSan = (s, o) => {
    o = o || {};
    if (s.atual != null && s.atual < 0) {
      const p = clamp(-s.atual, 1, 100);
      return `<div class="bar san-neg${o.lg ? ' bar-lg' : ''}" role="img" aria-label="${esc(o.label || 'Sanidade')}: ${s.atual} (até -100)"><i style="--p:${p}%;--pn:${p}"></i></div>`;
    }
    return bar(s.max ? pct(Math.max(0, s.atual), s.max) : 0, 'raz', o);
  };
  const tag = (txt, color, o) => `<span class="tag ${o && o.o ? 'tag-o ' : ''}c-${color}">${esc(txt)}</span>`;
  UI.h = { inp, uiInp, fld, area, sel, uiSel, chk, uiChk, btn, step, win, bar, tag, opts };

  /* ------------------------------------------------------------------ */
  /* LOGO                                                               */
  /* ------------------------------------------------------------------ */
  UI.logoSVG = function (texto, o) {
    o = o || {};
    const lg = D.LOGO.barras(texto || 'LIMIAR');
    const cw = 10, rh = 10, bh = 6.2;
    const cores = o.mono ? D.LOGO.CORES.map(() => o.mono) : D.LOGO.CORES;
    const rects = lg.barras.map(b => `<rect x="${b.x * cw}" y="${b.y * rh}" width="${b.w * cw}" height="${bh}" fill="${cores[b.row]}"/>`).join('');
    return `<svg viewBox="0 0 ${lg.colunas * cw} ${(lg.linhas - 1) * rh + bh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(texto || 'LIMIAR')}">${rects}</svg>`;
  };

  /* ------------------------------------------------------------------ */
  /* HUD + ABAS                                                         */
  /* ------------------------------------------------------------------ */
  UI.tabList = d => [
    { id: 'perito', k: '1', t: 'Perito' },
    { id: 'atributos', k: '2', t: 'Atributos' },
    { id: 'origem', k: '3', t: d.termo },
    { id: 'corpo', k: '4', t: 'Corpo' },
    { id: 'mente', k: '5', t: 'Mente' },
    { id: 'equipamento', k: '6', t: 'Equipamento' },
    { id: 'caminhos', k: '7', t: 'Caminhos' },
    { id: 'revelacoes', k: '8', t: 'Revelações' },
    { id: 'regras', k: '9', t: 'Regras' },
    { id: 'mapa', k: '0', t: 'Mapa' }
  ];

  /* Dispositivo: layout de celular (até 760px) e painel de compartilhar do sistema (toque). */
  UI.mobile = () => !!(window.matchMedia && window.matchMedia('(max-width: 760px)').matches);
  UI.toque = () => !!((window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || ''));
  UI.compartilhaArquivos = () => {
    if (!UI.toque() || !navigator.share || !navigator.canShare || typeof File === 'undefined') return false;
    try { return navigator.canShare({ files: [new File(['%PDF'], 'teste.pdf', { type: 'application/pdf' })] }); } catch (e) { return false; }
  };

  /* Gaveta lateral: abas + ações da ficha (no celular substitui a fileira de abas e o topo). */
  UI.gaveta = function (app) {
    const { d } = app;
    const u = app.usuario;
    const abas = UI.tabList(d).map(t => {
      const on = app.ui.tab === t.id;
      const alerta = d.avisos.some(a => a.tab === t.id && a.nivel !== 'info');
      return `<button type="button" class="gaveta-item${on ? ' on' : ''}" data-act="tab" data-a="${t.id}" data-fk="gav:${t.id}"${on ? ' aria-current="page"' : ''}><span class="kc">${t.k}</span>${esc(t.t)}${alerta ? '<span class="dot" title="Pendências"></span>' : ''}</button>`;
    }).join('');
    const acao = (rot, act, cls) => `<button type="button" class="gaveta-item gaveta-acao${cls ? ' ' + cls : ''}" data-act="${act}" data-fk="gav:${act}"><span class="gi">&rsaquo;</span>${esc(rot)}</button>`;
    return `<div class="gaveta-back" data-act="gaveta-fechar-fundo">
      <nav class="gaveta" id="gaveta" role="dialog" aria-modal="true" aria-label="Abas e menu">
        <div class="gaveta-topo">
          <img src="assets/logo-rpg-pixel.svg" alt="" width="33" height="35">
          <div class="gaveta-tit"><b>LIMIAR</b><span>${u ? `${esc(u.login)} #${u.id}` : 'Criador de fichas'}</span></div>
          <button type="button" class="btn btn-s" data-act="gaveta-fechar" data-fk="gav:fechar" aria-label="Fechar">&times;</button>
        </div>
        <div class="gaveta-sec">Abas</div>
        ${abas}
        <div class="gaveta-sec">Ficha</div>
        ${acao('Fichas salvas', 'fichas')}${acao('Nova ficha', 'nova')}${acao(UI.compartilhaArquivos() ? 'Compartilhar PDF' : 'Exportar PDF', 'pdf-modal', 'gaveta-pdf')}${acao('Importar PDF', 'importar-pdf')}${acao('Menu e opções', 'menu')}
        <div class="gaveta-sec">Extensão</div>
        <div class="gaveta-ext"><select data-modulo aria-label="Extensão do livro">${D.MODULOS.map(m => `<option value="${m.id}"${m.id === app.c.modulo ? ' selected' : ''}>${esc(m.nome)}</option>`).join('')}</select></div>
        <div class="gaveta-pe">
          <button type="button" class="btn btn-s" data-act="toggle-crt" data-fk="gav:crt">${app.store.prefs.crt ? 'CRT ON' : 'CRT OFF'}</button>
          <button type="button" class="btn btn-s btn-x" data-act="sair" data-fk="gav:sair">Sair</button>
        </div>
      </nav>
    </div>`;
  };

  UI.tabs = function (app) {
    const { d } = app;
    return UI.tabList(d).map(t => {
      const alerta = d.avisos.some(a => a.tab === t.id && a.nivel !== 'info');
      const on = app.ui.tab === t.id;
      return `<button type="button" class="tab" role="tab" id="tab-${t.id}" aria-selected="${on}" aria-controls="view" data-act="tab" data-a="${t.id}" data-fk="tab:${t.id}"><span class="kc">${t.k}</span>${esc(t.t)}${alerta ? '<span class="dot" title="Pendências"></span>' : ''}</button>`;
    }).join('');
  };

  UI.hud = function (app) {
    const { c, d } = app;
    const nome = c.nome.trim();
    const org = d.origem ? d.origem.nome : (d.origemEscolhida ? `Sem ${d.termo.toLowerCase()}` : `${d.termo}: a escolher`);
    const san = d.sanidade;
    const sanTxt = san.atual == null ? '—' : (san.max == null ? String(san.atual) : `${san.atual}/${san.max}`);
    const fol = d.folego;
    const erros = d.avisos.filter(a => a.nivel === 'erro').length;
    const avs = d.avisos.filter(a => a.nivel === 'aviso').length;
    const totalAv = erros + avs;
    return `
      <div class="hud-seg hud-id" role="button" tabindex="0" data-act="tab" data-a="perito" data-fk="hud:perito" title="Abrir a aba Perito"><span class="hud-l">PERITO · ${esc(d.modulo.curto)}</span><span class="hud-name${nome ? '' : ' empty'}">${esc(nome || 'SEM NOME')}</span><span class="hud-org">${esc(org)}</span></div>
      <div class="hud-seg hud-nv" role="button" tabindex="0" data-act="tab" data-a="mente" data-fk="hud:nv" title="Níveis: aba Mente"><span class="hud-l">NÍVEL</span><span class="hud-v t-yel">${c.nivel}</span></div>
      <div class="hud-seg hud-bar hud-con" role="button" tabindex="0" data-act="tab" data-a="mente" data-fk="hud:con" title="Conhecimento: aba Mente"><span class="hud-l">CONHECIMENTO</span><div class="bar-row">${bar(c.conhecimento, 'yel', { label: `Conhecimento ${c.conhecimento}%` })}<span class="t-yel">${c.conhecimento}%</span></div></div>
      <div class="hud-seg hud-bar hud-san" role="button" tabindex="0" data-act="tab" data-a="mente" data-fk="hud:san" title="Sanidade: aba Mente"><span class="hud-l">SANIDADE</span><div class="bar-row">${barSan(san, { label: `Sanidade ${sanTxt}` })}<span class="${san.atual != null && san.atual <= 0 ? 't-vig blink' : 't-raz'}">${sanTxt}</span></div></div>
      <div class="hud-seg hud-bar hud-fol hide-s" role="button" tabindex="0" data-act="tab" data-a="corpo" data-fk="hud:fol" title="Fôlego: aba Corpo"><span class="hud-l">FÔLEGO</span><div class="bar-row">${bar(pct(fol.atual, fol.max), 'cyan', { label: `Fôlego ${fol.atual}/${fol.max}` })}<span class="t-cyan">${fol.atual}/${fol.max}</span></div></div>
      <div class="hud-seg hud-def hide-s" role="button" tabindex="0" data-act="tab" data-a="corpo" data-fk="hud:def" title="Defesa: aba Corpo"><span class="hud-l">DEFESA</span><span class="hud-v t-psi">${d.defesa.base == null ? '—' : d.defesa.base + '%'}</span></div>
      <div class="hud-seg hud-tr" role="button" tabindex="0" data-act="tab" data-a="caminhos" data-fk="hud:tr" title="Traços: aba Caminhos"><span class="hud-l">TRAÇOS</span><span class="hud-v ${d.tracos.disponiveis > 0 ? 't-eso blink' : d.tracos.disponiveis < 0 ? 't-vig' : 't-eso'}">${d.tracos.disponiveis}</span></div>
      <div class="hud-seg hud-check hide-s"><span class="hud-l" style="margin-right:4px">MONTAGEM</span>${d.checklist.map(ck => `<button type="button" class="ck${ck.ok ? ' ok' : ''}" data-act="tab" data-a="${ck.tab}" data-fk="hudck:${ck.id}" title="${esc(`${ck.letra}. ${ck.txt}${!ck.ok && ck.det ? ' — ' + ck.det : ''}`)}">${ck.letra}</button>`).join('')}</div>
      <button type="button" class="hud-warn ${erros ? 'err' : totalAv ? '' : 'ok'}" data-act="avisos" data-fk="avisos" title="Pendências e avisos da ficha">${totalAv ? `! ${totalAv} ${totalAv === 1 ? 'AVISO' : 'AVISOS'}` : 'OK'}</button>`;
  };

  /* ------------------------------------------------------------------ */
  /* VIEW                                                               */
  /* ------------------------------------------------------------------ */
  const T = {};
  UI.view = function (app) {
    const fn = T[app.ui.tab] || T.perito;
    return fn(app);
  };

  /* ---------------- 1. PERITO ---------------- */
  T.perito = function (app) {
    const { c, d } = app;
    const ret = app.retratoURL;
    const identificacao = win('Identificação', 'cyan', `
      <div class="id-grid">
        <div class="portrait">
          <div class="portrait-frame">${ret ? `<img src="${esc(ret)}" alt="Retrato do Perito">` : '<div class="ph">SEM<br>RETRATO</div>'}</div>
          <div class="row">${btn(c.retrato ? 'Trocar' : 'Enviar retrato', 'retrato-up', { cls: 'btn-s' })}${c.retrato ? btn('Remover', 'retrato-del', { cls: 'btn-s btn-x' }) : ''}</div>
          ${c.retrato ? chk('retratoRetro', c.retratoRetro, 'Filtro EGA (16 cores, mais pixelado)') : ''}
        </div>
        <div class="stack id-campos">
          ${fld('Nome do Perito', 'nome', c.nome, { cls: 'in-big', ph: 'Nome do Perito', max: 80 })}
          <div class="grid g3 id-g3">${fld('Jogador', 'jogador', c.jogador, { max: 60 })}${fld('Idade', 'idade', c.idade, { max: 20 })}${fld('Origem', 'origem', c.origem, { ph: c.modulo === 'passado' ? 'Reino, cidade…' : 'Cidade, país…', max: 80 })}</div>
        </div>
        <div class="stack id-info">
          <div class="row">
            <span class="lbl">${esc(d.termo)}</span><span class="val t-acc">${esc(d.origem ? d.origem.nome : '—')}</span>${btn(d.origemEscolhida ? 'Alterar' : 'Escolher', 'tab', { a: 'origem', cls: 'btn-s' })}
          </div>
          <div class="row">
            <span class="lbl">Nível</span><span class="val t-yel">${c.nivel}</span>
            <span class="lbl" style="margin-left:14px">Conhecimento</span><span class="val t-yel">${c.conhecimento}%</span>
            <span class="lbl" style="margin-left:14px">Extensão</span><span class="val t-acc">${esc(d.modulo.nome)}</span>
          </div>
        </div>
      </div>`);
    const montagem = win('Montando um Perito', 'yel', `
      <p class="tx-s mb">Para montar seu primeiro perito, deve seguir as seguintes etapas:</p>
      <ul class="check-list">${d.checklist.map(ck => `
        <li class="${ck.ok ? 'ok' : ''}"><span class="ck">${ck.ok ? '✓' : ck.letra}</span>
          <span><span class="t-yel">${ck.letra}.</span> ${esc(ck.txt)}${!ck.ok && ck.det ? `<span class="det">› ${esc(ck.det)}</span>` : ''}</span>
          ${btn('Ir', 'tab', { a: ck.tab, cls: 'btn-s', fk: 'ck-ir:' + ck.id })}</li>`).join('')}</ul>
      <p class="tx-s mt">Os Peritos não são pessoas comuns como as outras, são casos excepcionais, com habilidades muito superiores às de outros humanos, pessoas que são prodígios.</p>`);
    const historia = win('História', 'eso', `
      <div class="stack">
        ${area('De onde veio', 'historia.origem', c.historia.origem, { rows: 3, ph: 'Plano de fundo: família, lugar, ofício…' })}
        ${area('Motivações', 'historia.motivacoes', c.historia.motivacoes, { rows: 3, ph: 'Por que está nessa história?' })}
        ${area('Primeiro contato com o Indizível', 'historia.contato', c.historia.contato, { rows: 3, ph: 'Como foi (se requisitado pelo Espectador)…' })}
        ${area('História completa', 'historia.livre', c.historia.livre, { rows: 7 })}
      </div>`);
    const aparencia = win('Aparência', 'acu', `
      <div class="stack">
        ${area('Traços físicos', 'aparencia.fisico', c.aparencia.fisico, { rows: 4, ph: 'Altura, marcas, roupas, cicatrizes…' })}
        ${area('Traços mentais — manias, tiques e peculiaridades', 'aparencia.mental', c.aparencia.mental, { rows: 4 })}
      </div>`);
    const notas = win('Anotações', 'dim', area('Notas livres', 'notas', c.notas, { rows: 6, ph: 'Pistas, contatos, dívidas, segredos…' }));
    const lore = c.modulo === 'passado' ? win('Em um Passado Distante', 'yel', `<div class="tx lore">${D.PASSADO.contexto.map(p => `<p>${hl(p)}</p>`).join('')}</div>`) : '';
    return `<div class="grid g-main"><div>${identificacao}${historia}</div><div>${montagem}${lore}${aparencia}${notas}</div></div>`;
  };

  /* ---------------- 2. ATRIBUTOS ---------------- */
  T.atributos = function (app) {
    const { c, d } = app;
    const pc = d.pontos.criacao;
    const pn = d.pontos.nivel;
    const termo = d.termo.toUpperCase();
    const penTodas = d.pen.ALL.map(p => `${p.fonte} ${fmt(p.v)} (todos)`)
      .concat(R.ATTR_KEYS.flatMap(k => d.pen[k].map(p => `${p.fonte} ${fmt(p.v)} (${D.ATTR[k].nome})`)));
    const rows = D.ATRIBUTOS.map(a => {
      const x = d.attr[a.id];
      const mt = d.modTeste(a.id);
      return `<tr class="c-${a.cor}">
        <td><div class="attr-name"><span class="sw"></span><div><b><span class="an-l">${a.nome}</span><span class="an-c">${a.id}</span></b><small>${esc(a.resumo)}</small></div></div></td>
        <td>${step('attr-base', a.id, x.base, { decDis: x.base <= D.CRIACAO.min, incDis: x.base >= D.CRIACAO.max || pc <= 0 })}</td>
        <td class="col-niv">${step('attr-niv', a.id, x.niv, { decDis: x.niv <= 0, incDis: pn <= 0 })}</td>
        <td class="hide-s"><span class="val ${x.prof ? 't-c' : 't-mute'}">${fmt(x.prof)}</span></td>
        <td><span class="attr-total">${fmt(x.efetivo)}</span>${x.notas.map(n => `<span class="attr-note">${esc(n)}</span>`).join('')}</td>
        <td class="col-teste">${a.id === 'PSI' ? '' : btn('d20' + (mt ? fmt(mt) : ''), 'roll-attr', { a: a.id, cls: 'btn-s btn-c', title: `Teste: 1d20 ${fmt(mt)}` })}</td>
      </tr>`;
    }).join('');
    const dist = win('Distribuição de pontos', 'cyan', `
      <div class="pts">
        <div><span class="lbl">Pontos de criação</span><div class="pv ${pc === 0 ? 't-acu' : pc < 0 ? 't-vig' : 't-yel'}">${pc}<span class="t-mute">/${D.CRIACAO.pontos}</span></div></div>
        <div><span class="lbl">Pontos de nível</span><div class="pv ${pn > 0 ? 't-eso' : pn < 0 ? 't-vig' : 't-mute'}">${pn}<span class="t-mute">/${c.nivel}</span></div></div>
        <p class="tx-s grow" style="max-width:520px">Na criação: 5 pontos para distribuir, no máximo +10 e no mínimo -5 em cada atributo — retire pontos de um para realocar em outro. Cada nível dá +1 ponto para colocar onde quiser.</p>
      </div>
      <div class="tbl-wrap"><table class="attr-tbl">
        <thead><tr><th>Atributo</th><th>Criação</th><th class="col-niv">Nível</th><th class="hide-s">${esc(termo)}</th><th>Total</th><th class="col-teste">Teste</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      ${penTodas.length ? `<div class="note c-vig mt">Penalidades ativas nos testes: ${esc(penTodas.join(' · '))}</div>` : ''}`);
    const psi = d.attr.PSI.efetivo;
    const subs = win('Psicometria · sub-atributos', 'psi', `
      <p class="tx-s mb">Escolha apenas um dos dois sub-atributos para receber o valor completo de PSICOMETRIA; o outro recebe o reforço -3. <span class="t-dim">Ex.: PSICOMETRIA 4 → Inteligência +4 e Sapiência +1.</span></p>
      <div class="sub-cards">${['INT', 'SAP'].map(k => {
        const s = d.sub[k];
        return `<div class="sub-card ${s.principal ? 'on' : ''}" role="button" tabindex="0" data-act="psi-prim" data-a="${k}" data-fk="psi:${k}" aria-pressed="${s.principal}">
          <span class="chk c-psi"><input type="radio" tabindex="-1" ${s.principal ? 'checked' : ''} aria-hidden="true"></span>
          <div><div class="sn">${D.SUBATRIBUTOS[k].nome} ${s.principal ? tag('PRINCIPAL', 'psi') : tag('SECUNDÁRIO', 'mute', { o: true })}</div>
            <p class="tx-s">${esc(D.SUBATRIBUTOS[k].desc)}</p>
            <p class="tx-s t-dim">${esc(s.det.join(' · '))}</p></div>
          <div class="sv">${fmt(s.valor)}</div>
        </div>`;
      }).join('')}</div>
      <div class="row mt"><span class="tx-s">PSICOMETRIA atual: ${fmt(psi)}</span></div>`);
    const testes = win('Testes', 'yel', `
      <ul class="rules-mini c-yel">
        <li>Teste = <em>1d20 + [ATRIBUTO]</em>. Ex.: VIGOR 5 → +5 em testes de VIGOR.</li>
        <li><em>20 natural</em>: acerto crítico — sucesso pleno; em ataques, dano máximo.</li>
        <li><em>1 natural</em>: falha crítica — além da falha, o pior resultado da ação.</li>
        <li><em>Vantagem</em>: rola 2 dados e fica com o melhor · <em>Desvantagem</em>: fica com o pior.</li>
        <li><em>Porcentagem</em>: 1d100 abaixo da chance = sucesso; 1 = crítico; 100 = falha crítica.</li>
      </ul>
      <div class="df-grade mt" role="table" aria-label="Dificuldade e número mínimo no d20">${D.DIFICULDADES.map(x => `<div class="df-cel" role="row"><span role="cell">DF ${x.df}</span><b role="cell" aria-label="mínimo ${x.min}">${x.min}</b></div>`).join('')}</div>`);
    const det = win('Atributos em detalhe', 'dim', `<div class="stack">${D.ATRIBUTOS.map(a => `<div class="c-${a.cor}"><span class="t-c" style="font-size:1.3rem">${a.nome}</span> <span class="t-dim">— ${esc(a.resumo)}</span><p class="tx-s">${hl(a.usos)}</p></div>`).join('')}</div>`);
    return `<div class="grid g-main"><div>${dist}${subs}</div><div>${testes}${det}</div></div>`;
  };

  /* ---------------- 3. PROFISSÃO / CLASSE ---------------- */
  const equipTexto = o => o.equipTexto || (o.equip || []).map(e => (e.qtd > 1 ? e.qtd + 'x ' : '') + e.nome).join(', ') || 'Nenhum';
  UI.equipTexto = equipTexto;

  function habilidadeHTML(h, cor) {
    return `<div class="abil c-${cor || 'acc'}"><h4>${esc(h.nome)} ${tag(h.tipo, 'yel')}</h4><p class="tx">${hl(h.desc)}</p></div>`;
  }
  UI.habilidadeHTML = habilidadeHTML;

  T.origem = function (app) {
    const { c, d } = app;
    const passado = c.modulo === 'passado';
    const lista = passado ? D.CLASSES : D.PROFISSOES;
    const atualId = R.origemId(c);
    const termo = d.termo;
    const o = d.origem;
    let sel;
    if (!d.origemEscolhida) {
      sel = `<p class="tx">Nenhuma ${termo.toLowerCase()} escolhida ainda. ${passado ? 'Nesta extensão as Classes substituem as Profissões.' : 'Todo Perito precisa escolher uma profissão — ela modifica seus testes.'}</p>`;
    } else if (!o) {
      sel = `<p class="tx">Sem ${termo.toLowerCase()}. O Perito não recebe bônus, equipamento nem dinheiro inicial de ${termo.toLowerCase()}.</p>`;
    } else {
      const dinheiroFixo = !o.dinheiro || o.dinheiro === '0';
      sel = `<div class="sel-origem">
        <div>
          <h3 class="t-acc" style="font-weight:400;font-size:2rem;margin:0 0 6px">${esc(o.nome)}</h3>
          ${o.desc ? `<p class="tx mb">${hl(o.desc)}</p>` : ''}
          <table class="tbl c-acc"><tbody>
            <tr><td class="t-dim">Bônus</td><td>${hl(o.bonusTexto)}</td></tr>
            <tr><td class="t-dim">Equipamento</td><td>${esc(equipTexto(o))}</td></tr>
            <tr><td class="t-dim">Dinheiro inicial</td><td class="t-yel">${esc(o.dinheiro)}</td></tr>
          </tbody></table>
          ${(d.situacionais.length || d.vantagemOrigem.length) ? `<div class="note mt">Bônus situacionais (use no rolador): ${esc([...d.vantagemOrigem.map(k => 'Vantagem em ' + D.ATTR[k].nome), ...d.situacionais.map(s => s.txt)].join(' · '))}</div>` : ''}
          ${o.conjuntoPalavras ? `<div class="note c-eso mt">+${o.conjuntoPalavras} Conjunto de Palavras adicionado ao repertório (aba Revelações) — as palavras são reveladas pelo Espectador.</div>` : ''}
        </div>
        <div class="stack">
          <div class="win-sub">Rolagens iniciais</div>
          ${dinheiroFixo ? `<p class="tx-s">Dinheiro inicial: <span class="t-yel">${esc(o.dinheiro || '0')}</span>.</p>` : `
          <div class="row-b"><label class="fld"><span class="fld-l">Dinheiro (${esc(o.dinheiro)})</span>${inp('rolagens.dinheiro', c.rolagens.dinheiro, { t: 'intn', cls: 'in-num', aria: 'Dinheiro inicial' })}</label>${c.rolagens.dinheiro == null ? btn('Rolar ' + o.dinheiro, 'roll-dinheiro', { cls: 'btn-pri' }) : ''}</div>`}
          ${o.folegoDado ? `<div class="row-b"><label class="fld"><span class="fld-l">Fôlego extra (${esc(o.folegoDado)})</span>${inp('rolagens.atleta', c.rolagens.atleta, { t: 'intn', cls: 'in-num', aria: 'Fôlego extra' })}</label>${btn('Rolar ' + o.folegoDado, 'roll-atleta', { cls: c.rolagens.atleta == null ? 'btn-pri' : '' })}</div>` : ''}
          ${(o.equip || []).length ? `<p class="tx-s">O equipamento inicial foi colocado no inventário (aba Equipamento). Trocar de ${termo.toLowerCase()} substitui esses itens.</p>` : ''}
          ${d.habilidades.length ? `<div class="win-sub">Habilidade${d.habilidades.length > 1 ? 's' : ''}</div>${d.habilidades.map(h => habilidadeHTML(h, 'yel')).join('')}` : ''}
        </div>
      </div>`;
    }
    const q = (app.ui.origemBusca || '').trim().toLowerCase();
    const filtrados = lista.filter(p => !q || (p.nome + ' ' + p.bonusTexto + ' ' + equipTexto(p)).toLowerCase().includes(q));
    const cards = [].concat(filtrados.map(p => `<div class="card ${atualId === p.id ? 'on' : ''}" role="button" tabindex="0" data-act="origem-set" data-a="${p.id}" data-fk="origem:${p.id}" aria-pressed="${atualId === p.id}">
        <h3>${esc(p.nome)}</h3>
        ${p.desc ? `<p class="tx-s">${esc(p.desc)}</p>` : ''}
        <div class="kv"><span>BÔNUS</span><span>${hl(p.bonusTexto)}</span><span>EQUIP.</span><span>${esc(equipTexto(p))}</span><span>$</span><span class="t-yel">${esc(p.dinheiro)}</span></div>
      </div>`)).join('');
    const conteudoLista = `
      ${passado ? `<p class="tx mb">${esc(D.PASSADO.classesIntro)}</p>` : `<p class="tx mb">Um Perito, assim como qualquer pessoa em nossa sociedade precisa contribuir de algum modo, ou não! Segue uma lista de Profissões para o Perito que modificam seus testes:</p>`}
      <div class="row mb"><label class="fld grow" style="max-width:420px"><span class="fld-l">Buscar</span>${uiInp('origemBusca', app.ui.origemBusca, { type: 'search', ph: 'nome, atributo, item…' })}</label><span class="tx-s">${filtrados.length} de ${lista.length}</span></div>
      <div class="cards">${cards}</div>`;
    // No celular, depois de escolher, a lista longa fica recolhida para não poluir a tela.
    const recolher = UI.mobile() && d.origemEscolhida;
    const listaWin = win(`${d.modulo.termoPlural} ${passado ? '· Em um Passado Distante' : '· Livro do Jogador'}`, passado ? 'yel' : 'cyan', recolher
      ? `<details class="troca-origem" data-open-key="origem-lista"${app.ui.open.has('origem-lista') ? ' open' : ''}><summary>Trocar de ${esc(termo.toLowerCase())} · ${lista.length} opções</summary>${conteudoLista}</details>`
      : conteudoLista);
    return win(`${termo} selecionada`, 'acc', sel) + listaWin;
  };

  /* ---------------- 4. CORPO ---------------- */
  const NOME_CURTO = { cabeca: 'Cabeça', tronco: 'Tronco', bracoE: 'Braço E.', bracoD: 'Braço D.', pernaE: 'Perna E.', pernaD: 'Perna D.' };
  T.corpo = function (app) {
    const { c, d } = app;
    const parts = D.MEMBROS.map(m => {
      const x = d.membros[m.id];
      const cls = x.perdido ? 'lost' : x.atual <= 0 ? 'zero' : x.atual < x.max ? 'hurt' : '';
      return `<div class="part ${cls}" style="grid-area:${m.id}" role="group" aria-label="${esc(m.nome)}: ${x.atual} de ${x.max}">
        <div class="part-h"><b><span class="pn-l">${esc(m.nome)}</span><span class="pn-c" aria-hidden="true">${esc(NOME_CURTO[m.id] || m.nome)}</span></b><span class="tx-s part-f" title="${esc(x.det.join(' · '))}">${esc(m.formula)}</span></div>
        <div class="row between part-v"><div class="part-hp">${x.atual}<small>/${x.max}</small></div>${stepInp('vida', m.id, `vida.${m.id}`, x.atual, { aria: `Vida atual: ${m.nome}` })}</div>
        ${bar(pct(Math.max(0, x.atual), x.max), 'vig', { label: `${m.nome} ${x.atual} de ${x.max}` })}
        <div class="part-meta"><span class="arm">${x.armadura ? esc(x.armadura.nome) : 'sem armadura'}</span><span>RD ${x.rd}</span><span>DEF ${x.defesa == null ? '—' : x.defesa + '%'}</span></div>
        <div class="row between part-a">${chk(`perdidos.${m.id}`, x.perdido, m.id === 'cabeca' ? 'Arrancada' : 'Perdido', { cls: 'c-vig' })}${x.atual !== x.max ? btn('Restaurar', 'vida-full', { a: m.id, cls: 'btn-s btn-ok' }) : ''}</div>
      </div>`;
    }).join('');
    const vida = win('Vida por membro', 'vig', `
      <div class="doll">${parts}</div>
      ${d.morte ? `<div class="death">☠ MORTE — ${esc(d.morte)}</div>` : ''}
      <div class="row between mt">
        <p class="tx-s grow" style="max-width:560px">A morte ocorre em dois casos: se a cabeça do perito for arrancada ou se a vida do tronco for completamente removida. ${d.has('couro-endurecido') ? '<span class="t-acu">Couro Endurecido: +3 na Vida de cada membro.</span>' : ''}</p>
        <div class="row">${btn('Restaurar tudo', 'vida-full', { a: 'all', cls: 'btn-ok' })}</div>
      </div>
      <details class="mt"${app.ui.open.has('vida-ajustes') ? ' open' : ''} data-open-key="vida-ajustes"><summary class="lbl" style="cursor:pointer">+ Ajustes manuais de Vida máxima</summary>
        <div class="grid g3 mt-s">${fld('Todos os membros', 'ajustes.vidaTodos', c.ajustes.vidaTodos, { t: 'int' })}${D.MEMBROS.map(m => fld(m.nome, `ajustes.vida.${m.id}`, c.ajustes.vida[m.id], { t: 'int' })).join('')}</div>
        <p class="tx-s mt-s">Use para efeitos do Espectador ou do Nó Limiar Rompido. Ganhos de nível marcados como "+ Máximo" já somam em todos os membros.</p>
      </details>`);

    const df = d.defesa;
    const defesa = win('Defesa', 'psi', `
      <div class="formula">2d4 <span class="t-psi">[${df.rolagem == null ? '?' : df.rolagem}]</span><span class="op">×</span>VIGOR de criação <span class="t-vig">[${fmt(df.vigCriacao)}]</span><span class="op">=</span><span class="huge t-psi" style="font-size:2.4rem">${df.base == null ? '—' : df.base + '%'}</span></div>
      ${df.bruto != null && df.bruto < 0 ? '<p class="tx-s t-raz">VIGOR de criação negativo: a chance de Defesa fica em 0%.</p>' : ''}
      <div class="row-b mt"><label class="fld"><span class="fld-l">Rolagem 2d4</span>${inp('rolagens.defesa', df.rolagem, { t: 'intn', cls: 'in-num', aria: 'Rolagem 2d4 da Defesa' })}</label>${df.rolagem == null ? btn('Rolar 2d4', 'roll-defesa', { cls: 'btn-pri' }) : ''}<label class="fld"><span class="fld-l">Ajuste</span>${inp('ajustes.defesa', c.ajustes.defesa, { t: 'int', cls: 'in-num' })}</label></div>
      <p class="tx-s mt">Ao receber um ataque, teste de porcentagem com a Defesa da parte atingida: sucesso = metade do dano; sucesso crítico = apenas ¼. Armaduras equipadas somam Defesa na sua parte do corpo.</p>
      <div class="tbl-wrap mt"><table class="tbl c-psi"><thead><tr><th>Parte</th><th>Armadura</th><th class="num">RD</th><th class="num">Defesa</th><th></th></tr></thead><tbody>
        ${D.MEMBROS.map(m => { const x = d.membros[m.id]; return `<tr><td>${esc(m.nome)}</td><td class="${x.armadura ? 't-psi' : 't-mute'}">${x.armadura ? esc(x.armadura.nome) : '—'}</td><td class="num">${x.rd}</td><td class="num">${x.defesa == null ? '—' : x.defesa + '%'}</td><td class="num">${btn('d100', 'roll-def-pct', { a: m.id, cls: 'btn-s', dis: x.defesa == null })}</td></tr>`; }).join('')}
      </tbody></table></div>`);

    const f = d.folego;
    const mv = d.mov;
    const folego = win('Fôlego', 'cyan', `
      <div class="row between">
        <div class="san-big"><span class="huge t-cyan">${f.atual}</span><span class="big t-dim">/${f.max}</span></div>
        ${stepInp('folego', 'x', 'folego', f.atual, { aria: 'Fôlego atual' })}
      </div>
      ${bar(pct(f.atual, f.max), 'cyan', { lg: true, label: `Fôlego ${f.atual} de ${f.max}` })}
      <p class="tx-s mt-s" title="${esc(f.det.join(' · '))}">Máximo: ${esc(f.det.join(' + '))}${f.pendente ? ' <span class="t-raz">(role o Fôlego extra)</span>' : ''}</p>
      <div class="qa mt">
        ${btn(`Correr ${mv.corrida}m (-1)`, 'folego-acao', { a: 'correr', dis: f.atual < 1 })}
        ${btn(`Pular/escalar (-${mv.pulo})`, 'folego-acao', { a: 'pular', dis: f.atual < mv.pulo })}
        ${btn(`15 min (+${mv.recupera})`, 'folego-acao', { a: 'recuperar', cls: 'btn-ok' })}
        ${d.has('meditacao-ativa') ? btn('Meditar 5 min (+2)', 'folego-acao', { a: 'meditar', cls: 'btn-ok' }) : ''}
        ${btn('Descanso 1h+', 'folego-acao', { a: 'descanso', cls: 'btn-ok' })}
      </div>
      <div class="row-b mt"><label class="fld"><span class="fld-l">Teste de força · DF</span>${uiInp('forcaDF', app.ui.forcaDF, { num: true, cls: 'in-num', aria: 'Dificuldade do teste de força' })}</label>${btn('Pagar em Fôlego', 'folego-acao', { a: 'forca' })}<span class="tx-s">Custo: ${esc(mv.forca)}</span></div>
      <ul class="rules-mini c-cyan mt">
        <li>1 Ponto de Fôlego = correr <em>${mv.corrida}m</em> sem teste · pular/escalar custa <em>${mv.pulo}</em>.</li>
        <li>Recupera <em>${mv.recupera}</em> a cada 15 minutos, sem precisar de descanso.</li>
        <li>Ao zerar: <em>Exaustão</em> (-[VIGOR] em todos os testes) e descanso de ${d.has('maquina-sem-descanso') ? '— dispensado (Máquina sem Descanso)' : '1 ou mais horas'}.</li>
      </ul>`);

    const ini = d.iniciativa;
    const combate = win('Combate', 'raz', `
      <ul class="rules-mini c-raz">
        <li>Iniciativa: <em>d20 + [ACUIDADE]</em>${ini.reflexos ? ' (+2 com Reflexos Afiados)' : ''}; do maior para o menor.</li>
        <li>Por turno: <em>1 Ação + 1 Ação Bônus</em> OU um turno de Movimentação (<em>${mv.turno}m</em> sem Fôlego ou testes).</li>
        <li>Combater, defender ou esquivar: teste de acerto com <em>ACUIDADE</em>; depois o dano, se acertar.</li>
        <li>Contra-ação do Perito: <em>DF${d.contra.df}</em>${d.contra.dfRazao !== 5 ? ` (DF${d.contra.dfRazao} usando RAZÃO)` : ''} · do oponente: <em>DF${d.contra.dfInimigo}</em>. 20 natural: +1 Ação Bônus${d.has('janela-aberta') ? ' (+2 com Janela Aberta)' : ''}.</li>
        <li>Defender: teste de ACUIDADE, depois VIGOR <em>DF6</em>${d.has('bloqueio-perfeito') ? ' (+2, Bloqueio Perfeito)' : ''} → metade do dano; crítico${d.has('defesa-absoluta') ? ' ou sucesso (Defesa Absoluta)' : ''} anula o dano.</li>
        <li>Locomoção: até 5m sem teste; além disso, VIGOR DF1 + metros extras${mv.marcha ? ' — ignorado (Marcha Infinita)' : ''}.</li>
        <li>+[VIGOR] de dano com armas cegas ou desarmado${d.has('esmagamento-critico') ? ' (dobrado no crítico)' : ''}. O livro não define o dado base do ataque desarmado: combine com o Espectador.</li>
        <li>Equipar ou desequipar itens gasta um turno. Um Perito pode testar ACUIDADE para impedir a perda de um aliado.</li>
      </ul>`);
    const descanso = win('Descanso e sono', 'acu', `
      <div class="win-sub">Descansar · recupera Vida</div>
      <div class="qa">${D.DESCANSOS.map(x => btn(`${x.nome.replace('Descanso ', '')} (${x.vida})`, 'descanso', { a: x.id, cls: 'btn-ok' })).join('')}</div>
      <div class="win-sub">Dormir · recupera Vida e Sanidade</div>
      <div class="qa">${D.SONOS.map(x => btn(`${x.nome.replace('Sono ', '')} (${x.vida} / ${x.san})`, 'sono', { a: x.id, cls: 'btn-ok' })).join('')}</div>
      <ul class="rules-mini c-acu mt">
        <li>A Vida recuperada vale para todos os membros (até o máximo de cada um).</li>
        <li>Dormir faz os dias passarem. Descanso e Sono <em>não</em> recebem modificadores de atributo.</li>
      </ul>`);
    return `<div class="grid g-main"><div>${vida}${combate}</div><div>${defesa}${folego}${descanso}</div></div>`;
  };

  /* ---------------- 5. MENTE ---------------- */
  T.mente = function (app) {
    const { c, d } = app;
    const s = d.sanidade;
    const insano = c.status.insano;
    const sanidade = win('Sanidade', 'raz', `
      <div class="row between">
        <div class="san-big ${s.atual != null && s.atual < 0 ? 'neg' : ''}"><span class="huge">${s.atual == null ? '—' : s.atual}</span><span class="big t-dim">/${s.max == null ? '?' : s.max}</span></div>
        ${s.max != null ? stepInp('san', 'x', 'sanidade', s.atual, { aria: 'Sanidade atual' }) : ''}
      </div>
      ${barSan(s, { lg: true, label: 'Sanidade' })}
      <div class="row-b mt"><label class="fld"><span class="fld-l">1d6 da criação</span>${inp('rolagens.sanidade', s.rolagem, { t: 'intn', cls: 'in-num', aria: 'Rolagem 1d6 da Sanidade' })}</label>${s.rolagem == null ? btn('Rolar 1d6', 'roll-sanidade', { cls: 'btn-pri' }) : ''}<label class="fld"><span class="fld-l">Ajuste máx.</span>${inp('ajustes.sanidade', c.ajustes.sanidade, { t: 'int', cls: 'in-num' })}</label></div>
      <p class="tx-s mt-s">${s.det.length ? esc(s.det.join(' · ')) : 'Fórmula: [RAZÃO] + 1d6 = Sanidade Total (mínimo 2).'}</p>
      ${insano ? `<div class="note c-vig mt">INSANO: ${d.has('loucura-restauradora') ? 'golpes mentais curam 1d6 de Vida (Loucura Restauradora).' : 'toma 2x dano de Sanidade.'}${c.lucidezPendente ? ' Próximo golpe mental sem o 2x (Lucidez Corrompida).' : ''}</div>` : (s.atual === 0 && s.max != null ? '<div class="note c-raz mt">Em 0: o próximo dano de Sanidade exige novo teste de RAZÃO (Corda da Loucura).</div>' : '')}
      <div class="win-sub c-raz">Dano e recuperação</div>
      <div class="row-b"><label class="fld"><span class="fld-l">Dano (nº ou dado)</span>${uiInp('sanDano', app.ui.sanDano, { cls: 'in-num', ph: '1', aria: 'Dano de sanidade' })}</label>${uiChk('sanRitual', app.ui.sanRitual, 'Ritual (não conta p/ Conhecimento)', { cls: 'c-raz' })}${btn('Sofrer dano', 'san-dano', { cls: 'btn-x', dis: s.max == null })}</div>
      <div class="row-b mt-s"><label class="fld"><span class="fld-l">Recuperar (nº ou dado)</span>${uiInp('sanCura', app.ui.sanCura, { cls: 'in-num', ph: '1d6', aria: 'Recuperação de sanidade' })}</label>${btn('Recuperar', 'san-cura', { cls: 'btn-ok', dis: s.max == null })}${btn('Restaurar tudo', 'san-full', { cls: 'btn-ok', dis: s.max == null })}</div>
      ${c.sanMagia ? `<div class="note c-eso mt">${c.sanMagia} de Sanidade gasta em magias — restaurada ao fim do combate se você permanecer acima de 0. ${btn('Fim do combate', 'fim-combate', { cls: 'btn-s' })}</div>` : ''}
      <ul class="rules-mini c-raz mt">
        <li>Ao chegar em <em>0</em>: teste de RAZÃO para "Se Equilibrar na Corda da Loucura". Falhou: status Insano (2x dano de Sanidade).</li>
        <li>Exposto ao Indizível fora de combate: <em>-1 a cada 15 min</em>${d.has('sussurros-familiares') ? ' — ignorado (Sussurros Familiares)' : ''}. Em combate: <em>-1 por golpe de um Indizível</em>.</li>
        <li>Recupere Sanidade com sessões de terapia, sermões ou itens psicoativos.</li>
      </ul>`);

    const faixas = win('Faixas de sanidade', 'vig', `
      <div class="tbl-wrap"><table class="tbl band-tbl c-vig"><thead><tr><th>Faixa</th><th>Efeito</th></tr></thead><tbody>
        ${D.FAIXAS_SANIDADE.map(f => `<tr class="${s.faixa === f ? 'hi' : ''}"><td>${f.max} a ${f.min}</td><td>${esc(f.efeito)}${s.faixa === f ? ' <span class="tag c-vig">ATUAL</span>' : ''}</td></tr>`).join('')}
      </tbody></table></div>
      ${s.riscoDisturbio ? '<div class="note c-raz mt">Sanidade entre -5 e 1: se ficar assim por muito tempo (3 dias de jogo), corre o risco de desenvolver distúrbios mentais.</div>' : ''}
      ${d.notasPen.length ? `<p class="tx-s mt">${esc(d.notasPen.join(' · '))}</p>` : ''}`);

    const temCresc = d.has('crescimento-anomalo'), temClar = d.has('clareza-crescente'), temEpi = d.has('epifania');
    const nivRows = c.niveis.map((h, idx) => nivelRow(h, idx, d)).join('');
    const progresso = win('Conhecimento e nível', 'yel', `
      <div class="row between">
        <div><span class="lbl">Nível</span><div class="row">${step('nivel', 'x', c.nivel, { raw: true, decDis: c.nivel <= 0 })}</div></div>
        <div class="grow" style="max-width:360px"><span class="lbl">Conhecimento</span><div class="bar-row">${bar(c.conhecimento, 'yel', { lg: true })}${inp('conhecimento', c.conhecimento, { t: 'int', cls: 'in-num-s', aria: 'Conhecimento %' })}<span class="t-yel">%</span></div></div>
      </div>
      <div class="row mt"><span class="chip c-eso">Traços: ${d.tracos.disponiveis} disp. / ${d.tracos.total}</span><span class="chip c-yel">Revelação: ${d.revelacao}%</span>${d.revelacaoSonho ? '<span class="chip c-vio">Sonho: 5%</span>' : ''}${btn('Investir Traços', 'tab', { a: 'caminhos', cls: 'btn-s' })}</div>
      <p class="tx-s mt">Todo dano de Sanidade conta 1:1 para o Conhecimento (rituais não contam). Em 100%: o contador zera, +1 Traço de Revelação, +1 ponto de atributo e, por nível, +1d4 de Vida / +${esc(d.dadoSanNivel)} de Sanidade.</p>
      ${c.niveis.length ? `<div class="tbl-wrap mt"><table class="tbl lvl-tbl c-yel"><thead><tr><th class="num">Nv</th><th>Vida 1d4</th>${temCresc ? '<th>+1d4</th>' : ''}<th>Aplicar</th><th>Sanidade ${esc(d.dadoSanNivel)}</th>${temClar ? '<th>+1d4</th>' : ''}<th>Aplicar</th>${temEpi ? '<th>Epifania</th>' : ''}</tr></thead><tbody>${nivRows}</tbody></table></div>` : '<p class="tx-s mt t-dim">Nenhum nível ainda. Níveis chegam ao atingir 100% de Conhecimento.</p>'}`);

    const statusGrid = D.STATUS.map(st => {
      const auto = st.auto;
      const on = auto ? d.indicadores[st.id] : (st.id === 'atordoado' ? c.status.atordoado > 0 : !!c.status[st.id]);
      let ctrl;
      if (auto) ctrl = `<span class="chk c-${st.cor}"><input type="checkbox" disabled ${on ? 'checked' : ''} aria-label="${esc(st.nome)}"><span>${esc(st.nome)}</span></span><span class="auto">AUTOMÁTICO · pelos distúrbios</span>`;
      else if (st.id === 'atordoado') ctrl = `<div class="row between"><span class="t-c" style="font-size:1.25rem">${esc(st.nome)}</span>${step('atordoado', 'x', c.status.atordoado, { raw: true, decDis: c.status.atordoado <= 0, incDis: c.status.atordoado >= 3 })}</div>`;
      else ctrl = chk(`status.${st.id}`, on, esc(st.nome), { cls: `c-${st.cor}` });
      let extra = '';
      if (st.id === 'infeccao' && on) extra = `<label class="fld"><span class="fld-l">Membro infeccionado</span>${sel('status.infeccaoMembro', c.status.infeccaoMembro, [{ v: '', t: '—' }].concat(D.MEMBROS.map(m => ({ v: m.id, t: m.nome }))))}</label>`;
      if (st.id === 'amaldicoado' && on) extra = `<div class="row"><span class="tx-s">Turnos:</span>${step('amaldicoado', 'x', c.status.amaldicoadoTurnos, { raw: true, decDis: c.status.amaldicoadoTurnos <= 0 })}${c.status.amaldicoadoTurnos >= 3 ? '<span class="tag c-eso">3 TURNOS!</span>' : ''}</div>`;
      return `<div class="st c-${st.cor} ${on ? 'on' : ''}">${ctrl}<span class="tx-s">${hl(st.desc)}</span>${extra}</div>`;
    }).join('');
    const status = win('Status do Perito', 'psi', `<div class="status-grid">${statusGrid}</div>`);

    const di = c.disturbios;
    const DS = D.DISTURBIOS;
    const grauSel = (fam) => sel(`disturbios.${fam}`, di[fam], [{ v: '', t: 'Nenhuma' }].concat(DS[fam].graus.map(g => ({ v: g.id, t: g.nome }))), { aria: DS[fam].nome });
    const descGrau = fam => { const g = DS[fam].graus.find(x => x.id === di[fam]); return g ? `<p class="tx mt-s">${hl(g.desc)}</p>` : ''; };
    const disturbios = win('Distúrbios mentais', 'eso', `
      <div class="dist-fam"><h4><span>Depressão</span>${chk('disturbios.medicado.depressao', di.medicado.depressao, 'Medicado', { cls: 'c-acu' })}</h4>${grauSel('depressao')}${descGrau('depressao')}<p class="tx-s mt-s">Indicador: ${esc(DS.depressao.indicador)} · Tratamento: ${esc(DS.depressao.tratamento)}</p></div>
      <div class="dist-fam"><h4><span>Esquizofrenia</span>${chk('disturbios.medicado.esquizofrenia', di.medicado.esquizofrenia, 'Medicado', { cls: 'c-acu' })}</h4>
        <div class="row">${DS.esquizofrenia.tipos.map(t => chk(`disturbios.esquizofrenia.${t.id}`, di.esquizofrenia[t.id], t.nome, { cls: 'c-eso' })).join('')}</div>
        ${DS.esquizofrenia.tipos.filter(t => di.esquizofrenia[t.id]).map(t => `<p class="tx mt-s"><span class="t-eso">${t.nome}:</span> ${hl(t.desc)}</p>`).join('')}
        <p class="tx-s mt-s">Indicador: ${esc(DS.esquizofrenia.indicador)} · Tratamento: ${esc(DS.esquizofrenia.tratamento)}</p></div>
      <div class="dist-fam"><h4><span>Ansiedade</span>${chk('disturbios.medicado.ansiedade', di.medicado.ansiedade, 'Medicado', { cls: 'c-acu' })}</h4>${grauSel('ansiedade')}${descGrau('ansiedade')}<p class="tx-s mt-s">Indicador: ${esc(DS.ansiedade.indicador)} · Tratamento: ${esc(DS.ansiedade.tratamento)}</p></div>
      ${area('Outros distúrbios / tratamento', 'disturbios.outros', di.outros, { rows: 2, wrap: 'mt' })}
      <p class="tx-s mt">Os distúrbios podem ser tratados e ter seus efeitos reduzidos, alguns completamente curados se medicados corretamente e tratados em terapia. Um Perito pode ter mais de um distúrbio.</p>`);

    const ter = d.terapia;
    const terapia = win('Terapia, sermões e o LIMIAR', 'acu', `
      <ul class="rules-mini c-acu">
        <li>Sessão de terapia: só ao final de uma sessão de jogo, <em>${ter.plantao ? 'sem limite (Plantão Eterno)' : 'uma por sessão'}</em>, e só se alguém da party for profissional em psicologia. Restaura <em>1d6</em> por Perito.</li>
        ${ter.conduz ? `<li>Você conduz terapias: <em>${esc(ter.dado)}</em>${ter.empatia ? ', 1 e 2 viram 3 (Empatia Terapêutica)' : ''}${ter.grupo ? ', afeta 2 aliados (Terapia de Grupo)' : ''}${ter.auto ? ', pode aplicar em si mesmo (Autoanálise)' : ''}.</li>` : ''}
        <li>Ouvir sermões também recupera Sanidade (quantidade definida pelo Espectador).</li>
      </ul>
      <div class="row-b mt"><label class="fld"><span class="fld-l">Bônus do terapeuta</span>${uiInp('terBonus', app.ui.terBonus, { num: true, cls: 'in-num', ph: '0' })}</label>${btn('Receber terapia (1d6)', 'terapia', { cls: 'btn-ok', dis: s.max == null })}${ter.conduz ? btn(`Conduzir (${ter.dado})`, 'terapia-conduzir', { cls: 'btn-s' }) : ''}</div>
      <div class="win-sub c-acu">Interagindo com o LIMIAR</div>
      <p class="tx-s">Ver uma imagem do outro lado: <span class="t-raz">2d20</span> de dano de Sanidade${d.has('iluminacao-traumatica') ? ' — role 3d20 e descarte o maior (Iluminação Traumática)' : ''}. Permanecer perto de seres do LIMIAR: perde 1 ponto periodicamente.</p>
      <div class="qa mt-s">${btn('Imagem do LIMIAR', 'limiar-imagem', { cls: 'btn-x', dis: s.max == null })}${btn('Exposição (-1)', 'limiar-exposicao', { cls: 'btn-x', dis: s.max == null })}${btn('Golpe de Indizível (-1)', 'limiar-golpe', { cls: 'btn-x', dis: s.max == null })}</div>`);

    return `<div class="grid g-main"><div>${sanidade}${progresso}${status}</div><div>${faixas}${disturbios}${terapia}</div></div>`;
  };

  const dado0 = d => d.dadoSanNivel;
  function nivelRow(h, idx, d) {
    const cresc = d.has('crescimento-anomalo'), clar = d.has('clareza-crescente'), epi = d.has('epifania');
    const modo = key => sel(`niveis.${idx}.${key}`, h[key], [{ v: 'max', t: '+ Máximo' }, { v: 'cura', t: 'Recupera' }], { aria: 'Como aplicar' });
    const rot = { vida: 'Vida (1d4)', vidaExtra: 'Vida extra', san: `Sanidade (${dado0(d)})`, sanExtra: 'Sanidade extra' };
    const cel = (key, dado) => `<td data-label="${rot[key]}"><div class="row" style="flex-wrap:nowrap">${inp(`niveis.${idx}.${key}`, h[key], { t: 'intn', cls: 'in-num-s', aria: key })}${h[key] == null ? btn(dado, 'roll-nivel', { a: idx, b: key, cls: 'btn-s' }) : ''}</div></td>`;
    return `<tr><td class="num t-yel" data-label="Nível">${h.nivel}</td>${cel('vida', '1d4')}${cresc ? cel('vidaExtra', '1d4') : ''}<td data-label="Aplicar vida">${modo('vidaModo')}</td>${cel('san', d.dadoSanNivel)}${clar ? cel('sanExtra', '1d4') : ''}<td data-label="Aplicar sanidade">${modo('sanModo')}</td>${epi ? `<td data-label="Epifania">${h.epifania ? `<span class="t-acu">${esc(h.epifania)}</span>` : btn('d100', 'roll-epifania', { a: idx, cls: 'btn-s' })}</td>` : ''}</tr>`;
  }
  UI.nivelRow = nivelRow;

  /* ---------------- 6. EQUIPAMENTO ---------------- */
  const CAT = Object.fromEntries(D.CATEGORIAS_ITEM.map(x => [x.id, x]));
  const catDe = it => CAT[it.tipo] || (it.tipo === 'escolha' ? { id: 'escolha', curto: '???', cor: 'yel', nome: 'À escolha' } : CAT.item);

  function itemStats(it, d) {
    const p = [];
    if (it.tipo === 'cac' || it.tipo === 'dist') {
      const dano = danoDoItem(it);
      p.push(`Dano ${dano || '—'}${it.cega ? ' +VIGOR' : ''}`);
      if (it.tiros) p.push(it.tiros);
    }
    if (it.tipo === 'armadura') p.push(`${it.parte ? D.MEMBRO[it.parte].nome : 'parte?'} · RD ${it.rd} · Defesa +${it.defesa}`);
    if (it.efeito) p.push(it.efeito);
    if (it.notas) p.push(it.notas);
    return p.join(' · ');
  }
  function danoDoItem(it) {
    if (it.ref === 'objeto-cenario' && it.tamanho) {
      const t = D.CATALOGO_MAP['objeto-cenario'].tamanhos.find(x => x.id === it.tamanho);
      if (t) return t.dano;
    }
    return it.dano;
  }
  UI.danoDoItem = danoDoItem;
  UI.itemStats = itemStats;

  function itemRow(it, app) {
    const { d } = app;
    const cat = catDe(it);
    const permitidos = R.locaisPermitidos(it);
    const locais = D.LOCAIS.filter(l => permitidos.includes(l.id)).map(l => ({ v: l.id, t: l.nome }));
    const usavel = it.tipo === 'medicinal' || it.tipo === 'psicoativo' || it.tipo === 'consumivel';
    const arma = it.tipo === 'cac' || it.tipo === 'dist';
    const abrir = app.ui.open.has('it:' + it.id);
    let principal;
    if (it.tipo === 'escolha') {
      const lista = it.escolha === 'arma' ? D.CATALOGO.filter(x => x.cat === 'cac' || x.cat === 'dist') : D.CATALOGO.filter(x => x.cat === 'psicoativo');
      principal = `<div class="grow"><div class="nm t-yel">${esc(it.nome)}</div><select data-chg="item-escolher" data-a="${it.id}" aria-label="Escolher item"><option value="">— escolha —</option>${lista.map(x => `<option value="${x.id}">${esc(x.nome)}${x.dano ? ' (' + x.dano + ')' : ''}</option>`).join('')}</select></div>`;
    } else {
      principal = `<div class="grow"><div class="nm">${esc(it.nome)}${it.qtd > 1 ? ` <span class="t-yel">×${it.qtd}</span>` : ''}${it.origem === 'inicial' ? ` <span class="tx-s">(inicial)</span>` : ''}</div><div class="st2">${hl(itemStats(it, d))}</div></div>`;
    }
    return `<div class="item c-${cat.cor}">
      <div class="item-row">
        <span class="tag c-${cat.cor}" title="${esc(cat.nome)}">${cat.curto}</span>
        ${principal}
        <div class="item-loc">${sel(`itens#${it.id}.local`, it.local, locais, { aria: 'Local' })}${it.tipo === 'armadura' ? sel(`itens#${it.id}.parte`, it.parte, [{ v: '', t: 'parte?' }].concat(D.MEMBROS.map(m => ({ v: m.id, t: m.nome }))), { aria: 'Parte do corpo' }) : ''}</div>
        <div class="item-acts">
          ${usavel ? btn('Usar', 'item-usar', { a: it.id, cls: 'btn-s btn-ok' }) : ''}
          ${arma ? btn('Dano', 'item-dano', { a: it.id, cls: 'btn-s btn-w' }) + btn('Crít.', 'item-dano', { a: it.id, b: 'crit', cls: 'btn-s btn-w', title: 'Dano de acerto crítico (máximo)' }) : ''}
          ${btn('-', 'item-qtd', { a: it.id, b: -1, cls: 'btn-s', title: 'Diminuir quantidade' })}${btn('+', 'item-qtd', { a: it.id, b: 1, cls: 'btn-s', title: 'Aumentar quantidade' })}
          ${btn('×', 'item-del', { a: it.id, cls: 'btn-s btn-x', title: 'Remover item' })}
        </div>
      </div>
      ${it.tipo === 'escolha' ? '' : `<details${abrir ? ' open' : ''} data-open-key="it:${it.id}"><summary>EDITAR</summary><div class="item-edit">
        ${fld('Nome', `itens#${it.id}.nome`, it.nome)}
        <label class="fld"><span class="fld-l">Tipo</span>${sel(`itens#${it.id}.tipo`, it.tipo, D.CATEGORIAS_ITEM.map(x => ({ v: x.id, t: x.nome })))}</label>
        ${fld('Quantidade', `itens#${it.id}.qtd`, it.qtd, { t: 'int' })}
        ${arma ? fld('Dano', `itens#${it.id}.dano`, it.dano, { ph: '1d6' }) + fld('Tiros/turno', `itens#${it.id}.tiros`, it.tiros) + `<label class="fld"><span class="fld-l">Arma cega</span>${chk(`itens#${it.id}.cega`, it.cega, '+VIGOR no dano')}</label>` : ''}
        ${it.ref === 'objeto-cenario' ? `<label class="fld"><span class="fld-l">Tamanho</span>${sel(`itens#${it.id}.tamanho`, it.tamanho, D.CATALOGO_MAP['objeto-cenario'].tamanhos.map(t => ({ v: t.id, t: `${t.nome} (${t.dano})` })))}</label>` : ''}
        ${it.tipo === 'armadura' ? fld('RD', `itens#${it.id}.rd`, it.rd, { t: 'int' }) + fld('Defesa (+%)', `itens#${it.id}.defesa`, it.defesa, { t: 'int' }) : ''}
        ${fld('Efeito', `itens#${it.id}.efeito`, it.efeito, { wrap: 'wide' })}
        ${fld('Notas', `itens#${it.id}.notas`, it.notas, { wrap: 'wide' })}
      </div></details>`}
    </div>`;
  }

  T.equipamento = function (app) {
    const { c, d } = app;
    const inv = d.inv;
    const ct = inv.contagem;
    const slot = (label, it, color) => `<div class="slot ${it ? 'full' : ''} c-${it ? catDe(it).cor : color || 'dim'}"><span class="sl">${label}</span>${it ? `<span class="si t-c">${esc(it.nome)}${it.qtd > 1 ? ' ×' + it.qtd : ''}</span><span class="ss">${esc(itemStats(it, d))}</span>` : '<span class="ss">— vazio —</span>'}</div>`;
    const pl = inv.porLocal;
    const rapidos = pl.rapido.flatMap(i => Array(Math.min(i.qtd, 2)).fill(i)).slice(0, 2);
    const pertences = win('Pertences · no corpo', 'cyan', `
      <div class="slots">
        ${slot('Mão esquerda', pl.maoE[0])}${slot('Mão direita', pl.maoD[0])}
        ${[0, 1].map(k => slot(`Fácil acesso ${k + 1}/2`, rapidos[k])).join('')}
        ${[0, 1, 2].map(k => slot(`Acessório ${k + 1}/3`, pl.acessorio[k], 'yel')).join('')}
      </div>
      <div class="win-sub c-psi">Armaduras equipadas (1 por parte)</div>
      <div class="slots">${D.MEMBROS.map(m => slot(m.nome, inv.armaduraPorParte[m.id], 'psi')).join('')}</div>
      <p class="tx-s mt">Armaduras contam como Pertences só quando equipadas; removidas, voltam para a Bagagem. Até 3 acessórios, impossíveis de desequipar em combate. Equipar/desequipar gasta um turno.</p>`);

    const Lm = D.LIMITES_BAGAGEM;
    const over = (v, lim) => (v > lim ? 'over' : '');
    const grupos = [
      { t: 'Nas mãos', ids: ['maoE', 'maoD'] },
      { t: 'Armaduras equipadas', ids: ['armadura'] },
      { t: 'Consumíveis de fácil acesso', ids: ['rapido'] },
      { t: 'Acessórios equipados', ids: ['acessorio'] },
      { t: 'Bagagem · mochila', ids: ['bagagem'] },
      { t: 'Patrimônio · não carregado', ids: ['patrimonio'] }
    ];
    const listas = grupos.map(g => {
      const itens = g.ids.flatMap(id => pl[id]);
      if (!itens.length) return '';
      return `<div class="win-sub">${esc(g.t)} <span class="t-dim">(${itens.length})</span></div><div class="items">${itens.map(it => itemRow(it, app)).join('')}</div>`;
    }).join('');
    const inventario = win('Inventário', 'raz', `
      <div class="cap">
        <span class="${over(ct.bagArmas, Lm.armas)}">Bagagem · armas ${ct.bagArmas}/${Lm.armas}</span>
        <span class="${over(ct.bagCons, Lm.consumiveis)}">consumíveis ${ct.bagCons}/${Lm.consumiveis}</span>
        <span>armaduras ${D.MEMBROS.map(m => `<span class="${over(ct.bagArm[m.id], Lm.armaduraPorParte)}">${m.curto} ${ct.bagArm[m.id]}/${Lm.armaduraPorParte}</span>`).join(' ')}</span>
      </div>
      ${inv.avisos.length ? `<div class="note c-vig mb">${inv.avisos.map(esc).join('<br>')}</div>` : ''}
      ${listas || '<p class="tx t-dim">Inventário vazio. Crie itens no catálogo abaixo e use [+] para colocá-los aqui.</p>'}`);

    /* Catálogo do jogador: começa vazio e cresce com o que ele cria (salvo na ficha). */
    const q = (app.ui.catBusca || '').trim().toLowerCase();
    const meus = (c.catalogo || []).filter(x => !q || (x.nome + ' ' + (x.efeito || '') + ' ' + (x.dano || '')).toLowerCase().includes(q));
    const catDeTipo = t => CAT[t] || CAT.item;
    const tipoSel = app.ui.novoItemTipo || 'item';
    const arma = tipoSel === 'cac' || tipoSel === 'dist';
    const catalogo = win('Catálogo · 8. Listas', 'eso', `
      <div class="win-sub">Novo item</div>
      <div class="row-b">
        <label class="fld grow" style="max-width:300px"><span class="fld-l">Nome</span>${uiInp('novoItemNome', app.ui.novoItemNome, { ph: 'Ex.: Lanterna, Revólver .38…' })}</label>
        <label class="fld"><span class="fld-l">Tipo</span>${uiSel('novoItemTipo', tipoSel, D.CATEGORIAS_ITEM.map(x => ({ v: x.id, t: x.nome })))}</label>
        ${arma ? `<label class="fld" style="max-width:110px"><span class="fld-l">Dano</span>${uiInp('novoItemDano', app.ui.novoItemDano, { ph: '1d8' })}</label>` : ''}
        <label class="fld grow"><span class="fld-l">Efeito / notas</span>${uiInp('novoItemEfeito', app.ui.novoItemEfeito, { ph: 'Ex.: Recupera 1d4 de Vida.' })}</label>
        ${btn('Criar', 'catalogo-criar', { cls: 'btn-ok' })}
      </div>
      <div class="row between mt mb"><span class="tx-s">${(c.catalogo || []).length} item(ns) conhecido(s) por este Perito</span>
        ${(c.catalogo || []).length ? `<label class="fld" style="min-width:220px"><span class="fld-l">Buscar</span>${uiInp('catBusca', app.ui.catBusca, { type: 'search', ph: 'nome, efeito…' })}</label>` : ''}</div>
      <div class="cat-list">${meus.map(x => `<div class="cat-it c-${catDeTipo(x.tipo).cor}"><div><b>${esc(x.nome)}</b> <span class="tx-s">${esc(catDeTipo(x.tipo).nome)}</span>${x.dano ? ` <span class="t-raz">${esc(x.dano)}</span>` : ''}${x.efeito ? `<p class="tx-s">${hl(x.efeito)}</p>` : ''}</div><span class="row">${btn('+', 'catalogo-add', { a: x.id, cls: 'btn-s btn-ok', title: 'Adicionar ao inventário' })}${btn('×', 'catalogo-del', { a: x.id, cls: 'btn-s btn-x', title: 'Esquecer este item' })}</span></div>`).join('') ||
        `<p class="tx t-dim">${(c.catalogo || []).length ? 'Nada encontrado.' : 'Catálogo vazio. Crie os itens que o Perito for conhecendo — eles ficam salvos na ficha.'}</p>`}</div>`);

    const o = d.origem;
    const dinheiro = win('Dinheiro', 'yel', `
      <div class="row-b"><label class="fld"><span class="fld-l">Dinheiro atual</span>${inp('dinheiro', c.dinheiro == null ? c.rolagens.dinheiro : c.dinheiro, { t: 'intn', cls: 'in-big in-num', aria: 'Dinheiro atual' })}</label>
      <p class="tx-s grow">${o ? `Inicial de ${esc(o.nome)}: ${esc(o.dinheiro)}${c.rolagens.dinheiro != null ? ` (rolado: ${c.rolagens.dinheiro})` : ' — ainda não rolado'}.` : 'Sem dinheiro inicial definido.'}</p></div>`);
    return `<div class="grid g-main"><div>${inventario}</div><div>${pertences}${dinheiro}</div></div>${catalogo}`;
  };

  /* ---------------- 7. CAMINHOS ---------------- */
  T.caminhos = function (app) {
    const { c, d } = app;
    const atual = D.CAMINHO[app.ui.caminho] || D.CAMINHOS[0];
    const tabs = D.CAMINHOS.map(cm => {
      const n = cm.trilhas.reduce((s, t) => s + t.nos.filter(no => d.nos.has(no.id)).length, 0);
      return `<button type="button" class="path-tab c-${cm.cor}" role="tab" aria-selected="${cm.id === atual.id}" data-act="caminho" data-a="${cm.id}" data-fk="caminho:${cm.id}">${cm.num}. ${esc(cm.nome.replace('Caminho ', ''))} <small>${D.ATTR[cm.attr].nome} · ${n}/32</small></button>`;
    }).join('');
    const attrV = d.attr[atual.attr].valor;
    const tIdx = Math.max(0, Math.min(atual.trilhas.length - 1, Number(app.ui.trilha) || 0));
    const trilhaTabs = atual.trilhas.map((t, i) => {
      const n = t.nos.filter(no => d.nos.has(no.id)).length;
      return `<button type="button" class="trail-tab c-${atual.cor}" role="tab" aria-selected="${i === tIdx}" data-act="trilha" data-a="${i}" data-fk="trilha:${atual.id}:${i}">${esc(t.nome.replace(/^Trilha (d[aeo]s? )?/, ''))} <small>${n}/8</small></button>`;
    }).join('');
    const trilhas = [atual.trilhas[tIdx]].map(t => `<div class="trail c-${atual.cor}">${t.nos.map((no, i) => {
      const st = R.statusNo(c, d, no.id);
      const ref = st.ref;
      const invalido = st.estado === 'owned' && d.nosInvalidos.some(x => x.id === no.id);
      const reqAttr = ref.req ? `<span class="tag ${attrV >= ref.req ? '' : 'tag-o '}c-${AC[atual.attr]}">${D.ATTR[atual.attr].nome.slice(0, 3)} ${ref.req}+</span>` : '';
      let acao = '';
      if (st.estado === 'owned') acao = st.podeRemover ? btn('Remover', 'no-del', { a: no.id, cls: 'btn-s btn-x' }) : '<span class="tx-s">adquirido</span>';
      else if (st.estado === 'available') acao = btn('Adquirir', 'no-add', { a: no.id, cls: 'btn-s btn-c' });
      return `<div class="node ${st.estado}${invalido ? ' invalid' : ''}">
        <div class="node-h"><b data-n="${i + 1}.">${esc(no.nome)}</b><span class="node-req"><span class="tag ${c.nivel >= ref.nv ? '' : 'tag-o '}c-yel">NV ${ref.nv}</span>${reqAttr}</span></div>
        <p class="tx-s">${hl(no.desc)}</p>
        ${st.estado === 'locked' ? `<span class="node-why">${esc(st.motivos.join(' · '))}</span>` : ''}
        ${invalido ? `<span class="node-why t-vig">Requisito perdido: ${esc(st.motivos.join(' · '))}</span>` : ''}
        ${acao ? `<div class="node-acts">${acao}</div>` : ''}
      </div>`;
    }).join('')}</div>`).join('');
    const possuidos = [...d.nos].map(id => D.NOS[id]);
    const resumo = possuidos.length ? D.CAMINHOS.map(cm => {
      const meus = possuidos.filter(r => r.caminho.id === cm.id);
      if (!meus.length) return '';
      return `<div class="c-${cm.cor}"><div class="t-c" style="font-size:1.3rem">${esc(cm.nome)}</div>${meus.map(r => `<p class="tx-s"><span class="t-c">${esc(r.no.nome)}</span> <span class="t-mute">(${esc(r.trilha.nome.replace('Trilha ', ''))}, Nv ${r.nv})</span> — ${hl(r.no.desc)}</p>`).join('')}</div>`;
    }).join('') : '<p class="tx t-dim">Nenhum Nó adquirido. Cada nível (100% de Conhecimento) dá 1 Traço de Revelação para comprar 1 Nó.</p>';
    return win('Os 5 Caminhos do Indizível', 'eso', `
      <div class="row between mb">
        <div class="row"><span class="chip c-eso">Traços disponíveis: ${d.tracos.disponiveis}</span><span class="chip c-yel">Nível ${c.nivel}</span><span class="chip c-cyan">Nós: ${d.nos.size}</span><span class="chip c-yel">Revelação: ${d.revelacao}%</span></div>
        <p class="tx-s" style="max-width:560px">Dentro de uma Trilha a ordem é obrigatória. Cada Nó exige um Nível mínimo; os Nós 5–6 exigem 3+ no atributo do Caminho e os Nós 7–8 exigem 5+.</p>
      </div>
      <div class="path-tabs" role="tablist">${tabs}</div>
      <div class="row mb"><span class="t-${AC[atual.attr]}" style="font-size:1.5rem">${esc(atual.nome)}</span><span class="tx-s">Atributo: ${D.ATTR[atual.attr].nome} ${fmt(attrV)}</span></div>
      <div class="trail-tabs" role="tablist">${trilhaTabs}</div>
      <div class="tree tree-one">${trilhas}</div>`) +
      win('Nós adquiridos', 'yel', `<div class="owned-list">${resumo}</div>`);
  };

  /* ---------------- 8. REVELAÇÕES ---------------- */
  T.revelacoes = function (app) {
    const { c, d } = app;
    const mg = d.magia;
    const rev = win('Revelações', 'yel', `
      <div class="row between">
        <div class="row"><span class="chip c-yel">Iluminação: ${d.revelacao}%</span>${btn('Rolar d100', 'roll-revelacao', { cls: 'btn-s' })}</div>
        <div class="row"><span class="chip c-vio">Sonho (Conhecimento > 75%): ${d.revelacaoSonho || 0}%</span>${btn('Rolar d100', 'roll-sonho', { cls: 'btn-s', dis: !d.revelacaoSonho })}</div>
      </div>
      <p class="tx-s mt">Ao receber uma iluminação, a chance de aprender uma Magia ou Ritual é 25%, +5% por Traço investido nos Caminhos (máximo 65%). O Perito jamais escolhe o que lhe é revelado: o Espectador explica o efeito, a duração, o preparo e os itens — anote tudo aqui.</p>`);

    const tiposPal = [['verbal', 'Verbais'], ['poder', 'Poder'], ['impulso', 'Impulso']];
    const colunas = tiposPal.map(([tipo, nome]) => `<div class="words-col">
        <div class="win-sub">${nome} · ${c.palavras.filter(p => p.tipo === tipo).length}</div>
        ${[1, 2, 3, 4, 5].map(cl => {
          const n = c.palavras.filter(p => p.tipo === tipo && Number(p.classe) === cl).length;
          return `<div class="row-b words-row"><span class="tx-s">Classe ${cl}</span><span class="row">${btn('-', 'palavra-qtd', { a: tipo, b: cl + ':-1', cls: 'btn-s', dis: !n })}<b class="t-eso words-n">${n}</b>${btn('+', 'palavra-qtd', { a: tipo, b: cl + ':1', cls: 'btn-s' })}</span></div>`;
        }).join('')}
      </div>`).join('');
    const palavras = win('Repertório de palavras', 'eso', `
      <div class="row mb"><span class="chip c-yel">Conjuntos: ${mg.conjuntos}</span><span class="chip c-eso">Verbais ${mg.nV}</span><span class="chip c-eso">Poder ${mg.nP}</span><span class="chip c-eso">Impulso ${mg.nI}</span>${mg.truncado ? '<span class="chip c-acu">Verbo Truncado: Impulso dispensado</span>' : ''}</div>
      ${mg.desequilibrado && c.palavras.length ? '<div class="note c-raz mb">A quantidade de cada tipo de palavra deve ser a mesma: com 3 Verbais, são necessárias 3 de Poder e 3 de Impulso.</div>' : ''}
      <div class="words-grid">${colunas}</div>
      <div class="row mt">${btn('+ Conjunto (V+P+I)', 'palavra-conjunto')}</div>
      <p class="tx-s mt">Toda magia tem no mínimo 3 palavras: 1 Verbal, 1 de Poder e 1 de Impulso. Cada conjunto custa em Sanidade o valor da palavra mais cara (classe 1 a 5).</p>`);

    const classes = [1, 2, 3, 4, 5].map(n => ({ v: n, t: String(n) }));
    const magias = win('Magias', 'vio', `
      ${c.magias.map(m => {
        const cu = R.custoMagia(m, d);
        const gat = [{ v: 'palavras', t: 'Palavras' }, { v: 'mantra', t: 'Mantra' }, { v: 'livro', t: 'Livro' }, { v: 'objeto', t: 'Objeto/relíquia' }, { v: 'outro', t: 'Outro' }];
        return `<div class="spell">
          <div class="spell-grid">
            ${fld('Nome', `magias#${m.id}.nome`, m.nome, { wrap: 's2', ph: 'Spawn Blood Barrier' })}
            <label class="fld"><span class="fld-l">Palavra + cara</span>${sel(`magias#${m.id}.classe`, m.classe, classes, { t: 'int' })}</label>
            ${fld('Conjuntos (preço)', `magias#${m.id}.conjuntos`, m.conjuntos, { t: 'int' })}
            <label class="fld s2"><span class="fld-l">Gatilho</span>${sel(`magias#${m.id}.gatilho`, m.gatilho, gat)}</label>
            ${fld('Duração', `magias#${m.id}.duracao`, m.duracao, { wrap: 's2' })}
            ${area('Efeito', `magias#${m.id}.efeito`, m.efeito, { wrap: 's6', rows: 2 })}
            ${fld('Notas', `magias#${m.id}.notas`, m.notas, { wrap: 's6' })}
          </div>
          <div class="spell-foot">
            <span class="chip c-raz">Custo: ${cu.total} SAN${cu.barganha ? ' (Barganha -1)' : ''}</span>
            <span class="chip c-cyan">${cu.turnos} turno(s)</span>
            ${m.gatilho === 'mantra' || m.gatilho === 'livro' ? '<span class="chip c-acu">Isenta de repertório</span>' : ''}
            <span class="grow"></span>
            ${btn('Conjurar', 'magia-conjurar', { a: m.id, cls: 'btn-pri' })}${btn('Remover', 'magia-del', { a: m.id, cls: 'btn-s btn-x' })}
          </div>
        </div>`;
      }).join('') || '<p class="tx t-dim">Nenhuma magia anotada.</p>'}
      <div class="row mt">${btn('+ Magia', 'magia-add')}</div>
      <ul class="rules-mini c-vio mt">
        <li>Mais conjuntos = mais turnos e mais custo. Cada conjunto extra: <em>+${esc(mg.bonusDado)}</em> no efeito.</li>
        <li>SAN gasta em magias volta ao fim do combate, se o conjurador ficar acima de 0${mg.emprestimo ? ' (Empréstimo Profano: pode ficar abaixo de 0 ao conjurar)' : ''}.</li>
        <li>Magias de mantra ou livro dispensam o repertório de palavras.${mg.eco ? ' Eco Persistente: duração dobrada.' : ''}</li>
      </ul>`);

    const rituais = win('Rituais', 'eso', `
      ${c.rituais.map(r => {
        const ri = R.ritualInfo(r, d);
        return `<div class="spell">
          <div class="spell-grid">
            ${fld('Nome', `rituais#${r.id}.nome`, r.nome, { wrap: 's3', ph: 'Coroação' })}
            ${fld('Nível', `rituais#${r.id}.nivel`, r.nivel, { t: 'int' })}
            ${fld('Custo SAN (fixo)', `rituais#${r.id}.custo`, r.custo, { t: 'int', wrap: 's2' })}
            ${area('Etapas (uma por linha, em ordem)', `rituais#${r.id}.etapas`, r.etapas, { wrap: 's3', rows: 4 })}
            ${area('Componentes', `rituais#${r.id}.componentes`, r.componentes, { wrap: 's3', rows: 4, ph: 'giz ritualístico, sangue, objeto de valor sentimental…' })}
            ${area('Efeito', `rituais#${r.id}.efeito`, r.efeito, { wrap: 's4', rows: 2 })}
            ${fld('Duração', `rituais#${r.id}.duracao`, r.duracao, { wrap: 's2' })}
            ${fld('Notas', `rituais#${r.id}.notas`, r.notas, { wrap: 's6' })}
          </div>
          <div class="spell-foot">
            <span class="chip c-cyan">Preparo: ${ri.tempo} min${ri.rapido ? ' (Canalização Rápida)' : ''} · Nível ${esc(ri.faixa)}</span>
            <span class="chip c-raz">Custo: ${ri.custo} SAN${ri.acima && ri.alem ? ' (dobro: Conhecimento Além)' : ''}</span>
            ${ri.acima ? `<span class="chip c-vig">${ri.alem ? 'Acima do seu ESOTERISMO' : 'Perigo: nível acima do seu ESOTERISMO'}</span>` : ''}
            <span class="grow"></span>
            ${btn('Realizar', 'ritual-realizar', { a: r.id, cls: 'btn-pri' })}${btn('Remover', 'ritual-del', { a: r.id, cls: 'btn-s btn-x' })}
          </div>
        </div>`;
      }).join('') || '<p class="tx t-dim">Nenhum ritual anotado.</p>'}
      <div class="row mt">${btn('+ Ritual', 'ritual-add')}</div>
      <ul class="rules-mini c-eso mt">
        <li>O sucesso não depende de teste: depende da execução correta de cada etapa, na ordem${d.has('ordem-corrompida') ? ' (Ordem Corrompida: tolera 1 erro)' : ''}.</li>
        <li>Nível 1-3: poucos materiais, 5 min · Nível 4-6: símbolos complexos, 8 min · Nível 7+: preparativos grandiosos, 12 min.</li>
        <li>Custo de Sanidade fixo; efeitos duradouros. Rituais não interferem na barra de Conhecimento.${d.has('ritual-vazio') ? ' Ritual Vazio: sem custo material.' : ''}</li>
      </ul>`);
    return `${rev}<div class="grid g2"><div>${palavras}${rituais}</div><div>${magias}</div></div>`;
  };

  /* ---------------- 9. DADOS ---------------- */
  T.dados = function (app) {
    const { d } = app;
    const rf = app.ui.rf;
    const attrs = ['VIG', 'ACU', 'PSI', 'INT', 'SAP', 'ESO', 'RAZ'];
    const pens = d.penLista(rf.attr);
    const sub = rf.attr === 'INT' || rf.attr === 'SAP';
    const sits = d.situacionais.map((s, i) => ({ s, i })).filter(({ s }) => !s.attrs || s.attrs.includes(rf.attr) || (sub && s.attrs.includes('PSI')));
    const dicas = d.dicasNos.filter(x => x.attr === rf.attr || (sub && x.attr === 'PSI'));
    const vantOrig = d.vantagemOrigem.includes(rf.attr);
    const last = app.ui.lastRoll;
    const teste = win('Teste de atributo', 'cyan', `
      <div class="row-b">
        <label class="fld"><span class="fld-l">Atributo</span>${uiSel('rf.attr', rf.attr, attrs.map(k => ({ v: k, t: `${nomeAttr(k)} (${fmt(k === 'INT' || k === 'SAP' ? d.sub[k].valor : d.attr[k].efetivo)})` })))}</label>
        <label class="fld"><span class="fld-l">Modo</span>${uiSel('rf.modo', rf.modo, [{ v: 'normal', t: 'Normal' }, { v: 'vantagem', t: 'Vantagem' }, { v: 'desvantagem', t: 'Desvantagem' }])}</label>
        <label class="fld"><span class="fld-l">Mod. extra</span>${uiInp('rf.mod', rf.mod, { num: true, cls: 'in-num', ph: '0' })}</label>
        <label class="fld"><span class="fld-l">Dificuldade</span>${uiSel('rf.df', rf.df, [{ v: '', t: '—' }].concat(D.DIFICULDADES.map(x => ({ v: x.df, t: `DF${x.df} (${x.min}+)` }))))}</label>
        ${btn('Rolar', 'roll-teste', { cls: 'btn-pri' })}
      </div>
      <div class="stack mt">
        ${pens.length ? uiChk('rf.pen', rf.pen, `Aplicar penalidades: ${esc(pens.map(p => `${p.fonte} ${fmt(p.v)}`).join(', '))}`, { cls: 'c-vig' }) : ''}
        ${sits.map(({ s, i }) => uiChk(`rf.sit.${i}`, !!rf.sit[i], `${esc(s.fonte)}: ${esc(s.txt)}`, { cls: 'c-acu' })).join('')}
        ${vantOrig ? `<p class="tx-s t-acu">${esc(d.origem.nome)}: Vantagem em ${nomeAttr(rf.attr)}.</p>` : ''}
        ${dicas.map(x => `<p class="tx-s t-eso">${esc(x.fonte)}: ${esc(x.txt)}</p>`).join('')}
      </div>
      <div class="roll-out mt" aria-live="polite">${last ? `<div class="roll-num ${last.cls || ''} roll-anim">${esc(last.num)}</div><div class="roll-det"><b>${esc(last.titulo)}</b><br>${last.detHtml || esc(last.det || '')}</div>` : '<div class="roll-num t-mute">--</div><div class="roll-det">Escolha o atributo e role. Críticos: 20 natural (sucesso pleno) e 1 natural (falha crítica).</div>'}</div>`);
    const rapidos = win('Rolagens rápidas', 'yel', `
      <div class="qa">
        ${btn('Iniciativa', 'roll-iniciativa')}${btn('Acerto', 'roll-acerto')}${btn('Defender', 'roll-defender')}${btn('Contra-ação', 'roll-contra', { a: 'ACU' })}
        ${btn(`Revelação ${d.revelacao}%`, 'roll-revelacao')}${btn('Corda da Loucura', 'roll-corda')}
      </div>
      <div class="row-b mt"><label class="fld"><span class="fld-l">Teste de %</span>${uiInp('pct', app.ui.pct, { num: true, cls: 'in-num', ph: '50' })}</label>${btn('Rolar d100', 'roll-pct')}</div>`);
    const livres = win('Dados livres', 'eso', `
      <div class="dice-presets">${[4, 6, 8, 10, 12, 20, 100].map(n => `<button type="button" class="die" data-act="roll-die" data-a="${n}" data-fk="die:${n}">d${n}</button>`).join('')}</div>
      <div class="row-b mt"><label class="fld grow" style="max-width:320px"><span class="fld-l">Expressão</span>${uiInp('expr', app.ui.expr, { ph: '2d6+3 · 3d20kl2 · d%' })}</label>${uiChk('exprMax', app.ui.exprMax, 'Crítico (máximo)')}${btn('Rolar', 'roll-expr', { cls: 'btn-pri' })}</div>
      <p class="tx-s mt">kh/kl mantêm os maiores/menores dados: 3d20kl2 = role 3d20 e descarte o maior.</p>`);
    const log = win('Registro de rolagens', 'dim', `
      ${app.log.length ? `<ul class="log">${app.log.map(e => `<li><span class="tm">${esc(e.hora)}</span><span><span class="lt">${esc(e.titulo)}</span><span class="ld">${e.detHtml || esc(e.det || '')}</span></span><span class="lr ${e.cls || ''}">${esc(e.num)}</span></li>`).join('')}</ul><div class="row mt">${btn('Limpar', 'log-limpar', { cls: 'btn-s btn-x' })}</div>` : '<p class="tx t-dim">Nenhuma rolagem nesta sessão.</p>'}`);
    return `<div class="grid g2"><div>${teste}${rapidos}${livres}</div><div>${log}</div></div>`;
  };

  /* ---------------- 10. REGRAS ---------------- */
  function blocoHTML(b, app) {
    switch (b.t) {
      case 'p': return `<p>${hl(b.x)}</p>`;
      case 'h': return `<h3 class="${b.c ? 'c-' + b.c : ''}">${hl(b.x)}</h3>`;
      case 'h3': return `<h4>${esc(b.x)}</h4>`;
      case 'ul': return `<ul>${b.i.map(x => `<li>${hl(x)}</li>`).join('')}</ul>`;
      case 'quote': return `<blockquote>"${esc(b.x)}"${b.a ? `<cite>— ${esc(b.a)}</cite>` : ''}</blockquote>`;
      case 'note': return `<div class="note">${hl(b.x)}</div>`;
      case 'big': return `<p class="bigtx">${esc(b.x)}</p>`;
      case 'data': return dataHTML(b.k, app);
      default: return '';
    }
  }
  function dataHTML(k, app) {
    const d = app && app.d;
    switch (k) {
      case 'dificuldades':
        return `<div class="tbl-wrap"><table class="tbl c-yel" style="max-width:360px"><thead><tr><th>Dificuldade</th><th class="num">Número mínimo</th></tr></thead><tbody>${D.DIFICULDADES.map(x => `<tr><td>${x.df}</td><td class="num">${x.min}</td></tr>`).join('')}</tbody></table></div>`;
      case 'faixas':
        return `<div class="tbl-wrap"><table class="tbl c-vig"><thead><tr><th>Faixa de sanidade</th><th>Efeito</th></tr></thead><tbody>${D.FAIXAS_SANIDADE.map(f => `<tr class="${d && d.sanidade.faixa === f ? 'hi' : ''}"><td>${f.max} a ${f.min}</td><td>${esc(f.efeito)}</td></tr>`).join('')}</tbody></table></div>`;
      case 'disturbios': {
        const DS = D.DISTURBIOS;
        return `<h4>Efeitos da Depressão no Perito por grau</h4><ul>${DS.depressao.graus.map(g => `<li><span class="t-eso">${g.nome}</span> — ${hl(g.desc)}</li>`).join('')}</ul>
          <h4>Efeitos da Esquizofrenia no Perito</h4><ul>${DS.esquizofrenia.tipos.map(g => `<li><span class="t-eso">${g.nome}</span> — ${hl(g.desc)}</li>`).join('')}</ul>
          <h4>Efeitos da Ansiedade no Perito por grau</h4><ul>${DS.ansiedade.graus.map(g => `<li><span class="t-eso">${g.nome}</span> — ${hl(g.desc)}</li>`).join('')}</ul>`;
      }
      case 'status':
        return `<ul>${D.STATUS.map(s => `<li><span class="t-${s.cor}">${esc(s.nome)}</span> › ${hl(s.desc)}</li>`).join('')}</ul>`;
      case 'profissoes':
        return `<div class="tbl-wrap"><table class="tbl c-cyan"><thead><tr><th>Profissão</th><th>Bônus</th><th>Equipamento</th><th class="num">Dinheiro</th></tr></thead><tbody>${D.PROFISSOES.map(p => `<tr><td class="t-cyan">${esc(p.nome)}</td><td>${hl(p.bonusTexto)}</td><td>${esc(equipTexto(p))}</td><td class="num t-yel">${esc(p.dinheiro)}</td></tr>`).join('')}</tbody></table></div>`;
      case 'classes':
        return D.CLASSES.map(o => `<h4>${esc(o.nome)}</h4><p>${hl(o.desc)}</p><ul><li>${hl(o.bonusTexto)}</li><li>Equipamento Inicial: ${esc(o.equipTexto)}</li><li>Dinheiro Inicial: ${esc(o.dinheiro)}</li></ul>`).join('') +
          `<h3>Habilidades de Profissões</h3><ul>${D.CLASSES.flatMap(o => o.habilidades).map(h => D.HABILIDADES[h]).map(h => `<li><span class="t-yel">${esc(h.nome)}</span>: ${hl(h.desc)}</li>`).join('')}</ul>`;
      case 'caminhos':
        return D.CAMINHOS.map(cm => `<h3 class="c-${cm.cor}" style="color:var(--c)">${cm.num}. ${esc(cm.nome)} <span class="t-dim" style="font-size:1.1rem">· ${D.ATTR[cm.attr].nome}</span></h3>${cm.trilhas.map(t => `<h4>${esc(t.nome)}</h4><ul>${t.nos.map((no, i) => `<li><span class="t-${cm.cor === 'yel' ? 'yel' : cm.cor === 'vio' ? 'vio' : AC[cm.attr]}">${esc(no.nome)}</span> <span class="t-mute">[Nv. ${D.NIVEIS_NO[i]}]</span> — ${hl(no.desc)}</li>`).join('')}</ul>`).join('')}`).join('');
      case 'itens': {
        const grupo = (cat, titulo) => `<h3>${titulo}</h3><ul>${D.CATALOGO.filter(x => x.cat === cat).map(x => `<li><span class="t-${CAT[cat].cor}">${esc(x.nome)}</span>: ${x.dano ? esc(x.dano) + (cat === 'dist' ? ' por tiro' : ' de dano') + (x.tiros ? ', ' + esc(x.tiros) : '') + (x.efeito ? ' + ' : '') : ''}${hl(x.efeito || '')}</li>`).join('')}</ul>`;
        return grupo('medicinal', 'Itens medicinais') + grupo('psicoativo', 'Itens psicoativos') + grupo('cac', 'Armas de corpo-a-corpo') + grupo('dist', 'Armas a distância');
      }
      default: return '';
    }
  }

  function textoBloco(b) {
    if (b.x) return b.x;
    if (b.i) return b.i.join(' ');
    return '';
  }

  /* ---------------- 10. MAPA ---------------- */
  /* A tela de desenho é montada por L.Mapa (js/mapa.js) dentro de #mapa-root depois do render. */
  T.mapa = function () {
    return win('Mapa do mundo', 'acu', `
      <div id="mapa-root" class="mapa"></div>
      <ul class="rules-mini c-acu mt">
        <li>A malha não tem fim: arraste com <em>Mover</em>, com o botão do meio ou direito do mouse, segurando <em>Espaço</em> ou com dois dedos. A roda do mouse (ou a pinça) dá zoom.</li>
        <li class="so-desk">Atalhos: <em>B</em> lápis · <em>E</em> borracha · <em>G</em> balde (preenche só o que está visível) · <em>I</em> conta-gotas · <em>H</em> mover · <em>C</em> centralizar · <em>[ ]</em> troca a cor · <em>Ctrl+Z / Ctrl+Y</em> desfazer e refazer.</li>
        <li>O mapa é salvo junto com a ficha como uma matriz de números: 0 = vazio, 1 a 16 = cores da paleta.</li>
      </ul>`);
  };

  T.regras = function (app) {
    const secs = D.REGRAS.concat(app.c.modulo === 'passado' ? [D.REGRAS_PASSADO] : []);
    const q = (app.ui.rq || '').trim();
    const atual = secs.find(s => s.id === app.ui.regra) || secs[0];
    const toc = secs.map(s => `<button type="button" data-act="regra" data-a="${s.id}" data-fk="regra:${s.id}" aria-current="${!q && s.id === atual.id}">${esc(s.titulo)}</button>`).join('');
    let corpo;
    if (q.length >= 2) {
      const ql = q.toLowerCase();
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const mark = html => html.replace(/(>[^<]*)/g, seg => seg.replace(re, m => `<mark>${m}</mark>`));
      const res = [];
      for (const s of secs) {
        for (const b of s.blocos) {
          if (b.t === 'data') continue;
          if (textoBloco(b).toLowerCase().includes(ql)) res.push({ s, html: mark('>' + blocoHTML(b, app)).slice(1) });
        }
      }
      // nós, itens e profissões também
      for (const id in D.NOS) {
        const r = D.NOS[id];
        if ((r.no.nome + ' ' + r.no.desc).toLowerCase().includes(ql)) res.push({ s: { titulo: `${r.caminho.nome} · ${r.trilha.nome}` }, html: mark(`><p><span class="t-yel">${esc(r.no.nome)}</span> [Nv. ${r.nv}] — ${hl(r.no.desc)}</p>`).slice(1) });
      }
      for (const x of D.CATALOGO) if ((x.nome + ' ' + (x.efeito || '')).toLowerCase().includes(ql)) res.push({ s: { titulo: '8. Listas' }, html: mark(`><p><span class="t-yel">${esc(x.nome)}</span>${x.dano ? ' · ' + esc(x.dano) : ''} ${hl(x.efeito || '')}</p>`).slice(1) });
      for (const p of D.PROFISSOES.concat(D.CLASSES)) if ((p.nome + ' ' + p.bonusTexto).toLowerCase().includes(ql)) res.push({ s: { titulo: D.CLASSE[p.id] ? 'Classes' : '3. Profissões' }, html: mark(`><p><span class="t-yel">${esc(p.nome)}</span> — ${hl(p.bonusTexto)} · ${esc(equipTexto(p))} · ${esc(p.dinheiro)}</p>`).slice(1) });
      corpo = `<h2>Busca: "${esc(q)}" <span class="t-dim" style="font-size:1.2rem">${res.length} resultado(s)</span></h2>${res.slice(0, 120).map(r => `<div class="rules-res"><div class="lbl">${esc(r.s.titulo)}</div><div class="tx">${r.html}</div></div>`).join('') || '<p class="tx t-dim">Nada encontrado.</p>'}`;
    } else {
      corpo = `<h2>${esc(atual.titulo)}</h2><div class="tx">${atual.blocos.map(b => blocoHTML(b, app)).join('')}</div>`;
    }
    return win('Livro do Jogador · regras', 'acc', `<div class="rules-layout">
      <aside class="toc"><label class="fld mb"><span class="fld-l">Buscar nas regras</span>${uiInp('rq', app.ui.rq, { type: 'search', ph: 'fôlego, crítico, ritual…' })}</label>${toc}</aside>
      <article class="rules-body">${corpo}</article></div>`);
  };

  /* ------------------------------------------------------------------ */
  /* MODAIS                                                             */
  /* ------------------------------------------------------------------ */
  UI.modal = function (title, body, acts, o) {
    o = o || {};
    return `<div class="modal-back" data-act="modal-fechar-fundo"><div class="modal c-${o.cor || 'acc'} ${o.wide ? 'modal-w' : ''}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h2 class="win-t" id="modal-title">${title}</h2>
      <button type="button" class="modal-x" data-act="modal-fechar" data-fk="modal:x" aria-label="Fechar janela">&times;</button>
      ${body}
      <div class="modal-acts">${acts || btn('Fechar', 'modal-fechar')}</div>
    </div></div>`;
  };

  UI.modalFichas = function (app) {
    const lista = Object.values(app.store.fichas).sort((a, b) => b.atualizadoEm - a.atualizadoEm);
    const linhas = lista.map(f => {
      const org = f.modulo === 'passado' ? (D.CLASSE[f.classe] || {}).nome : (D.PROF[f.profissao] || {}).nome;
      const at = f.id === app.c.id;
      return `<tr><td>${at ? '<span class="tag c-acu">ATUAL</span> ' : ''}<span class="${at ? 't-acc' : ''}">${esc(f.nome || 'Sem nome')}</span><br><span class="tx-s">${esc(org || '—')} · Nv ${f.nivel || 0} · ${f.modulo === 'passado' ? 'Passado Distante' : '1ª Edição'}</span></td><td class="tx-s">${new Date(f.atualizadoEm).toLocaleString('pt-BR')}</td>
        <td><div class="row" style="justify-content:flex-end">${at ? '' : btn('Abrir', 'ficha-abrir', { a: f.id, cls: 'btn-s btn-pri' })}${btn('Duplicar', 'ficha-duplicar', { a: f.id, cls: 'btn-s' })}${btn('Excluir', 'ficha-excluir', { a: f.id, cls: 'btn-s btn-x' })}</div></td></tr>`;
    }).join('');
    return UI.modal('Fichas salvas', `
      <p class="tx-s mb">As fichas ficam salvas na sua conta, com uma cópia neste navegador. Exporte em JSON ou PDF para guardar um arquivo.</p>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Perito</th><th>Atualizada</th><th></th></tr></thead><tbody>${linhas}</tbody></table></div>`,
      `${btn('Importar JSON', 'importar')}${btn('Importar PDF', 'importar-pdf')}${btn('Exportar esta (JSON)', 'exportar-json')}${btn('Nova ficha', 'nova')}${btn('Fechar', 'modal-fechar')}`, { wide: true });
  };

  UI.modalNova = function (app) {
    return UI.modal('Nova ficha', `
      <p class="tx mb">Escolha o livro da nova ficha. Você pode trocar depois pelo seletor de extensão no topo.</p>
      <div class="cards">
        <div class="card" role="button" tabindex="0" data-act="ficha-nova" data-a="base" data-fk="nova:base"><h3>1ª Edição</h3><p class="tx-s">Livro do Jogador — anos 80, Profissões.</p></div>
        <div class="card" role="button" tabindex="0" data-act="ficha-nova" data-a="passado" data-fk="nova:passado"><h3 class="t-yel">Em um Passado Distante</h3><p class="tx-s">Extensão medieval — Classes substituem as Profissões.</p></div>
      </div>`, btn('Cancelar', 'modal-fechar'));
  };

  UI.modalPDF = function (app) {
    const p = app.store.prefs;
    const compartilha = UI.compartilhaArquivos();
    const pronto = !!app.ui.pdfPronto; // PDF gerado esperando um toque para compartilhar
    const partes = [
      ['ficha', 'Ficha principal (atributos, corpo, sanidade)'],
      ['equip', 'Equipamento e habilidades'],
      ['caminhos', 'Nós dos Caminhos adquiridos'],
      ['revel', 'Revelações: palavras, magias e rituais'],
      ['historia', 'História, aparência e notas'],
      ['ref', 'Referência rápida (tabelas e status)']
    ];
    return UI.modal('Exportar PDF', `
      <div class="grid g2">
        <div class="stack">
          <span class="lbl">Tema</span>
          <label class="chk"><input type="radio" name="pdfTema" data-pref="pdfTema" value="escuro" ${p.pdfTema !== 'claro' ? 'checked' : ''}><span>Escuro · CRT (como o livro)</span></label>
          <label class="chk"><input type="radio" name="pdfTema" data-pref="pdfTema" value="claro" ${p.pdfTema === 'claro' ? 'checked' : ''}><span>Claro · para imprimir</span></label>
          <span class="lbl mt">Papel</span>
          <label class="chk"><input type="radio" name="pdfPapel" data-pref="pdfPapel" value="a4" ${p.pdfPapel !== 'letter' ? 'checked' : ''}><span>A4</span></label>
          <label class="chk"><input type="radio" name="pdfPapel" data-pref="pdfPapel" value="letter" ${p.pdfPapel === 'letter' ? 'checked' : ''}><span>Carta (Letter)</span></label>
        </div>
        <div class="stack">
          <span class="lbl">Incluir</span>
          ${partes.map(([k, t]) => `<label class="chk"><input type="checkbox" data-pref="pdfPartes.${k}" ${p.pdfPartes[k] !== false ? 'checked' : ''}><span>${esc(t)}</span></label>`).join('')}
        </div>
      </div>
      <p class="tx-s mt">"Ficha em branco" gera a mesma ficha sem dados, para preencher à mão.${compartilha ? ' No celular, o PDF abre o painel de compartilhar (WhatsApp, Drive, Arquivos…).' : ''}</p>
      ${pronto ? '<div class="note c-acu mt">PDF pronto. Toque em "Compartilhar PDF" para enviar ou salvar.</div>' : ''}
      <div id="pdf-status" class="tx-s mt t-yel" aria-live="polite"></div>`,
      pronto
        ? `${btn('Compartilhar PDF', 'pdf-compartilhar', { cls: 'btn-pri' })}${btn('Fechar', 'modal-fechar')}`
        : `${btn('Ficha em branco', 'pdf-branco')}${compartilha ? '' : btn('Visualizar', 'pdf-ver')}${btn(compartilha ? 'Compartilhar PDF' : 'Baixar PDF', 'pdf-baixar', { cls: 'btn-pri' })}${btn('Fechar', 'modal-fechar')}`, { wide: true });
  };

  UI.modalAvisos = function (app) {
    const av = app.d.avisos;
    const cor = { erro: 'vig', aviso: 'raz', info: 'cyan' };
    return UI.modal('Pendências da ficha', av.length ? `<ul class="rules-mini">${av.map(a => `<li class="c-${cor[a.nivel]}"><span class="t-c">${a.nivel.toUpperCase()}</span> ${esc(a.txt)} ${a.tab ? btn('Ir', 'tab', { a: a.tab, cls: 'btn-s', fk: 'av:' + a.txt.slice(0, 20) }) : ''}</li>`).join('')}</ul>` : '<p class="tx t-acu">Nenhuma pendência. Ficha pronta!</p>', btn('Fechar', 'modal-fechar'), { cor: 'raz' });
  };

  UI.modalMenu = function (app) {
    const p = app.store.prefs;
    return UI.modal('Menu', `
      <div class="stack">
        <label class="chk"><input type="checkbox" data-pref="crt" ${p.crt ? 'checked' : ''}><span>Filtro CRT (scanlines, máscara RGB, brilho)</span></label>
        <label class="chk"><input type="checkbox" data-pref="boot" ${p.boot ? 'checked' : ''}><span>Tela de boot ao abrir</span></label>
      </div>
      <div class="win-sub mt">Atalhos</div>
      <ul class="rules-mini"><li><em>Alt + 1…0</em> troca de aba</li><li><em>Ctrl + S</em> salva (também salva sozinho)</li><li><em>Ctrl + P</em> exportar PDF</li><li><em>Esc</em> fecha janelas</li></ul>
      <div class="win-sub mt">Sobre</div>
      <p class="tx-s">Criador de fichas para LIMIAR — Livro do Jogador, 1ª Edição, com a extensão "Em um Passado Distante". Fontes VT323 e IBM Plex Mono (SIL Open Font License). PDF gerado no navegador com jsPDF (MIT). As fichas ficam salvas na sua conta, com uma cópia neste navegador.</p>`,
      `${btn('Apagar TODAS as fichas', 'apagar-tudo', { cls: 'btn-x' })}${btn('Fechar', 'modal-fechar')}`);
  };

  UI.modalConfirm = function (titulo, texto, acao, rotulo, cor) {
    return UI.modal(titulo, `<p class="tx">${texto}</p>`, `${btn('Cancelar', 'modal-fechar')}${btn(rotulo || 'Confirmar', 'confirmar', { a: acao, cls: 'btn-pri ' + (cor === 'vig' ? 'btn-x' : '') })}`, { cor: cor || 'raz' });
  };

  UI.modalCorda = function (app) {
    const { d } = app;
    const r = app.ui.cordaRoll;
    const vant = d.has('equilibrista-nato');
    return UI.modal('Corda da Loucura', `
      <p class="tx">A Sanidade chegou a <span class="t-vig">0</span>. Role RAZÃO para "Se Equilibrar na Corda da Loucura". A dificuldade é dada pelo Espectador.</p>
      <p class="tx-s mt-s">Falhou: passa a tomar 2x dano de Sanidade e recebe o status Insano. Passou: fica em 0 e testa de novo no próximo dano de Sanidade.${vant ? ' <span class="t-acu">Equilibrista Nato: role com Vantagem.</span>' : ''}</p>
      <div class="roll-out mt">${r ? `<div class="roll-num ${r.cls || ''} roll-anim">${esc(r.num)}</div><div class="roll-det"><b>${esc(r.titulo)}</b><br>${esc(r.det)}</div>` : `<div class="roll-num t-mute">--</div><div class="roll-det">1d20 ${fmt(d.modTeste('RAZ'))}${vant ? ' com Vantagem' : ''}</div>`}</div>`,
      `${btn('Rolar RAZÃO', 'corda-rolar')}${btn('Passou · fica em 0', 'corda-passou', { cls: 'btn-ok' })}${btn('Falhou · Insano', 'corda-falhou', { cls: 'btn-x' })}`, { cor: 'vig' });
  };

  UI.modalNivel = function (app, idx) {
    const { c, d } = app;
    const h = c.niveis[idx];
    if (!h) return UI.modal('Nível', '<p class="tx">Nível não encontrado.</p>');
    const temCresc = d.has('crescimento-anomalo'), temClar = d.has('clareza-crescente'), temEpi = d.has('epifania');
    return UI.modal(`Nível ${h.nivel} alcançado`, `
      <p class="tx">O Conhecimento chegou a 100% e zerou. ${h.nivel === 1 ? 'Primeiro nível: o Perito recebe uma iluminação — a visita de um Indizível ou uma revelação em sonho.' : ''}</p>
      <ul class="rules-mini c-yel mt">
        <li><em>+1 Traço de Revelação</em> — compre um Nó nos Caminhos (${d.tracos.disponiveis} disponível(is)).</li>
        <li><em>+1 ponto de atributo</em> — distribua na aba Atributos (${d.pontos.nivel} disponível(is)).</li>
        <li>Role os ganhos de Vida (1d4) e Sanidade (${esc(d.dadoSanNivel)}). "+ Máximo" soma ao máximo; "Recupera" só cura.</li>
      </ul>
      <div class="tbl-wrap mt"><table class="tbl lvl-tbl c-yel"><thead><tr><th class="num">Nv</th><th>Vida 1d4</th>${temCresc ? '<th>+1d4</th>' : ''}<th>Aplicar</th><th>Sanidade ${esc(d.dadoSanNivel)}</th>${temClar ? '<th>+1d4</th>' : ''}<th>Aplicar</th>${temEpi ? '<th>Epifania</th>' : ''}</tr></thead><tbody>${nivelRow(h, idx, d)}</tbody></table></div>
      <div class="row mt"><span class="chip c-yel">Iluminação: ${d.revelacao}% de aprender magia/ritual</span>${btn('Rolar revelação', 'roll-revelacao', { cls: 'btn-s' })}</div>`,
      `${btn('Atributos', 'tab', { a: 'atributos' })}${btn('Caminhos', 'tab', { a: 'caminhos' })}${btn('Concluir', 'modal-fechar', { cls: 'btn-pri' })}`, { cor: 'yel', wide: true });
  };

  UI.modalUsarVida = function (app, it, rolado) {
    return UI.modal(`Usar ${esc(it.nome)}`, `
      <p class="tx">${hl(it.efeito || '')}</p>
      <div class="row-b mt"><label class="fld"><span class="fld-l">Membro</span>${uiSel('usoMembro', app.ui.usoMembro || 'tronco', D.MEMBROS.map(m => ({ v: m.id, t: `${m.nome} (${app.d.membros[m.id].atual}/${app.d.membros[m.id].max})` })))}</label></div>
      ${rolado ? `<p class="tx mt">Resultado: <span class="t-acu">${esc(rolado)}</span></p>` : ''}`,
      `${btn('Cancelar', 'modal-fechar')}${btn('Aplicar', 'item-usar-vida', { a: it.id, cls: 'btn-pri' })}`, { cor: 'acu' });
  };

  UI.modalConjurar = function (app, m) {
    const { d } = app;
    const cu = R.custoMagia(m, d);
    const k = Math.max(cu.conjuntos, parseInt(app.ui.conjK, 10) || cu.conjuntos);
    const extras = k - cu.conjuntos;
    return UI.modal(`Conjurar ${esc(m.nome || 'magia')}`, `
      <div class="row-b mt"><label class="fld"><span class="fld-l">Conjuntos usados (mín. ${cu.conjuntos})</span>${uiInp('conjK', k, { num: true, cls: 'in-num' })}</label>
        <div class="stack"><span class="chip c-raz">Custo: ${cu.porConjunto * k} SAN</span><span class="chip c-cyan">${k} turno(s) de preparação</span>${extras > 0 ? `<span class="chip c-eso">+${extras}× ${esc(d.magia.bonusDado)} no efeito</span>` : ''}</div></div>
      <p class="tx-s mt">Você tem ${d.magia.conjuntos} conjunto(s) completo(s) no repertório${m.gatilho === 'mantra' || m.gatilho === 'livro' ? ' — esta magia é isenta de repertório' : ''}. A Sanidade gasta volta ao fim do combate se você ficar acima de 0.</p>
      ${d.has('graca-critica') ? '<p class="tx-s t-acu">Graça Crítica: um acerto crítico na conjuração zera o custo.</p>' : ''}`,
      `${btn('Cancelar', 'modal-fechar')}${btn('Conjurar e pagar', 'magia-pagar', { a: m.id, cls: 'btn-pri' })}`, { cor: 'vio' });
  };

  /* ------------------------------------------------------------------ */
  /* BOOT                                                               */
  /* ------------------------------------------------------------------ */
  UI.bootText = function (modulo) {
    return [
      '<span class="hi">LIMIAR BIOS v1.0</span>  (C) 1984 LIMIAR Corp.',
      'IBM PERSONAL COMPUTER · Modo de texto 80x25 · 16 cores',
      '',
      'Teste de memória ........ <span class="ok">640K OK</span>',
      'Unidade A: ............... LIVRO_DO_JOGADOR.DSK',
      modulo === 'passado' ? 'Unidade B: ............... PASSADO_DISTANTE.DSK' : 'Unidade B: ............... <span class="t-mute">vazia</span>',
      'Verificando o Véu ........ <span class="wr">INSTÁVEL</span>',
      '',
      'C:\\> LIMIAR.EXE /FICHA',
      'Carregando Peritos...'
    ];
  };
})();
