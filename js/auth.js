/* LIMIAR — telas de login (index.html) e cadastro (registrar.html). */
(function () {
  'use strict';
  const L = window.LIMIAR;
  const API = L.API;
  const $ = s => document.querySelector(s);
  const APP = 'app.html';

  /* logo em barras, igual ao do app */
  const lg = L.DATA.LOGO.barras('LIMIAR');
  const cw = 10, rh = 10, bh = 7;
  $('#logo').innerHTML = `<svg viewBox="0 0 ${lg.colunas * cw} ${(lg.linhas - 1) * rh + bh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LIMIAR">${
    lg.barras.map(b => `<rect x="${b.x * cw}" y="${b.y * rh}" width="${b.w * cw}" height="${bh}" fill="${L.DATA.LOGO.CORES[b.row]}"/>`).join('')}</svg>`;
  $('#bar').innerHTML = L.DATA.LOGO.CORES.map(c => `<span style="background:${c}"></span>`).join('');

  const msg = (t, ok) => { const m = $('#msg'); m.textContent = t || ''; m.classList.toggle('ok', !!ok); };
  const ocupado = (btn, on, txt) => { btn.disabled = on; if (txt) btn.textContent = txt; };

  /* ---------- LOGIN ---------- */
  const formLogin = $('#form-login');
  if (formLogin) {
    // "Lembrar de mim": se já existe sessão válida, entra direto
    if (API.sessao()) {
      msg('Verificando sessão…', true);
      API.me().then(() => location.replace(APP)).catch(e => {
        if (e.status === 401) API.limpar();
        msg(e.status === 0 ? 'Sem conexão com o servidor.' : '');
      });
    }
    const q = new URLSearchParams(location.search);
    if (q.get('novo')) { $('#login').value = q.get('novo'); msg('Conta criada! Agora é só entrar.', true); $('#senha').focus(); }
    else $('#login').focus();

    formLogin.addEventListener('submit', async e => {
      e.preventDefault();
      const login = $('#login').value.trim();
      const senha = $('#senha').value;
      if (!login || !senha) { msg('Preencha login e senha.'); return; }
      const btn = $('#entrar');
      ocupado(btn, true, 'Entrando…');
      msg('');
      try {
        await API.login(login, senha, $('#lembrar').checked);
        msg('Acesso liberado.', true);
        location.replace(APP);
      } catch (err) {
        msg(err.message);
        ocupado(btn, false, 'Entrar');
        $('#senha').select();
      }
    });
  }

  /* ---------- REGISTRO ---------- */
  const formReg = $('#form-registro');
  if (formReg) {
    $('#login').focus();
    let captchaOk = false;
    const cbtn = $('#captcha-btn'), cbox = $('#captcha-box');
    cbtn.addEventListener('click', () => {
      if (captchaOk || cbox.querySelector('.spin')) return;
      cbox.innerHTML = '<span class="spin"></span>';
      setTimeout(() => {
        captchaOk = true;
        cbox.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="#36e08a" stroke-width="3.2" stroke-linecap="square"/></svg>';
        $('#captcha').classList.add('ok');
        cbtn.setAttribute('aria-pressed', 'true');
        msg('');
      }, 900);
    });

    formReg.addEventListener('submit', async e => {
      e.preventDefault();
      const login = $('#login').value.trim();
      const senha = $('#senha').value;
      if (!/^[A-Za-z0-9_.-]{3,24}$/.test(login)) { msg('Login: 3 a 24 caracteres (letras, números, _ . -).'); $('#login').focus(); return; }
      if (senha.length < 6) { msg('A senha precisa ter pelo menos 6 caracteres.'); $('#senha').focus(); return; }
      if (senha !== $('#senha2').value) { msg('As senhas não conferem.'); $('#senha2').select(); return; }
      if (!captchaOk) { msg('Confirme que você não é um robô.'); cbtn.focus(); return; }
      const btn = $('#criar');
      ocupado(btn, true, 'Criando…');
      try {
        const u = await API.registrar(login, senha, true);
        msg(`Conta criada! Seu ID: #${u.id}`, true);
        setTimeout(() => location.replace('index.html?novo=' + encodeURIComponent(u.login)), 1200);
      } catch (err) {
        msg(err.message);
        ocupado(btn, false, 'Criar conta');
      }
    });
  }
})();
