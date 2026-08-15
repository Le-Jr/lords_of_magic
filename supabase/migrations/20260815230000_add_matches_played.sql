-- Tracks how many solo rounds a player has finished, for the public ranking.

alter table public.profiles
  add column matches_played integer not null default 0 check (matches_played >= 0);

-- No new grants: like xp_total, matches_played is only ever written through
-- record_solo_session (security definer), never directly by clients.

-- Extends record_solo_session (create_solo_sessions.sql) so the XP bump and the
-- matches_played increment happen in the same atomic update, in the same
-- transaction that inserts the session row.
create or replace function public.record_solo_session(
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
       set xp_total = xp_total + greatest(0, v_score),
           matches_played = matches_played + 1
     where id = p_player_id;
  end if;

  return query
    select p_session_id,
           coalesce((select s.score from public.solo_sessions s where s.id = p_session_id), v_score),
           v_recorded;
end;
$$;
