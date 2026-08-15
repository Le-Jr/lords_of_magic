# Questions

Author your question bank here, one JSON file per topic or batch. Files
are imported with:

```
npm run import:questions
```

which reads every `*.json` file in this folder, validates it, and upserts
the questions into Supabase using the service role key (see `.env.local` →
`SUPABASE_SERVICE_ROLE_KEY`). Re-running is safe: rows are upserted by `id`
(in place, no duplicates). Removing a file does **not** delete its questions
from the database.

## File format

Each file contains either a single question object or an array of question
objects:

| Field           | Type                                                                     | Required | Notes |
|-----------------|--------------------------------------------------------------------------|----------|-------|
| `id`            | string, unique                                                           | yes      | Slug-like key, e.g. `web-html-doctype-001`. Used as the upsert key. |
| `category`      | `web-mobile-stack` / `platforms` / `general-development`                 | yes      | Translated to the display name on import. |
| `difficulty`    | `vibecoder` / `junior` / `mid-level` / `senior` / `linus-torvalds` / `code-wizard-supreme` | yes | Translated to the display name on import. |
| `type`          | `multiple_choice` / `text`                                               | yes      | |
| `question`      | string                                                                   | yes      | Stored as `question_text`. |
| `options`       | array of exactly 4 strings                                               | for `multiple_choice` | Must be `null` for `text`. |
| `answer`        | string                                                                   | yes      | For `multiple_choice`, must equal one of `options`. Text answers are compared case-insensitively, trimmed. |
| `explanation`   | string                                                                   | yes      | Short, didactic, shown after answering. |
| `needs_review`  | boolean                                                                  | no       | Defaults to `false`. `true` imports with status `pending`, `false` with status `official`. |

## Example

```json
{
  "id": "web-html-doctype-001",
  "category": "web-mobile-stack",
  "difficulty": "junior",
  "type": "multiple_choice",
  "question": "Which HTML tag declares the document type?",
  "options": ["<!doctype html>", "<html>", "<meta>", "<head>"],
  "answer": "<!doctype html>",
  "explanation": "The doctype declaration tells the browser to render in standards mode.",
  "needs_review": false
}
```
