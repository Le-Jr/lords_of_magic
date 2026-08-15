import { DIFFICULTY_TIERS } from "@/lib/questions/schema";

export type Difficulty = (typeof DIFFICULTY_TIERS)[number];

export const BASE_POINTS = 10;

export const DIFFICULTY_MULTIPLIERS: Record<Difficulty, number> = {
  Vibecoder: 0.8,
  Junior: 1.0,
  "Mid-level": 1.5,
  Senior: 2.0,
  "Linus Torvalds": 3.0,
  "Code Wizard Supreme": 4.0,
};

const WRONG_PENALTIES: Record<Difficulty, number> = {
  Vibecoder: 0,
  Junior: 0,
  "Mid-level": 0,
  Senior: 0,
  "Linus Torvalds": -5,
  "Code Wizard Supreme": -10,
};

export type AnswerResult = "correct" | "wrong" | "no-answer";

export type ScoredAnswer = {
  difficulty: Difficulty;
  result: AnswerResult;
};

/** Points for a single question, per the PROJECT.md difficulty/scoring table. */
export function scoreQuestion(
  difficulty: Difficulty,
  result: AnswerResult,
): number {
  switch (result) {
    case "correct":
      return BASE_POINTS * DIFFICULTY_MULTIPLIERS[difficulty];
    case "wrong":
      return WRONG_PENALTIES[difficulty];
    case "no-answer":
      return 0;
  }
}

export function roundScore(answers: readonly ScoredAnswer[]): number {
  return answers.reduce(
    (total, answer) => total + scoreQuestion(answer.difficulty, answer.result),
    0,
  );
}

/** XP earned in a round equals the round score (1:1) for now. */
export function xpFromScore(score: number): number {
  return score;
}
