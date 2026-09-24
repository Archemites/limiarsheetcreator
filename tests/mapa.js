// Teste da aba Mapa no Chrome headless, com a API do Supabase substituída por uma falsa (sem rede).
// Uso: node tests/mapa.js   (prints em tests/saida/)
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');
const RAIZ = path.resolve(__dirname, '..');
const URL_RAIZ = 'file:///' + RAIZ.replace(/\\/g, '/').split('/').map(encodeURIComponent).join('/').replace(/^file:\/\/\/(\w)%3A/, 'file:///$1:');
const SAIDA = path.join(__dirname, 'saida');
fs.mkdirSync(SAIDA, { recursive: true });
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const SCR = SAIDA, PORT = 9336;
const APP = URL_RAIZ + '/app.html';
const prof = path.join(SCR, 'chrome-prof7'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${prof}`, '--hide-scrollbars', '--window-size=1280,1000', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const res = [], erros = [];
const ok = (n, c, v) => res.push({ n, c: !!c, v });

(async () => {
  let lista; for (let i = 0; i < 60; i++) { try { lista = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); break; } catch (e) { await sleep(250); } }
  const ws = new WebSocket(lista.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => (ws.onopen = r));
  let id = 0; const pend = new Map();
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); return; }
    if (m.method === 'Runtime.exceptionThrown') erros.push('EXC: ' + (m.params.exceptionDetails.exception || {}).description);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') erros.push('console.error: ' + m.params.args.map(a => a.value || a.description).join(' '));
  };
  const send = (method, params) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
  const ev = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 400)); return r.result.result.value; };
  const mouse = (type, x, y, extra) => send('Input.dispatchMouseEvent', Object.assign({ type, x, y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1 }, extra || {}));
  const tecla = async (key, code, vk, mods) => { await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key, code, windowsVirtualKeyCode: vk, modifiers: mods || 0 }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: vk, modifiers: mods || 0 }); await sleep(80); };
  const shot = async nome => { const r = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(SCR, nome + '.png'), Buffer.from(r.result.data, 'base64')); };

  await send('Runtime.enable'); await send('Page.enable');
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    try { localStorage.setItem('limiar.auth', 'teste'); sessionStorage.setItem('limiar.boot', '1'); } catch (e) {}
    window.LIMIAR = window.LIMIAR || {};
    const guardadas = () => JSON.parse(localStorage.getItem('stub.fichas') || '{}');
    const stub = {
      sessao: () => ({ token: true, usuario: { id: 1234, login: 'teste' } }), limpar() {},
      me: async () => ({ id: 1234, login: 'teste' }),
      listar: async () => Object.values(guardadas()),
      salvar: async c => { const g = guardadas(); g[c.id] = c; localStorage.setItem('stub.fichas', JSON.stringify(g)); window.__salvos = (window.__salvos || 0) + 1; },
      excluir: async () => {}, logout: async () => {}, login: async () => ({}), registrar: async () => ({})
    };
    Object.defineProperty(window.LIMIAR, 'API', { get: () => stub, set: () => {}, configurable: true });
  ` });

  await send('Page.navigate', { url: APP });
  await sleep(2500);
  ok('app abriu com a API falsa', await ev(`!!(window.LIMIAR.App && LIMIAR.App.c && location.pathname.endsWith('app.html'))`));
  ok('10 abas, a última é Mapa', await ev(`(() => { const t = [...document.querySelectorAll('#tabs [role=tab]')]; return t.length === 10 && t[9].textContent.includes('Mapa'); })()`));

  await tecla('0', 'Digit0', 48, 1); // Alt+0
  ok('Alt+0 abre a aba Mapa', await ev(`LIMIAR.App.ui.tab === 'mapa' && !!document.querySelector('#mapa-root canvas')`));
  ok('paleta com 16 cores', await ev(`document.querySelectorAll('.mapa-cor').length === 16`));
  const r = await ev(`(() => { const r = document.querySelector('.mapa-canvas').getBoundingClientRect(); window.scrollTo(0, r.top + scrollY - 200); const q = document.querySelector('.mapa-canvas').getBoundingClientRect(); return { x: q.left, y: q.top, w: q.width, h: q.height }; })()`);
  await sleep(200);
  ok('canvas com tamanho', r.w > 600 && r.h > 300, r);

  // traço horizontal com a cor padrão (3 = verde)
  const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
  await mouse('mousePressed', cx - 80, cy);
  for (let i = 1; i <= 10; i++) await mouse('mouseMoved', cx - 80 + i * 16, cy);
  await mouse('mouseReleased', cx + 80, cy);
  await sleep(150);
  let m = await ev(`JSON.stringify(LIMIAR.App.c.mapa)`);
  let mapa = JSON.parse(m);
  ok('traço gravado como matriz', mapa && Array.isArray(mapa.m) && mapa.m.length === 1 && mapa.m[0].length >= 10 && mapa.m[0].every(v => v === 3), m);
  ok('formato: x, y inteiros e linhas de números 0-16', mapa && Number.isInteger(mapa.x) && Number.isInteger(mapa.y) && mapa.m.every(l => l.every(v => Number.isInteger(v) && v >= 0 && v <= 16)));

  // cor 5 e pincel 3: segundo traço vertical
  await ev(`document.querySelector('[data-mapa=cor][data-v="5"]').click(); document.querySelector('[data-mapa=tam][data-v="3"]').click(); true`);
  await mouse('mousePressed', cx, cy - 64);
  for (let i = 1; i <= 8; i++) await mouse('mouseMoved', cx, cy - 64 + i * 16);
  await mouse('mouseReleased', cx, cy + 64);
  await sleep(150);
  mapa = JSON.parse(await ev(`JSON.stringify(LIMIAR.App.c.mapa)`));
  const conta = (mp, v) => mp ? mp.m.flat().filter(x => (v == null ? x : x === v)).length : 0;
  ok('pincel 3×3 com a cor 5', conta(mapa, 5) >= 27 && mapa.m.length >= 9, { cor5: conta(mapa, 5), linhas: mapa.m.length });
  const antesBalde = conta(mapa);

  // desfazer / refazer
  await tecla('z', 'KeyZ', 90, 2);
  let m2 = JSON.parse(await ev(`JSON.stringify(LIMIAR.App.c.mapa)`));
  ok('Ctrl+Z desfaz o último traço', conta(m2, 5) === 0 && conta(m2, 3) >= 10);
  await tecla('y', 'KeyY', 89, 2);
  m2 = JSON.parse(await ev(`JSON.stringify(LIMIAR.App.c.mapa)`));
  ok('Ctrl+Y refaz', conta(m2, 5) === conta(mapa, 5));

  // balde na área visível vazia (cor 2)
  await ev(`document.querySelector('[data-mapa=cor][data-v="2"]').click(); document.querySelector('[data-mapa=ferr][data-v="balde"]').click(); true`);
  await mouse('mousePressed', r.x + 20, r.y + 20); await mouse('mouseReleased', r.x + 20, r.y + 20);
  await sleep(200);
  m2 = JSON.parse(await ev(`JSON.stringify(LIMIAR.App.c.mapa)`));
  const vis = await ev(`(() => { const c = document.querySelector('.mapa-canvas'); return Math.floor(c.clientWidth / 16) * Math.floor(c.clientHeight / 16); })()`);
  ok('balde preenche a área visível sem vazar', conta(m2, 2) > vis * 0.8 && conta(m2, 3) === conta(mapa, 3) && conta(m2, 5) === conta(mapa, 5), { azul: conta(m2, 2), visiveis: vis, verde: conta(m2, 3), vermelho: conta(m2, 5), antes: { verde: conta(mapa, 3), vermelho: conta(mapa, 5) } });
  await tecla('z', 'KeyZ', 90, 2);

  // borracha no traço verde
  await tecla('e', 'KeyE', 69, 0);
  await ev(`document.querySelector('[data-mapa=tam][data-v="1"]').click(); true`);
  await mouse('mousePressed', cx - 80, cy);
  for (let i = 1; i <= 4; i++) await mouse('mouseMoved', cx - 80 + i * 16, cy);
  await mouse('mouseReleased', cx - 16, cy);
  await sleep(150);
  m2 = JSON.parse(await ev(`JSON.stringify(LIMIAR.App.c.mapa)`));
  ok('borracha apaga (vira 0)', conta(m2, 3) < conta(mapa, 3) && m2.m.flat().includes(0), { verdeAntes: conta(mapa, 3), verdeDepois: conta(m2, 3) });

  // zoom com a roda e arrastar com o botão direito
  const z0 = await ev(`document.querySelector('.mapa-status').textContent`);
  await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: cx, y: cy, deltaX: 0, deltaY: -120 });
  await sleep(100);
  const z1 = await ev(`document.querySelector('.mapa-status').textContent`);
  ok('roda do mouse dá zoom', /Zoom 20px/.test(z1), { z0, z1 });
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: cx, y: cy, button: 'right', buttons: 2, clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: cx + 200, y: cy + 100, button: 'right', buttons: 2 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: cx + 200, y: cy + 100, button: 'right', buttons: 0, clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: cx, y: cy, buttons: 0 });
  await sleep(100);
  const coord = await ev(`document.querySelector('.mapa-status span').textContent`);
  ok('arrastar move a vista (malha sem fim)', /X -10 · Y -5/.test(coord), coord);
  const semMudar = JSON.stringify(m2) === await ev(`JSON.stringify(LIMIAR.App.c.mapa)`);
  ok('arrastar não pinta nada', semMudar);

  // desenho longe da origem: coordenadas negativas
  await tecla('b', 'KeyB', 66, 0);
  await mouse('mousePressed', r.x + 30, r.y + 30); await mouse('mouseReleased', r.x + 30, r.y + 30);
  await sleep(150);
  m2 = JSON.parse(await ev(`JSON.stringify(LIMIAR.App.c.mapa)`));
  ok('pinta em coordenadas negativas (matriz começa em x/y negativos)', m2.x < -20 && m2.y < -10, { x: m2.x, y: m2.y, w: m2.m[0].length, h: m2.m.length });

  // salvar: sincronização e JSON da ficha
  await sleep(2000);
  const salvo = await ev(`(() => { const g = JSON.parse(localStorage.getItem('stub.fichas') || '{}'); const f = g[LIMIAR.App.c.id]; return f && JSON.stringify(f.mapa) === JSON.stringify(LIMIAR.App.c.mapa) && window.__salvos > 0; })()`);
  ok('mapa enviado ao "banco" dentro da ficha', salvo);
  await shot('mapa-desktop');

  // troca de aba e volta: o desenho continua
  const antes = await ev(`JSON.stringify(LIMIAR.App.c.mapa)`);
  await ev(`document.querySelector('#tab-perito').click(); document.querySelector('#tab-mapa').click(); true`);
  await sleep(200);
  ok('trocar de aba mantém o desenho', antes === await ev(`JSON.stringify(LIMIAR.App.c.mapa)`) && await ev(`!!document.querySelector('#mapa-root canvas')`));

  // recarregar a página: o mapa vem do "banco"
  await send('Page.reload'); await sleep(2500);
  await ev(`document.querySelector('#tab-mapa').click(); true`); await sleep(300);
  ok('recarregar mantém o mapa', antes === await ev(`JSON.stringify(LIMIAR.App.c.mapa)`));

  // limpar com confirmação e desfazer
  await ev(`document.querySelector('[data-act="mapa-limpar"]').click(); true`);
  ok('limpar pede confirmação', await ev(`LIMIAR.App.ui.modal && LIMIAR.App.ui.modal.tipo === 'confirm'`));
  await ev(`document.querySelector('#modal-root [data-act="confirmar"]').click(); true`); await sleep(150);
  ok('limpar zera o mapa', await ev(`LIMIAR.App.c.mapa === null`));
  await ev(`document.querySelector('#toast-root [data-act="desfazer"]').click(); true`); await sleep(300);
  console.log('APOS DESFAZER', await ev(`JSON.stringify(LIMIAR.Mapa.estado())`));
  ok('Desfazer traz o mapa de volta', antes === await ev(`JSON.stringify(LIMIAR.App.c.mapa)`));

  // celular
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await sleep(400);
  await ev(`document.querySelector('#tab-mapa').click(); window.scrollTo(0, document.querySelector('#mapa-root').getBoundingClientRect().top + scrollY - 60); true`);
  await sleep(300);
  console.log('CELULAR', await ev(`JSON.stringify(LIMIAR.Mapa.estado())`));
  ok('celular sem rolagem lateral', await ev(`document.documentElement.scrollWidth <= innerWidth`));
  await shot('mapa-celular');

  ok('sem erros no console', !erros.length, erros.slice(0, 5));
  for (const x of res) console.log((x.c ? 'OK   ' : 'FALHA') + ' ' + x.n + (x.c ? '' : ' → ' + JSON.stringify(x.v)));
  console.log(`${res.filter(x => x.c).length}/${res.length}`);
  chrome.kill(); process.exit(0);
})().catch(e => { console.error('ERRO', e); chrome.kill(); process.exit(1); });
