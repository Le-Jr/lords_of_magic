-- Public profile for every auth.users row (1:1, same id).

create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  nickname      text not null,
  xp_total      integer not null default 0 check (xp_total >= 0),
  current_title text not null default 'Vibecoder'
    check (current_title in (
      'Vibecoder', 'Junior', 'Mid-level', 'Senior',
      'Linus Torvalds', 'Code Wizard Supreme'
    )),
  created_at    timestamptz not null default now(),
  check (char_length(btrim(nickname)) between 1 and 24)
);

-- Case-insensitive unique nickname.
create unique index profiles_nickname_lower_idx
  on public.profiles (lower(nickname));

-- Auto-create a profile row on signup so the 1:1 invariant always holds.
-- Placeholder nickname gets replaced during onboarding.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, 'Player_' || left(new.id::text, 12))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- The trigger is a system operation; no role should be able to call it directly.
revoke execute on function public.handle_new_user() from public;

-- RLS: anyone can read (needed for the public ranking); only the owner can
-- insert/update their own profile.
alter table public.profiles enable row level security;

create policy "profiles_read_all" on public.profiles
  for select
  to anon, authenticated
  using (true);

create policy "profiles_insert_own" on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "profiles_update_own" on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Data API grants. The owner can only ever write their nickname through the
-- client; xp_total / current_title are server-side only (anti-cheat).
grant select on public.profiles to anon, authenticated;
grant insert (id, nickname) on public.profiles to authenticated;
grant update (nickname) on public.profiles to authenticated;
