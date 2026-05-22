# 藥師職缺比較網站 — 規劃文件 (v2)

> Pharmacist hospital-job comparison site — build spec.
> Captures every decision from the planning discussion. Code comes after this is approved.
>
> **Archived.** Superseded by
> [pharmacist-job-compare-plan-v3.md](pharmacist-job-compare-plan-v3.md), which
> aligns §7 wording with §6's Server-Component architecture and reframes §5
> mobile compare from "ranking" to "grouping sorted where sortable" (honest
> about text fields that aren't orderable). v2 is kept as the first version
> that locked Next.js, the Data Cache approach, and Vercel Analytics.
>
> **v2 changes from v1** (archived at
> [pharmacist-job-compare-plan-v1.md](pharmacist-job-compare-plan-v1.md)):
> framework locked to Next.js App Router; caching locked to Vercel Data Cache
> via `next.revalidate` (in-memory ruled out); Vercel Analytics added in week 4
> with outbound-click tracking; EN/i18n cut (Traditional Chinese only); runway
> framing corrected from "around existing work" to "fresh build, reusing
> patterns from prior projects"; Notion week-1 sequencing made explicit.

---

## 1. One-line purpose

A small public website where job-hunting pharmacists browse hospital pharmacy
positions side by side, filtered and tagged by the things that actually drive a
decision — salary, shift load, institution character, growth opportunities —
which 104 buries in free text.

**We point to 104; we never mirror it.**

**Lifespan:** seasonal. Stand it up before new-pharmacist hiring season, update
weekly for ~2–3 months, then let it go dormant. Every scope decision below is
shaped by this — small, solo-maintained, short-lived.

---

## 2. The governing rule (read this first)

**We do not scrape 104, and we do not republish 104's content.**

- 104's Terms of Service prohibit automated data collection, and they have
  litigated it. No scraper. No "AI agent that fetches from 104." No reverse-
  engineered API. Changing the database or host does **not** change this — the
  constraint lives at the data-collection layer, not the storage layer.
- **Data collection is manual and human.** Evelyn (or a helper) opens the 104
  pages she is tracking, reads them, and enters her **own structured summary**
  into Notion. AI may help *structure text she has already gathered by hand* — it
  must never do the gathering.

### Mirror vs. index card

| | Mirror (do NOT) | Index card (DO) |
|---|---|---|
| What's stored | 104's full job text, copied | Evelyn's own short fields |
| User experience | Reads everything on our site | Reads our summary, clicks to 104 for detail |
| Legal footing | Republishing others' content | Stating facts + linking out |
| Product quality | Rebuilds 104's bloat | Tight, comparable — the whole value |

Every job stores **summaries and tags in Evelyn's words**, plus a **link back to
the original 104 posting**. Never a pasted blob of 104 description. The clean
legal choice and the good-product choice are the same choice.

---

## 3. Data fields per job

Two kinds of columns: **plain facts** (extracted from 104's structured block) and
**editorial tags/judgment** (Evelyn's expert read). Marked [FACT] / [JUDGMENT].

| Field | Type | Notes |
|---|---|---|
| 醫院名稱 | [FACT] text | e.g. 輔大附醫 |
| 地點 (縣市·區) | [FACT] text | e.g. 新北·泰山 |
| 公立/私立 | [FACT] text | neutral fact, shown on card — NOT a tag |
| 薪資顯示字串 | [FACT] text | Evelyn's words, e.g. "年薪約100萬" / "月薪7萬+" |
| 薪資等級 (tier) | [JUDGMENT] select | 突出 / 一般 — drives color badge + 薪資門檻 filter |
| 輪班說明 | [FACT] text | e.g. "需輪班·日/晚/大夜"; "四週變形工時" lives here as a fact |
| 職務內容摘要 | [FACT] short text | e.g. "線上調劑·發藥" |
| 學歷要求 | [FACT] text | 大學以上 / 專科以上 etc. |
| 證照 | [FACT] text | 高考藥師 |
| 宿舍 | [FACT] text/bool | 可申請 / 外地免費 / — |
| 需求人數 | [FACT] text | 2人 / 不限 / — |
| 更新日期 | [FACT] date | from 104's 更新 stamp |
| 104 原始連結 | [FACT] url | required on every job |
| 特色標籤 (tags) | [JUDGMENT] multi-select | the 10 curated tags below |

**Every field is nullable.** When 104 omits something, the card shows "—"
gracefully — never breaks layout. (Confirmed against real postings where 尚縕 had
no 宿舍 info and the 北榮 company-page row had no 需求人數.)

### Salary handling (decided)

- Stored as **two things**: a display string (honest, readable, Evelyn's words)
  and a **manual tier tag** (突出 / 一般).
- **Color is set manually**, not auto-by-amount. Reason: the real postings mix
  月薪 / 年薪 / 面議 with large, uneven bonus structures (簽約金, 夜班費, 考核獎金)
  that cannot be honestly reduced to one comparable number. A formula would imply
  a false ranking. A human flag is the truthful representation and costs one click
  on data already being reviewed.
- The same tier drives both the **color badge** and the **薪資門檻 filter** — one
  tag, no duplicate work.

---

## 4. The 10 curated feature tags (v1, fixed/positive-only)

**Rules:** the tag set is **fixed and curated** — at entry, Evelyn picks from this
defined list via checkboxes, never free-types (free-typing breaks filters). All
tags are **positive selling points** — they highlight what a hospital offers.
A hospital simply *not having* a tag is fine; there is no negative/opposite tag.

| Group | Tags |
|---|---|
| 生活/班別 | 工作單純 · 免/少輪班 · 夜班津貼優渥 |
| 規模/成長 | 醫學中心級 · 教學醫院 · 重視教學 · 全面藥事訓練 · 外派進修機會 |
| 加分福利 | 簽約金 · 提供宿舍 |

Each tag maps to evidence in the real postings (e.g. 工作單純 ← 三總「無化療無TPN·
工作單純」; 免/少輪班 ← 北榮桃園「免小夜·大夜每月0–2天」; 重視教學 ← 輔大「醫學中心
模式·PGY」).

**Demoted from tags to plain factual fields** (because they are neutral facts, not
positive selling points, and tagging one would imply the other is worse):
公立/私立, 四週變形工時, 近捷運距離 (the actual distance goes in the 地點 field).

**Why 10 is right for v1, not a frozen ceiling:**
- A tag earns its place only if it changes a decision. There aren't ~20 decision-
  flipping distinctions in entry-level hospital pharmacy — roughly a dozen exist.
- With ~15–20 jobs a season, ~10 tags means each tag lands on a meaningful chunk
  of listings, so filters actually narrow. More tags = each too sparse to be useful.
- Every tag is a checkbox Evelyn ticks per job, every weekly update. 10 is a
  glance; 20 is a chore that erodes data quality.
- **Tags are cheap to add later.** Launch with 10, watch which filters get used and
  what users ask for, add #11/#12 only when a real gap shows. Adding mid-season is
  a 5-minute change; starting with 20 dead-weight tags is the expensive mistake.

---

## 5. The website — what users see

### Desktop
Wide **side-by-side comparison table**: fields as rows, hospitals as columns,
sticky left "欄位" column, horizontal scroll for many hospitals. (Validated as a
mockup against all 5 real jobs — structure held, gaps showed as "—".)

### Mobile (decided: field-first)
Phones can't show many columns legibly, and "compare only 2–3" was rejected as too
few. So mobile uses **field-first comparison**, which handles unlimited jobs and
matches real decision-making:

1. **Browse** — jobs as a scrollable card list. Each card: 醫院, 薪資 badge,
   location, and its feature-tag badges.
2. **Shortlist** — tap to add as many jobs as wanted (no cap).
3. **Compare** — tap a field (e.g. 薪資), see *every* shortlisted job ranked on
   just that field; tap 輪班, re-rank on that. One dimension at a time, all jobs
   visible, always readable on a phone.

### Features in v1 (decided — kept tight)
- **Filters:** 輪班 (免/少輪班) · 地點 (縣市) · 薪資門檻 (via salary tier)
- **Sort:** 薪資 · 更新日期
- Feature tags double as filters (e.g. 〔免/少輪班〕+〔提供宿舍〕).

### Explicitly NOT in v1 (confirmed)
User accounts · saved favorites/shortlist persistence across sessions · search by
hospital name · hundreds of jobs. Evelyn confirmed these are not needed, ever — so
we do not build for them.

---

## 6. Tech stack (locked: Next.js + Notion + Vercel)

```
Notion DB ──> Next.js Server Component ──> Static-ish page (Vercel)
(data +        (holds secret key,                (cards, filters, sort,
 admin UI)      fetches with revalidate cache)    field-first compare)
```

### Framework: Next.js App Router

This project's shape — fetch on server, cache, render once — is the App Router
poster case. Every piece that would be "manual wiring" in a Vite SPA + Vercel
function setup becomes a one-liner in Next:

- **Caching:** `fetch(notionUrl, { next: { revalidate: 600 } })` — shared
  Vercel Data Cache, ~1 Notion fetch per 10-min window globally (not per cold
  instance).
- **First paint:** server-rendered HTML with data already in it; no skeleton
  flash.
- **Secret key:** read via `process.env.NOTION_TOKEN` directly in the Server
  Component — never reaches the browser. No separate `/api/*` function needed.

**Vite was the alternative** (familiar default). It was dropped because this is
a fresh build, not a graft onto an existing codebase — so the familiarity
argument no longer applies, and Next.js makes the cache + analytics + SSR
shape nearly free.

### Framework scope floor (deliberate, to protect the timeline)

App Router has a wide surface; wandering into the deep end eats week 2. v1
uses only this minimal set — anything outside it is out of scope:

- Server Components for the page shell + the Notion fetch.
- One `"use client"` island for the filter/sort/compare UI (local state).
- `fetch + next.revalidate` for caching. No other cache layer.
- `<Analytics />` + `track()` for instrumentation.
- **No** middleware, **no** server actions, **no** route handlers, **no**
  parallel/intercepting routes.

### Why Notion over Neon
The data is tiny (~15–20 rows/season), hand-entered, public read-only, seasonal,
solo-maintained. Every Neon advantage is an advantage *at scale / under write-heavy
load* — which this tool explicitly never has. Choosing Neon would mean paying its
setup cost (schema + building an admin form from scratch) to buy ruled-out
capabilities = over-engineering.

Notion gives, for this exact shape:
- **Admin form already exists** — it's the Notion table. Add a row (and tick tags
  via multi-select) on a phone, straight from the 104 page. No admin page to build.
- Zero schema work, instant first data, weekly updates as a ~30-second task.

Migrating Notion → Neon later (if a future season proves it should grow) is
straightforward because the data already lives in clean columns.

### Caching: locked approach

- **Vercel Data Cache via `next.revalidate: 600`** (10 min). The cache is
  shared across all serverless instances, so a traffic spike causes ~1 Notion
  fetch per window globally — regardless of how many cold instances spin up.
- **Not** in-memory caching. In-memory on serverless is per-instance, which
  under load degrades to "1 Notion call per cold instance per window" (many
  calls, not one). Locking this up front so the function isn't rewritten in
  week 2.
- Notion's API is rate-limited (~3 req/sec); the cache makes that a non-issue.
- Staleness up to 10 min is irrelevant for weekly-updated data.

### Analytics: Vercel Analytics (week 4)

§4 and §9 both promise to decide tags and filters "on evidence" — which
requires a mechanism to gather evidence. Without it, "watch which filters get
used" is a wish, not a plan. Vercel Analytics is wired in week 4 with explicit
event tracking:

- `track('filter_change', { filter, value })` — which filters get used.
- `track('tag_toggle', { tag })` — which tags drive interaction.
- `track('click_104', { hospital })` — outbound clicks to 104 per job. This
  is the single best signal of which listings resonate, better than pageviews.

This data feeds the post-v1 decisions in §9 (tag #11/#12, role-label split, etc.).

---

## 7. The data workflow (per weekly update)

1. Evelyn opens the 104 pages she tracks (manual, human, legitimate).
2. For each, she reads it and fills/updates a **row in Notion** — her own summary
   fields + ticked feature tags + the 104 link. (AI may help *structure her
   gathered text* into fields; it never fetches from 104.)
3. The site reads Notion through the cached serverless function and renders
   everything. Visitors get an instant, comparable view and click through to 104
   for full detail.

Total weekly effort: refreshing a handful of rows — a side-task, not a second job.

---

## 8. One-month build shape

Fresh build — **not** a graft onto an existing live codebase. "One month" is
calendar time around other commitments, drawing on familiar React/Vercel
patterns from prior projects rather than reusing in-repo code.

| Week | Focus |
|---|---|
| 1 | Notion DB: define columns → **then** define the 10 tag options as multi-select → **then** seed the 5 known real jobs (order matters: tag options must exist before tagging rows, or you re-tag everything by hand). Next.js App Router project scaffold; Server Component fetching Notion with `revalidate: 600`. |
| 2 | Public site: card-list browse + desktop comparison table reading live data. |
| 3 | Mobile field-first compare; filters (輪班/地點/薪資門檻) + sort (薪資/更新日). |
| 4 | Salary color badges; Vercel Analytics with `track()` on filter changes, tag toggles, and outbound clicks to 104 (§6); polish; Vercel deploy. Buffer. |

---

## 9. Open items deferred to post-v1 (decide on evidence, not now)

- Tags #11/#12 if a real gap appears in-season.
- A genuine 臨床藥師 / 管理 role label if the season's listings include one (current
  5 jobs are all dispensing-based — a 調劑/臨床 split would leave an empty bucket).
- Notion → Neon migration only if the tool outgrows its seasonal/tiny shape.

---

## 10. Decisions locked (so we don't re-litigate)

- No scraping 104; summarize-and-link only.
- Fields per §3; salary = display string + manual tier.
- 10 fixed, positive, curated tags (§4); pick-from-list, not free-type.
- Desktop = side-by-side table; mobile = field-first compare; no shortlist cap.
- Filters 輪班/地點/薪資門檻; sort 薪資/更新日. No accounts/favorites/search in v1.
- **Framework = Next.js App Router** (Server Component fetches Notion) + Vercel.
  No Neon, no auth, no separate `/api/*` function.
- **Framework scope floor:** Server Components + one client island +
  `revalidate` cache + Analytics. No middleware, no server actions, no route
  handlers, no parallel/intercepting routes.
- **Caching = Vercel Data Cache via `next.revalidate: 600`.** Not in-memory.
- **Analytics = Vercel Analytics in week 4**, tracking filter changes, tag
  toggles, and outbound clicks to 104 (the primary evidence signal for §9).
- **Traditional Chinese only.** No EN/i18n in v1 — audience is domestic.
- Notion week-1 ordering: columns → tag options → seed jobs.
