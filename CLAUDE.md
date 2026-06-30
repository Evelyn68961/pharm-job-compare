# CLAUDE.md

Project context for Claude Code sessions. Read [README.md](README.md) first for setup/architecture — this file adds non-obvious facts and guardrails.

## What this is

**藥師命運轉盤** — a seasonal Traditional Chinese site helping Taiwanese pharmacists discover hospital pharmacy jobs. One surface:

- `/` — a playful MBTI quiz → pillbox-maze "fortune" reveal flow ([SpinApp.tsx](app/components/spin/SpinApp.tsx)), ending on a 4-card horizontal swipe deck ([ResultDeck.tsx](app/components/spin/ResultDeck.tsx)): the 命運醫院 winner + 3 recommendations.

(There used to be a `/all` structured filter/compare tool — `JobsView` and friends — but it was removed per product decision. The Notion data layer it shared with the spin flow stays.)

Built by **pharmacists at 輔大附醫 (FJUH)**, not students. This shapes voice + scope decisions below.

## Hard scope (don't violate)

- **≤50 well-known hospitals.** Not a comprehensive Taiwan directory.
- Implications: don't propose pagination, virtualization, full-text search, autocomplete-over-thousands, or any feature that only makes sense at >100 entries.
- The bulk-import + 104-parser pipeline from an earlier broader-scope plan has been archived to [legacy/](legacy/) (`legacy/scripts/`, `legacy/parsers/`, `legacy/data/`) — it is **not** the current data pipeline and the app imports nothing from it. The current pipeline is hand-entry into Notion. Note: `scripts/` still holds **active** maintenance helpers (`backfill-brief-names.py`, `shorten-hospital-names.py`, `preview-idols.mjs`); those are not legacy.

## Voice + copy

- **Traditional Chinese only.** No English UI, no i18n.
- **Never describe the site as a student project or 學生作品.** It's built by working pharmacists — voice should be practitioner insight, not classroom exercise. (The visible `輔大附醫藥劑部製作` credit line was removed from the UI per product decision — don't re-add it; the standing FJUH surface is the contact form on FJUH cards.)
- Tone is playful for the spin flow; neutral-informative for the result/alternatives detail.

## Data sourcing (governing rule)

- **No scraping of 104.** Every job is hand-entered into the 藥師職缺資料庫 Notion database by a pharmacist, with a link back to the original 104 posting. Don't propose features that scrape, parse, or auto-ingest 104 listings.
- Notion is both the database AND the admin UI. New hospitals = new rows in Notion, not new files in this repo.

## Architecture guardrails

- **`/` (spin) is one client island** ([SpinApp.tsx](app/components/spin/SpinApp.tsx)) that orchestrates the `intro → quiz → maze → result` state machine. Sub-components (MBTIQuiz, PillboxMaze, ResultDeck) are also client components but driven by SpinApp state. The `result` stage is a **4-card horizontal swipe deck** ([ResultDeck.tsx](app/components/spin/ResultDeck.tsx), CSS scroll-snap, no vertical scroll): card 1 = the 命運醫院 winner, cards 2–4 = the recommendations from `resolveAlternatives`. Each card carries its own share button + 104 link; below the deck sit pagination dots and one `再玩一次`. There is no separate `alternatives` stage and no `關於這個網站` section anymore. The rolling pill is always a two-tone capsule ([RollingPill](app/components/spin/RollingPill.tsx)); when it settles on the winning maze cell it cracks open in place (`opening` state — halves slide apart + powder burst + glow) and reveals the result directly. There is no separate gift-box step (the old `MysteryBox`/`box` stage was removed).
- **One real `/api`-ish route: [/og](app/og/route.tsx)** — Edge-runtime dynamic OG image via `next/og`. Server Components otherwise talk to Notion directly via [app/lib/notion.ts](app/lib/notion.ts); no other server routes.
- **Job ordering** is by hospital name (zh-Hant collation) via `sortJobs` in [app/lib/notion.ts](app/lib/notion.ts); the spin flow re-scores and weighted-samples downstream, so this ordering is mostly a stable baseline.

## Where to look

- [README.md](README.md) — setup + tech stack
- [plan/pharmacist-job-compare-plan-v4.md](plan/pharmacist-job-compare-plan-v4.md) — latest design rationale (v1–v3 also in [plan/](plan/) for history)
- [app/lib/types.ts](app/lib/types.ts) — `Job` data model + tag / region / tier enums
- [hospital-icons-guide.md](hospital-icons-guide.md) — icon system reference: 4-layer composition, the 7 archetypes (金牛 is idol-only, not resolver-reachable), the two-colour `accentColor`/`secondaryColor` contract, file map
- [app/components/spin/SpinApp.tsx](app/components/spin/SpinApp.tsx) — spin flow state machine entry point
- [app/lib/resolveAlternatives.ts](app/lib/resolveAlternatives.ts) — the 3 recommendation cards (next-best matches by quiz score + FJUH seeding)
- [app/lib/fjuh.ts](app/lib/fjuh.ts) — FJUH visibility knobs (`FJUH_WIN_MULT`, `FJUH_ALT_RATE`, `isFjuh`)
- [app/og/route.tsx](app/og/route.tsx) — dynamic Open Graph image (Edge runtime + `next/og`)
- [data/hospitals-reference.md](data/hospitals-reference.md) — Taiwan medical center curation reference (read-only aid)

## Active context (update as it changes)

- **Icon system is fully built out, with a two-colour contract.** All 7 chibi character SVGs are hand-drawn in [archetypes/](app/components/spin/icons/archetypes/) (no Figma workflow). [HospitalIcon](app/components/spin/icons/HospitalIcon.tsx) feeds each character **two** colours: `accentColor` = `job.brandColor` (Notion `識別色`, the **primary**) drives the halo, the badge circle, and the neckerchief/collar; `secondaryColor` = `job.secondaryColor` (Notion `輔助色`, **falls back to primary** when blank/invalid via `safeBrandColor(...) ?? brandColor`) drives the held **accessory/prop** (clipboard / suitcase / mug / pill bottle / marker / seal / gold ingot 元寶). Accessory surfaces are tinted at `0.85` / `0.55` opacity; every tinted `fill`/`stroke` keeps an `|| '#hex'` fallback so a missing colour still renders. A `輔助色` of `—` (or any non-hex) is the convention for "intentionally single-colour" — it's ignored and falls back to primary.
- **Badge = per-archetype emblem, not initials.** [HospitalBadge](app/components/spin/icons/HospitalBadge.tsx) takes the resolved `archetype` and draws a white line-emblem in the brand-colour circle (graduation cap / train / open book / crescent+star / water lily / shield+star / ancient coin 古錢). [hospital-icons-guide.md](hospital-icons-guide.md) was rewritten to match the current emblem badge + two-colour system (incl. 金牛 being idol-only, not resolver-reachable) — treat it as current.
- **Icons render in several places.** Every card in [ResultDeck](app/components/spin/ResultDeck.tsx) uses a 96 px [HospitalIcon](app/components/spin/icons/HospitalIcon.tsx); the landing hero uses `ArchetypeAvatar` (character + halo, no badge); the [OG image](app/og/route.tsx) draws its own. [PillboxMaze](app/components/spin/PillboxMaze.tsx) cells get faint per-archetype glyphs via the standalone [MazeEmblem](app/components/spin/MazeEmblem.tsx) (a deliberate copy of the badge glyphs — badge can evolve without touching the maze).
- **The result is a 4-card swipe deck** ([ResultDeck.tsx](app/components/spin/ResultDeck.tsx)) — card 1 = winner (`✨ 你的命運醫院`), cards 2–4 = `resolveAlternatives` picks (`也推薦給你`). Horizontal CSS scroll-snap, no vertical scroll; dots + desktop arrows; footer = `再玩一次`. Each card has share + 104. Recommendation picks are the **next-best matches by quiz score** — `resolveAlternatives` reuses `buildWheelCandidates`' eligible+region pool, drops the winner, and ranks by pure `scoreJob` (not the FJUH-boosted weight) — then FJUH may be seeded in. `idolRank[i]` drives each card's idol icon (from the user's final-step ranking, not the hospital's archetype).
- **FJUH cards carry a contact form (owner-sanctioned).** Every 輔大附醫 card in [ResultDeck](app/components/spin/ResultDeck.tsx) (winner OR seeded recommendation) renders [FjuhContactForm](app/components/spin/FjuhContactForm.tsx), gated by `isFjuh(job)` — no other hospital shows it. It's a collapsed `📩 想進一步了解？留下聯絡方式` button that expands to 姓名 / Email / 方便聯絡時間, posting **client-side** to Web3Forms (no server route) which emails the maintainer. The key is `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (public, email-bound; the form hides if unset). This is a **deliberate exception** the owner requested to the "no FJUH recruitment block" rule below — keep it quiet/native (collapsed by default), not a loud labelled ad.
- **FJUH (輔大附醫) is deliberately boosted — this is intentional, not a bug.** Both knobs live in [fjuh.ts](app/lib/fjuh.ts) and are **region-gated** (they only fire when FJUH is already eligible, i.e. user picked 北北基 or no region — so FJUH never appears when its region was excluded). `FJUH_WIN_MULT` multiplies FJUH's wheel weight in `buildWheelCandidates` (wins the 命運醫院 slot more often, organically). `FJUH_ALT_RATE` is the probability of seeding FJUH into the recommendation cards at a random slot (the score ranking itself uses the un-boosted score, so FJUH's recommendation presence is controlled only by this rate). Keep it subtle: don't make FJUH deterministic, don't bypass the region gate. The one **sanctioned** FJUH recruitment surface is the contact form above; otherwise don't re-add a labelled "we made this / we're hiring" block (the old `關於這個網站` section was removed on purpose, and the one-line `輔大附醫藥劑部製作` credit was later removed too — the standing FJUH surface is now just that contact form).
- **Sharing flow uses dynamic OG images.** [ShareButton](app/components/spin/ShareButton.tsx) on the result card builds a URL `/?archetype=...&hospital=...&color=...`. The recipient lands on the game start (not the result), but [page.tsx](app/page.tsx)'s `generateMetadata` reads those params and points the OG image at the parameterized `/og?...` URL, so LINE/WhatsApp/IG link previews show a personalized image. Uses `navigator.share()` on mobile (native share sheet); falls back to clipboard copy on desktop.
- **Set `NEXT_PUBLIC_SITE_URL` in production** so OG image URLs resolve correctly when scraped by social platforms. Defaults to `http://localhost:3000` for dev (configured in [layout.tsx](app/layout.tsx) via `metadataBase`).
- Archetype lineup uses the naming convention **`{2-char}藥師`** for consistency: 學霸藥師 / 教魂藥師 / 北漂藥師 / 鐵腕藥師 / 夜貓藥師 / 佛系藥師 / 金牛藥師. Preserve this pattern if proposing additions or renames. 金牛藥師 (money/salary) is the idol for the 薪資 quiz question ([QUESTION_IDOL](app/lib/quiz.ts)). It shows up as a ranked-idol avatar on the result cards (plus its badge), as a random maze-cell emblem ([MazeEmblem](app/components/spin/MazeEmblem.tsx)), and in the landing-hero `HERO_CAST` (the 7-character row on `/`).
- **Archetype priority order** (set in [resolveArchetype.ts](app/components/spin/icons/resolveArchetype.ts)): tier-prestige > teaching > dormitory > public-sector > night-shift > chill. 醫學中心 hospitals will resolve to 學霸 even if they also have teaching tags. Reorder cautiously — changing priority shifts many existing hospitals' archetypes at once.
