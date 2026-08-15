import { z } from "zod";

export const QUESTION_CATEGORIES = [
  "Web & Mobile Stack",
  "Platforms",
  "General Development",
] as const;

export const QUESTION_CATEGORY_SLUGS = [
  "web-mobile-stack",
  "platforms",
  "general-development",
] as const;

export const DIFFICULTY_TIERS = [
  "Vibecoder",
  "Junior",
  "Mid-level",
  "Senior",
  "Linus Torvalds",
  "Code Wizard Supreme",
] as const;

export const DIFFICULTY_TIER_SLUGS = [
  "vibecoder",
  "junior",
  "mid-level",
  "senior",
  "linus-torvalds",
  "code-wizard-supreme",
] as const;

export const QUESTION_TYPES = ["multiple_choice", "text"] as const;

export const QUESTION_STATUSES = [
  "official",
  "pending",
  "approved",
  "rejected",
] as const;

export const CATEGORY_SLUG_TO_DISPLAY: Record<
  (typeof QUESTION_CATEGORY_SLUGS)[number],
  (typeof QUESTION_CATEGORIES)[number]
> = {
  "web-mobile-stack": "Web & Mobile Stack",
  platforms: "Platforms",
  "general-development": "General Development",
};

export const DIFFICULTY_SLUG_TO_DISPLAY: Record<
  (typeof DIFFICULTY_TIER_SLUGS)[number],
  (typeof DIFFICULTY_TIERS)[number]
> = {
  vibecoder: "Vibecoder",
  junior: "Junior",
  "mid-level": "Mid-level",
  senior: "Senior",
  "linus-torvalds": "Linus Torvalds",
  "code-wizard-supreme": "Code Wizard Supreme",
};

interface QuestionInvariant {
  type: (typeof QUESTION_TYPES)[number];
  options: string[] | null;
  answer: string;
}

function textQuestionHasNoOptions(q: QuestionInvariant): boolean {
  return q.type === "text" ? q.options === null : q.options !== null;
}

function answerIsOneOfTheOptions(q: QuestionInvariant): boolean {
  return (
    q.type === "text" || (q.options !== null && q.options.includes(q.answer))
  );
}

/** Full question row, matching the questions table in the database. */
export const QuestionSchema = z
  .object({
    id: z.string().trim().min(1).max(120),
    category: z.enum(QUESTION_CATEGORIES),
    difficulty: z.enum(DIFFICULTY_TIERS),
    type: z.enum(QUESTION_TYPES),
    question_text: z.string().trim().min(1).max(2000),
    options: z.array(z.string().trim().min(1).max(500)).length(4).nullable(),
    answer: z.string().trim().min(1).max(500),
    explanation: z.string().trim().min(1).max(2000),
    active: z.boolean().default(true),
    created_by: z.string().uuid().nullable().optional(),
    status: z.enum(QUESTION_STATUSES).default("official"),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  })
  .refine(
    textQuestionHasNoOptions,
    "type 'text' must have options null; type 'multiple_choice' must have exactly 4 options",
  )
  .refine(answerIsOneOfTheOptions, "multiple_choice answer must be one of the options");

export type Question = z.infer<typeof QuestionSchema>;

/**
 * Shape expected in the JSON files under questions/ (see questions/README.md):
 * slug categories/difficulties and a `question` field; `needs_review` maps to
 * the status column (pending vs official) on import.
 */
export const QuestionImportSchema = z
  .object({
    id: z.string().trim().min(1).max(120),
    category: z.enum(QUESTION_CATEGORY_SLUGS),
    difficulty: z.enum(DIFFICULTY_TIER_SLUGS),
    type: z.enum(QUESTION_TYPES),
    question: z.string().trim().min(1).max(2000),
    options: z.array(z.string().trim().min(1).max(500)).length(4).nullable(),
    answer: z.string().trim().min(1).max(500),
    explanation: z.string().trim().min(1).max(2000),
    needs_review: z.boolean().default(false),
  })
  .refine(
    textQuestionHasNoOptions,
    "type 'text' must have options null; type 'multiple_choice' must have exactly 4 options",
  )
  .refine(answerIsOneOfTheOptions, "multiple_choice answer must be one of the options");

export type QuestionImport = z.infer<typeof QuestionImportSchema>;
