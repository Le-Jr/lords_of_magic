import { createClient } from "@/lib/supabase/server";

export type RankingRow = {
  nickname: string;
  xp_total: number;
  matches_played: number;
  created_at: string;
};

export type RankingPage = {
  rows: RankingRow[];
  total: number;
  totalPages: number;
  page: number;
};

export const RANKING_PAGE_SIZE = 50;

/**
 * One page of the public ranking, ordered by xp_total descending with
 * created_at ascending as the tie-break. Reads through the anon role; the
 * profiles_read_all RLS policy makes this data public. The requested page is
 * clamped into [1, totalPages] — PostgREST rejects a range that starts past
 * the data, so the count is fetched first.
 */
export async function getRankingPage(
  page: number,
  pageSize: number = RANKING_PAGE_SIZE,
): Promise<RankingPage> {
  const supabase = await createClient();

  const { count, error: countError } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  if (countError) {
    throw new Error(`Failed to load ranking: ${countError.message}`);
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clampedPage = Math.min(Math.max(1, page), totalPages);
  const from = (clampedPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
    .from("profiles")
    .select("nickname, xp_total, matches_played, created_at")
    .order("xp_total", { ascending: false })
    .order("created_at", { ascending: true })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to load ranking: ${error.message}`);
  }

  return {
    rows: (data ?? []) as RankingRow[],
    total,
    totalPages,
    page: clampedPage,
  };
}
