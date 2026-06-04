# pharm-job-compare

A small seasonal website for job-hunting pharmacists: a playful MBTI quiz that
draws your "fortune" hospital out of a pillbox maze, then shows that job plus a
few similar alternatives. Job data (salary tier, location, curated feature tags
like `免/少輪班`, `提供宿舍`) is curated in Notion.

Full design rationale and decision history:
[`plan/pharmacist-job-compare-plan-v3.md`](plan/pharmacist-job-compare-plan-v3.md).

## Governing rule

This site **does not scrape 104**. All job data is manually entered into Notion
by a human, stored as short summaries in the maintainer's own words, with a
link back to the original 104 posting. (See plan §2.)

## Tech stack

- **Next.js 15** (App Router) — Server Component fetches Notion; one client
  island handles all interactivity.
- **Notion** — both the database and the admin UI. New jobs are added as rows
  in a Notion table.
- **Vercel** — caching (`next.revalidate: 600`, shared Data Cache) and deploy
  target.
- **Tailwind CSS 3**.
- **Traditional Chinese only** — domestic audience, no i18n.

## Setup

**Prerequisites:** Node.js 20+, a Notion workspace, the 藥師職缺資料庫 database.

```sh
git clone https://github.com/<you>/pharm-job-compare.git
cd pharm-job-compare
npm install
```

Then:

1. Create a Notion integration at https://www.notion.so/profile/integrations →
   **New integration** → **Access token** auth. Copy the token (`ntn_…`).
2. In Notion, open the 藥師職缺資料庫 page → `···` menu → **Connections** →
   search and add your integration. (Without this, the API returns 404.)
3. Copy `.env.local.example` to `.env.local` and paste your real token. The
   `NOTION_DATA_SOURCE_ID` is pre-filled for the existing DB.

## Scripts

```sh
npm run dev        # start dev server (http://localhost:3000)
npm run build      # production build
npm run typecheck  # TypeScript validation, no emit
```

## Layout

- `app/page.tsx` — Server Component, fetches Notion with `revalidate: 600`.
- `app/components/spin/SpinApp.tsx` — the single `"use client"` island; the
  `intro → quiz → maze → result` state machine.
- `app/components/spin/` — quiz, pillbox maze, rolling capsule, result card,
  alternatives, hospital icons (6 chibi archetypes).
- `app/og/route.tsx` — Edge-runtime dynamic Open Graph image.
- `app/lib/{notion,styles,types,quiz}.ts` — Notion fetch + parse, tag/tier
  styles, type definitions, and the quiz scoring/weighting logic.
- `plan/` — v1–v4 planning docs (read in order for full rationale).
- `data/hospitals-reference.md` — Taiwan medical center reference list
  (curation aid, not used at runtime).

## Architectural notes

- **One client island only** (`SpinApp`). All other components are
  server-importable; they get pulled into the client tree as children of
  `SpinApp`. Matches plan §6 "framework scope floor".
- **No `/api/*` route** other than the `/og` image. The Server Component talks
  to Notion directly.
- **Job ordering:** by hospital name (zh-Hant collation) via `sortJobs`; the
  spin flow re-scores and weighted-samples downstream.
- A structured filter/compare tool used to live at `/all` (`JobsView` + card /
  table / field views) but was removed; the shared Notion data layer remains.

## Deployment

Not yet deployed. Vercel is the planned target (plan v3 week 4). When wired:
import the repo into Vercel, set `NOTION_TOKEN` and `NOTION_DATA_SOURCE_ID` in
project environment variables, deploy.
