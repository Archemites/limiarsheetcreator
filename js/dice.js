/* LIMIAR — dados. Expressões: "2d6+3", "d20", "1d100", "d%", "3d20kl2" (mantém os 2 menores). */
(function () {
  'use strict';
  const L = (window.LIMIAR = window.LIMIAR || {});

  function rnd(sides) {
    sides = Math.max(1, Math.floor(sides));
    const c = typeof crypto !== 'undefined' && crypto.getRandomValues ? crypto : null;
    if (c) {
      // rejeição para evitar viés de módulo
      const max = Math.floor(0x100000000 / sides) * sides;
      const buf = new Uint32Array(1);
      let v;
      do { c.getRandomValues(buf); v = buf[0]; } while (v >= max);
      return (v % sides) + 1;
    }
    return 1 + Math.floor(Math.random() * sides);
  }

  const TERM = /([+-]?)\s*(?:(\d*)d(\d+|%)(?:(kh|kl)(\d+))?|(\d+))/gi;

  function parse(expr) {
    const src = String(expr || '').replace(/\s+/g, '').toLowerCase();
    if (!src) return null;
    const terms = [];
    let consumed = 0;
    TERM.lastIndex = 0;
    let m;
    while ((m = TERM.exec(src)) !== null) {
      if (m.index !== consumed) return null;
      if (m[0] === '') { TERM.lastIndex++; continue; }
      consumed = m.index + m[0].length;
      const sign = m[1] === '-' ? -1 : 1;
      if (m[6] !== undefined) {
        terms.push({ sign, k: Number(m[6]) });
      } else {
        const n = m[2] === '' ? 1 : Number(m[2]);
        const sides = m[3] === '%' ? 100 : Number(m[3]);
        if (n < 1 || n > 200 || sides < 1 || sides > 1000) return null;
        const t = { sign, n, sides };
        if (m[4]) { t.keep = m[4]; t.keepN = Math.max(1, Math.min(n, Number(m[5]))); }
        terms.push(t);
      }
    }
    if (consumed !== src.length || !terms.length) return null;
    return terms;
  }

  function valid(expr) { return parse(expr) !== null; }

  /* opts.max: dados no máximo (crítico) · opts.minFace/opts.minTo: ex. Teimosia Bruta (1 -> 5) */
  function roll(expr, opts) {
    opts = opts || {};
    const terms = parse(expr);
    if (!terms) return { ok: false, expr: String(expr || ''), total: 0, text: 'expressão inválida', terms: [] };
    let total = 0;
    const out = [];
    for (const t of terms) {
      if (t.k !== undefined) {
        total += t.sign * t.k;
        out.push({ sign: t.sign, k: t.k });
        continue;
      }
      let rolls = [];
      for (let i = 0; i < t.n; i++) {
        let v = opts.max ? t.sides : rnd(t.sides);
        const orig = v;
        if (opts.onesTo && v === 1) v = opts.onesTo;
        rolls.push({ v, orig });
      }
      let kept = rolls.map((r, i) => i);
      if (t.keep) {
        const order = rolls.map((r, i) => i).sort((a, b) => t.keep === 'kh' ? rolls[b].v - rolls[a].v : rolls[a].v - rolls[b].v);
        kept = order.slice(0, t.keepN).sort((a, b) => a - b);
      }
      const sum = kept.reduce((s, i) => s + rolls[i].v, 0);
      total += t.sign * sum;
      out.push({ sign: t.sign, n: t.n, sides: t.sides, keep: t.keep, keepN: t.keepN, rolls, kept, sum });
    }
    return { ok: true, expr: String(expr), total, terms: out, text: describe(out) };
  }

  function describe(terms) {
    return terms.map((t, i) => {
      const s = t.sign < 0 ? '−' : (i ? '+' : '');
      if (t.k !== undefined) return `${s}${t.k}`;
      const lbl = `${t.n}d${t.sides === 100 ? '100' : t.sides}${t.keep ? t.keep + t.keepN : ''}`;
      const faces = t.rolls.map((r, idx) => {
        const txt = r.orig !== r.v ? `${r.orig}→${r.v}` : String(r.v);
        return t.kept.includes(idx) ? txt : `~${txt}~`;
      }).join(',');
      return `${s}${lbl}[${faces}]`;
    }).join(' ');
  }

  function maxOf(expr) {
    const terms = parse(expr);
    if (!terms) return 0;
    return terms.reduce((s, t) => s + t.sign * (t.k !== undefined ? t.k : (t.keep ? t.keepN : t.n) * t.sides), 0);
  }

  function minOf(expr) {
    const terms = parse(expr);
    if (!terms) return 0;
    return terms.reduce((s, t) => s + t.sign * (t.k !== undefined ? t.k : (t.keep ? t.keepN : t.n)), 0);
  }

  /* Teste d20: modo 'normal' | 'vantagem' | 'desvantagem'. alvo = número mínimo (da tabela de DF). */
  function d20(mod, modo, alvo) {
    const a = rnd(20);
    const dois = modo === 'vantagem' || modo === 'desvantagem';
    const b = dois ? rnd(20) : null;
    let nat = a;
    if (modo === 'vantagem') nat = Math.max(a, b);
    if (modo === 'desvantagem') nat = Math.min(a, b);
    const total = nat + (mod || 0);
    const res = { dados: dois ? [a, b] : [a], nat, mod: mod || 0, total, modo: modo || 'normal', critico: nat === 20, falhaCritica: nat === 1, alvo: alvo == null ? null : alvo };
    if (alvo != null) res.sucesso = res.critico ? true : res.falhaCritica ? false : total >= alvo;
    return res;
  }

  /* Teste de porcentagem: 1d100 abaixo (ou igual) da chance = sucesso; 1 = crítico; 100 = falha crítica. */
  function pct(chance) {
    const v = rnd(100);
    const c = Math.max(0, Number(chance) || 0);
    return { dado: v, chance: c, sucesso: v !== 100 && (v === 1 || v <= c), critico: v === 1, falhaCritica: v === 100 };
  }

  L.Dice = { rnd, parse, valid, roll, maxOf, minOf, d20, pct };
})();
