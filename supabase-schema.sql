create table if not exists public.dashboard_state (
  id text primary key,
  stages jsonb not null default '[]'::jsonb,
  activity jsonb not null default '[]'::jsonb,
  monitored_folders jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.dashboard_state add column if not exists monitored_folders jsonb not null default '[]'::jsonb;

alter table public.dashboard_state enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'dashboard_state'
  ) then
    alter publication supabase_realtime add table public.dashboard_state;
  end if;
end $$;

drop policy if exists "Allow public dashboard read" on public.dashboard_state;
drop policy if exists "Allow public dashboard write" on public.dashboard_state;
drop policy if exists "Allow public dashboard update" on public.dashboard_state;

create policy "Allow public dashboard read"
  on public.dashboard_state for select
  using (true);

create policy "Allow public dashboard write"
  on public.dashboard_state for insert
  with check (true);

create policy "Allow public dashboard update"
  on public.dashboard_state for update
  using (true)
  with check (true);

insert into public.dashboard_state (id, stages, activity, monitored_folders)
values ('main', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
on conflict (id) do nothing;
