// Gera PDFs de teste sem navegador (Node + jsPDF). Uso: node tests/pdf.js [--sem-fontes]   (PDFs em tests/saida/)
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, 'saida');
fs.mkdirSync(OUT, { recursive: true });
global.window = global;
require(ROOT + '/js/data.js');
require(ROOT + '/js/dice.js');
require(ROOT + '/js/rules.js');
window.jspdf = require(ROOT + '/vendor/jspdf.umd.min.js');
require(ROOT + '/js/pdf.js');
const L = window.LIMIAR, R = L.Rules;

const semFontes = process.argv.includes('--sem-fontes');
if (!semFontes) {
  L.PDF.fontes = {};
  for (const f of ['VT323-Regular.ttf', 'IBMPlexMono-Regular.ttf', 'IBMPlexMono-Bold.ttf', 'IBMPlexMono-Italic.ttf'])
    L.PDF.fontes[f] = fs.readFileSync(ROOT + '/assets/fonts/' + f).toString('base64');
  L.PDF.fontesOk = true;
}

function exemplo(modulo) {
  const c = R.novoPerito(modulo);
  c.nome = modulo === 'passado' ? 'Aldric de Themmia — o Juramentado' : 'Helena Varga “Fósforo”';
  c.jogador = 'Guilherme'; c.idade = '34'; c.origem = modulo === 'passado' ? 'Nefertat' : 'Porto Alegre, RS';
  c.atributos.base = { VIG: 2, ACU: 1, PSI: 1, ESO: 0, RAZ: 1 };
  c.atributos.nivel = { VIG: 1, ACU: 1, PSI: 0, ESO: 1, RAZ: 0 };
  c.nivel = 3; c.conhecimento = 45;
  R.aplicarOrigem(c, modulo === 'passado' ? 'cavaleiro' : 'policial');
  c.rolagens = { defesa: 5, sanidade: 4, dinheiro: 12, atleta: null };
  c.dinheiro = 9;
  c.niveis = [
    { nivel: 1, vida: 3, vidaModo: 'max', san: 2, sanModo: 'max', epifania: '' },
    { nivel: 2, vida: 1, vidaModo: 'cura', san: 4, sanModo: 'max', epifania: '' },
    { nivel: 3, vida: 4, vidaModo: 'max', san: null, sanModo: 'max', epifania: '' }
  ];
  c.nos = ['casca-grossa', 'bloqueio-perfeito', 'folego-de-ferro'];
  c.vida.bracoE = 2; c.vida.tronco = 9; c.perdidos.pernaE = true;
  c.sanidade = -12;
  c.status.insano = true; c.status.sangrando = true; c.status.atordoado = 2; c.status.infeccao = true; c.status.infeccaoMembro = 'bracoE';
  c.disturbios.ansiedade = 'moderada'; c.disturbios.esquizofrenia.paranoide = true; c.disturbios.medicado.ansiedade = true;
  c.itens.push(R.itemDoCatalogo('gaze', { local: 'rapido', qtd: 2 }));
  c.itens.push(R.itemDoCatalogo('cigarros-marca', { local: 'bagagem', qtd: 3 }));
  c.itens.push(R.itemDoCatalogo('capacete-couro', { local: 'armadura' }));
  c.itens.push(R.itemDoCatalogo('martelos', { local: 'maoE' }));
  c.itens.push(R.itemDoCatalogo('espingarda', { local: 'bagagem' }));
  c.itens.push(R.normalizarItem({ nome: 'Amuleto de osso ☠', tipo: 'acessorio', local: 'acessorio', notas: 'Presente da avó. Vibra perto do Véu.' }));
  c.itens.push(R.normalizarItem({ nome: 'Casa em ruínas', tipo: 'item', local: 'patrimonio' }));
  c.desarmado = '1d4';
  c.palavras.push({ texto: "Gof'nnn", tipo: 'verbal', classe: 1, significado: 'Invocar / chamar' });
  c.palavras.push({ texto: "Gn'th'bthnk", tipo: 'poder', classe: 3, significado: 'Sangue' });
  c.palavras.push({ texto: "Mg'nglui", tipo: 'impulso', classe: 2, significado: 'Barreira, muralha' });
  c.magias.push({ nome: 'Barreira de Sangue', palavras: "Gof'nnn gn'th'bthnk mg'nglui", traducao: 'Spawn Blood Barrier', classe: 3, conjuntos: 1, gatilho: 'palavras', efeito: 'Ergue uma barreira de sangue coagulado que bloqueia 1d6 de dano por turno.', duracao: '3 turnos', notas: '' });
  c.rituais.push({ nome: 'Purificação do Relicário', nivel: 2, custo: 3, etapas: 'Desenhar o círculo com giz; acender 4 velas; recitar o nome do dono.', componentes: 'Giz ritualístico, 4 velas, objeto de valor sentimental', efeito: 'Remove maldições menores de um objeto.', duracao: 'Permanente', notas: '' });
  c.historia.origem = 'Cresceu entre os cais e as fábricas de fósforo, filha de um estivador e de uma costureira. Aprendeu cedo a ler as pessoas e a desconfiar do silêncio.';
  c.historia.motivacoes = 'Descobrir o que aconteceu com o irmão desaparecido na noite do incêndio no armazém 12.';
  c.historia.contato = 'Viu algo sem rosto atravessar as chamas — e o fogo se curvou para ele.';
  c.aparencia.fisico = 'Alta, cabelo curto grisalho precoce, cicatriz de queimadura no antebraço esquerdo.';
  c.aparencia.mental = 'Conta fósforos quando está nervosa. Nunca senta de costas para a porta.';
  c.notas = 'Deve 20 ao Tavares.\nO número 12 aparece em todo lugar.';
  return R.normalizar(c);
}

async function main() {
  const casos = [
    { nome: 'escuro-base', c: exemplo('base'), o: { tema: 'escuro' } },
    { nome: 'claro-passado', c: exemplo('passado'), o: { tema: 'claro', papel: 'letter' } },
    { nome: 'branco-escuro', c: R.novoPerito('base'), o: { tema: 'escuro', branco: true } },
    { nome: 'branco-claro-passado', c: R.novoPerito('passado'), o: { tema: 'claro', branco: true } }
  ];
  for (const k of casos) {
    const d = R.derive(k.c);
    const t0 = Date.now();
    const doc = L.PDF.gerar(k.c, d, k.o);
    const buf = Buffer.from(doc.output('arraybuffer'));
    const arq = path.join(OUT, `teste-${k.nome}${semFontes ? '-semfontes' : ''}.pdf`);
    fs.writeFileSync(arq, buf);
    console.log(k.nome, doc.getNumberOfPages(), 'págs', (buf.length / 1024).toFixed(0) + ' KB', (Date.now() - t0) + 'ms');
  }
}
main().catch(e => { console.error(e); process.exit(1); });
