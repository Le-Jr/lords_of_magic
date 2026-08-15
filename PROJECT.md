# Project Scope — Lords of Logic

What this project is, for anyone (human or agent) picking it up
without prior context. This file explains the product; `AGENTS.md`
explains how to work on it; `STYLE_GUIDE.md` explains how it should
look.

## What it is

A trivia/quiz game built specifically for software developers, with a
focus on the web stack, e-commerce platforms, and development best
practices. Fast, short sessions (3–7 minutes), meant to be replayed
casually — not a long-form learning course.

## Current phase

Front-end first, single-player, no backend yet. Auth (Google/Discord
OAuth via Supabase) and async multiplayer are planned but come later,
each as its own phase — see `AGENTS.md` for the scope-discipline rules
around that.

## Question categories

Every question belongs to exactly one category:

1. **Web & Mobile Stack** — HTML, CSS, JavaScript, React, Next.js,
   Node.js, Express, NestJS, Java, C#, PHP, cross-platform frameworks,
   general web ecosystem concepts.
2. **Platforms** — Salesforce (Apex, SOQL, governor limits, config),
   VTEX, Shopify — configuration, architecture, limitations, best
   practices.
3. **General Development** — clean code, Git/version control, DevOps
   concepts, software architecture, basic security, performance,
   testing.

## Question model

Each question is a structured object with: id, category, type
(`multiple_choice` or `text`), difficulty, the question text, options
(multiple choice only), the correct answer, and a short, didactic
explanation shown after answering.

Two question types only:
- **Multiple choice** — 4 options, exactly 1 correct.
- **Text input** — free text, compared case-insensitively, trimmed;
  small simple variations should be tolerated.

No long code snippets, no essay-style questions, no manual grading.

## Core loop

1. Landing screen → play or view ranking.
2. Pick a category (one of the three above).
3. A round of 5 random questions from that category, mixed
   difficulty, one question per screen.
4. Immediate feedback after each answer: correct/incorrect plus the
   short explanation.
5. End of round: total score, XP earned, option to play again.

## Difficulty and scoring

Six difficulty tiers, each with its own score multiplier:

| Tier | Multiplier |
|---|---|
| Vibecoder | x0.8 |
| Junior | x1.0 |
| Mid-level | x1.5 |
| Senior | x2.0 |
| Linus Torvalds | x3.0 |
| Code Wizard Supreme | x4.0 |

Base correct answer: +10 points, multiplied by tier. Wrong answers are
free at the lower tiers (no penalty), but the two top tiers penalize a
miss: Linus Torvalds tier is -5 points, Code Wizard Supreme tier is
-10 points. This scoring logic must live in a single centralized
place (service/util), never scattered across UI components.

## Titles by total XP

A player's overall title is derived from accumulated XP, independent
of any single match's difficulty tier:

| XP range | Title |
|---|---|
| 0–49 | Vibecoder |
| 50–149 | Junior |
| 150–349 | Mid-level |
| 350–699 | Senior |
| 700–1199 | Linus Torvalds |
| 1200+ | Code Wizard Supreme |

## Progression and ranking

Track total score, accumulated XP, number of matches played, and a
local Top 10 leaderboard. Currently local-only (no backend); this
moves to a persisted, Supabase-backed ranking once the backend phase
starts — see `AGENTS.md` for planned routes and phasing.

## Explicitly out of scope for now

Real traditional login (email/password), a chat feature, native mobile
apps, and — until its own dedicated phase — any backend, database, or
real-time multiplayer. These aren't rejected ideas, just sequenced for
later; don't build toward them ahead of an explicit task to do so.

## Language

English first, for every feature and every piece of copy. A pt-BR
toggle is planned as a later feature — see the "Language" section in
`AGENTS.md` and the "Copy" section in `STYLE_GUIDE.md` for how that
constrains string handling today.