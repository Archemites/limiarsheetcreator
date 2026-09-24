// Ações extras para mobile-shots.js: gaveta, setas, compartilhar PDF/JSON (navigator.share simulado).
module.exports = async ({ ev, send, shot, sleep, erros }) => {
  const ok = (n, c, v) => { console.log((c ? 'OK   ' : 'FALHA') + ' ' + n + (c ? '' : ' → ' + JSON.stringify(v))); if (!c) erros.push('falhou: ' + n); };
  const toque = async sel => {
    await sleep(300); // deixa a tela assentar (prints no modo celular mexem na janela por um instante)
    let r = null;
    for (let i = 0; i < 5; i++) {
      r = await ev(`(() => { const e = document.querySelector('${sel}'); if (!e) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); const x = b.left + b.width / 2, y = b.top + b.height / 2; const a = document.elementFromPoint(x, y); return { x, y, ok: !!a && (a === e || e.contains(a)) }; })()`);
      if (!r || r.ok) break;
      await sleep(200);
    }
    if (!r) throw new Error('não achei ' + sel);
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: r.x, y: r.y }] });
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await sleep(250);
  };

  await ev(`document.querySelector('#tab-perito').click(); window.scrollTo(0, 0); true`);
  await sleep(300);
  const topo = await ev(`(() => { const t = document.querySelector('.topbar'), b = document.querySelector('.logo-topo'); const r = b.getBoundingClientRect(); return { tabsVisiveis: getComputedStyle(document.querySelector('#tabs')).display !== 'none', controles: getComputedStyle(document.querySelector('.top-controls')).display !== 'none', botao: { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left) }, aba: document.querySelector('#aba-atual').textContent, sticky: getComputedStyle(t).position }; })()`);
  ok('topo do celular: sem fileira de abas nem botões soltos', !topo.tabsVisiveis && !topo.controles, topo);
  ok('ícone é um botão tocável (≥ 40px) à esquerda', topo.botao.w >= 40 && topo.botao.h >= 40 && topo.botao.x < 30, topo.botao);
  ok('topo mostra a aba atual e fica fixo', /Perito/i.test(topo.aba) && topo.sticky === 'sticky', topo);

  // rolar a página: o topo continua visível
  await ev(`window.scrollTo(0, 900); true`); await sleep(200);
  const fixo = await ev(`Math.round(document.querySelector('.logo-topo').getBoundingClientRect().top)`);
  ok('ao rolar, o botão continua no topo', fixo >= 0 && fixo < 20, fixo);
  await ev(`window.scrollTo(0, 0); true`); await sleep(150);

  // gaveta
  await toque('.logo-topo');
  const g = await ev(`({ aberta: !!document.querySelector('#gaveta'), itens: document.querySelectorAll('#gaveta .gaveta-item[data-act="tab"]').length, exp: document.querySelector('.logo-topo').getAttribute('aria-expanded'), trava: document.documentElement.classList.contains('gaveta-aberta'), foco: document.activeElement && document.activeElement.dataset.a })`);
  ok('tocar no ícone abre a gaveta com as 10 abas', g.aberta && g.itens === 10 && g.exp === 'true' && g.trava, g);
  ok('foco vai para a aba atual na gaveta', g.foco === 'perito', g);
  await shot('gaveta', false);
  await toque('#gaveta [data-act="tab"][data-a="corpo"]');
  const g2 = await ev(`({ aba: LIMIAR.App.ui.tab, aberta: !!document.querySelector('#gaveta'), rotulo: document.querySelector('#aba-atual').textContent, trava: document.documentElement.classList.contains('gaveta-aberta') })`);
  ok('escolher uma aba troca e fecha a gaveta', g2.aba === 'corpo' && !g2.aberta && /Corpo/i.test(g2.rotulo) && !g2.trava, g2);

  // fundo escuro fecha; Esc fecha
  await toque('.logo-topo');
  const fundo = await ev(`(() => { const r = document.querySelector('#gaveta').getBoundingClientRect(); return { x: r.right + 30, y: 400 }; })()`);
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [fundo] });
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await sleep(250);
  ok('tocar no fundo fecha a gaveta', await ev(`!document.querySelector('#gaveta')`));
  await toque('.logo-topo');
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await sleep(200);
  ok('Esc fecha a gaveta', await ev(`!document.querySelector('#gaveta')`));

  // ações da gaveta: trocar extensão e abrir Fichas
  await toque('.logo-topo');
  await ev(`(() => { const s = document.querySelector('#gaveta select[data-modulo]'); s.value = 'passado'; s.dispatchEvent(new Event('change', { bubbles: true })); return true; })()`);
  await sleep(250);
  const ext = await ev(`({ mod: LIMIAR.App.c.modulo, aberta: !!document.querySelector('#gaveta'), sel: document.querySelector('#gaveta select[data-modulo]') && document.querySelector('#gaveta select[data-modulo]').value })`);
  ok('extensão troca pela gaveta', ext.mod === 'passado' && ext.sel === 'passado', ext);
  await ev(`(() => { const s = document.querySelector('#gaveta select[data-modulo]'); s.value = 'base'; s.dispatchEvent(new Event('change', { bubbles: true })); return true; })()`);
  await sleep(200);
  await toque('#gaveta [data-act="fichas"]');
  ok('ação da gaveta fecha a gaveta e abre o modal', await ev(`!document.querySelector('#gaveta') && LIMIAR.App.ui.modal && LIMIAR.App.ui.modal.tipo === 'fichas'`));
  await shot('modal-fichas', false);
  await ev(`document.querySelector('#modal-root [data-act="modal-fechar"]').click(); true`);

  // setas
  await ev(`document.querySelector('#tab-perito').click(); true`); await sleep(150);
  await toque('.nav-setas [data-a="1"]');
  const s1 = await ev(`LIMIAR.App.ui.tab`);
  await toque('.nav-setas [data-a="-1"]'); await toque('.nav-setas [data-a="-1"]');
  const s2 = await ev(`LIMIAR.App.ui.tab`);
  ok('setas: próxima e anterior (dá a volta)', s1 === 'atributos' && s2 === 'mapa', { s1, s2 });

  // atributos no celular: dá para mexer nos pontos de nível
  await ev(`document.querySelector('#tab-atributos').click(); true`); await sleep(200);
  const at = await ev(`(() => { const niv = [...document.querySelectorAll('.attr-tbl .col-niv')].filter(e => getComputedStyle(e).display !== 'none').length; const teste = [...document.querySelectorAll('.attr-tbl .col-teste')].filter(e => getComputedStyle(e).display !== 'none').length; const t = document.querySelector('.attr-tbl').getBoundingClientRect(), w = document.querySelector('.attr-tbl').closest('.tbl-wrap').getBoundingClientRect(); return { niv, teste, cabe: t.width <= w.width + 1 }; })()`);
  ok('atributos: coluna Nível visível e tabela cabe na tela', at.niv >= 6 && at.teste === 0 && at.cabe, at);
  await shot('atributos-depois', false);

  // profissão escolhida: lista recolhida
  await ev(`document.querySelector('#tab-origem').click(); true`); await sleep(200);
  const or = await ev(`(() => { const d = document.querySelector('details.troca-origem'); return { existe: !!d, aberta: d && d.open, alt: document.documentElement.scrollHeight }; })()`);
  ok('profissão escolhida: lista de 32 recolhida', or.existe && !or.aberta && or.alt < 3000, or);

  // compartilhar PDF (navigator.share simulado)
  await ev(`(() => { window.__log = []; document.addEventListener('click', e => { const a = e.target.closest('[data-act]'); window.__log.push((a ? a.dataset.act : e.target.tagName) + '@' + e.clientX + ',' + e.clientY); }, true); window.__share = []; navigator.canShare = () => true; navigator.share = async d => { window.__share.push(d.files.map(f => f.name + ':' + f.type + ':' + f.size).join(',')); }; return true; })()`);
  await toque('.logo-topo');
  await toque('#gaveta [data-act="pdf-modal"]');
  const m = await ev(`({ tipo: LIMIAR.App.ui.modal && LIMIAR.App.ui.modal.tipo, botoes: [...document.querySelectorAll('#modal-root .modal-acts .btn')].map(b => b.textContent.trim()) })`);
  ok('modal do PDF no celular: "Compartilhar PDF", sem "Visualizar"', m.tipo === 'pdf' && m.botoes.some(b => /Compartilhar PDF/.test(b)) && !m.botoes.some(b => /Visualizar/.test(b)), m);
  await shot('modal-pdf', false);
  await toque('#modal-root [data-act="pdf-baixar"]');
  await sleep(2500);
  const sh = await ev(`({ share: window.__share, status: (document.querySelector('#pdf-status') || {}).textContent, log: window.__log, modal: LIMIAR.App.ui.modal && LIMIAR.App.ui.modal.tipo })`);
  ok('Compartilhar PDF abre o painel com o arquivo .pdf', sh.share.length === 1 && /\.pdf:application\/pdf:\d{5,}/.test(sh.share[0]) && /compartilhado/i.test(sh.status), sh);

  // navegador exigindo um toque novo (NotAllowedError): aparece o botão com o PDF já pronto
  await ev(`(() => { let vez = 0; window.__share = []; navigator.share = async d => { if (vez++ === 0) { const e = new Error('precisa de toque'); e.name = 'NotAllowedError'; throw e; } window.__share.push(d.files[0].name); }; return true; })()`);
  await toque('#modal-root [data-act="pdf-branco"]');
  await sleep(2500);
  const pr = await ev(`({ botoes: [...document.querySelectorAll('#modal-root .modal-acts .btn')].map(b => b.textContent.trim()), pronto: !!LIMIAR.App.ui.pdfPronto })`);
  ok('sem permissão: mostra "Compartilhar PDF" com o arquivo pronto', pr.pronto && pr.botoes.some(b => /Compartilhar PDF/.test(b)), pr);
  await toque('#modal-root [data-act="pdf-compartilhar"]');
  await sleep(400);
  const pr2 = await ev(`({ share: window.__share, pronto: !!LIMIAR.App.ui.pdfPronto })`);
  ok('um toque no botão compartilha o PDF pronto', pr2.share.length === 1 && /ficha-em-branco\.pdf$/.test(pr2.share[0]) && !pr2.pronto, pr2);
  await ev(`document.querySelector('#modal-root [data-act="modal-fechar"]').click(); true`);
  await sleep(150);

  // topo e HUD compactos
  await ev(`document.querySelector('#tab-perito').click(); window.scrollTo(0, 0); true`); await sleep(250);
  const alt = await ev(`Math.round(document.querySelector('#view').getBoundingClientRect().top + scrollY)`);
  ok('conteúdo começa mais cedo (topo + resumo compactos)', alt < 360, alt);
  await shot('topo-depois', false);
};
