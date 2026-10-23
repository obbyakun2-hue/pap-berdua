-- PAP Berdua — jalankan SEKALI di Supabase: SQL Editor → New query → tempel → Run
-- Membuat tabel foto PAP + tabel lokasi terakhir, hanya bisa diakses akun yang login.

create table if not exists public.pap (
  id bigint generated always as identity primary key,
  sender text not null,
  photo text not null,
  caption text,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

create table if not exists public.lokasi (
  sender text primary key,
  lat double precision not null,
  lng double precision not null,
  updated_at timestamptz not null default now()
);

alter table public.pap enable row level security;
alter table public.lokasi enable row level security;

drop policy if exists "akun login akses penuh pap" on public.pap;
create policy "akun login akses penuh pap" on public.pap
  for all to authenticated using (true) with check (true);

drop policy if exists "akun login akses penuh lokasi" on public.lokasi;
create policy "akun login akses penuh lokasi" on public.lokasi
  for all to authenticated using (true) with check (true);
