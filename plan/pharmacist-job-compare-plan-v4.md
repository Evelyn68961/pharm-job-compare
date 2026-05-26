# 藥師職缺比較網站 — 規劃文件 (v4)

> Pharmacist hospital-job comparison site — build spec.
> Captures every decision from the planning discussion. Code comes after
> this is approved.
>
> **v4 changes from v3** (archived at
> [pharmacist-job-compare-plan-v3.md](pharmacist-job-compare-plan-v3.md)):
> - **Scope** shifted from "~15–30 jobs Evelyn manually picks" to **全台灣
>   hospital pharmacist jobs tracked**. No editorial curation — site shows
>   every hospital in the URL registry equally. Update cadence flipped from
>   "weekly manual paste" to "monthly parser cron + human-reviewed diff".
> - **§2 carve-out** added: 104 fetching remains forbidden; **hospital
>   official career pages** are now permitted as data source via deterministic
>   parsers. The "no AI gathering" principle is preserved — parsers are
>   human-authored code committed to the repo, not runtime agents.
> - **§3 schema** adds 「地區」 derived field (one of 北北基 / 桃竹苗 / 中彰投 /
>   雲嘉南 / 高屏 / 宜花東 / 離島) for the new region-chip filter, plus
>   「醫院等級」 (醫學中心 / 區域 / 地區) as a first-class column.
> - **§5 UI redesigned**: region chips + filtered card grid (default view).
>   Desktop side-by-side comparison table demoted to *compare mode* triggered
>   by a shortlist (≤ 8). Hospital-name search un-banned. Sort dropdown
>   added (default 醫院名稱 A→Z, alternative 更新日期 newest first).
> - **§7 workflow** rewritten around the parser cron. Manual paste flow
>   retained only as historical record for the 12 seeded rows.
> - **§8 build shape** stretches from 4 weeks to ~6 weeks for the parser
>   layer (regional/district hospitals extend post-launch).
> - **§10** locked decisions updated to match.
> - **§11 (new)**: parser architecture — URL registry, per-hospital configs,
>   tag inference levels, LLM-fallback, GitHub Actions cron, diff applier.
>
> v3 inherited from v2 inherited from v1. Earlier amendments and rationale
> live in those archived docs.

---

## 1. One-line purpose

A public website where job-hunting pharmacists browse **every hospital
pharmacist position in Taiwan** side by side, filtered by the things that
actually drive a decision — region, hospital tier, salary, shift load,
training opportunities, benefits — which typical recruitment pages bury
in unstructured free text.

**We summarize each hospital's own posting; we link out to the hospital's
career page for full detail.** Source data and outbound link both come from
each hospital's own official career page (§2, §11 parser). 104 is not used
as either source or destination — see §2 Rule B.

**Lifespan:** seasonal. Stand it up before new-pharmacist hiring season,
update monthly via parser cron for ~3 months, then let it go dormant.
Every scope decision below is shaped by this — solo-maintained, short-
lived, no real user accounts, no real ops team.

---

## 2. The governing rule (read this first)

**Two distinct rules.** Read them as a pair.

### Rule A: Hospital career pages, via deterministic parsers, paraphrased

Each hospital publishes its own recruitment page (e.g. 輔大附醫 人事室招募
頁, 國泰人才招募系統, 北榮人事系統) **as its own announcement to the public**.
These pages are the site's single data source and single outbound link
target:

- Hospitals publish these pages *intending* people to read and act on them.
- No ToS prohibition on automated reads of publicly-posted recruitment
  pages (verify per-hospital before adding to the URL registry).
- The data is the hospital's own first-party announcement, not a third
  party's aggregated republication.

**Deterministic parsers** (one CSS-selector config per hospital, human-
authored code committed to the repo) are permitted against hospital career
pages. The runtime fetcher is plain code — HTTP GET + CSS-selector parse —
not "AI fetching".

AI / Claude assistance is limited to two roles:
1. **Build-time**: writing parser configs, refining tag inference rules,
   structuring text into the locked 4-section body template.
2. **LLM-fallback at parse time**: if a deterministic parser returns
   nothing (broken selectors, layout change), the fallback sends raw HTML
   to Claude for structured-output extraction. This is flagged in the
   diff report as low-confidence and routed to Evelyn for review.

Outbound links from the site go to the hospital's career page — never to
any aggregator. Cards, detail panels, and analytics all reference the
hospital's career page only.

### Rule B: 104 is a permitted destination; never a scraping target

Two halves, distinct:

- **104 as outbound link**: ALLOWED, and now preferred when available.
  Linking to a public 104 page does not violate any ToS — anyone can link
  to a public URL. Job seekers benefit from the richer posting on 104, so
  when the row has a 104 URL we display it as the primary "apply" link
  and the hospital career page becomes the fallback.
- **104 as data source**: STILL FORBIDDEN. 104's Terms of Service prohibit
  automated data collection, and they have litigated it. **No scraper,
  no AI agent, no reverse-engineered API targeting 104.com.tw.** All 104
  URLs in the database must be collected by hand (Evelyn manually
  pastes), or surfaced by a search-engine query that humans review before
  saving.

The 12 historical rows from the v3 phase were paraphrased from 104 by
Evelyn — a one-time manual exercise to seed the database, well within
the "manual data collection" lane. Their 104 URLs remain in the
`104 原始連結` column and now drive the primary "查看 104 原始職缺" link
in the card UI.

### Mirror vs. index card (rule preserved from v3)

| | Mirror (do NOT) | Index card (DO) |
|---|---|---|
| What's stored | Verbatim posting text | Structured fields + paraphrased body |
| User experience | Reads everything on our site | Reads our summary, clicks out to apply |
| Legal footing | Republishing others' content | Stating facts + linking out |
| Product quality | Rebuilds the source page's bloat | Tight, comparable — the whole value |

Every job stores **structured fields + tags + a 4-section paraphrased
body**, plus an outbound link to the **hospital's career page**. Never a
pasted blob of the hospital page. The clean legal choice and the good-
product choice are the same choice.

---

## 3. Data fields per job

Two kinds of columns: **plain facts** (parsed from the hospital career page;
the 12 historical rows were paraphrased from 104 in the v3 phase but have
since been migrated to point at hospital career pages) and **editorial
tags / judgment** (rule-based inference for objective tags, human review
for subjective). Marked [FACT] / [JUDGMENT].

| Field | Type | Notes |
|---|---|---|
| 醫院名稱 | [FACT] text | e.g. 輔大附醫 |
| 地點 (縣市·區) | [FACT] text | e.g. 新北·泰山 |
| 地區 | [FACT, derived] select | 北北基 / 桃竹苗 / 中彰投 / 雲嘉南 / 高屏 / 宜花東 / 離島 (mapped from 縣市) |
| 公立/私立 | [FACT] select | neutral fact, filterable |
| 醫院等級 | [FACT, verified] select | 醫學中心 / 區域 / 地區 (cross-verified against 衛福部 list in `data/hospitals-reference.md`) |
| 薪資顯示字串 | [FACT] text | parser-extracted, e.g. "年薪約100萬" / "月薪7萬+" |
| 薪資等級 (tier) | [JUDGMENT, manual] select | 突出 / 一般 — parser cannot auto-set (see Salary handling) |
| 輪班說明 | [FACT] text | e.g. "需輪班·日/晚/大夜"; "四週變形工時" lives here |
| 職務內容摘要 | [FACT] short text | e.g. "線上調劑·發藥" |
| 學歷要求 | [FACT] text | 大學以上 / 專科以上 etc. |
| 證照 | [FACT] text | 高考藥師 (special-case conditions go in body 工作概況) |
| 宿舍 | [FACT] text/bool | 可申請 / 外地免費 / 條件式 / — |
| 需求人數 | [FACT] text | 2人 / 不限 / — |
| 更新日期 | [FACT] date | parser fetch timestamp or hospital page's last-modified |
| 醫院官網職缺連結 | [FACT] url | the single outbound link — points to the hospital's career page that the parser reads. Mirrors `career_page_url` from the URL registry (§11). |
| 特色標籤 (tags) | [JUDGMENT, rule-based] multi-select | the 11 curated tags (§4) |

**Every field is nullable.** Cards show "—" gracefully when the parser
can't extract; never crashes the layout.

### Salary handling (rule preserved from v3)

- Stored as **two things**: a display string (whatever the hospital page
  states) and a **manual tier tag** (突出 / 一般).
- **Color is set manually**, not auto-by-amount. Reason: real postings
  mix 月薪 / 年薪 / 面議 with uneven bonus structures (簽約金, 夜班費,
  考核獎金) that cannot be honestly reduced to one comparable number. A
  formula would imply a false ranking.
- **Parser defaults new rows to 一般.** Evelyn promotes to 突出 by manually
  flipping the field in Notion. The diff applier (§11) **never overwrites**
  this field.

### Body content (the 4-section template, rule preserved from v3)

The Notion row body for every entry uses a locked 4-section template:
**工作概況 / 薪酬結構 / 訓練與福利 / 法定福利**. Parser fills each
section by mapping selector-extracted text into the templated structure;
no verbatim copy of the hospital page. Subjective phrasing (recruitment
marketing language) gets paraphrased per §2 Index-card rule.

### 地區 derivation (new in v4)

| 地區 chip | 縣市 included |
|---|---|
| 北北基 | 臺北 · 新北 · 基隆 |
| 桃竹苗 | 桃園 · 新竹市 · 新竹縣 · 苗栗 |
| 中彰投 | 臺中 · 彰化 · 南投 |
| 雲嘉南 | 雲林 · 嘉義市 · 嘉義縣 · 臺南 |
| 高屏 | 高雄 · 屏東 |
| 宜花東 | 宜蘭 · 花蓮 · 臺東 |
| 離島 | 澎湖 · 金門 · 連江 |
| 全部 | (all of the above) |

Parser derives 地區 from the 縣市 it extracts from the hospital page.
The mapping above is the single source of truth — also embedded in
`parsers/region-mapping.json` for parser use and as a UI lookup for the
region chip strip (§5).

---

## 4. The curated feature tags (11, fixed, positive-only)

**Rules:** the tag set is **fixed and curated**. Tags are applied by parser
rules (`data/tag-rules.md`), not by free-typing. All tags are **positive
selling points**. A hospital simply *not having* a tag is fine; there is
no negative/opposite tag.

| Group (color) | Tags |
|---|---|
| 生活/班別 (blue) | 工作單純 · 免/少輪班 · 無大夜 · 夜班津貼優渥 |
| 規模/成長 (purple) | 醫學中心級 · 教學醫院 · 重視教學 · 全面藥事訓練 · 外派進修機會 |
| 加分福利 (green) | 簽約金 · 提供宿舍 |

Tag-evidence anchors (each tag traces to real postings):
- 工作單純 ← 三總「無化療無TPN·工作單純」
- 免/少輪班 ← 北榮桃園「免小夜·大夜每月0–2天」
- 無大夜 ← 新國民「日班，需輪值週六半天」/ 秉坤「日/晚/假日」
- 重視教學 ← 輔大「醫學中心模式·PGY」

`免/少輪班` and `無大夜` are distinct on purpose: 免/少輪班 covers any
lightening of rotation (could include 0–2 大夜/月); 無大夜 specifically
signals **zero 大夜 班** — the most disruptive shift type for pharmacists.
A posting can earn one but not the other.

### Tag inference levels (new in v4)

See `data/tag-rules.md` for the full rule table. Three evidence levels
determine whether the parser auto-applies or flags for human review:

- **Level A — Institutional fact** (醫學中心級, 教學醫院): cross-checked
  against 衛福部 lists in `data/hospitals-reference.md`. **Parser
  auto-applies.** A hospital's own page claiming "醫學中心" is not enough;
  it must appear on the authoritative list.
- **Level B — Textual match** (免/少輪班, 無大夜, 夜班津貼優渥, 外派進修
  機會, 簽約金, 提供宿舍): regex/keyword hit on hospital page. **Parser
  auto-applies with an evidence trace** in audit log.
- **Level C — Subjective** (工作單純, 重視教學, 全面藥事訓練): parser
  flags candidates for Evelyn review; **never auto-applies**. Reason:
  these require reading-comprehension judgment that pattern matching
  cannot reliably do without false positives.

**Demoted from tags to plain factual fields** (rule preserved from v3):
公立/私立, 四週變形工時, 近捷運距離 (the actual distance lives in 地點).

### Why 11 stays right even at 400-row scale

Each tag now lands on potentially many hospitals (e.g. 提供宿舍 might
apply to 200+). Tags serve as **multi-axis cross-filters**, not as a
primary differentiator. 〔免/少輪班〕+〔提供宿舍〕+〔簽約金〕at 400 rows
narrows to a small set; same combinatorial value as before. More tags
would add noise more than signal — keep the discipline.

Tags can still be added later if a real evidentiary gap appears (e.g. a
season's postings reveal a 「臨床藥師」 role label worth tagging).
Process unchanged from v3.

---

## 5. The website — what users see

### Landing page (default view, desktop + mobile)

Three stacked zones.

**Zone 1 — Region chip strip** (top, full-width row; horizontal scroll on
mobile if needed):

```
[ 北北基 ] [ 桃竹苗 ] [ 中彰投 ] [ 雲嘉南 ] [ 高屏 ] [ 宜花東 ] [ 離島 ] [ 全部 ]
```

- Default selection: 全部. Single-select (tap a chip → grid filters to
  that region's hospitals only; tap 全部 to clear).
- Region mapping locked in §3.
- A user who wants 北北基 + 桃竹苗 uses the 縣市 multi-select in Zone 2.

**Zone 2 — Secondary filters + search** (below chips; on mobile this row
collapses behind a 「篩選」 button to keep the landing clean):

- Hospital-name search: text input, debounced; matches substring in
  醫院名稱.
- 醫院等級: multi-select (醫學中心 / 區域 / 地區).
- 薪資等級: multi-select (突出 / 一般).
- 公立/私立: multi-select.
- 縣市: multi-select (when region chip is too broad).
- 11 tag chips: each toggleable; selected chips AND together.
- Sort dropdown: 醫院名稱 A→Z (default) | 更新日期 newest first.

**Zone 3 — Card grid** (4-col desktop, 1-col mobile; paginated 50/page):

Each card shows: 醫院名稱, 地點, 醫院等級 + 公立/私立 badges, 薪資 badge
(突出 = orange, 一般 = gray), assigned feature-tag chips, and two
buttons: 「查看詳情」 (opens detail panel) + 「加入比較」 (adds to
shortlist).

Empty filter combinations show a "0 家符合" state with a 「清除篩選」
button — no silent empty page.

### Card detail view

Tap 「查看詳情」 → modal (mobile) / right-side panel (desktop) showing
all §3 fields + the 4-section body template (工作概況 / 薪酬結構 / 訓練
與福利 / 法定福利) + a 「→ 前往醫院官網應徵」 outbound link to the
hospital's career page.

### Compare mode (post-shortlist)

Comparison is **a mode**, not the default view. With 400+ rows, a
400-column table is meaningless; users compare *after* narrowing.

1. **Shortlist** — tap 「加入比較」 on cards. **Soft cap of 8** — the UI
   shows 「已達上限，需移除才能新增」 past 8.
2. A 「比較模式」 button appears once shortlist ≥ 2; tap to enter.
3. Compare mode has two layouts:
   - **Desktop**: side-by-side table — fields as rows, shortlisted
     hospitals as columns (preserves v3's desktop strength, just bounded).
   - **Mobile**: field-first — tap a field, see all shortlisted
     hospitals' values stacked vertically. Same as v3 mobile.
4. **No ranking promised** — grouping, not sorting (rule preserved from
   v3.0). Sort applies to the landing card grid only.

### Shortlist persistence

In-memory only (`useState`). Refresh wipes it. Acceptable for a
discover-then-compare session flow. No cross-session persistence; no
accounts.

### Explicitly NOT in v1

- User accounts, sign-up, login.
- Cross-session shortlist or favorite persistence.
- Map view (region chips cover the geographic-first use case).
- Hospital ratings, reviews, sponsored placements.
- Cross-region chip multi-select (use Zone 2 縣市 for that).
- Editorial recommendation / "Evelyn's picks" — site is neutral.

---

## 6. Tech stack (locked: Next.js + Notion + Vercel)

```
Notion DB ──> Next.js Server Component ──> Static-ish page (Vercel)
(parser-fed)  (paginated, revalidate cache) (cards, filters, compare)
```

### Framework: Next.js App Router

Project shape — fetch on server, cache, render once — is the App Router
poster case. v3's locked choice carries forward unchanged.

- **Caching:** `fetch(notionUrl, { next: { revalidate: 600 } })`. Shared
  Vercel Data Cache, ~1 Notion fetch per 10-min window globally.
- **First paint:** server-rendered HTML with data already in it.
- **Secret key:** `process.env.NOTION_TOKEN` in the Server Component;
  never reaches the browser.

### Framework scope floor (preserved from v3)

v4 uses only this minimal set:

- Server Components for the page shell + the Notion fetch.
- One `"use client"` island for filter / search / shortlist / compare UI.
- `fetch + next.revalidate` for caching.
- `<Analytics />` + `track()` for instrumentation.
- **No** middleware, **no** server actions, **no** route handlers, **no**
  parallel/intercepting routes.

### Notion at 400-row scale

Notion's REST API returns max 100 rows per page → need paginated fetch
inside the Server Component (loop while `has_more`, accumulate). At
~400 rows this is 4 round-trips, runs in ~1–2 seconds on cold cache,
cached for 10 minutes by `revalidate`.

The original "tiny dataset" justification for Notion over Neon weakens
at this scale, but the **admin-form-already-exists** advantage holds:
Notion's table UI is still the cheapest way to manually flip 薪資等級,
review parser diffs, and edit hospital rows. Migration to Neon stays
deferred to a future season per §9.

### Caching: locked approach (preserved from v3)

- **Vercel Data Cache via `next.revalidate: 600`** (10 min). Shared
  across instances; ~1 Notion paginated fetch per 10-min window.
- **Not** in-memory caching (per-instance, degrades under load).
- Staleness up to 10 min irrelevant for monthly-updated data.

### Analytics: Vercel Analytics (week 6)

- `track('filter_change', { filter, value })` — which filters get used.
- `track('region_chip', { region })` — which regions users care about.
- `track('tag_toggle', { tag })` — tag interaction.
- `track('shortlist_add', { hospital })` — what users want to compare.
- `track('click_career_page', { hospital })` — outbound clicks to each
  hospital's career page (the primary "user got value" signal).

Feeds the post-v1 decisions in §9.

---

## 7. The data workflow

### Source data

- **Historical 12 rows** (manually seeded weeks 1–3 of v3 build):
  paraphrased from 104 during the v3 phase as a one-time seeding exercise.
  Content preserved as-is; their 104 outbound links are being migrated to
  the hospital's career page (task #16). Marked in Notion with a
  `manual-seed` flag to distinguish from parser-fed rows.
- **All other rows** (parser-fed, ongoing): each row originates from a
  hospital's official career page via the parser (§11). Notion is the
  single source of truth for the public site.

### Monthly cron (the primary workflow)

1. **Trigger** — GitHub Actions `monthly-parse.yml`, schedule `'0 0 1 * *'`
   (1st of month, 00:00 UTC).
2. **Parser run** — for each hospital in `data/hospital-career-urls.md`:
   fetch career page → deterministic CSS-selector parse (or LLM-fallback
   if selectors return nothing) → tag inference per `data/tag-rules.md`
   → row construction → diff vs current Notion state.
3. **Diff report** — `data/monthly-diffs/{YYYY-MM}.json` lists per-
   hospital: `unchanged` | `text-only-change` | `tag-change` |
   `salary-tier-flip` | `new-posting` | `dropped-posting` | `parse-error`.
   Each change carries a confidence rating and the parser's evidence
   trace.
4. **Notification** — workflow opens a GitHub issue tagging Evelyn with
   the diff summary.
5. **Human review (first 1–2 cycles)** — Evelyn reads the diff, approves
   or edits, runs `scripts/apply-diff.py` which writes to Notion via API.
   薪資等級 (突出/一般) **always** requires manual approval per §3 rule.
6. **Auto-apply mode (cycle 3+)** — if quality has held, high-confidence
   text-only diffs apply automatically; tag changes, salary-tier flips,
   and parse-errors still queue for review.

### Public-site read path

Unchanged from v3 §7: page's Server Component reads Notion (cached via
`next.revalidate: 600`) and renders. Parser activity is invisible to
visitors — they always see whatever's currently in Notion.

### Failure modes

- **Hospital changes its page layout** → deterministic parser returns
  empty → LLM-fallback kicks in → flagged as low-confidence in diff →
  Evelyn reviews + updates the parser config commit.
- **Hospital takes down the recruitment page** → parser returns 404 →
  `dropped-posting` in diff → Evelyn decides: delete row or mark as
  inactive.
- **New hospital appears** → not in URL registry → won't be seen until
  manually added to `data/hospital-career-urls.md`. Discovery of new
  hospitals is human-led (Evelyn finds them via 衛福部 updates, news,
  word of mouth).

---

## 8. Build shape (~6 weeks calendar around other commitments)

Fresh build, drawing on familiar React/Vercel patterns. v4 stretches
the v3 one-month plan to ~6 weeks because of the parser layer; regional
and district hospital coverage extends past launch.

| Week | Focus |
|---|---|
| 1 | Notion DB schema + 11 tag options + 12 historical rows (done in v3 phase). Next.js scaffold; Server Component fetching Notion with paginated `revalidate: 600`. |
| 2 | Landing page: region chip strip (§5 Zone 1) + card grid. Sort dropdown. Live data from Notion. |
| 3 | Zone 2 filters + hospital-name search; card detail panel; compare mode (shortlist ≤ 8 → desktop table / mobile field-first). |
| 4 | URL registry + `tag-rules.md` (done) + 輔大附醫 pilot parser. Verify pilot output against historical row. |
| 5 | 22 remaining 醫學中心 parsers + first cron dry run. Diff applier script. |
| 6 | Vercel Analytics; salary color badges polished; deploy. Buffer. |
| 7+ | 區域醫院 parsers (templated batch) — extends past launch. |
| 8+ | 地區醫院 (LLM-fallback) — extends past launch. |

---

## 9. Open items deferred to post-v1 (decide on evidence)

- **Tags #12+** if a real evidentiary gap appears in-season. (#11 已新增
  `無大夜`; see v3 amendment carried into v4.)
- **Role label split** (調劑 / 臨床 / 管理) if posting variety warrants it.
- **Auto-apply mode promotion** — when do high-confidence text-only diffs
  flow without review? Decide on cycle-3 evidence.
- **Notion → Neon migration** — only if the tool outgrows seasonal scope
  or Notion API limits become a real bottleneck.
- **Cross-session shortlist persistence** — only if analytics show users
  abandoning before completing compare (Vercel funnel data).

---

## 10. Decisions locked (so we don't re-litigate)

- **§2 dual rule**: Hospital career pages are the only data source and
  the only outbound link target. **104 is neither a source nor a
  destination** — no fetch, no link out, no analytics target. AI is a
  build-time tool + a fallback parser, never a runtime decider of what
  to fetch.
- **Fields per §3**: 16 columns including 地區 (derived) and 醫院等級
  (verified against 衛福部 list). 薪資等級 stays manual.
- **11 fixed, positive, curated tags** (§4): applied by parser rules,
  Level A/B auto, Level C human-reviewed.
- **Default view** (§5): region chips + filtered card grid. Compare mode
  is post-shortlist (≤ 8 hospitals).
- **Filters** (§5 Zone 2): region chip + 醫院等級 + 薪資等級 + 公立/私立
  + 縣市 + 11 tag toggles + hospital-name search.
- **Sort** (§5): default 醫院名稱 A→Z. Alternative: 更新日期 newest first.
  No salary-tier sort (would imply ranking).
- **Shortlist cap = 8** (soft, swap allowed). In-memory only.
- **Framework = Next.js App Router** + Vercel. Scope floor: Server
  Components + one client island + `revalidate` cache + Analytics.
- **Caching = Vercel Data Cache via `next.revalidate: 600`** (10 min).
  Paginated Notion fetch (~4 round-trips at 400 rows).
- **Analytics = Vercel Analytics in week 6**, tracking filter changes,
  region chip taps, tag toggles, shortlist adds, and outbound clicks to
  hospital career pages.
- **Traditional Chinese only.** No EN/i18n.
- **Notion ordering**: columns → tag options → historical seed rows →
  parser-fed rows.
- **Update cadence = monthly cron**. First 1–2 cycles human-reviews every
  diff; auto-apply for high-confidence text-only diffs from cycle 3+.
- **Parser code lives in the repo**: `parsers/{hospital_id}.json` configs,
  `scripts/run-parsers.py` runner, `scripts/apply-diff.py` applier,
  `.github/workflows/monthly-parse.yml` cron. Open-source-friendly (no
  secrets in configs; secrets in GitHub Actions env).
- **Site is neutral**: no editorial recommendation, no "featured"
  hospitals, no "Evelyn's picks". All hospitals in the registry display
  equally.

---

## 11. Parser architecture

### Goal

Replace v3's manual paste workflow with monthly parser-driven updates
covering 全台灣 hospital pharmacist postings, while preserving §2 (no
104 fetching) and the §3 schema.

### Components

**1. URL registry** — `data/hospital-career-urls.md` (human-edited
markdown) + `data/hospital-career-urls.json` (machine mirror, generated
by `scripts/build-url-registry.py`). Each entry:

```json
{
  "hospital_id": "fju-fjuh",
  "name": "輔大附醫",
  "tier": "區域",
  "region": "北北基",
  "city": "新北市",
  "career_page_url": "https://...",
  "parser_config_path": "parsers/fju-fjuh.json",
  "last_verified_date": "2026-05-23"
}
```

**2. Per-hospital parser config** — `parsers/{hospital_id}.json`:
CSS selectors + field mappings + per-hospital quirks. Hand-written for
醫學中心 (high stakes, custom HTML). Templated for 區域/地區 grouped
by CMS family (many 區域醫院 share the same vendor system).

**3. Generic LLM-fallback parser** — `parsers/llm_fallback.py`. For
hospitals without a deterministic config or when selectors return
nothing. Sends rendered HTML to Claude with a structured-output prompt
matching the §3 schema. Flagged in diff report as `llm-sourced,
low-confidence`.

**4. Tag inference engine** — `data/tag-rules.md` (human-readable) +
`parsers/tag-rules.json` (machine form). For each tag: trigger keywords,
regex, exclude conditions, evidence-required level (§4 Level A/B/C).

**5. Runner** — `scripts/run-parsers.py`. Iterates URL registry, invokes
parsers, runs tag inference, computes diff vs current Notion state,
emits monthly diff report.

**6. Diff applier** — `scripts/apply-diff.py`. Reads an approved diff,
writes to Notion via the official API. Idempotent (safe to re-run).
**Never touches 薪資等級** (§3 rule).

**7. Cron** — `.github/workflows/monthly-parse.yml`, schedule
`'0 0 1 * *'`. Outputs:
- Commits `data/monthly-diffs/{YYYY-MM}.json` and audit logs to the repo.
- Opens a GitHub issue summarizing the diff, tagging Evelyn.

### Parser output contract

Per hospital, every run emits:
- All [FACT] fields from §3 (including derived 地區 and verified 醫院等級).
- Inferred tags array + per-tag evidence trace.
- Parse confidence: `high` (deterministic, all expected fields found),
  `medium` (deterministic, some fields missing), `low` (LLM-fallback).
- Source URL, parse timestamp, raw HTML snapshot path (for audit).
- Errors, if any.

The Notion row body still follows the 4-section template (§3); parser
fills sections by mapping selector-extracted text into the template
structure. Hospital marketing language gets paraphrased, never
copy-pasted.

### Phasing

| Phase | Scope | Status |
|---|---|---|
| 0 | 12 historical rows from 104 manual paste | Done (v3 phase) |
| 1 | URL registry + `tag-rules.md` + 輔大附醫 pilot parser + diff plumbing | In progress |
| 2 | 22 remaining 醫學中心 parsers + first cron dry run | Next |
| 3 | 80+ 區域醫院 (templated) + LLM-fallback as needed | Post-launch |
| 4 | 地區醫院 (LLM-fallback primary) | Ongoing |
| 5 | Auto-apply mode for high-confidence diffs | From cycle 3 |

### Boundary re-stated (the §2 firewall)

Parser code runs locally / in GitHub Actions. **Fetches hospital career
pages only — never 104**. Claude assistance is restricted to:

1. Writing parser configs (build-time, human-reviewed commits).
2. LLM-fallback extraction when deterministic parsers fail (always
   flagged as low-confidence in diff report).
3. Tag inference rule maintenance (build-time).

Claude **never**:
- Decides at runtime which URL to fetch (registry is pre-declared).
- Fetches 104 in any form.
- Bypasses the diff-review step in cycles 1–2.

The runtime data path is human-written code. AI is a build-time tool
and a fallback assistant, not a runtime agent. This preserves §2's
"AI never gathers" principle while making 全台灣-scale tracking
feasible.
