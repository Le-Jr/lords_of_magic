```
 _     ___  ____    _    _     ______   ___   ____
| |   / _ \|  _ \  / \  | |   |__  /  / _ \ / ___|
| |  | | | | | | |/ _ \ | |     / /  | | | | |
| |__| |_| | |_| / ___ \| |___ / /_ _| |_| | |___
|_____\___/|____/_/   \_\_____|____(_)___/ \____|
```

> dev trivia for software developers

**Lords of Logic** is a browser-based trivia game built for software developers.
Short, fast rounds — 3 to 7 minutes — covering web stack, platforms, and
development best practices. Built with a monochrome MS-DOS terminal aesthetic.

---

## FEATURES

- **OAuth login** — Google and Discord, no email/password
- **3 question categories** — Web & Mobile Stack, Platforms, General Development
- **2 question types** — multiple choice and free-text input
- **6 difficulty tiers** — from Vibecoder to Code Wizard Supreme
- **XP and ranking system** — earn XP per round, climb the global leaderboard
- **Anti-cheat scoring** — scores are recomputed server-side in PostgreSQL
- **15-second timer** — answer fast or lose the points
- **Keyboard-first navigation** — full roving tabindex menus, no mouse required
- **Accessible** — high contrast, reduced-motion support, visible focus states

---

## TECH STACK

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | [React 19](https://react.dev), [Tailwind CSS v4](https://tailwindcss.com) |
| Language | [TypeScript 5](https://www.typescriptlang.org) (strict mode) |
| Backend | [Supabase](https://supabase.com) (Auth, Database, RLS, Edge Functions) |
| Validation | [Zod](https://zod.dev) |
| Database | PostgreSQL (via Supabase) |
| Fonts | [VT323](https://fonts.google.com/specimen/VT323) (display), [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) (body) |

---

## GETTING STARTED

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- Google and/or Discord OAuth credentials

### Setup

```bash
// clone the repo
git clone https://github.com/tupinicode/lords-of-logic.git
cd lords-of-logic

// install dependencies
npm install

// set up environment variables
cp .env.example .env.local
```

Configure `.env.local` with your Supabase keys and OAuth secrets:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
```

Run Supabase migrations:

```bash
npx supabase db push
```

Import the question bank:

```bash
npm run import:questions
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## PROJECT STRUCTURE

```
src/
├── app/                    # routes (Next.js App Router)
│   ├── page.tsx            # landing
│   ├── login/              # OAuth login
│   ├── play/               # category selection + match
│   ├── ranking/            # global leaderboard
│   ├── settings/           # profile settings
│   └── auth/               # callback, logout, nickname onboarding
├── components/             # UI components
│   ├── menu.tsx            # keyboard-roving DOS menu
│   ├── pong.tsx            # pong ball decoration / progress
│   ├── prompt-line.tsx     # terminal breadcrumb header
│   └── round/              # game round state machine
├── lib/                    # shared logic
│   ├── scoring.ts          # difficulty multipliers + point calculation
│   ├── titles.ts           # XP threshold -> title mapping
│   ├── strings.ts          # centralized UI copy
│   ├── questions/          # question schema + sampling
│   └── supabase/           # client + server Supabase factories
├── questions/              # question bank (JSON)
├── scripts/                # import script
└── supabase/               # migrations + config
```

---

## GAME MECHANICS

### Categories

| Category | Slug |
|----------|------|
| Web & Mobile Stack | `web-mobile-stack` |
| Platforms (Salesforce, VTEX, Shopify) | `platforms` |
| General Development | `general-development` |

### Difficulty Tiers

| Tier | Multiplier | Wrong Answer Penalty |
|------|-----------|---------------------|
| Vibecoder | x0.8 | 0 |
| Junior | x1.0 | 0 |
| Mid-level | x1.5 | 0 |
| Senior | x2.0 | 0 |
| Linus Torvalds | x3.0 | -5 pts |
| Code Wizard Supreme | x4.0 | -10 pts |

> Base points: 10 per correct answer. Score = base x multiplier.

### XP Titles

| Title | Min XP |
|-------|--------|
| Vibecoder | 0 |
| Junior | 50 |
| Mid-level | 150 |
| Senior | 350 |
| Linus Torvalds | 700 |
| Code Wizard Supreme | 1200 |

### Round Flow

1. Pick a category from the lobby
2. Answer 5 random questions (mixed difficulty)
3. 15 seconds per question
4. Feedback after each answer with explanation
5. Score summary at the end
6. XP is recorded server-side (authenticated players only)

---

## COMMANDS

```bash
npm run dev              # start dev server
npm run build            # production build + typecheck
npm run start            # start production server
npm run lint             # eslint
npm run import:questions # import question bank from JSON
```

---

## DATABASE

Three tables via Supabase migrations:

- **profiles** — player data (nickname, XP, title, matches played)
- **questions** — question bank with moderation workflow (official/pending/approved/rejected)
- **solo_sessions** — round records with server-side score recomputation

Row Level Security ensures players can only modify their own data.
Ranking data is publicly readable.

---

## ROADMAP

- [ ] User-generated question submissions
- [ ] Async multiplayer matches
- [ ] Portuguese (pt-BR) language toggle
- [ ] Timed competitive mode
- [ ] Question moderation dashboard

---

## LICENSE

> // TBD
