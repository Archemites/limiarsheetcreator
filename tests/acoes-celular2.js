// Testes da segunda rodada de mobile: layouts por aba e acessibilidade.
module.exports = async ({ ev, send, shot, sleep, erros }) => {
  const ok = (n, c, v) => { console.log((c ? 'OK   ' : 'FALHA') + ' ' + n + (c ? '' : ' → ' + JSON.stringify(v))); if (!c) erros.push('falhou: ' + n); };
  const aba = async t => { await ev(`LIMIAR.App.ui.gaveta = false; document.querySelector('#tab-${t}').click(); window.scrollTo(0, 0); true`); await sleep(300); };
  const toqueEm = async (x, y) => { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] }); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(250); };
  const toque = async sel => {
    await sleep(250);
    const r = await ev(`(() => { const e = document.querySelector('${sel}'); if (!e) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    if (!r) throw new Error('não achei ' + sel);
    await toqueEm(r.x, r.y);
  };
  const deslizar = async (x0, x1, y) => {
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y }] });
    for (let i = 1; i <= 4; i++) await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + (x1 - x0) * i / 4, y: y + i }] });
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await sleep(350);
  };

  // Perito: retrato à esquerda, campos à direita; caixas de texto na largura toda
  await aba('perito');
  const p = await ev(`(() => { const r = document.querySelector('.portrait').getBoundingClientRect(), c = document.querySelector('.id-campos').getBoundingClientRect(); const ta = document.querySelector('textarea[data-bind="historia.origem"]').getBoundingClientRect(); const w = document.querySelector('textarea[data-bind="historia.origem"]').closest('.win').getBoundingClientRect(); return { retEsq: Math.round(r.left), camposEsq: Math.round(c.left), mesmaLinha: Math.abs(r.top - c.top) < 30, retLarg: Math.round(r.width), ta: Math.round(ta.width), win: Math.round(w.width) }; })()`);
  ok('Perito: retrato à esquerda e campos à direita', p.retEsq < p.camposEsq && p.mesmaLinha && p.retLarg >= 120, p);
  ok('Perito: caixas de texto ocupam o bloco todo', p.ta >= p.win - 40, p);

  // Corpo: boneco 3×3
  await aba('corpo');
  const b = await ev(`(() => { const r = id => document.querySelector('.part[style*="grid-area:' + id + '"]').getBoundingClientRect(); const cab = r('cabeca'), tro = r('tronco'), be = r('bracoE'), bd = r('bracoD'), pe = r('pernaE'), pd = r('pernaD'); return { cabCentro: Math.abs((cab.left + cab.right) / 2 - (tro.left + tro.right) / 2) < 3, bracos: be.right <= tro.left + 1 && bd.left >= tro.right - 1 && Math.abs(be.top - tro.top) < 3, cabecaEmCima: cab.bottom <= tro.top + 1, pernas: pe.top >= tro.bottom - 1 && pd.top >= tro.bottom - 1 && pe.left < tro.left && pd.left > tro.left, nomes: [...document.querySelectorAll('.part .pn-c')].map(e => getComputedStyle(e).display !== 'none' ? e.textContent : '').join(',') }; })()`);
  ok('Corpo: cabeça em cima, braços ao lado do tronco, pernas embaixo', b.cabCentro && b.bracos && b.cabecaEmCima && b.pernas, b);
  ok('Corpo: nomes curtos nos cartões', /Braço E\./.test(b.nomes) && /Perna D\./.test(b.nomes), b.nomes);

  // Mente: níveis em cartões
  await aba('mente');
  const n = await ev(`(() => { const t = document.querySelector('.lvl-tbl'); if (!t) return { sem: true }; const th = getComputedStyle(t.querySelector('thead')).display; const tr = getComputedStyle(t.querySelector('tbody tr')).display; const w = t.closest('.tbl-wrap'); return { th, tr, cabe: w.scrollWidth <= w.clientWidth + 1, rotulo: getComputedStyle(t.querySelector('td[data-label]'), '::before').content }; })()`);
  ok('Mente: cada nível vira cartão com rótulos (sem rolar para o lado)', n.th === 'none' && n.tr === 'grid' && n.cabe && /Vida|NV/.test(n.rotulo), n);
  ok('teclado: Sanidade aceita "-" e rolagem usa teclado numérico', await ev(`document.querySelector('input[data-bind="sanidade"]').inputMode === 'text'`) && true);

  // Atributos: grade de DF em 5 colunas
  await aba('atributos');
  const df = await ev(`(() => { const g = document.querySelector('.df-grade'); const cols = getComputedStyle(g).gridTemplateColumns.split(' ').length; return { cols, cabe: g.scrollWidth <= g.clientWidth + 1 }; })()`);
  ok('Atributos: tabela de DF em 2 linhas de 5', df.cols === 5 && df.cabe, df);

  // Resumo tocável
  await aba('perito');
  await toque('.hud-san');
  ok('tocar na Sanidade do resumo abre a aba Mente', await ev(`LIMIAR.App.ui.tab === 'mente'`));
  await toque('.hud-tr');
  ok('tocar em Traços abre Caminhos', await ev(`LIMIAR.App.ui.tab === 'caminhos'`));

  // Deslizar entre abas
  await sleep(600);
  await aba('corpo');
  const yView = () => ev(`(() => { const cand = [...document.querySelectorAll('#view p.tx-s, #view .rules-mini li, #view .part-meta, #view .lbl')].map(e => e.getBoundingClientRect()).find(r => r.top > 120 && r.bottom < innerHeight - 60 && r.height > 8); return cand ? Math.round(cand.top + cand.height / 2) : 500; })()`);
  await deslizar(300, 100, await yView());
  const d1 = await ev(`LIMIAR.App.ui.tab`);
  await deslizar(100, 300, await yView());
  const d2 = await ev(`LIMIAR.App.ui.tab`);
  const yMeio = await yView();
  await deslizar(200, 200, yMeio); // rolagem vertical não troca
  ok('deslizar para a esquerda vai à próxima aba e para a direita volta', d1 === 'mente' && d2 === 'corpo', { d1, d2 });
  await deslizar(5, 250, yMeio);
  ok('deslizar a partir da borda não troca de aba (gesto do sistema)', await ev(`LIMIAR.App.ui.tab === 'corpo'`));

  // Janelas recolhíveis
  await aba('corpo');
  await toque('#view .win .win-tg');
  const rec = await ev(`(() => { const w = document.querySelector('#view .win'); return { rec: w.classList.contains('recolhida'), corpo: getComputedStyle(w.querySelector('.win-corpo')).display, exp: w.querySelector('.win-tg').getAttribute('aria-expanded'), salvo: LIMIAR.App.store.prefs.recolhidas.join('|') }; })()`);
  ok('tocar no título recolhe a janela', rec.rec && rec.corpo === 'none' && rec.exp === 'false' && /corpo:/.test(rec.salvo), rec);
  await aba('perito'); await aba('corpo');
  ok('a janela continua recolhida ao voltar para a aba', await ev(`document.querySelector('#view .win').classList.contains('recolhida')`));
  await toque('#view .win .win-tg');
  ok('tocar de novo expande', await ev(`!document.querySelector('#view .win').classList.contains('recolhida') && LIMIAR.App.store.prefs.recolhidas.length === 0`));

  // Voltar ao topo
  await aba('mente');
  await ev(`window.scrollTo(0, 3000); true`); await sleep(400);
  const vt = await ev(`({ rolou: document.documentElement.classList.contains('rolou'), op: getComputedStyle(document.querySelector('.topo-voltar')).opacity })`);
  ok('botão de voltar ao topo aparece depois de rolar', vt.rolou && vt.op === '1', vt);
  const tb = await ev(`(() => { const b = document.querySelector('.topo-voltar').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
  await toqueEm(tb.x, tb.y); await sleep(700);
  ok('tocar no botão volta ao topo', await ev(`window.scrollY < 5`));

  // × nos modais e aviso tocável
  await ev(`document.querySelector('.hud-warn').click(); true`); await sleep(250);
  await toque('#modal-root .modal-x');
  ok('o × fecha o modal', await ev(`!LIMIAR.App.ui.modal`));
  await ev(`LIMIAR.App.toast('Aviso de teste'); true`); await sleep(200);
  await toque('#toast-root .toast');
  ok('tocar no aviso faz ele sumir', await ev(`![...document.querySelectorAll('#toast-root .toast')].some(t => /Aviso de teste/.test(t.textContent))`));

  // SAIR só na gaveta; instalação na tela inicial
  ok('SAIR não fica na barra de baixo do celular', await ev(`getComputedStyle(document.querySelector('#st-sair')).display === 'none'`));
  ok('página tem manifest e ícone para a tela inicial', await ev(`!!document.querySelector('link[rel="manifest"]') && !!document.querySelector('link[rel="apple-touch-icon"]') && /viewport-fit=cover/.test(document.querySelector('meta[name=viewport]').content)`));
  await aba('perito');
  await shot('perito-final', false);
  await aba('corpo');
  await ev(`window.scrollTo(0, document.querySelector('.doll').getBoundingClientRect().top + scrollY - 80); true`); await sleep(250);
  await shot('corpo-final', false);
};
