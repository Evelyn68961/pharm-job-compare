# Threads 推廣計畫 — 藥師人格圖鑑（21-post series）

Promotion plan for the **own-name / Threads build** (`pharm-fortune.vercel.app`,
`NEXT_PUBLIC_NEUTRAL=1`). This is the neutral build the maintainer posts under
their own name — so content stays practitioner-voiced, not an FJUH ad.

> **Status: fully built & shipping.** All 21 posts are rendered to PNGs on disk
> under `promotion/post-01-*` … `post-21-*`. This doc is the plan/overview; the
> **source of truth is `SERIES` in [build-cards.mjs](build-cards.mjs)**, which
> also generates every caption into [threads-captions.md](threads-captions.md).
> If this doc and `SERIES` ever disagree, `SERIES` wins.

## Goal

Drive quiz plays → 輔大附醫 contact-form submissions, all tagged `連結來源: threads`
(the build's `NEXT_PUBLIC_SOURCE_TAG`). Leads land at `evelyn68961@gmail.com` and
auto-forward to `drug@mail.fjuh.fju.edu.tw` (see the delivery note in CLAUDE.md).
KPI = form fills tagged `threads`.

## The 7 idols (source: hospital-icons-guide.md)

| Idol | Accent (hex) | Prop | Badge motif | Persona |
|---|---|---|---|---|
| 學霸藥師 | `#6366f1` indigo | clipboard + glasses | graduation cap | 醫學中心 / prestige |
| 教魂藥師 | `#ea580c` orange | whiteboard marker | open book | teaching / 帶學生 |
| 北漂藥師 | `#3b82f6` blue | rolling suitcase | train | 北漂 / 宿舍 |
| 鐵腕藥師 | `#ef4444` red | red seal (印章) | shield + star | 公職 / 鐵飯碗 |
| 夜貓藥師 | `#8b5cf6` violet | coffee mug + zzz | crescent + star | 夜班 / 高薪 |
| 佛系藥師 | `#10b981` emerald | pill bottle | lotus | 準時下班 / 佛系 |
| 金牛藥師 | `#ca8a04` gold | gold ingot (元寶) | ancient coin | 薪水 / 年薪百萬 |

## Three post formats

- **(a) Idol deep-dives — 5 cards** (×7): one persona per post. Arc: Hook →
  這就是你 → 你該在意的（3 factors）→ 命運醫院 tease → CTA.
- **(b) 1v1 comparisons — 4 cards** (×10): a tradeoff between two idols already
  introduced. Arc: Hook（你更像誰？）→ 兩種人生 → 關鍵差異 3-row table → CTA.
  **Standing rule: write positive claims for BOTH sides — neither reads as the
  inferior choice. Never fabricate numbers** (the value tables are qualitative,
  not salary figures).
- **(c) Grid recaps — 4–6 cards** (×4): standalone content across the full
  7-idol cast, screenshot-shareable without needing the quiz. These are the
  least ad-like posts and the strongest organic reach.

## Full schedule — Tue / Thu / Sun

Kickoff **Tue 2026-07-28**, ends **Sun 2026-09-13**. 21 posts, 3/week.
Every comparison lands after both its idols are introduced. Grids anchor the
Sunday slot from week 4 on (Sunday is the strongest day for career content).

| Week | Tue | Thu | Sun |
|---|---|---|---|
| 1 (Jul 28) | 01 夜貓 idol | 02 佛系 idol | 03 夜貓 vs 佛系 |
| 2 (Aug 4)  | 04 金牛 idol | 05 鐵腕 idol | 06 金牛 vs 鐵腕 |
| 3 (Aug 11) | 07 學霸 idol | 08 北漂 idol | 09 教魂 idol |
| 4 (Aug 18) | 10 教魂 vs 佛系 | 11 學霸 vs 金牛 | **12 全員集合** (grid) |
| 5 (Aug 25) | 13 夜貓 vs 鐵腕 | 14 教魂 vs 北漂 | **15 7 種藥師的一天** (grid) |
| 6 (Sep 1)  | 16 學霸 vs 夜貓 | 17 教魂 vs 金牛 | **18 薪水 × 生活 座標圖** (grid) |
| 7 (Sep 8)  | 19 學霸 vs 鐵腕 | 20 佛系 vs 北漂 | **21 完結篇** (grid) |

Comparison tensions (all positive-both): 03 爆肝 vs 準時下班 · 06 私立高薪 vs 公職穩定
· 10 傳承 vs 平衡 · 11 成長 vs 收入 · 13 夜型高薪 vs 穩定保障 · 14 深耕 vs 闖蕩
· 16 專業頂端 vs 實質高薪 · 17 使命 vs 回報 · 19 大院資源 vs 制度保障 · 20 留下 vs 離家.

Grids: **12** 全員集合（roll-call）· **15** 7 種藥師的一天（day-in-the-life timeline）
· **18** 薪水 × 生活 座標圖（quadrant scatter — relative positions, no figures）
· **21** 完結篇（audience-first finale: cast recap + play / tag-a-friend CTA）.

## Interleaving with the info track

The maintainer also ships ~3 clinical 醫藥筆記 posts/week on **Mon / Wed / Sat**.
The two tracks fill the week with zero collisions and Friday as a natural gap:

`Mon info · Tue promo · Wed info · Thu promo · Fri rest · Sat info · Sun promo`

Promo is ~50% of the feed (healthy on Threads), and the bio's 每週醫藥筆記 promise
stays intact. Keep the promo on **Thursday, not Friday** — Friday is the weakest
engagement day and especially weak for career content; rest belongs on the
lowest-value day.

## Rendering (reality)

Not Canva/Figma, not AI generation. Every card is composed and rendered by
**[build-cards.mjs](build-cards.mjs)** — a Node ESM generator that draws the
real archetype characters as inline SVG (character + scene + Traditional-Chinese
text all in the SVG), then rasterizes each to a **1080×1350 PNG at 2×** via
headless Chrome. Text lives in the SVG (`<g id="text-overlay">`), so copy edits
happen in `SERIES`/the card builders, never by hand on the image.

- Run: `node promotion/build-cards.mjs` → writes every post's `card-N.svg`,
  re-rasterize the PNGs with headless Chrome (see `post-01-yemao/README.md`).
- One source, two outputs: the same `SERIES` array drives both the cards and
  `threads-captions.md`, so captions and cards can never drift apart.

## Distribution & tracking

- **Tag:** exactly **one** topic tag per post — `#藥師命運轉盤` on all 21. Threads
  only surfaces a single tappable tag, so this keeps the series name as the
  button on every post. (No `#藥師 / #醫院藥師 / #藥師人生` or per-persona tags.)
- **Link:** put `https://pharm-fortune.vercel.app/` in the **first comment**
  (Threads throttles in-body links). No `?ref=` needed — the build already
  defaults `連結來源` to `threads`, so leads arrive tagged either way.
- **Attribution:** every lead arrives tagged `連結來源: threads` in the email
  (Gmail + drug@), distinguishing Threads leads from `official` (pharmfate) leads.

## Posting workflow (per post)

1. Upload the post's PNGs in order (5 for idol, 4 for comparison, 4–6 for grid).
2. Copy the「貼文」block for that post from `threads-captions.md` — don't retype.
3. Add the single tag `#藥師命運轉盤`.
4. Within ~60s, drop the first comment with the CTA line + bare link.

## Open questions / later

- **Data checkpoint at week 3.** After 03 and 06 (the first two comparisons),
  compare their saves / swipe-through / link-clicks against the idol posts. If
  the comparisons clearly underperform, trim some of the later, most-redundant
  ones (13, 16, 17, 19) then — with data, not up front. If they hold, run all 21.
- **Reserve wave.** Anything trimmed stays on disk; best performers can re-run
  after a break, and the trimmed comparisons become a second wave if the series
  lands.
- **A/B hook copy** per idol, and **per-post `?ref=`** (`threads-yemao`,
  `threads-grid18`, …) for finer attribution — only once volume is meaningful.
- **FJUH signoff** on the practitioner-voiced framing — leads land in the shared
  drug@ inbox tagged `threads`; worth pre-empting the "why is this in our inbox"
  conversation before the series takes off.
