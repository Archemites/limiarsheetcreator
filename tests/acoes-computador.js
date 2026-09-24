module.exports = async ({ ev, send, shot, sleep }) => {
  const r = await ev(`(() => { const vis = s => { const e = document.querySelector(s); return !!e && getComputedStyle(e).display !== 'none'; }; return { abas: vis('#tabs'), controles: vis('.top-controls'), setas: vis('.nav-setas'), abaAtual: vis('#aba-atual'), botao: document.querySelector('.logo-topo').getBoundingClientRect().height }; })()`);
  console.log('DESKTOP', JSON.stringify(r));
  await ev(`document.querySelector('.logo-topo').click(); true`); await sleep(300);
  console.log('GAVETA', await ev(`!!document.querySelector('#gaveta') && document.querySelectorAll('#gaveta .gaveta-item').length`));
  await shot('desk-gaveta', false);
  await ev(`document.querySelector('#gaveta [data-act="gaveta-fechar"]').click(); true`); await sleep(200);
  await ev(`document.querySelector('[data-act="pdf-modal"]').click(); true`); await sleep(300);
  console.log('PDF DESKTOP', JSON.stringify(await ev(`[...document.querySelectorAll('#modal-root .modal-acts .btn')].map(b => b.textContent.trim())`)));
};
