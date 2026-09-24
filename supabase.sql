-- LIMIAR — tabelas do Supabase. Cole tudo no SQL Editor e clique em Run (pode rodar mais de uma vez).

-- Perfis: login + id de 4 dígitos (criado automaticamente no cadastro)
create table if not exists public.usuarios (
  id uuid primary key references auth.users (id) on delete cascade,
  numero int not null unique check (numero between 1000 and 9999),
  login text not null unique,
  criado_em timestamptz not null default now()
);

-- Fichas: o JSON completo do Perito, preso ao usuário
create table if not exists public.fichas (
  id text primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  numero_usuario int,
  nome text not null default '',
  modulo text not null default 'base',
  ficha jsonb not null,
  atualizado_em timestamptz not null default now()
);
-- Lixeira: 1 = ativo, 0 = apagado pelo usuário (some da lista, mas continua no banco)
alter table public.fichas add column if not exists lixeira smallint not null default 1;
alter table public.fichas drop constraint if exists fichas_lixeira_chk;
alter table public.fichas add constraint fichas_lixeira_chk check (lixeira in (0, 1));
create index if not exists fichas_user_idx on public.fichas (user_id, atualizado_em desc);

-- Cria o perfil com um número de 4 dígitos livre sempre que alguém se cadastra
create or replace function public.novo_usuario() returns trigger
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  loop
    n := 1000 + floor(random() * 9000)::int;
    exit when not exists (select 1 from public.usuarios where numero = n);
  end loop;
  insert into public.usuarios (id, numero, login)
  values (new.id, n, coalesce(new.raw_user_meta_data ->> 'login', split_part(new.email, '@', 1)));
  return new;
end $$;

drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario after insert on auth.users
  for each row execute function public.novo_usuario();

-- Quem se cadastrou antes deste script ganha o perfil agora
do $$
declare u record; n int;
begin
  for u in select * from auth.users a where not exists (select 1 from public.usuarios p where p.id = a.id) loop
    loop
      n := 1000 + floor(random() * 9000)::int;
      exit when not exists (select 1 from public.usuarios where numero = n);
    end loop;
    insert into public.usuarios (id, numero, login)
    values (u.id, n, coalesce(u.raw_user_meta_data ->> 'login', split_part(u.email, '@', 1)));
  end loop;
end $$;

-- Preenche o número do dono em cada ficha salva
create or replace function public.ficha_dono() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.user_id := auth.uid();
  new.numero_usuario := (select numero from public.usuarios where id = auth.uid());
  new.atualizado_em := now();
  return new;
end $$;

drop trigger if exists ao_salvar_ficha on public.fichas;
create trigger ao_salvar_ficha before insert or update on public.fichas
  for each row execute function public.ficha_dono();

-- Cada um só enxerga e mexe no que é seu
alter table public.usuarios enable row level security;
alter table public.fichas enable row level security;

drop policy if exists "ver o proprio perfil" on public.usuarios;
create policy "ver o proprio perfil" on public.usuarios for select using (id = auth.uid());

drop policy if exists "fichas do dono" on public.fichas;
create policy "fichas do dono" on public.fichas for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
