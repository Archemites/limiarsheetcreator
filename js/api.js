/* LIMIAR — contas e fichas na nuvem via Supabase (site 100% estático).
   A chave "publishable" é pública por design: quem protege os dados são as
   regras de linha (RLS) criadas em supabase.sql — cada um só vê as próprias fichas. */
(function () {
  'use strict';
  const L = (window.LIMIAR = window.LIMIAR || {});
  const SUPABASE_URL = 'https://bqvkfhjvmckepygmlgou.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_dMOGAGCL5WdoDBGUXiOvDw_-rpCoBVV';
  const K_AUTH = 'limiar.auth', K_LEMBRAR = 'limiar.lembrar', K_USER = 'limiar.usuario';
  const DOMINIO = '@limiar.app'; // o login vira um e-mail fictício só para o Supabase

  const ls = (() => { try { return window.localStorage; } catch (e) { return null; } })();
  const ss = (() => { try { return window.sessionStorage; } catch (e) { return null; } })();
  const lembrar = () => !!ls && ls.getItem(K_LEMBRAR) === '1';
  /* "Lembrar de mim": sessão no localStorage (entra sozinho); senão, só nesta aba. */
  const armazenamento = {
    getItem: k => (ls && ls.getItem(k)) || (ss && ss.getItem(k)) || null,
    setItem: (k, v) => {
      const [sim, nao] = lembrar() ? [ls, ss] : [ss, ls];
      if (sim) sim.setItem(k, v);
      if (nao) nao.removeItem(k);
    },
    removeItem: k => { if (ls) ls.removeItem(k); if (ss) ss.removeItem(k); }
  };

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { storage: armazenamento, storageKey: K_AUTH, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });

  function falha(e, padrao) {
    const txt = String((e && e.message) || e || '');
    const err = new Error(padrao || txt || 'Erro no servidor.');
    if (/fetch|network|Load failed/i.test(txt)) { err.message = 'Sem conexão com o servidor.'; err.status = 0; }
    else if (/JWT|not authenticated|session|expired|PGRST301/i.test(txt) || (e && (e.status === 401 || e.code === 'PGRST301'))) err.status = 401;
    else err.status = (e && e.status) || 500;
    return err;
  }
  const emailDe = login => String(login || '').trim().toLowerCase() + DOMINIO;
  const LOGIN_RE = /^[A-Za-z0-9_.-]{3,24}$/;

  function sessao() {
    if (!armazenamento.getItem(K_AUTH)) return null;
    let usuario = null;
    try { usuario = JSON.parse(armazenamento.getItem(K_USER) || 'null'); } catch (e) { usuario = null; }
    return { token: true, usuario };
  }
  function limpar() {
    armazenamento.removeItem(K_AUTH);
    armazenamento.removeItem(K_USER);
  }

  async function perfil(uid) {
    const { data, error } = await sb.from('usuarios').select('numero, login').eq('id', uid).single();
    if (error) throw falha(error);
    return { id: data.numero, login: data.login };
  }

  L.API = {
    sessao, limpar,

    async registrar(login, senha, captcha) {
      if (captcha !== true) throw falha(null, 'Confirme que você não é um robô.');
      if (!LOGIN_RE.test(login || '')) throw falha(null, 'Login: 3 a 24 caracteres (letras, números, _ . -).');
      if (typeof senha !== 'string' || senha.length < 6) throw falha(null, 'A senha precisa ter pelo menos 6 caracteres.');
      const { data, error } = await sb.auth.signUp({ email: emailDe(login), password: senha, options: { data: { login } } });
      if (error) {
        if (/already|registered|exists/i.test(error.message)) throw falha(error, 'Esse login já existe.');
        throw falha(error);
      }
      if (!data.session) throw falha(null, 'No Supabase, desligue "Confirm email" em Authentication → Email.');
      const u = await perfil(data.user.id);
      await sb.auth.signOut(); // o cadastro não loga: volta para a tela de login
      limpar();
      return u;
    },

    async login(login, senha, lembrarMe) {
      try { if (ls) ls.setItem(K_LEMBRAR, lembrarMe ? '1' : '0'); } catch (e) { /* ok */ }
      const { data, error } = await sb.auth.signInWithPassword({ email: emailDe(login), password: senha });
      if (error) throw falha(error, /invalid|credentials/i.test(error.message) ? 'Login ou senha incorretos.' : null);
      const u = await perfil(data.user.id);
      armazenamento.setItem(K_USER, JSON.stringify(u));
      return u;
    },

    async logout() {
      try { await sb.auth.signOut(); } finally { limpar(); }
    },

    async me() {
      const { data, error } = await sb.auth.getUser();
      if (error || !data.user) { const e = falha(error || 'sem sessão'); if (e.status !== 0) e.status = 401; throw e; }
      const u = await perfil(data.user.id);
      armazenamento.setItem(K_USER, JSON.stringify(u));
      return u;
    },

    async listar() {
      const { data, error } = await sb.from('fichas').select('ficha').eq('lixeira', 1).order('atualizado_em', { ascending: false });
      if (error) throw falha(error);
      return data.map(r => r.ficha);
    },

    async salvar(c) {
      const { error } = await sb.from('fichas').upsert({ id: c.id, nome: String(c.nome || ''), modulo: c.modulo || 'base', ficha: c });
      if (error) throw falha(error);
    },

    async excluir(id) {
      // não apaga de verdade: manda para a lixeira (lixeira = 0 some da lista)
      const { error } = await sb.from('fichas').update({ lixeira: 0 }).eq('id', id);
      if (error) throw falha(error);
    }
  };
})();
