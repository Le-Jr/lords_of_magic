import { createClient } from "@/lib/supabase/server";
import {
  CATEGORY_SLUG_TO_DISPLAY,
  QuestionSchema,
  QUESTION_CATEGORY_SLUGS,
} from "@/lib/questions/schema";
import type { Question } from "@/lib/questions/schema";

export const ROUND_SIZE = 5;

export function isCategorySlug(
  slug: string,
): slug is (typeof QUESTION_CATEGORY_SLUGS)[number] {
  return (QUESTION_CATEGORY_SLUGS as readonly string[]).includes(slug);
}

/** Fisher-Yates shuffle; returns a new array, leaves the input untouched. */
export function sampleQuestions<T>(items: readonly T[], count: number): T[] {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/** Playable (active, official) questions for a category, randomly sampled. */
export async function getRoundQuestions(
  categorySlug: (typeof QUESTION_CATEGORY_SLUGS)[number],
): Promise<Question[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("category", CATEGORY_SLUG_TO_DISPLAY[categorySlug])
    .eq("active", true)
    .eq("status", "official");

  if (error) {
    throw new Error(`Failed to load questions: ${error.message}`);
  }

  const questions: Question[] = [];
  for (const row of (data ?? []) as unknown[]) {
    const parsed = QuestionSchema.safeParse(row);
    if (parsed.success) {
      questions.push(parsed.data);
    }
  }

  return sampleQuestions(questions, ROUND_SIZE);
}
