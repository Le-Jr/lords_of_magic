-- Persistence for completed solo rounds. Deliberately separate from the
-- future multiplayer match tables; this only records single-player results
-- and awards XP.

create table public.solo_sessions (
  -- Client-generated round id; the unique constraint doubles as the guard
  -- against double submission (re-render or retried network call).
  id         uuid primary key,
  player_id  uuid not null references public.profiles (id) on delete cascade,
  category   text not null check (category in (
    'Web & Mobile Stack', 'Platforms', 'General Development'
  )),
  score      integer not null,
  created_at timestamptz not null default now()
);

-- Index the FK (joins and cascades on player_id).
create index solo_sessions_player_id_idx
  on public.solo_sessions (player_id);

-- Records a completed round with a server-computed score. Never trusts a score
-- value from the client: correctness and points are recomputed here from the
-- real answers and difficulties in the questions table, applying the same
-- difficulty/scoring table as PROJECT.md. In one transaction it inserts the
-- solo_sessions row and atomically increments profiles.xp_total.
create function public.record_solo_session(
  p_session_id uuid,
  p_player_id uuid,
  p_category text,
  p_answers jsonb
)
returns table (session_id uuid, score integer, created boolean)
language plpgsql
security definer set search_path = public
as $$
declare
  v_score      integer := 0;
  v_answer     jsonb;
  v_q          record;
  v_points     integer;
  v_recorded   boolean := false;
begin
  -- Only ever record sessions for the caller themselves.
  if p_player_id is distinct from auth.uid() then
    raise exception 'solo session player_id does not match authenticated user';
  end if;

  if p_category not in ('Web & Mobile Stack', 'Platforms', 'General Development') then
    raise exception 'invalid solo session category';
  end if;

  if p_answers is null or jsonb_typeof(p_answers) <> 'array'
     or jsonb_array_length(p_answers) = 0 then
    raise exception 'solo session answers must be a non-empty array';
  end if;

  for v_answer in select * from jsonb_array_elements(p_answers)
  loop
    select q.id, q.category, q.difficulty, q.type, q.answer
      into v_q
      from public.questions q
     where q.id = v_answer->>'question_id';

    if not found then
      raise exception 'solo session references unknown question %', v_answer->>'question_id';
    end if;

    if v_q.category <> p_category then
      raise exception 'solo session question % does not belong to category %', v_q.id, p_category;
    end if;

    -- Mirrors the client-side comparison so on-screen feedback and scoring agree.
    if (v_answer->>'selected_option') is null then
      v_points := 0; -- no-answer (timeout)
    elsif (v_q.type = 'multiple_choice' and v_answer->>'selected_option' = v_q.answer)
       or (v_q.type = 'text'
           and lower(btrim(v_answer->>'selected_option')) = lower(btrim(v_q.answer))) then
      v_points := case v_q.difficulty
        when 'Vibecoder'          then 8
        when 'Junior'             then 10
        when 'Mid-level'          then 15
        when 'Senior'             then 20
        when 'Linus Torvalds'     then 30
        when 'Code Wizard Supreme' then 40
      end;
    else
      v_points := case v_q.difficulty
        when 'Linus Torvalds'     then -5
        when 'Code Wizard Supreme' then -10
        else 0
      end;
    end if;

    v_score := v_score + v_points;
  end loop;

  insert into public.solo_sessions (id, player_id, category, score)
  values (p_session_id, p_player_id, p_category, v_score)
  on conflict (id) do nothing;

  if found then
    v_recorded := true;
    update public.profiles
       set xp_total = xp_total + greatest(0, v_score)
     where id = p_player_id;
  end if;

  return query
    select p_session_id,
           coalesce((select s.score from public.solo_sessions s where s.id = p_session_id), v_score),
           v_recorded;
end;
$$;

-- RLS: a player can read and write only their own sessions.
alter table public.solo_sessions enable row level security;

create policy "solo_sessions_select_own" on public.solo_sessions
  for select
  to authenticated
  using ((select auth.uid()) = player_id);

create policy "solo_sessions_insert_own" on public.solo_sessions
  for insert
  to authenticated
  with check ((select auth.uid()) = player_id);

-- Data API grants. Players can only ever read their sessions; writes go
-- exclusively through record_solo_session so the score is always recomputed
-- server-side (anti-cheat). No update/delete policies or grants.
grant select on public.solo_sessions to authenticated;

-- The scoring function is a public API endpoint for authenticated users only.
grant execute on function public.record_solo_session(uuid, uuid, text, jsonb) to authenticated;
revoke execute on function public.record_solo_session(uuid, uuid, text, jsonb) from public, anon;
