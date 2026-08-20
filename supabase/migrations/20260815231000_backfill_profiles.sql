-- Create profiles for auth.users rows that predate the on_auth_user_created
-- trigger (accounts that signed in before create_profiles was applied). The
-- trigger only fires on new inserts, so pre-existing users never got a row.
-- Uses the same placeholder the trigger writes so onboarding can detect it.

insert into public.profiles (id, nickname)
select id, 'Player_' || left(id::text, 12)
from auth.users
on conflict (id) do nothing;
