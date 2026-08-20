import type { SupabaseClient } from "@supabase/supabase-js";

export async function getUserStatus(
  supabase: SupabaseClient,
): Promise<string> {
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims.sub) return "GUEST";

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", data.claims.sub)
    .single();

  return profile?.nickname ?? "PLAYER";
}
