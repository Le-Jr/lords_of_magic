-- Moderated question bank. Questions are authored as static JSON content and
-- imported with the service role (scripts/import-questions.ts); nothing in the
-- game writes here.

create table public.questions (
  id            text primary key,
  category      text not null check (category in (
    'Web & Mobile Stack', 'Platforms', 'General Development'
  )),
  difficulty    text not null check (difficulty in (
    'Vibecoder', 'Junior', 'Mid-level', 'Senior',
    'Linus Torvalds', 'Code Wizard Supreme'
  )),
  type          text not null check (type in ('multiple_choice', 'text')),
  question_text text not null check (char_length(question_text) between 1 and 2000),
  options       jsonb,
  answer        text not null check (char_length(answer) between 1 and 500),
  explanation   text not null check (char_length(explanation) between 1 and 2000),
  active        boolean not null default true,
  created_by    uuid references public.profiles (id) on delete set null,
  status        text not null default 'official'
    check (status in ('official', 'pending', 'approved', 'rejected')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  -- Multiple choice always carries exactly 4 options; text questions carry none.
  check (
    (type = 'multiple_choice' and options is not null and jsonb_array_length(options) = 4)
    or (type = 'text' and options is null)
  )
);

-- The game picks random questions from a single category; only live, official
-- ones are ever dealt to players.
create index questions_playable_idx
  on public.questions (category)
  where active and status = 'official';

-- Keep updated_at in sync on any change.
create function public.set_updated_at()
returns trigger
language plpgsql
security invoker set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger questions_set_updated_at
  before update on public.questions
  for each row execute function public.set_updated_at();

-- The trigger is a system operation; no role should be able to call it directly.
revoke execute on function public.set_updated_at() from public;

-- RLS: anyone can read (public question bank); writing is service-role only.
-- There are deliberately no insert/update/delete policies and no write grants,
-- so neither anon nor authenticated can ever write through the Data API.
alter table public.questions enable row level security;

create policy "questions_read_all" on public.questions
  for select
  to anon, authenticated
  using (true);

-- Explicit grants needed: config.toml does not auto-expose new tables.
-- anon/authenticated can only read; service_role is the sole writer (import
-- script and future server-side moderation) and bypasses RLS.
grant select on public.questions to anon, authenticated;
grant select, insert, update, delete on public.questions to service_role;
