# pharm-job-compare

A small seasonal website for job-hunting pharmacists to browse and compare
hospital pharmacy positions side by side — filtered by salary tier, location,
and curated feature tags (e.g. `免/少輪班`, `提供宿舍`).

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
- `app/components/JobsView.tsx` — the single `"use client"` island; holds
  filter state and view mode (`卡片 / 比較表 / 依欄位`).
- `app/components/{JobCard,ComparisonTable,FieldCompareView,TagButton}.tsx` —
  the three view implementations + shared tag pill.
- `app/lib/{notion,styles,types}.ts` — Notion fetch + parse, tag/tier styles
  and city north-to-south ranking, type definitions.
- `plan/` — v1–v3 planning docs (read in order for full rationale).
- `data/hospitals-reference.md` — Taiwan medical center reference list
  (curation aid, not used at runtime).

## Architectural notes

- **One client island only** (`JobsView`). All other components are
  server-importable; they get pulled into the client tree as children of
  `JobsView`. Matches plan v3 §6 "framework scope floor".
- **No `/api/*` route**. The Server Component talks to Notion directly.
- **Default order:** 薪資 tier `突出` first, then Notion insertion order within
  tier. No global sort UI. Per-field sort exists only inside the `依欄位` view
  (see plan v3 §10).
- **City ranking is geographic** (north → south, Taiwan-aware), not
  alphabetic. See `rankCity` in `app/lib/styles.ts`.

## Deployment

Not yet deployed. Vercel is the planned target (plan v3 week 4). When wired:
import the repo into Vercel, set `NOTION_TOKEN` and `NOTION_DATA_SOURCE_ID` in
project environment variables, deploy.
