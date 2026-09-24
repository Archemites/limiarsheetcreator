/* LIMIAR — retrato: guardado minúsculo (64×80, paleta ANSI32, PNG indexado ~2-4 KB).
   O filtro EGA reduz ainda mais (32×40, 16 cores). Exibido ampliado sem borrar. */
(function () {
  'use strict';
  const L = (window.LIMIAR = window.LIMIAR || {});
  const EGA = [[0, 0, 0], [0, 0, 170], [0, 170, 0], [0, 170, 170], [170, 0, 0], [170, 0, 170], [170, 85, 0], [170, 170, 170],
    [85, 85, 85], [85, 85, 255], [85, 255, 85], [85, 255, 255], [255, 85, 85], [255, 85, 255], [255, 255, 85], [255, 255, 255]];
  /* ANSI32: as 16 cores EGA + 16 tons intermediários (peles, terras, céus) para retratos. */
  const ANSI32 = EGA.concat([[22, 20, 42], [92, 52, 30], [150, 95, 65], [200, 140, 105], [236, 190, 160], [255, 140, 40], [112, 110, 40], [30, 92, 52],
    [20, 80, 92], [120, 170, 230], [72, 52, 140], [122, 40, 92], [230, 120, 150], [222, 202, 142], [100, 110, 132], [212, 212, 212]]);
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const RET = { w: 64, h: 80 };   // guardado
  const RET_EGA = { w: 32, h: 40 }; // filtro EGA
  const RET_TELA = 320;             // largura exibida (múltiplo de 64 e 32)
  const cacheRetro = new Map();
  function carregarImagem(src) {
    return new Promise((ok, erro) => { const i = new Image(); i.onload = () => ok(i); i.onerror = erro; i.src = src; });
  }
  /* Reduz em etapas (metade por vez) para não serrilhar, depois ajusta ao tamanho final. */
  function reduzir(src, sx, sy, sw, sh, w, h) {
    let cv = document.createElement('canvas');
    let cw = sw, ch = sh;
    cv.width = cw; cv.height = ch;
    let cx = cv.getContext('2d');
    cx.fillStyle = '#000'; cx.fillRect(0, 0, cw, ch);
    cx.drawImage(src, sx, sy, sw, sh, 0, 0, cw, ch);
    while (cw / 2 >= w && ch / 2 >= h) {
      const n = document.createElement('canvas');
      n.width = Math.round(cw / 2); n.height = Math.round(ch / 2);
      const nx = n.getContext('2d');
      nx.imageSmoothingQuality = 'high';
      nx.drawImage(cv, 0, 0, n.width, n.height);
      cv = n; cx = nx; cw = n.width; ch = n.height;
    }
    const f = document.createElement('canvas');
    f.width = w; f.height = h;
    const fx = f.getContext('2d');
    fx.imageSmoothingQuality = 'high';
    fx.drawImage(cv, 0, 0, w, h);
    return f;
  }
  /* Quantiza com pontilhado ordenado (Bayer 4×4); devolve índices da paleta. */
  function quantizar(cv, pal, forca) {
    const { width: w, height: h } = cv;
    const p = cv.getContext('2d').getImageData(0, 0, w, h).data;
    const idx = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const t = (BAYER[(y % 4) * 4 + (x % 4)] / 16 - 0.5) * forca;
        const r = p[i] + t, g = p[i + 1] + t, b = p[i + 2] + t;
        let best = 0, bd = Infinity;
        for (let k = 0; k < pal.length; k++) {
          const dr = r - pal[k][0], dg = g - pal[k][1], db = b - pal[k][2];
          const dist = dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11;
          if (dist < bd) { bd = dist; best = k; }
        }
        idx[y * w + x] = best;
      }
    }
    return idx;
  }
  /* PNG de paleta (tipo 3), bem menor que o PNG RGBA do canvas. */
  let tabCRC = null;
  function crc32(bytes) {
    if (!tabCRC) { tabCRC = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; tabCRC[n] = c >>> 0; } }
    let c = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) c = tabCRC[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  async function pngIndexado(w, h, idx, pal) {
    const usados = [...new Set(idx)].sort((a, b) => a - b);
    const mapa = new Map(usados.map((k, i) => [k, i]));
    const cru = new Uint8Array(h * (w + 1));
    for (let y = 0; y < h; y++) { cru[y * (w + 1)] = 0; for (let x = 0; x < w; x++) cru[y * (w + 1) + 1 + x] = mapa.get(idx[y * w + x]); }
    const zlib = new Uint8Array(await new Response(new Blob([cru]).stream().pipeThrough(new CompressionStream('deflate'))).arrayBuffer());
    const chunk = (tipo, dados) => {
      const out = new Uint8Array(12 + dados.length);
      const v = new DataView(out.buffer);
      v.setUint32(0, dados.length);
      for (let i = 0; i < 4; i++) out[4 + i] = tipo.charCodeAt(i);
      out.set(dados, 8);
      v.setUint32(8 + dados.length, crc32(out.subarray(4, 8 + dados.length)));
      return out;
    };
    const ihdr = new Uint8Array(13);
    const hv = new DataView(ihdr.buffer);
    hv.setUint32(0, w); hv.setUint32(4, h); ihdr[8] = 8; ihdr[9] = 3;
    const plte = new Uint8Array(usados.length * 3);
    usados.forEach((k, i) => plte.set(pal[k], i * 3));
    const partes = [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('PLTE', plte), chunk('IDAT', zlib), chunk('IEND', new Uint8Array(0))];
    let bin = '';
    for (const p of partes) for (let i = 0; i < p.length; i++) bin += String.fromCharCode(p[i]);
    return 'data:image/png;base64,' + btoa(bin);
  }
  /* Qualquer imagem → retrato guardado (64×80, ANSI32). */
  async function comprimirRetrato(img) {
    const alvo = RET.w / RET.h;
    let sw = img.width, sh = img.height, sx = 0, sy = 0;
    if (sw / sh > alvo) { sw = sh * alvo; sx = (img.width - sw) / 2; } else { sh = sw / alvo; sy = (img.height - sh) / 2; }
    const cv = reduzir(img, sx, sy, sw, sh, RET.w, RET.h);
    return pngIndexado(RET.w, RET.h, quantizar(cv, ANSI32, 40), ANSI32);
  }
  /* Versão exibida: ANSI32 ampliado, ou o filtro EGA (menor ainda, 16 cores). */
  async function retratoTela(src, ega) {
    const k = (ega ? 'ega:' : 'ansi:') + src;
    if (cacheRetro.has(k)) return cacheRetro.get(k);
    const img = await carregarImagem(src);
    let base = img;
    if (ega) {
      const cv = reduzir(img, 0, 0, img.width, img.height, RET_EGA.w, RET_EGA.h);
      const idx = quantizar(cv, EGA, 72);
      const cx = cv.getContext('2d');
      const px = cx.createImageData(RET_EGA.w, RET_EGA.h);
      idx.forEach((c, i) => { px.data.set(EGA[c], i * 4); px.data[i * 4 + 3] = 255; });
      cx.putImageData(px, 0, 0);
      base = cv;
    }
    const big = document.createElement('canvas');
    big.width = RET_TELA; big.height = RET_TELA * RET.h / RET.w;
    const bx = big.getContext('2d');
    bx.imageSmoothingEnabled = false;
    bx.drawImage(base, 0, 0, big.width, big.height);
    const url = big.toDataURL('image/png');
    cacheRetro.set(k, url);
    return url;
  }
  L.Retrato = { carregarImagem, comprimirRetrato, retratoTela, RET, ANSI32, EGA };
})();
