-- LaJerga: Migración de base de datos
-- Ejecutar en Supabase SQL Editor

-- Extensión para UUIDs
create extension if not exists "uuid-ossp";

-- Tabla de jergas
create table if not exists public.jergas (
  id uuid default uuid_generate_v4() primary key,
  jerga text not null,
  significado text not null,
  ejemplo text,
  pais text not null,
  region text,
  categoria text,
  votos_positivos int default 0,
  votos_negativos int default 0,
  creado_por uuid references auth.users(id),
  creado_en timestamptz default now(),
  aprobado boolean default true
);

-- Tabla de perfiles
create table if not exists public.perfiles (
  id uuid references auth.users(id) primary key,
  email text,
  nombre text,
  pais text,
  jergas_agregadas int default 0,
  creado_en timestamptz default now()
);

-- Tabla de votos
create table if not exists public.votos (
  id uuid default uuid_generate_v4() primary key,
  jerga_id uuid references public.jergas(id) on delete cascade,
  ip_hash text not null,
  voto boolean not null,
  creado_en timestamptz default now()
);

-- Índices
create index if not exists idx_jergas_pais on public.jergas(pais);
create index if not exists idx_jergas_aprobado on public.jergas(aprobado);
create index if not exists idx_jergas_votos on public.jergas(votos_positivos desc);
create index if not exists idx_jergas_jerga on public.jergas using gin(jerga gin_trgm_ops);
create index if not exists idx_votos_jerga_ip on public.votos(jerga_id, ip_hash);

-- Extensión para búsqueda por trigrama (necesaria para el índice gin_trgm_ops)
create extension if not exists pg_trgm;

-- RLS (Row Level Security)
alter table public.jergas enable row level security;
alter table public.perfiles enable row level security;
alter table public.votos enable row level security;

-- Políticas para jergas
create policy "Jergas visibles para todos" on public.jergas
  for select using (aprobado = true);

create policy "Usuarios autenticados pueden insertar jergas" on public.jergas
  for insert with check (auth.uid() = creado_por);

-- Políticas para perfiles
create policy "Perfiles visibles para todos" on public.perfiles
  for select using (true);

create policy "Usuarios pueden actualizar su perfil" on public.perfiles
  for update using (auth.uid() = id);

-- Políticas para votos
create policy "Votos visibles para todos" on public.votos
  for select using (true);

create policy "Cualquiera puede votar" on public.votos
  for insert with check (true);

-- Función para crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.perfiles (id, email, nombre)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para crear perfil
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
