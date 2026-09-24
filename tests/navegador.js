// Abre o app no Chrome headless com a API do Supabase trocada por uma falsa (nada vai para o banco)
// e uma ficha de exemplo; tira prints das abas e roda um roteiro de testes opcional.
// Uso: node tests/navegador.js <prefixo> [largura] [abas separadas por vírgula | "todas" | "nenhuma"] [--acoes=acoes-celular.js]
// Prints em tests/saida/.
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');
const RAIZ = path.resolve(__dirname, '..');
const URL_RAIZ = 'file:///' + RAIZ.replace(/\\/g, '/').split('/').map(encodeURIComponent).join('/').replace(/^file:\/\/\/(\w)%3A/, 'file:///$1:');
const SAIDA = path.join(__dirname, 'saida');
fs.mkdirSync(SAIDA, { recursive: true });
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const SCR = SAIDA, PORT = 9337;
const ROOT = RAIZ + '/';
const APP = URL_RAIZ + '/app.html';
const prefixo = process.argv[2] || 'mob';
const largura = +(process.argv[3] || 390);
const abasArg = process.argv[4] || 'todas';
const TODAS = ['perito', 'atributos', 'origem', 'corpo', 'mente', 'equipamento', 'caminhos', 'revelacoes', 'regras', 'mapa'];
const abas = abasArg === 'todas' ? TODAS : abasArg === 'nenhuma' ? [] : abasArg.split(',');
const extra = process.argv.find(a => a.startsWith('--acoes='));

/* ficha de exemplo */
global.window = global;
require(ROOT + 'js/data.js'); require(ROOT + 'js/dice.js'); require(ROOT + 'js/rules.js');
const R = window.LIMIAR.Rules;
let c = R.novoPerito('base');
Object.assign(c, { nome: 'Helena Varga', jogador: 'Lyssa', idade: '34', origem: 'Porto Alegre' });
c.atributos.base = { VIG: 2, ACU: 1, PSI: 1, ESO: 0, RAZ: 1 };
c.nivel = 2; c.conhecimento = 45;
R.aplicarOrigem(c, 'policial');
c.rolagens = { defesa: 5, sanidade: 4, dinheiro: 12, atleta: null };
c.niveis = [{ nivel: 1, vida: 3, san: 2 }, { nivel: 2, vida: 2, san: 3 }];
c.nos = ['casca-grossa'];
c.sanidade = -12; c.status.insano = true;
c.palavras.push({ texto: '', tipo: 'verbal', classe: 1 }, { texto: '', tipo: 'poder', classe: 3 }, { texto: '', tipo: 'impulso', classe: 2 });
c.magias.push({ nome: 'Barreira de Sangue', classe: 3, conjuntos: 1, gatilho: 'palavras', efeito: 'Barreira de sangue coagulado.', duracao: '3 turnos' });
c.catalogo.push({ id: 'k1', nome: 'Lanterna', tipo: 'item', dano: '', efeito: 'Ilumina 10m.' });
c.historia.origem = 'Cresceu entre os cais e as fábricas de fósforo.';
c.mapa = { x: -4, y: -3, m: [[0, 3, 3, 3, 0, 0, 0], [3, 3, 11, 3, 3, 0, 0], [3, 11, 11, 11, 3, 2, 2], [0, 3, 3, 3, 2, 2, 10], [0, 0, 7, 7, 2, 10, 10]] };
c = R.normalizar(c);
const FICHA = JSON.stringify({ [c.id]: c });

const prof = path.join(SCR, 'chrome-prof8'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${prof}`, '--hide-scrollbars', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const erros = [];
(async () => {
  let lista; for (let i = 0; i < 60; i++) { try { lista = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); break; } catch (e) { await sleep(250); } }
  const ws = new WebSocket(lista.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => (ws.onopen = r));
  let id = 0; const pend = new Map();
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); return; }
    if (m.method === 'Runtime.exceptionThrown') erros.push('EXC: ' + ((m.params.exceptionDetails.exception || {}).description || m.params.exceptionDetails.text));
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') erros.push('console.error: ' + m.params.args.map(a => a.value || a.description).join(' '));
  };
  const send = (method, params) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
  const ev = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true }); if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 500)); return r.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: largura, height: 844, deviceScaleFactor: 1, mobile: largura < 700 });
  if (largura < 700) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    try { localStorage.setItem('limiar.auth', 'teste'); sessionStorage.setItem('limiar.boot', '1');
      if (!localStorage.getItem('stub.fichas')) localStorage.setItem('stub.fichas', ${JSON.stringify(FICHA)}); } catch (e) {}
    window.LIMIAR = window.LIMIAR || {};
    const guardadas = () => JSON.parse(localStorage.getItem('stub.fichas') || '{}');
    const stub = {
      sessao: () => ({ token: true, usuario: { id: 1234, login: 'lyssa' } }), limpar() {},
      me: async () => ({ id: 1234, login: 'lyssa' }),
      listar: async () => Object.values(guardadas()),
      salvar: async c => { const g = guardadas(); g[c.id] = c; localStorage.setItem('stub.fichas', JSON.stringify(g)); },
      excluir: async () => {}, logout: async () => {}, login: async () => ({}), registrar: async () => ({})
    };
    Object.defineProperty(window.LIMIAR, 'API', { get: () => stub, set: () => {}, configurable: true });
  ` });
  await send('Page.navigate', { url: APP });
  await sleep(2500);
  const shot = async (nome, cheio) => {
    let clip;
    if (cheio) {
      const h = await ev(`Math.min(document.documentElement.scrollHeight, 6000)`);
      clip = { x: 0, y: 0, width: largura, height: h, scale: 1 };
    }
    const r = await send('Page.captureScreenshot', Object.assign({ format: 'png' }, cheio ? { clip, captureBeyondViewport: true } : {}));
    fs.writeFileSync(path.join(SCR, `${prefixo}-${nome}.png`), Buffer.from(r.result.data, 'base64'));
  };
  await shot('topo', false);
  for (const t of abas) {
    await ev(`(() => { const A = LIMIAR.App; A.ui.modal = null; A.ui.gaveta = false; document.querySelector('#modal-root').innerHTML = ''; const b = document.querySelector('#tab-${t}') || document.querySelector('[data-act="tab"][data-a="${t}"]'); b.click(); window.scrollTo(0, 0); return true; })()`);
    await sleep(350);
    const larg = await ev(`({ sw: document.documentElement.scrollWidth, vw: innerWidth })`);
    if (larg.sw > larg.vw) erros.push(`${t}: rolagem lateral ${larg.sw} > ${larg.vw}`);
    await shot(t, true);
  }
  if (extra) {
    const acoes = require(path.resolve(__dirname, extra.slice(8)));
    await acoes({ ev, send, shot, sleep, erros });
  }
  console.log(erros.length ? erros.join('\n') : 'sem erros');
  chrome.kill(); process.exit(0);
})().catch(e => { console.error('ERRO', e); chrome.kill(); process.exit(1); });
