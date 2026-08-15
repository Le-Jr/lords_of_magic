import type { Difficulty } from "@/lib/scoring";

/** Min XP required to hold each title. Thresholds from the PROJECT.md table. */
export const TITLE_XP_THRESHOLDS = [
  { title: "Vibecoder", minXp: 0 },
  { title: "Junior", minXp: 50 },
  { title: "Mid-level", minXp: 150 },
  { title: "Senior", minXp: 350 },
  { title: "Linus Torvalds", minXp: 700 },
  { title: "Code Wizard Supreme", minXp: 1200 },
] as const satisfies ReadonlyArray<{ title: Difficulty; minXp: number }>;

/** Highest title a player has earned, given their accumulated XP. */
export function titleFromXp(xp: number): Difficulty {
  let title: Difficulty = "Vibecoder";
  for (const threshold of TITLE_XP_THRESHOLDS) {
    if (xp >= threshold.minXp) {
      title = threshold.title;
    }
  }
  return title;
}
