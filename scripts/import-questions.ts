import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import {
  CATEGORY_SLUG_TO_DISPLAY,
  DIFFICULTY_SLUG_TO_DISPLAY,
  QuestionImportSchema,
  type QuestionImport,
} from "../src/lib/questions/schema";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const questionsDir = join(repoRoot, "questions");
const batchSize = 100;

try {
  process.loadEnvFile(join(repoRoot, ".env.local"));
} catch {
  // Env vars may already be exported by the shell; missing ones are reported below.
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error("ERROR: NEXT_PUBLIC_SUPABASE_URL is not set (.env.local)");
  process.exit(1);
}
if (!serviceRoleKey) {
  console.error("ERROR: SUPABASE_SERVICE_ROLE_KEY is not set (.env.local)");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

interface QuestionRow {
  id: string;
  category: string;
  difficulty: string;
  type: string;
  question_text: string;
  options: string[] | null;
  answer: string;
  explanation: string;
  active: boolean;
  status: string;
}

interface FileResult {
  file: string;
  questions: QuestionRow[];
  error?: string;
}

function errorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === "string" && message.length > 0) return message;
  }
  return error instanceof Error ? error.message : String(error);
}

function loadFile(file: string): FileResult {
  try {
    const raw = JSON.parse(readFileSync(join(questionsDir, file), "utf8"));
    const entries = Array.isArray(raw) ? raw : [raw];
    const rows: QuestionRow[] = [];

    for (const entry of entries) {
      const parsed = QuestionImportSchema.safeParse(entry);
      if (!parsed.success) {
        const details = parsed.error.issues
          .map((issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`)
          .join("; ");
        return { file, questions: [], error: details };
      }
      const q: QuestionImport = parsed.data;
      rows.push({
        id: q.id,
        category: CATEGORY_SLUG_TO_DISPLAY[q.category],
        difficulty: DIFFICULTY_SLUG_TO_DISPLAY[q.difficulty],
        type: q.type,
        question_text: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
        active: true,
        status: q.needs_review ? "pending" : "official",
      });
    }

    return { file, questions: rows };
  } catch (error) {
    return { file, questions: [], error: errorMessage(error) };
  }
}

async function upsertQuestions(rows: QuestionRow[]): Promise<void> {
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase
      .from("questions")
      .upsert(batch, { onConflict: "id" });
    if (error) throw error;
  }
}

async function main(): Promise<void> {
  let files: string[];
  try {
    files = readdirSync(questionsDir)
      .filter((name) => name.endsWith(".json"))
      .sort();
  } catch {
    console.error(`ERROR: questions/ directory not found at ${questionsDir}`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.log("OK: no question files found in questions/");
    return;
  }

  let failed = 0;
  let total = 0;

  for (const file of files) {
    const { questions, error } = loadFile(file);
    if (error) {
      failed += 1;
      console.error(`ERROR: ${file}: ${error}`);
      continue;
    }
    try {
      await upsertQuestions(questions);
      total += questions.length;
      console.log(
        `OK: ${file} (${questions.length} question${questions.length === 1 ? "" : "s"})`,
      );
    } catch (error) {
      failed += 1;
      console.error(`ERROR: ${file}: upsert failed: ${errorMessage(error)}`);
    }
  }

  console.log(
    failed === 0
      ? `OK: imported ${total} question${total === 1 ? "" : "s"}`
      : `ERROR: ${failed} file${failed === 1 ? "" : "s"} failed`,
  );
  process.exitCode = failed === 0 ? 0 : 1;
}

main();
