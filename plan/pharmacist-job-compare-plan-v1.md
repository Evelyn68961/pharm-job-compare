# 藥師職缺比較網站 — 規劃文件 (v1)

> Pharmacist hospital-job comparison site — build spec.
> Captures every decision from the planning discussion. Code comes after this is approved.
>
> **Archived.** This is the original v1 plan. The active plan is
> [pharmacist-job-compare-plan-v2.md](pharmacist-job-compare-plan-v2.md), which
> locks Next.js, the Vercel Data Cache approach, Vercel Analytics, cuts EN/i18n,
> and corrects the "existing work" runway framing. v1 is kept for reference of
> the original reasoning (especially the framework-agnostic "two patterns"
> framing in §6 and the bilingual assumption in §8 — both later revised).

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

## 6. Tech stack (decided: Notion + Vercel, no Neon, no auth)

```
Notion DB ──> Vercel serverless function ──> React site (Vercel)
(data +        (holds secret key,              (cards, filters, sort,
 admin UI)      fetches + caches)               field-first compare)
```

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

### Two patterns that apply either way
- **Serverless function (the "front desk").** The browser can't talk to Notion/Neon
  directly, because the secret key would be visible in browser code for anyone to
  steal. So a tiny Vercel function holds the key out of sight, fetches the data, and
  hands the cleaned result to the browser. (Same pattern as the existing
  `/api/ai-feedback` proxy.)
- **Caching.** Notion's API is slow and rate-limited (~3 req/sec). The function
  fetches from Notion *once*, serves a saved copy to all visitors for a short window
  (e.g. 10 min), then refreshes. A traffic spike causes ~1 Notion call, not hundreds.
  Staleness up to the cache window is irrelevant for weekly-updated data.

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

## 8. One-month build shape (around existing work)

| Week | Focus |
|---|---|
| 1 | Notion DB set up with all columns + the 10 tags as multi-select; enter the 5 known real jobs as seed data; Vercel serverless function reading Notion (with caching). |
| 2 | Public site: card-list browse + desktop comparison table reading live data. |
| 3 | Mobile field-first compare; filters (輪班/地點/薪資門檻) + sort (薪資/更新日). |
| 4 | Salary color badges, bilingual strings (existing i18n pattern), polish, Vercel deploy. Buffer. |

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
- Stack = Notion + Vercel serverless (key-holder + cache) + React. No Neon, no auth.
