/* LIMIAR — modelo da ficha e regras calculadas. Funções puras sempre que possível. */
(function () {
  'use strict';
  const L = (window.LIMIAR = window.LIMIAR || {});
  const D = L.DATA;

  const ATTR_KEYS = ['VIG', 'ACU', 'PSI', 'ESO', 'RAZ'];
  const MEMBRO_KEYS = D.MEMBROS.map(m => m.id);

  const int = v => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
  };
  const intOrNull = v => (v === null || v === undefined || v === '' ? null : (Number.isFinite(parseInt(v, 10)) ? parseInt(v, 10) : null));
  const sum = arr => arr.reduce((s, v) => s + v, 0);
  const fmtMod = v => (v > 0 ? '+' + v : String(v));
  const uid = p => (p || 'x') + '_' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  const porMembro = v => Object.fromEntries(MEMBRO_KEYS.map(k => [k, typeof v === 'function' ? v(k) : v]));

  /* ------------------------------------------------------------------ */
  /* MODELO                                                             */
  /* ------------------------------------------------------------------ */
  function novoPerito(modulo) {
    return {
      v: 1,
      id: uid('p'),
      modulo: modulo === 'passado' ? 'passado' : 'base',
      criadoEm: Date.now(),
      atualizadoEm: Date.now(),
      nome: '', jogador: '', idade: '', origem: '',
      retrato: null, retratoRetro: false, // padrão ANSI32; o filtro EGA reduz ainda mais
      historia: { origem: '', motivacoes: '', contato: '', livre: '' },
      aparencia: { fisico: '', mental: '' },
      notas: '',
      profissao: '', // '' = ainda não escolhida (a escolha é obrigatória)
      classe: '',
      rolagens: { defesa: null, sanidade: null, dinheiro: null, atleta: null },
      dinheiro: null,
      atributos: { base: { VIG: 0, ACU: 0, PSI: 0, ESO: 0, RAZ: 0 }, nivel: { VIG: 0, ACU: 0, PSI: 0, ESO: 0, RAZ: 0 } },
      psiPrimario: 'INT',
      nivel: 0,
      conhecimento: 0,
      niveis: [],
      vida: porMembro(null),
      perdidos: porMembro(false),
      ajustes: { vidaTodos: 0, vida: porMembro(0), sanidade: 0, folego: 0, defesa: 0 },
      sanidade: null,
      folego: null,
      sanMagia: 0,
      fome: 100, // Em um Passado Distante: barra da Party (100 = saciado)
      posturaGuarda: false, // Postura de Guarda armada para o próximo Bloqueio
      lucidezPendente: false,
      status: {
        exaustao: false, insano: false, cancer: false, embriagado: false,
        infeccao: false, infeccaoMembro: '', envenenado: false, sangrando: false, parasitado: false,
        amaldicoado: false, amaldicoadoTurnos: 0, chamas: false, atordoado: 0, paralizado: false, critico: false
      },
      disturbios: {
        depressao: '', ansiedade: '',
        esquizofrenia: { paranoide: false, hebefrenica: false, catatonica: false },
        medicado: { depressao: false, esquizofrenia: false, ansiedade: false },
        outros: ''
      },
      itens: [],
      catalogo: [], // itens que o jogador criou/conhece (começa vazio)
      mapa: null, // aba Mapa: { x, y, m: [[0,3,3], …] } — 0 = vazio, 1 a 16 = cores
      desarmado: '',
      nos: [],
      palavras: [],
      magias: [],
      rituais: []
    };
  }

  function mergeDefaults(def, raw) {
    if (Array.isArray(def)) return Array.isArray(raw) ? raw : def;
    if (def && typeof def === 'object') {
      const out = {};
      const src = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
      for (const k of Object.keys(def)) out[k] = mergeDefaults(def[k], src[k]);
      return out;
    }
    if (raw === undefined) return def;
    if (def === null) return raw;
    if (typeof def === 'number') return raw === null ? null : (Number.isFinite(Number(raw)) ? Number(raw) : def);
    if (typeof def === 'boolean') return !!raw;
    if (typeof def === 'string') return raw === null ? '' : String(raw);
    return raw;
  }

  /* Onde cada tipo de item pode ficar: armadura só equipada; arma só nas mãos ou na bagagem. */
  function locaisPermitidos(it) {
    if (it.tipo === 'armadura') return ['armadura'];
    if (it.tipo === 'cac' || it.tipo === 'dist') return ['maoE', 'maoD', 'bagagem'];
    return D.LOCAIS.map(l => l.id).filter(id => id !== 'armadura');
  }

  function normalizarItem(it) {
    const i = Object.assign({
      id: uid('it'), nome: 'Item', tipo: 'item', local: 'bagagem', qtd: 1, origem: 'manual', ref: null,
      dano: '', tiros: '', cega: false, fogo: false, efeito: '', rd: 0, defesa: 0, parte: '', notas: '', escolha: '', tamanho: ''
    }, it || {});
    i.qtd = Math.max(1, int(i.qtd) || 1);
    i.rd = int(i.rd);
    i.defesa = int(i.defesa);
    const ok = locaisPermitidos(i);
    if (!ok.includes(i.local)) i.local = ok.includes('bagagem') ? 'bagagem' : ok[0];
    return i;
  }

  function normalizar(raw) {
    const base = novoPerito(raw && raw.modulo);
    const c = mergeDefaults(base, raw || {});
    c.id = (raw && raw.id) || base.id;
    for (const k of ATTR_KEYS) {
      c.atributos.base[k] = int(c.atributos.base[k]);
      c.atributos.nivel[k] = Math.max(0, int(c.atributos.nivel[k]));
    }
    c.psiPrimario = c.psiPrimario === 'SAP' ? 'SAP' : 'INT';
    if (!D.PROF[c.profissao]) c.profissao = '';
    if (!D.CLASSE[c.classe]) c.classe = '';
    c.nivel = Math.max(0, int(c.nivel));
    c.conhecimento = Math.max(0, Math.min(100, int(c.conhecimento)));
    c.itens = (c.itens || []).map(normalizarItem);
    c.catalogo = (Array.isArray(c.catalogo) ? c.catalogo : []).filter(x => x && typeof x === 'object').map(x => ({
      id: String(x.id || uid('k')), nome: String(x.nome || 'Item').slice(0, 80), tipo: D.CATEGORIAS_ITEM.some(k => k.id === x.tipo) ? x.tipo : 'item',
      dano: String(x.dano || '').slice(0, 30), efeito: String(x.efeito || '').slice(0, 400)
    }));
    c.mapa = normalizarMapa(c.mapa);
    c.nos = (c.nos || []).filter(id => D.NOS[id]);
    c.palavras = (c.palavras || []).map(p => Object.assign({ id: uid('w'), texto: '', tipo: 'verbal', classe: 1, significado: '', origem: 'manual' }, p));
    c.magias = (c.magias || []).map(m => Object.assign({ id: uid('m'), nome: '', palavras: '', traducao: '', classe: 1, conjuntos: 1, gatilho: 'palavras', efeito: '', duracao: '', notas: '' }, m));
    c.rituais = (c.rituais || []).map(r => Object.assign({ id: uid('r'), nome: '', nivel: 1, custo: 1, etapas: '', componentes: '', efeito: '', duracao: '', notas: '' }, r));
    c.niveis = (c.niveis || []).map((h, idx) => Object.assign({ nivel: idx + 1, vida: null, vidaExtra: null, vidaModo: 'max', san: null, sanExtra: null, sanModo: 'max', epifania: '', revelacao: null, data: Date.now() }, h));
    // histórico sempre coerente com o nível
    while (c.niveis.length < c.nivel) c.niveis.push(novoRegistroNivel(c.niveis.length + 1));
    if (c.niveis.length > c.nivel) c.niveis.length = c.nivel;
    for (const k of ['defesa', 'sanidade', 'dinheiro', 'atleta']) c.rolagens[k] = intOrNull(c.rolagens[k]);
    c.dinheiro = intOrNull(c.dinheiro);
    c.sanidade = intOrNull(c.sanidade);
    c.folego = intOrNull(c.folego);
    for (const k of MEMBRO_KEYS) c.vida[k] = intOrNull(c.vida[k]);
    if (typeof c.retrato !== 'string' || !/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(c.retrato)) c.retrato = null;
    c.status.atordoado = Math.max(0, Math.min(3, int(c.status.atordoado)));
    c.fome = c.fome == null ? 100 : Math.max(0, Math.min(100, int(c.fome)));
    c.status.amaldicoadoTurnos = Math.max(0, int(c.status.amaldicoadoTurnos));
    return c;
  }

  /* Mapa: matriz de 0 a 16 (0 = vazio). Aceita linhas como arrays ou como texto "0,3,3". */
  const MAPA_LIMITE = 512;
  function normalizarMapa(m) {
    if (!m || typeof m !== 'object' || !Array.isArray(m.m) || !m.m.length) return null;
    const linhas = m.m.slice(0, MAPA_LIMITE).map(l => (Array.isArray(l) ? l : typeof l === 'string' ? l.split(',') : [])
      .slice(0, MAPA_LIMITE).map(v => { const n = parseInt(v, 10); return n >= 0 && n <= 16 ? n : 0; }));
    const w = Math.max(0, ...linhas.map(l => l.length));
    if (!w || !linhas.some(l => l.some(Boolean))) return null;
    linhas.forEach(l => { while (l.length < w) l.push(0); });
    return { x: int(m.x), y: int(m.y), m: linhas };
  }

  function novoRegistroNivel(nivel) {
    return { nivel, vida: null, vidaExtra: null, vidaModo: 'max', san: null, sanExtra: null, sanModo: 'max', epifania: '', revelacao: null, data: Date.now() };
  }

  /* ------------------------------------------------------------------ */
  /* ORIGEM (profissão / classe)                                        */
  /* ------------------------------------------------------------------ */
  function origemId(c) { return c.modulo === 'passado' ? c.classe : c.profissao; }
  function origemDe(c) {
    if (c.modulo === 'passado') return c.classe ? D.CLASSE[c.classe] || null : null;
    return c.profissao ? D.PROF[c.profissao] || null : null;
  }

  function itemDoCatalogo(ref, extra) {
    const r = D.CATALOGO_MAP[ref];
    if (!r) return normalizarItem(extra);
    return normalizarItem(Object.assign({
      nome: r.nome, tipo: r.cat, ref: r.id, dano: r.dano || '', tiros: r.tiros || '', cega: !!r.cega, fogo: !!r.fogo,
      efeito: r.efeito || '', rd: r.rd || 0, defesa: r.defesa || 0, parte: r.parte || '', origem: 'catalogo',
      local: r.cat === 'armadura' ? 'armadura' : 'bagagem',
      tamanho: r.tamanhos ? 'medio' : ''
    }, extra || {}));
  }

  function itemDeEquip(e) {
    if (e.escolha) {
      return normalizarItem({ nome: e.nome, tipo: 'escolha', escolha: e.escolha, origem: 'inicial', local: 'bagagem' });
    }
    if (e.ref) {
      const r = D.CATALOGO_MAP[e.ref];
      return itemDoCatalogo(e.ref, {
        nome: e.nome, origem: 'inicial', local: e.local || 'bagagem',
        notas: r && r.nome !== e.nome ? `Usa as regras de ${r.nome}.` : ''
      });
    }
    const tipo = e.tipo || 'item';
    const semDano = tipo === 'cac';
    return normalizarItem({
      nome: e.nome, tipo, parte: e.parte || '', origem: 'inicial',
      local: e.local || (tipo === 'armadura' ? 'armadura' : 'bagagem'),
      notas: tipo === 'armadura' ? 'RD e Defesa não definidas no livro: combine com o Espectador.' : (semDano ? 'Dano não definido no livro: combine com o Espectador.' : '')
    });
  }

  /* Troca a profissão/classe: remove o equipamento inicial anterior e aplica o novo. */
  function aplicarOrigem(c, id) {
    c.itens = c.itens.filter(i => i.origem !== 'inicial');
    c.palavras = c.palavras.filter(p => p.origem !== 'inicial');
    if (c.modulo === 'passado') c.classe = id; else c.profissao = id;
    c.rolagens.dinheiro = null;
    c.dinheiro = null;
    c.rolagens.atleta = null;
    const o = origemDe(c);
    if (!o) return;
    const novos = [];
    for (const e of o.equip || []) {
      const qtd = e.qtd || 1;
      for (let k = 0; k < qtd; k++) novos.push(itemDeEquip(e));
    }
    // primeira arma já vai para a mão direita
    const arma = novos.find(i => i.tipo === 'cac' || i.tipo === 'dist');
    if (arma && !c.itens.some(i => i.local === 'maoD')) arma.local = 'maoD';
    c.itens.push(...novos);
    if (o.conjuntoPalavras) {
      for (let k = 0; k < o.conjuntoPalavras; k++) {
        for (const tipo of ['verbal', 'poder', 'impulso']) {
          c.palavras.push({ id: uid('w'), texto: '', tipo, classe: 1, significado: 'Concedida pela classe — definida pelo Espectador', origem: 'inicial' });
        }
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* INVENTÁRIO                                                         */
  /* ------------------------------------------------------------------ */
  const CAT = Object.fromEntries(D.CATEGORIAS_ITEM.map(c => [c.id, c]));
  const ehArma = i => i.tipo === 'cac' || i.tipo === 'dist' || (i.tipo === 'escolha' && i.escolha === 'arma');
  const ehConsumivel = i => (CAT[i.tipo] && CAT[i.tipo].consumivel) || (i.tipo === 'escolha' && i.escolha === 'psicoativo');

  function avaliarInventario(itens) {
    const porLocal = Object.fromEntries(D.LOCAIS.map(l => [l.id, []]));
    for (const i of itens) (porLocal[i.local] || porLocal.bagagem).push(i);
    const armaduraPorParte = porMembro(null);
    const avisos = [];
    const armEquip = porMembro(0);
    for (const i of porLocal.armadura) {
      if (i.tipo !== 'armadura') { avisos.push(`"${i.nome}" não é armadura, mas está como armadura equipada.`); continue; }
      if (!i.parte || !armaduraPorParte.hasOwnProperty(i.parte)) { avisos.push(`Escolha a parte do corpo da armadura "${i.nome}".`); continue; }
      armEquip[i.parte]++;
      if (!armaduraPorParte[i.parte]) armaduraPorParte[i.parte] = i;
    }
    for (const k of MEMBRO_KEYS) if (armEquip[k] > 1) avisos.push(`Mais de uma armadura equipada em ${D.MEMBRO[k].nome} (limite: 1 por parte).`);
    for (const loc of D.LOCAIS) {
      if (!loc.limite) continue;
      const qtd = loc.id === 'rapido' ? sum(porLocal[loc.id].map(i => i.qtd)) : porLocal[loc.id].length;
      if (qtd > loc.limite) avisos.push(`${loc.nome}: ${qtd} de ${loc.limite} permitidos.`);
    }
    for (const i of porLocal.rapido) if (!ehConsumivel(i)) avisos.push(`"${i.nome}" não é consumível — só consumíveis ficam no acesso rápido.`);
    const bag = porLocal.bagagem;
    const bagArmas = sum(bag.filter(ehArma).map(i => i.qtd));
    const bagCons = sum(bag.filter(ehConsumivel).map(i => i.qtd));
    const bagArm = porMembro(0);
    for (const i of bag) if (i.tipo === 'armadura' && i.parte && bagArm.hasOwnProperty(i.parte)) bagArm[i.parte] += i.qtd;
    const Lm = D.LIMITES_BAGAGEM;
    if (bagArmas > Lm.armas) avisos.push(`Bagagem: ${bagArmas} armas (limite ${Lm.armas}).`);
    if (bagCons > Lm.consumiveis) avisos.push(`Bagagem: ${bagCons} consumíveis (limite ${Lm.consumiveis}).`);
    for (const k of MEMBRO_KEYS) if (bagArm[k] > Lm.armaduraPorParte) avisos.push(`Bagagem: ${bagArm[k]} peças de armadura de ${D.MEMBRO[k].nome} (limite ${Lm.armaduraPorParte}).`);
    return {
      porLocal, armaduraPorParte, avisos,
      contagem: {
        maos: porLocal.maoE.length + porLocal.maoD.length,
        rapido: sum(porLocal.rapido.map(i => i.qtd)),
        acessorios: porLocal.acessorio.length,
        armaduras: MEMBRO_KEYS.filter(k => armaduraPorParte[k]).length,
        bagArmas, bagCons, bagArm,
        patrimonio: porLocal.patrimonio.length
      }
    };
  }

  /* ------------------------------------------------------------------ */
  /* DERIVADOS                                                          */
  /* ------------------------------------------------------------------ */
  function derive(c) {
    const d = {};
    const origem = origemDe(c);
    const bonus = (origem && origem.bonus) || {};
    const nos = new Set(c.nos.filter(id => D.NOS[id]));
    const has = id => nos.has(id);
    d.origem = origem;
    d.bonus = bonus;
    d.nos = nos;
    d.has = has;
    d.modulo = D.MODULOS.find(m => m.id === c.modulo) || D.MODULOS[0];
    d.termo = d.modulo.termo;
    d.origemEscolhida = !!origem; // escolha obrigatória: não existe "nenhuma"
    d.nivel = c.nivel;

    /* Atributos */
    d.attr = {};
    for (const k of ATTR_KEYS) {
      const base = int(c.atributos.base[k]);
      const niv = int(c.atributos.nivel[k]);
      const prof = int(bonus[k]);
      const valor = base + niv + prof;
      d.attr[k] = { id: k, base, niv, prof, criacao: base + prof, valor, efetivo: valor, notas: [] };
    }
    if (c.status.cancer) {
      if (has('sangue-frio')) d.attr.VIG.notas.push('Câncer ignorado (Sangue Frio)');
      else { d.attr.VIG.efetivo -= 2; d.attr.VIG.notas.push('Câncer: -2'); }
    }
    d.pontos = {
      criacao: D.CRIACAO.pontos - sum(ATTR_KEYS.map(k => d.attr[k].base)),
      nivel: c.nivel - sum(ATTR_KEYS.map(k => d.attr[k].niv))
    };

    /* Sanidade (base fixada na criação: RAZÃO de criação + 1d6, mínimo 2) */
    const razC = d.attr.RAZ.criacao;
    const r6 = c.rolagens.sanidade;
    const san = { rolagem: r6, det: [], base: null, max: null, atual: null, faixa: null };
    if (r6 != null) {
      san.base = Math.max(2, razC + r6);
      san.max = san.base;
      san.det.push(`RAZÃO de criação (${fmtMod(razC)}) + 1d6 (${r6})${razC + r6 < 2 ? ' → mínimo 2' : ''} = ${san.base}`);
      if (bonus.sanMax) { san.max += bonus.sanMax; san.det.push(`${origem.nome}: +${bonus.sanMax}`); }
      if (has('ancora-racional')) { san.max += 1; san.det.push('Âncora Racional: +1'); }
      const nivSan = sum(c.niveis.filter(h => h.sanModo !== 'cura').map(h => int(h.san) + int(h.sanExtra)));
      if (nivSan) { san.max += nivSan; san.det.push(`Ganhos de nível: +${nivSan}`); }
      if (c.ajustes.sanidade) { san.max += int(c.ajustes.sanidade); san.det.push(`Ajuste manual: ${fmtMod(int(c.ajustes.sanidade))}`); }
      san.atual = c.sanidade == null ? san.max : c.sanidade;
    } else if (c.sanidade != null) {
      san.atual = c.sanidade;
    }
    if (san.atual != null && san.atual < 0) {
      san.faixa = D.FAIXAS_SANIDADE.find(f => san.atual <= f.max && san.atual >= f.min) || D.FAIXAS_SANIDADE[D.FAIXAS_SANIDADE.length - 1];
    }
    san.riscoDisturbio = san.atual != null && san.atual >= -5 && san.atual <= 1;
    d.sanidade = san;

    const faixaMin = san.faixa ? san.faixa.min : null;
    if (faixaMin === -30 && has('vazio-concentrado')) {
      d.attr.VIG.efetivo += 2;
      d.attr.VIG.notas.push('Vazio Concentrado: +2');
    }

    /* Penalidades de teste */
    const pen = { ALL: [], VIG: [], ACU: [], PSI: [], ESO: [], RAZ: [] };
    const notasPen = [];
    if (c.status.exaustao) {
      const v = Math.max(0, d.attr.VIG.efetivo);
      if (v) pen.ALL.push({ v: -v, fonte: 'Exaustão (-VIGOR)' });
    }
    if (c.status.embriagado) {
      if (has('foco-etilico')) notasPen.push('Embriagado sem penalidade (Foco Etílico)');
      else pen.ACU.push({ v: -2, fonte: 'Embriagado' });
    }
    if (faixaMin === -30) {
      if (has('vazio-concentrado')) notasPen.push('Perda de Memória não atrapalha (Vazio Concentrado)');
      else if (has('memoria-muscular')) notasPen.push('Perda de Memória ignorada (Memória Muscular)');
      else pen.ACU.push({ v: -1, fonte: 'Perda de Memória' });
    }
    if (faixaMin === -50) {
      if (has('cicatriz-lucida')) notasPen.push('Dano Cerebral Permanente ignorado (Cicatriz Lúcida)');
      else pen.ALL.push({ v: -5, fonte: 'Dano Cerebral Permanente' });
    }
    if (faixaMin === -60) pen.ALL.push({ v: -8, fonte: 'Dano Cerebral Grave Permanente' });
    d.pen = pen;
    d.notasPen = notasPen;
    d.modTeste = k => {
      const attrKey = k === 'INT' || k === 'SAP' ? 'PSI' : k;
      const baseV = k === 'INT' || k === 'SAP' ? d.sub[k].valor : d.attr[k].efetivo;
      return baseV + sum(pen.ALL.map(p => p.v)) + sum((pen[attrKey] || []).map(p => p.v));
    };
    d.penLista = k => {
      const attrKey = k === 'INT' || k === 'SAP' ? 'PSI' : k;
      return pen.ALL.concat(pen[attrKey] || []);
    };

    /* Sub-atributos de PSICOMETRIA */
    const psi = d.attr.PSI.efetivo;
    const penSec = has('sinergia-cognitiva') ? 1 : 3;
    const prim = c.psiPrimario === 'SAP' ? 'SAP' : 'INT';
    d.sub = {};
    for (const s of ['INT', 'SAP']) {
      const principal = s === prim;
      const det = [principal ? `PSICOMETRIA ${fmtMod(psi)} (principal)` : `PSICOMETRIA ${fmtMod(psi)} - ${penSec} (secundário${penSec === 1 ? ', Sinergia Cognitiva' : ''})`];
      let v = principal ? psi : psi - penSec;
      if (bonus[s]) { v += bonus[s]; det.push(`${origem.nome}: ${fmtMod(bonus[s])}`); }
      if (s === 'INT' && has('erudicao-absoluta')) { v += 2; det.push('Erudição Absoluta: +2'); }
      d.sub[s] = { id: s, valor: v, principal, det };
    }

    /* Corpo */
    const vig = d.attr.VIG.efetivo;
    const couro = has('couro-endurecido') ? 3 : 0;
    const nivVida = sum(c.niveis.filter(h => h.vidaModo !== 'cura').map(h => int(h.vida) + int(h.vidaExtra)));
    const inv = avaliarInventario(c.itens);
    d.inv = inv;
    const vigCri = d.attr.VIG.criacao;
    const r2d4 = c.rolagens.defesa;
    const defBase = r2d4 == null ? null : Math.max(0, r2d4 * vigCri) + int(c.ajustes.defesa);
    d.defesa = { rolagem: r2d4, vigCriacao: vigCri, base: defBase, bruto: r2d4 == null ? null : r2d4 * vigCri };
    d.membros = {};
    for (const m of D.MEMBROS) {
      const det = [`VIGOR ${fmtMod(vig)} + ${m.base}`];
      let max = vig + m.base;
      if (couro) { max += couro; det.push('Couro Endurecido +3'); }
      if (nivVida) { max += nivVida; det.push(`Níveis +${nivVida}`); }
      const adjT = int(c.ajustes.vidaTodos);
      if (adjT) { max += adjT; det.push(`Ajuste geral ${fmtMod(adjT)}`); }
      const adjM = int(c.ajustes.vida[m.id]);
      if (adjM) { max += adjM; det.push(`Ajuste ${fmtMod(adjM)}`); }
      const arm = inv.armaduraPorParte[m.id];
      d.membros[m.id] = {
        id: m.id, nome: m.nome, curto: m.curto, max, det,
        atual: c.vida[m.id] == null ? max : c.vida[m.id],
        perdido: !!c.perdidos[m.id],
        armadura: arm, rd: arm ? int(arm.rd) : 0,
        defesa: defBase == null ? null : defBase + (arm ? int(arm.defesa) : 0)
      };
    }
    const tro = d.membros.tronco;
    d.morte = c.perdidos.cabeca ? 'Cabeça arrancada' : (tro.atual <= 0 ? 'Vida do tronco zerada' : '');

    /* Fôlego */
    const fol = { det: [], max: Math.max(0, vig) };
    fol.det.push(`VIGOR ${fmtMod(vig)}${vig < 0 ? ' → 0' : ''}`);
    if (bonus.folego) { fol.max += bonus.folego; fol.det.push(`${origem.nome}: +${bonus.folego}`); }
    if (origem && origem.folegoDado) {
      if (c.rolagens.atleta != null) { fol.max += c.rolagens.atleta; fol.det.push(`${origem.nome} (${origem.folegoDado}): +${c.rolagens.atleta}`); }
      else fol.pendente = true;
    }
    if (has('metabolismo-infinito')) { fol.max += 3; fol.det.push('Metabolismo Infinito: +3'); }
    if (c.ajustes.folego) { fol.max += int(c.ajustes.folego); fol.det.push(`Ajuste manual: ${fmtMod(int(c.ajustes.folego))}`); }
    fol.atual = c.folego == null ? fol.max : c.folego;
    d.folego = fol;
    d.mov = {
      corrida: has('explosao-adrenalinica') ? 10 : 5,
      pulo: has('salto-espectral') ? 1 : 2,
      turno: has('passada-inumana') ? 20 : 10,
      recupera: has('folego-de-ferro') ? 2 : 1,
      forca: has('forca-descomunal') ? 'metade da DF em Fôlego' : 'a DF em Fôlego',
      marcha: has('marcha-infinita')
    };

    /* Progressão */
    d.conhecimento = c.conhecimento;
    d.tracos = { total: c.nivel, usados: nos.size, disponiveis: c.nivel - nos.size };
    d.revelacao = Math.min(65, 25 + 5 * nos.size);
    d.revelacaoSonho = c.conhecimento > 75 ? 5 : 0;
    d.dadoSanNivel = has('alma-teimosa') ? '1d6' : '1d4';
    d.iniciativa = { mod: d.attr.ACU.efetivo + (has('reflexos-afiados') ? 2 : 0), reflexos: has('reflexos-afiados') };
    d.contra = { df: 5, dfRazao: has('logica-quebrada') ? 4 : 5, dfInimigo: has('alvo-escorregadio') ? 8 : 6 };

    /* Terapia */
    const terBonus = int(bonus.terapia) + (has('escuta-ativa') ? 2 : 0);
    d.terapia = { dado: '1d6' + (terBonus ? '+' + terBonus : ''), empatia: has('empatia-terapeutica'), grupo: has('terapia-de-grupo'), auto: has('autoanalise'), plantao: has('plantao-eterno'), conduz: !!(origem && (origem.habilidades || []).includes('terapia')) || has('escuta-ativa') };

    /* Distúrbios */
    const di = c.disturbios;
    const ativos = [];
    if (di.depressao) { const g = D.DISTURBIOS.depressao.graus.find(x => x.id === di.depressao); if (g) ativos.push({ fam: 'depressao', nome: `Depressão ${g.nome}`, desc: g.desc }); }
    for (const t of D.DISTURBIOS.esquizofrenia.tipos) if (di.esquizofrenia[t.id]) ativos.push({ fam: 'esquizofrenia', nome: `Esquizofrenia ${t.nome}`, desc: t.desc });
    if (di.ansiedade) { const g = D.DISTURBIOS.ansiedade.graus.find(x => x.id === di.ansiedade); if (g) ativos.push({ fam: 'ansiedade', nome: `Ansiedade ${g.nome}`, desc: g.desc }); }
    d.disturbios = ativos;
    d.indicadores = {
      ansioso: !!di.ansiedade,
      estressado: D.DISTURBIOS.esquizofrenia.tipos.some(t => di.esquizofrenia[t.id]),
      deprimido: di.depressao === 'leve',
      suicida: di.depressao === 'moderada' || di.depressao === 'grave'
    };
    d.statusAtivos = D.STATUS.filter(s => (s.auto ? d.indicadores[s.id] : (s.id === 'atordoado' ? c.status.atordoado > 0 : !!c.status[s.id])));

    /* Magia */
    const pal = c.palavras;
    const nV = pal.filter(p => p.tipo === 'verbal').length;
    const nP = pal.filter(p => p.tipo === 'poder').length;
    const nI = pal.filter(p => p.tipo === 'impulso').length;
    const truncado = has('verbo-truncado');
    d.magia = {
      nV, nP, nI, truncado,
      conjuntos: truncado ? Math.min(nV, nP) : Math.min(nV, nP, nI),
      desequilibrado: truncado ? nV !== nP : !(nV === nP && nP === nI),
      bonusDado: has('amplificacao-verbal') ? '1d6' : '1d4',
      barganha: has('barganha-eficiente'),
      emprestimo: has('emprestimo-profano'),
      eco: has('eco-persistente')
    };

    /* Situacionais (rolador) */
    d.situacionais = [];
    if (origem && origem.situacional) origem.situacional.forEach(s => d.situacionais.push(Object.assign({ fonte: origem.nome }, s)));
    d.vantagemOrigem = (origem && origem.vantagem) || [];
    d.dicasNos = [];
    nos.forEach(id => { const ref = D.NOS[id]; if (ref.no.r) ref.no.r.forEach(r => d.dicasNos.push({ attr: r.a, txt: r.x, vantagem: !!r.v, fonte: ref.no.nome })); });
    if (faixaMin === -20 && has('furia-psicotica')) d.situacionais.push({ fonte: 'Fúria Psicótica', txt: '+2 em testes de Acerto em combate', v: 2, attrs: ['ACU'] });

    /* Habilidades (profissão/classe + nós) */
    d.habilidades = ((origem && origem.habilidades) || []).map(h => D.HABILIDADES[h]).filter(Boolean);

    /* Nós inválidos (ex.: nível reduzido depois) */
    d.nosInvalidos = [];
    for (const id of nos) {
      const st = statusNo(c, d, id, true);
      if (st.motivos.length) d.nosInvalidos.push({ id, nome: D.NOS[id].no.nome, motivos: st.motivos });
    }

    d.checklist = checklist(c, d);
    d.avisos = avisos(c, d);
    return d;
  }

  /* Estado de um nó: 'owned' | 'available' | 'locked'. ignorarTracos = só requisitos. */
  function statusNo(c, d, id, ignorarTracos) {
    const ref = D.NOS[id];
    const motivos = [];
    const owned = d.nos.has(id);
    const attrV = d.attr[ref.caminho.attr].valor;
    if (c.nivel < ref.nv) motivos.push(`Requer Nível ${ref.nv}`);
    if (ref.req && attrV < ref.req) motivos.push(`Requer ${D.ATTR[ref.caminho.attr].nome} ${ref.req}+`);
    if (ref.idx > 0 && !d.nos.has(ref.trilha.nos[ref.idx - 1].id)) motivos.push('Requer o Nó anterior da Trilha');
    if (!owned && !ignorarTracos && d.tracos.disponiveis <= 0) motivos.push('Sem Traços de Revelação disponíveis');
    const proximo = ref.trilha.nos[ref.idx + 1];
    return {
      estado: owned ? 'owned' : (motivos.length ? 'locked' : 'available'),
      motivos,
      podeRemover: owned && (!proximo || !d.nos.has(proximo.id)),
      ref
    };
  }

  function checklist(c, d) {
    const temTexto = o => Object.values(o).some(v => String(v || '').trim());
    const origemOk = d.origemEscolhida;
    const dinheiroOk = !d.origem || !d.origem.dinheiro || d.origem.dinheiro === '0' || c.rolagens.dinheiro != null;
    return [
      { id: 'nome', letra: 'A', txt: 'Nome do Perito', ok: !!c.nome.trim(), tab: 'perito' },
      { id: 'historia', letra: 'B', txt: 'História', ok: temTexto(c.historia), tab: 'perito' },
      { id: 'atributos', letra: 'C', txt: 'Atributos', ok: d.pontos.criacao === 0 && c.rolagens.sanidade != null && c.rolagens.defesa != null, tab: 'atributos',
        det: d.pontos.criacao !== 0 ? 'distribua os 5 pontos' : (c.rolagens.sanidade == null ? 'role a Sanidade (1d6)' : (c.rolagens.defesa == null ? 'role a Defesa (2d4)' : '')) },
      { id: 'origem', letra: 'D', txt: d.termo, ok: origemOk && dinheiroOk && !d.folego.pendente && !c.itens.some(i => i.tipo === 'escolha'), tab: 'origem',
        det: !origemOk ? `escolha uma ${d.termo.toLowerCase()}` : (!dinheiroOk ? 'role o dinheiro inicial' : (d.folego.pendente ? 'role o Fôlego extra' : (c.itens.some(i => i.tipo === 'escolha') ? 'escolha os itens iniciais' : ''))) },
      { id: 'aparencia', letra: 'E', txt: 'Aparência', ok: temTexto(c.aparencia), tab: 'perito' }
    ];
  }

  function avisos(c, d) {
    const out = [];
    const add = (nivel, txt, tab) => out.push({ nivel, txt, tab });
    for (const k of ATTR_KEYS) {
      const b = d.attr[k].base;
      if (b > D.CRIACAO.max || b < D.CRIACAO.min) add('erro', `${D.ATTR[k].nome}: pontos de criação devem ficar entre ${D.CRIACAO.min} e +${D.CRIACAO.max}.`, 'atributos');
    }
    if (d.pontos.criacao > 0) add('aviso', `Faltam ${d.pontos.criacao} ponto(s) de criação para distribuir.`, 'atributos');
    if (d.pontos.criacao < 0) add('erro', `${-d.pontos.criacao} ponto(s) de criação acima do permitido (5).`, 'atributos');
    if (d.pontos.nivel > 0) add('info', `${d.pontos.nivel} ponto(s) de atributo por nível para distribuir.`, 'atributos');
    if (d.pontos.nivel < 0) add('erro', `${-d.pontos.nivel} ponto(s) de nível distribuídos além do Nível ${c.nivel}.`, 'atributos');
    if (d.tracos.disponiveis > 0) add('info', `${d.tracos.disponiveis} Traço(s) de Revelação para investir nos Caminhos.`, 'caminhos');
    if (d.tracos.disponiveis < 0) add('erro', `${-d.tracos.disponiveis} Nó(s) além dos Traços de Revelação (Nível ${c.nivel}).`, 'caminhos');
    for (const n of d.nosInvalidos) add('erro', `${n.nome}: ${n.motivos.join(', ')}.`, 'caminhos');
    if (c.rolagens.sanidade == null) add('aviso', 'Role 1d6 para definir a Sanidade Total.', 'mente');
    if (c.rolagens.defesa == null) add('aviso', 'Role 2d4 para definir a Defesa.', 'corpo');
    if (d.origem && d.origem.dinheiro && d.origem.dinheiro !== '0' && c.rolagens.dinheiro == null) add('aviso', `Role o dinheiro inicial (${d.origem.dinheiro}).`, 'origem');
    if (d.folego.pendente) add('aviso', `Role o Fôlego extra de ${d.origem.nome} (${d.origem.folegoDado}).`, 'origem');
    if (c.itens.some(i => i.tipo === 'escolha')) add('aviso', 'Há itens iniciais "à escolha" esperando uma escolha.', 'equipamento');
    for (const a of d.inv.avisos) add('aviso', a, 'equipamento');
    if (d.magia.desequilibrado && c.palavras.length) add('aviso', 'Repertório desequilibrado: a quantidade de cada tipo de palavra deve ser a mesma.', 'revelacoes');
    for (const h of c.niveis) {
      if (h.vida == null || h.san == null) { add('aviso', `Nível ${h.nivel}: role os ganhos de Vida e Sanidade.`, 'mente'); break; }
    }
    if (d.morte) add('erro', `MORTE: ${d.morte}.`, 'corpo');
    for (const m of Object.values(d.membros)) if (m.max <= 0) { add('aviso', `${m.nome} com Vida máxima ${m.max}.`, 'corpo'); }
    if (d.sanidade.faixa) add('erro', `Sanidade ${d.sanidade.atual}: ${d.sanidade.faixa.efeito}.`, 'mente');
    return out;
  }

  /* ------------------------------------------------------------------ */
  /* AÇÕES DE REGRA (mutam a ficha, devolvem eventos para a UI)         */
  /* ------------------------------------------------------------------ */
  function registrarNivel(c) {
    c.nivel += 1;
    c.niveis.push(novoRegistroNivel(c.nivel));
    return c.nivel;
  }

  function removerNivel(c) {
    if (c.nivel <= 0) return;
    c.nivel -= 1;
    c.niveis.length = c.nivel;
  }

  /* Dano de Sanidade: dobra se Insano, trava em 0 até o teste da Corda da Loucura,
     soma ao Conhecimento (exceto rituais/magias) e sobe de nível a cada 100%. */
  function sofrerDanoSanidade(c, valor, opts) {
    opts = opts || {};
    const d = derive(c);
    const ev = { dano: 0, dobrado: false, corda: false, niveis: [], fio: false, lucidez: false, restauradora: false, folego: 0, antes: d.sanidade.atual, depois: null };
    let dano = Math.max(0, int(valor));
    if (!dano) return ev;
    if (c.status.insano) {
      if (d.has('loucura-restauradora')) ev.restauradora = true;
      else if (c.lucidezPendente) { c.lucidezPendente = false; ev.lucidez = true; }
      else { dano *= 2; ev.dobrado = true; }
    }
    ev.dano = dano;
    const atual = d.sanidade.atual == null ? 0 : d.sanidade.atual;
    let novo = atual - dano;
    const podeNegativar = c.status.insano || (opts.magia && d.has('emprestimo-profano'));
    if (!podeNegativar && novo <= 0) { novo = 0; ev.corda = true; }
    if (d.has('fio-da-consciencia') && novo < -70) { novo = -70; ev.fio = true; }
    novo = Math.max(-100, novo);
    c.sanidade = novo;
    ev.depois = novo;
    if (opts.magia) c.sanMagia += Math.max(0, atual - novo);
    if (!opts.ritual && !opts.magia) {
      c.conhecimento += dano;
      while (c.conhecimento >= 100) {
        c.conhecimento -= 100;
        ev.niveis.push(registrarNivel(c));
      }
    }
    if (d.has('combustao-mental')) {
      const fol = derive(c).folego;
      const ganho = Math.max(0, Math.min(dano, fol.max - fol.atual));
      if (ganho) { c.folego = fol.atual + ganho; if (c.folego >= fol.max) c.folego = null; ev.folego = ganho; }
    }
    return ev;
  }

  function recuperarSanidade(c, valor) {
    const d = derive(c);
    if (d.sanidade.max == null) return 0;
    const atual = d.sanidade.atual;
    const novo = Math.min(d.sanidade.max, atual + Math.max(0, int(valor)));
    c.sanidade = novo >= d.sanidade.max ? null : novo;
    return novo - atual;
  }

  function fimDeCombate(c) {
    const d = derive(c);
    const gasto = c.sanMagia;
    c.sanMagia = 0;
    if (!gasto) return { recuperado: 0, perdido: 0 };
    if (d.sanidade.atual > 0) return { recuperado: recuperarSanidade(c, gasto), perdido: 0 };
    return { recuperado: 0, perdido: gasto };
  }

  function custoMagia(m, d) {
    let porConjunto = Math.max(1, Math.min(5, int(m.classe) || 1));
    const barganha = d.has('barganha-eficiente') && porConjunto >= 3;
    if (barganha) porConjunto -= 1;
    const conjuntos = Math.max(1, int(m.conjuntos) || 1);
    return { porConjunto, conjuntos, total: porConjunto * conjuntos, turnos: conjuntos, barganha };
  }

  function ritualInfo(r, d) {
    const t = D.tempoRitual(r.nivel);
    const rapido = d.has('canalizacao-rapida');
    const acima = int(r.nivel) > d.attr.ESO.valor;
    const alem = d.has('conhecimento-alem');
    const custo = Math.max(0, int(r.custo)) * (acima && alem ? 2 : 1);
    return { tempo: rapido ? t.min / 2 : t.min, faixa: t.faixa, faixaDesc: t.desc, rapido, acima, alem, custo };
  }

  L.Rules = {
    ATTR_KEYS, MEMBRO_KEYS, int, intOrNull, sum, fmtMod, uid,
    novoPerito, normalizar, normalizarItem, locaisPermitidos, origemDe, origemId, aplicarOrigem, itemDoCatalogo,
    avaliarInventario, derive, statusNo, registrarNivel, removerNivel,
    sofrerDanoSanidade, recuperarSanidade, fimDeCombate, custoMagia, ritualInfo, ehArma, ehConsumivel
  };
})();
