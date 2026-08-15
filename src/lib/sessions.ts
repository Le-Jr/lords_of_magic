import { createClient } from "@/lib/supabase/client";

export type SoloAnswer = {
  questionId: string;
  selected: string | null;
};

export type SoloSessionResult =
  | { recorded: true; score: number; created: boolean }
  | { recorded: false };

type RecordSoloSessionRow = {
  session_id: string;
  score: number;
  created: boolean;
};

type RecordSoloSessionArgs = {
  p_session_id: string;
  p_player_id: string;
  p_category: string;
  p_answers: { question_id: string; selected_option: string | null }[];
};

/**
 * Records a finished solo round through the record_solo_session RPC. The score
 * is recomputed server-side; nothing here is trusted by the database. Returns
 * { recorded: false } when the player is not signed in or the call fails, so
 * the end screen is never blocked by persistence.
 */
export async function recordSoloSession({
  sessionId,
  category,
  answers,
}: {
  sessionId: string;
  category: string;
  answers: readonly SoloAnswer[];
}): Promise<SoloSessionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { recorded: false };
  }

  const args: RecordSoloSessionArgs = {
    p_session_id: sessionId,
    p_player_id: user.id,
    p_category: category,
    p_answers: answers.map((answer) => ({
      question_id: answer.questionId,
      selected_option: answer.selected,
    })),
  };

  const { data, error } = await supabase.rpc("record_solo_session", args);

  if (error || !data || data.length === 0) {
    return { recorded: false };
  }

  const [row] = data as RecordSoloSessionRow[];
  return { recorded: true, score: row.score, created: row.created };
}
