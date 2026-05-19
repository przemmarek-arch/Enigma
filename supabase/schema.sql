create table if not exists public.document_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  file_name text not null,
  output_name text,
  file_size bigint,
  file_type text,
  created_at timestamptz not null default now()
);

alter table public.document_history enable row level security;

drop policy if exists "Users can read own document history" on public.document_history;
create policy "Users can read own document history"
  on public.document_history
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own document history" on public.document_history;
create policy "Users can insert own document history"
  on public.document_history
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own document history" on public.document_history;
create policy "Users can delete own document history"
  on public.document_history
  for delete
  using (auth.uid() = user_id);

create index if not exists document_history_user_created_idx
  on public.document_history (user_id, created_at desc);
