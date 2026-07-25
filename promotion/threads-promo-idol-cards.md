# Threads 推廣計畫 — 藥師人格圖鑑（21-post series）

Promotion plan for the **own-name / Threads build** (`pharm-fortune.vercel.app`,
`NEXT_PUBLIC_NEUTRAL=1`). This is the neutral build the maintainer posts under
their own name — so content stays practitioner-voiced, not an FJUH ad.

## Goal

Drive quiz plays → 輔大附醫 contact-form submissions, all tagged `連結來源: threads`
(the build's `NEXT_PUBLIC_SOURCE_TAG`). Leads land at `evelyn68961@gmail.com` and
auto-forward to `drug@mail.fjuh.fju.edu.tw` (see the delivery note in CLAUDE.md).
KPI = form fills tagged `threads`.

## Strategy decision (settled)

- **Image carousels, NOT AI video.** AI img2vid mutates the hand-drawn idols
  off-model; video is slow/costly before we know what converts. Phase 2 *could*
  be motion-graphics of the SVGs (on-model), never img2vid.
- **SVG composition, not AI raster generation.** The idols are already
  flat-vector SVGs — AI generators drift off-model on the details that
  distinguish them (closed sleepy eyes, wink, side ribbons, gov pin, floating
  Z's, etc.). Compose scenes in SVG with the actual character SVG as-is;
  render to PNG via the existing satori pipeline. See "Rendering approach"
  section for the reasoning + the character reference. Text is still overlaid
  in Canva/Figma at the end (Traditional Chinese layout).
- **Three post formats, 21-post series.**
  (a) **Idol deep-dives** — 5 cards, one persona per post (×7).
  (b) **1v1 comparisons** — 4 cards, tradeoff between two idols already introduced (×10).
  (c) **Grid recaps** — single-image or short arc across the full 7-idol cast (×4).
  Total 21 posts over 7 weeks, 3 posts/week M/W/F. See the schedule table below.

## The 7 idols (source: hospital-icons-guide.md)

| Idol | Accent (hex) | Prop | Badge motif | Persona |
|---|---|---|---|---|
| 學霸藥師 | `#6366f1` indigo | clipboard + glasses | graduation cap | 醫學中心 / prestige |
| 教魂藥師 | `#f59e0b` amber | whiteboard marker | open book | teaching / 帶學生 |
| 北漂藥師 | `#3b82f6` blue | rolling suitcase | train | 北漂 / 宿舍 |
| 鐵腕藥師 | `#ef4444` red | red seal (印章) | shield + star | 公職 / 鐵飯碗 |
| 夜貓藥師 | `#8b5cf6` violet | coffee mug + zzz | crescent + star | 夜班 / 爆肝 |
| 佛系藥師 | `#10b981` emerald | pill bottle | lotus | 準時下班 / 佛系 |
| 金牛藥師 | `#ca8a04` gold | gold ingot (元寶) | ancient coin | 薪水 / 年薪百萬 |

## Card design system

- **Format:** 1080 × 1350 (4:5 portrait) — fills the Threads feed.
- **Background:** app pastel gradient (amber-cream → rose → mint) + faint 💊
  texture, so cards match the destination site.
- **Character:** the real archetype SVG (`ArchetypeAvatar` look — character +
  colored halo, no badge), or AI art referenced from it.
- **Accent:** idol posts themed in that idol's accent; comparison posts use a
  duotone split (left accent | right accent); grid posts use the full palette.
- **Text overlay** (added in Canva/Figma, NOT in the AI image): bold sans,
  Traditional Chinese, practitioner voice. Never "student project / 學生作品".
- **Furniture:** small `藥師命運轉盤` brand mark, position counter (2/5 or 2/4),
  swipe hint (→) on all but the last card. Grid posts skip the counter if single-image.

---

## 7-week schedule

Kickoff Mon 2026-07-27. Cadence M/W/F, 3 posts per week. Every comparison lands
after both its idols are already introduced.

| Week | Mon | Wed | Fri |
|---|---|---|---|
| 1 (Jul 27) | 夜貓 idol | 佛系 idol | 夜貓 vs 佛系 ★★★ |
| 2 (Aug 3)  | 金牛 idol | 鐵腕 idol | 金牛 vs 鐵腕 ★★★ |
| 3 (Aug 10) | 學霸 idol | 北漂 idol | 學霸 vs 鐵腕 ★★★ |
| 4 (Aug 17) | 教魂 idol | 佛系 vs 金牛 ★★★ | **Grid 1: 全員集合** |
| 5 (Aug 24) | 教魂 vs 學霸 ★★ | 學霸 vs 佛系 ★★★ | **Grid 2: 7 種一日** |
| 6 (Aug 31) | 金牛 vs 北漂 ★★★ | 北漂 vs 鐵腕 ★★ | **Grid 3: 薪水×生活** |
| 7 (Sep 7)  | 夜貓 vs 金牛 ★★★ | 佛系 vs 鐵腕 ★★ | **Grid 4: 系列總結** |

Series ends Fri 2026-09-11. 21 posts total.

---

## Post formats

### Idol post — 5-card arc

| Card | Role | Purpose |
|---|---|---|
| 1 Hook | big idol + name + 「你，也是___藥師嗎？」 | stop the scroll |
| 2 這就是你 | relatable "this is your life" scenario | recognition |
| 3 你該在意的 | 2–3 job factors this type should check | practitioner value |
| 4 命運醫院 | tease the quiz payoff (50+ 醫院抽一間) | curiosity |
| 5 CTA | 30 秒測驗 + `?ref=threads` link | the click |

> **A/B question for later:** is card 4 pulling weight, or is a 4-card idol post
> cleaner? Watch swipe-through and completion rates.

### Comparison post — 4-card arc

| Card | Role | Purpose |
|---|---|---|
| 1 Hook | split-screen: both idols facing off + 「你更像A還是B？」 | stop the scroll |
| 2 兩種人生 | side-by-side scenario (A's day / B's day) | recognition |
| 3 硬指標對比 | side-by-side table of the actual tradeoff (薪資帶 / 工時 / 福利) | practitioner value |
| 4 CTA | 30 秒測驗 + `?ref=threads` link | the click |

No 命運醫院 tease card — the comparison itself is the payoff.

### Grid post — single-image or short arc

Format varies by concept (see per-grid section). Every grid uses all 7 idols
and reuses hero art from the idol posts — zero new AI generation from week 4
onward. CTA overlay always includes the quiz link.

---

## Rendering approach

**Primary path: SVG composition.** The idol characters are simple flat-vector
SVGs already (see `src/components/archetypes/*.tsx`). AI raster generators
(Midjourney img2img / `--cref`) will drift off-model on details that matter —
closed sleepy eyes (夜貓), the wink (金牛), long hair + green side ribbons
(佛系), the government shield-and-star pin (鐵腕), the specific mug band and
floating "z"s (夜貓), and so on. Recreating those with an AI generator is
fighting the tools.

Instead: **use the actual character SVG at 1:1 fidelity as the character layer,
composite scene elements around it as additional SVG shapes and gradients,
render to PNG.** The codebase already has satori/OG-image infrastructure
(referenced in `NightOwlPharmacist.tsx`), so this fits the existing pipeline.
Zero AI cost, zero character drift, faster iteration.

Aesthetic tradeoff: cards will read as sticker/UI, not painterly illustration.
That matches the actual app aesthetic anyway.

**Fallback: AI generation with corrected reference.** If a card genuinely needs
a scene AI is better at (dense pharmacy interior, night moonlight rendering,
crowd scene), generate only the *background* via AI and composite the actual
character SVG on top in Canva/Figma. Never let AI render the character itself.

### Character reference (accurate to the actual SVGs)

Use this as the source of truth — the earlier prose descriptions in this doc
were wrong on multiple points. Every character shares: ~2.2 heads tall
(proportional body, not tiny), white lab coat with light-gray outline,
peachy-tan skin (`#F8D2AC`), small round ears, and a **diamond-shaped chest
ornament in the idol's accent color** (this is a decorative pin over the
sternum, NOT a neckerchief around the neck).

**Never include in a character prompt or render:** the colored halo, hospital
badge, or salary sparkle. Those are composed on top by `HospitalIcon` and
should stay separate.

| Idol | Gender-coded | Face | Prop | Distinctive detail |
|---|---|---|---|---|
| 學霸 | male | round wire glasses, serious dot eyes inside, plain small mouth, **no cheek blush** | beige clipboard tilted at his left side, ruled lines, small clip tab | short spiky-bangs dark hair |
| 教魂 | female, long hair | dot eyes with highlight dots + small eyelash strokes, **wide open enthusiastic smile**, cheek blush | whiteboard marker at waist: dark triangular nib, blue barrel, darker cap | long dark hair past shoulders |
| 北漂 | male | curved eyebrows (no glasses), wide open hopeful smile, prominent cheek blush | brown/tan rolling suitcase at his left, horizontal seam, arched handle | tousled short hair, newcomer vibe |
| 鐵腕 | female | strong angled dark brows, dot eyes with highlights, controlled small smile, faint blush | red official seal (印章) at waist: brown wooden top + handle, red block, darker ink edge | **hair bun on top of head**; **gov shield-and-star pin on lab coat chest** |
| 夜貓 | male | **closed sleepy eyes (happy arcs, no pupils)**, small relaxed smile, cheek blush | cream coffee mug: indigo band near bottom, curved brown handle, steam curls, dark coffee visible at rim | **two indigo "Z" letters floating above head (upper-left)** — part of the character, not decoration |
| 佛系 | female, long hair | **closed serene eyes (soft happy curves with tiny pupil dots)**, gentle small smile, cheek blush | small white pill bottle at waist: green cap, green cross on label | **green three-lobed side ribbons at both sides of head near ears** |
| 金牛 | male | **WINKING**: left eye is a smiling arch, right eye is a dot with highlight; big grin with tooth-line; prominent blush | gold 元寶 (sycee ingot) at waist: trapezoidal with oval indentation on top, small darker gold accents, tiny sparkle | most expressive face; cheeky/mischievous |

### Scene templates — idol post (5 cards)

Each card = character SVG + scene layer. `{PROP}` = the character's canonical
prop from the table above (drawn as part of the SVG already).

1. **Hook:** character centered in a full-cast hero pose, {ACCENT} radial-gradient halo behind, large empty top and bottom bands for headline text overlay.
2. **這就是你:** character offset to one side of a scene background (see per-idol scenarios below), other side left empty for text.
3. **你該在意的:** character on left, three flat-icon tiles floating on right ({ICON1/2/3}), space beside icons for a bulleted list.
4. **命運醫院:** character next to a stylized pillbox fortune-wheel with tiny hospital-building icons around its rim, wheel with {ACCENT} glow, bottom band empty for text.
5. **CTA:** character in a waving/pointing pose toward viewer, subtle tap/arrow motif near hand, large empty bottom area for the button and link.

Backgrounds are gradients + a few soft flat shapes (moon, shelves, sunset, etc.). All plain SVG — no AI needed for these unless a card benefits from a photographic/painterly feel.

### Scene templates — comparison post (4 cards)

Two character SVGs, one per side. Duotone background split (A_ACCENT | B_ACCENT).

1. **Hook:** split composition — A on left in A_ACCENT half, B on right in B_ACCENT half, facing each other with playful rivalry stance, clean vertical divider, empty top for headline.
2. **兩種人生:** two stacked half-panels — top: A in A_scenario; bottom: B in B_scenario. Clear visual contrast, empty side strip for labels.
3. **硬指標對比:** both characters as small avatars at top corners, wide clean center area for a 3-row comparison table, A_ACCENT vs B_ACCENT column tint.
4. **CTA:** both characters side-by-side pointing outward at viewer, "which are you?" energy, neutral background, large empty bottom for button.

### Scene templates — grid post

Reuse the already-composed character SVGs. Grid layouts (3+3+1, 24hr timeline strip, 2×2 scatter, collage) are all pure SVG/Canva composition — zero new AI generation from week 4 onward.

---

## Per-idol content (scenario + card-3 icons + copy overlays)

### 夜貓藥師 (violet)
- **Card2 scenario:** dim hospital pharmacy counter at night, single desk-lamp glow, dark window with a moon, faint zzz around head
- **Card3 icons:** a coin · rotating-shift arrows · a moon-with-slash ("no night")
- **Copy:** 1) 夜貓藥師 ·「你，也是夜貓藥師嗎？」 2) 大夜輪到天亮，咖啡當水喝 · 別人放假你補班 3) 該看：夜班津貼 / 能否包大夜 / 有無「無大夜」 4) 你的命運醫院是哪間？50+ 家抽一間 5) 30 秒測出你的命運醫院 → 連結在留言

### 學霸藥師 (indigo)
- **Card2 scenario:** chibi in a bright well-equipped medical-center pharmacy, many shelves, moving fast with a slight frazzle, clipboard in hand
- **Card3 icons:** a PGY/certificate ribbon · a ladder (進階) · a book+microscope (研究)
- **Copy:** 1) 學霸藥師 ·「你，是學霸藥師嗎？」 2) 醫學中心衝一波，資源光環拉滿 · 但節奏快到飛起 3) 該看：PGY 訓練 / 專科藥師・進階制度 / 教學研究資源 4) 你的命運醫院是哪間醫學中心？ 5) 30 秒測測看 → 連結在留言

### 教魂藥師 (amber)
- **Card2 scenario:** chibi at a small whiteboard explaining to two tiny student silhouettes, warm mentor energy
- **Card3 icons:** graduation cap (帶教) · calendar with a check (公假) · airplane (研討/外派)
- **Copy:** 1) 教魂藥師 ·「你，是教魂藥師嗎？」 2) 帶學生比自己上班還累 · 但看他們成長就充電 3) 該看：教學醫院資源 / 帶教制度與時數 / 進修・研討公假公費 4) 你的命運醫院是哪間教學醫院？ 5) 30 秒測測看 → 連結在留言

### 北漂藥師 (blue)
- **Card2 scenario:** chibi arriving at a new city with a rolling suitcase, tall unfamiliar buildings + a small train behind, hopeful newcomer look
- **Card3 icons:** a bed/dorm building · a coin ("補助") · a location pin (機能)
- **Copy:** 1) 北漂藥師 ·「你，是北漂藥師嗎？」 2) 為工作離鄉背井 · 一卡皮箱闖天涯 3) 該看：有無提供宿舍/租屋補助 / 宿舍離醫院多近多少錢 / 生活機能 4) 哪間醫院有你落腳的宿舍？ 5) 30 秒測測看 → 連結在留言

### 鐵腕藥師 (red)
- **Card2 scenario:** chibi standing firm and proud in front of a government building / official crest, holding the red seal, solid stable vibe
- **Card3 icons:** a shield (保障) · a stacking-years chart (年資) · a clock (工時)
- **Copy:** 1) 鐵腕藥師 ·「你，是鐵腕藥師嗎？」 2) 追求穩定鐵飯碗 · 公職保障足、年資完整 3) 該看：公立/私立差別 / 年資與退休制度 / 輪班與工時保障 4) 你的命運醫院是哪間公立醫院？ 5) 30 秒測測看 → 連結在留言

### 佛系藥師 (emerald)
- **Card2 scenario:** chibi leaving work on time at sunset, relaxed stroll, calm closed-eye smile, soft green ambience
- **Card3 icons:** a clock at 5:00 (準時) · a moon-with-slash (無大夜) · a simple checkmark (工作單純)
- **Copy:** 1) 佛系藥師 ·「你，是佛系藥師嗎？」 2) 準時下班就是勝利 · 錢夠用、心不累 3) 該看：免/少輪班 / 有無「無大夜」 / 工作單純穩定 4) 哪間醫院最適合佛系的你？ 5) 30 秒測測看 → 連結在留言

### 金牛藥師 (gold)
- **Card2 scenario:** chibi with sparkly eyes holding the gold ingot, floating coins and a rising salary chart, prosperous cheerful vibe
- **Card3 icons:** a "100萬" money bag · a signing-bonus tag (簽約金) · stacked coins (津貼疊加)
- **Copy:** 1) 金牛藥師 ·「你，是金牛藥師嗎？」 2) 年薪百萬是信仰 · 簽約金、夜班費一分不放過 3) 該看：薪資等級與年薪 / 簽約金・留任獎金 / 各項津貼疊加 4) 哪間醫院能餵飽金牛的你？ 5) 30 秒測測看 → 連結在留言

---

## Per-comparison content

One full example drafted below to lock the template; the remaining 9 stubbed
with the tension line and are meant to be filled in ~1 week before their post
date, so real salary/hours numbers can be sanity-checked against the quiz
app's own data.

### Wk 1 · 夜貓 vs 佛系 (violet × emerald) ★★★  — DRAFTED

- **Tension:** 爆肝 vs 準時下班 — the classic pharmacist tradeoff.
- **Card 3 硬指標** (fill final numbers from app data before posting):
  | | 夜貓藥師 | 佛系藥師 |
  |---|---|---|
  | 月薪帶 | ~65–80k（含夜班費） | ~55–65k（純本薪） |
  | 大夜頻率 | 8–10 班/月 | 0 |
  | 週六補班 | 常有 | 少或無 |
- **Copy:**
  1) 夜貓 vs 佛系 ·「你，更想成為誰？」
  2) 夜貓：凌晨 3 點還在調藥，帳戶滿滿 · 佛系：5 點準時下班，帳戶普通
  3) 硬指標對比：月薪 / 大夜頻率 / 週六補班
  4) 30 秒測出你其實是哪一種 → 連結在留言

### Wk 2 · 金牛 vs 鐵腕 (gold × red) ★★★  — TODO
- **Tension:** 私立高薪 vs 公職穩定

### Wk 3 · 學霸 vs 鐵腕 (indigo × red) ★★★  — TODO
- **Tension:** 醫學中心衝一波 vs 公職鐵飯碗

### Wk 4 · 佛系 vs 金牛 (emerald × gold) ★★★  — TODO
- **Tension:** 錢 vs 命 — the money-vs-life question

### Wk 5 Mon · 教魂 vs 學霸 (amber × indigo) ★★  — TODO
- **Tension:** 教書 vs 做研究 — two different flavors of "教學醫院"

### Wk 5 Wed · 學霸 vs 佛系 (indigo × emerald) ★★★  — TODO
- **Tension:** 拼上去 vs 躺得住

### Wk 6 Mon · 金牛 vs 北漂 (gold × blue) ★★★  — TODO
- **Tension:** 為錢離鄉 — 回本嗎？

### Wk 6 Wed · 北漂 vs 鐵腕 (blue × red) ★★  — TODO
- **Tension:** 離家闖 vs 在地公職

### Wk 7 Mon · 夜貓 vs 金牛 (violet × gold) ★★★  — TODO
- **Tension:** 用命換錢，值不值

### Wk 7 Wed · 佛系 vs 鐵腕 (emerald × red) ★★  — TODO
- **Tension:** 兩種「穩定」的差別 — 私立佛系 vs 公職鐵腕

---

## Per-grid content

Reuses existing idol hero art. One full example drafted, three stubbed.

### Grid 1 · Wk 4 Fri ·「全員集合 — 你是幾號?」— DRAFTED

- **Concept:** classic 7-idol grid. All 7 hero images arranged 3+3+1 (or 4+3),
  each with a numbered badge (1–7) in their accent color halo. Series wordmark
  top, headline center, CTA bottom.
- **Layout:** single 1080×1350 image (no carousel), or optional 2-card
  (grid → CTA close-up) if engagement data suggests carousels convert better.
- **Copy:**
  - Headline: 「你，是幾號藥師？」
  - Sub: 「留言你的號碼，我猜下一位。」
  - CTA: 「30 秒測驗 → 連結在留言」
- **Why now:** mid-series recap for new followers; sparks numbered replies
  (low-friction engagement Threads' algorithm rewards).

### Grid 2 · Wk 5 Fri ·「7 種藥師的一天」— TODO
- **Concept:** horizontal 24-hour timeline strip, one row per idol, with 2–3
  emoji-style event markers per row (夜貓: 22:00 上班 · 03:00 咖啡 · 08:00 下班;
  佛系: 08:30 打卡 · 17:00 準時走 · 20:00 追劇, etc.)
- **Why:** different format from Grid 1 (rows not grid); shows lived difference
  between personas at a glance.

### Grid 3 · Wk 6 Fri ·「薪水 × 生活 座標圖」— TODO  ← sleeper bet
- **Concept:** scatter or 2×2 with 薪水 (low → high) on X and 生活品質 (low → high)
  on Y. Place all 7 idols as small avatars. Rough placement (to defend before posting):
  金牛 top-right (high $, decent life), 佛系 mid-Y right (mid $, great life),
  夜貓 top-Y-low-X (high $, low life), 鐵腕 mid center (stable both), 學霸 upper mid
  (high $, tight life), 教魂 mid-mid (rewarding but tiring), 北漂 lower-left initially.
- **Why:** naturally sparks "I'm here, where are you?" comments; historically
  over-performs on career-adjacent Threads content because it's screenshot-shareable.

### Grid 4 · Wk 7 Fri ·「系列總結 · 幫朋友點名」— TODO
- **Concept:** finale — collage of best hooks from the series + CTA to tag a
  friend「我覺得你是___」. High viral coefficient (tag mechanics).
- **Why:** series capstone; converts remaining lurkers and seeds the loop
  (best-performing posts can re-run after a break).

---

## Production workflow

1. **Build a card-scene renderer** (one-time setup) — a React/satori component
   that takes `{character: ArchetypeComponent, scene: SceneComponent, accent:
   string, dimensions: 1080×1350}` and renders a composed SVG → PNG. Character
   layer uses the actual archetype SVG at large scale; scene layer is background
   gradient + a few shape elements per template above.
2. **Per idol post:** author 5 SceneComponents (Hook, 這就是你, 你該在意的,
   命運醫院, CTA). Reuse the character SVG from `src/components/archetypes/`.
   Export 5 PNGs from the renderer.
3. **Per comparison post:** author 4 SceneComponents that take TWO characters.
   Export 4 PNGs.
4. **Per grid post:** author a single SceneComponent that arranges all 7
   character SVGs in the grid concept for that week. Export 1 PNG (or 2 if
   using the grid + CTA carousel variant).
5. **Copy overlay in Canva/Figma** (1080×1350 template): bold sans Traditional
   Chinese, accent-themed (duotone for comparisons), plus brand mark + swipe
   hint + counter. Do NOT put copy in the renderer — Chinese text layout is
   easier to iterate on in Canva.
6. Export final PNGs → post as Threads carousel (or single-image for some grids).

Reuse: SceneComponents from card 4 (命運醫院) and card 5 (CTA) are largely
character-agnostic — build them once, parametrize by character + accent, reuse
across all 7 idol posts.

## Distribution & tracking

- **Link:** put `https://pharm-fortune.vercel.app/?ref=threads` in the **first
  comment** (Threads throttles in-body links). The `?ref=threads` overrides the
  build default but is the same value — belt-and-suspenders for attribution.
- **Attribution:** every resulting lead arrives tagged `連結來源: threads` in the
  email (Gmail + drug@), so Threads leads are distinguishable from `official`
  (pharmfate) leads in the shared inbox.
- **Cadence:** 3 posts/week M/W/F, 7-week run, 21 posts total. See the
  schedule table. Best performers can re-run after a break.

## Open questions / later

- **Phase 2 video** = motion-graphics of the SVG cards (character SVG + scene
  layer both already vector) → natural transition to Lottie or Rive if warranted.
  Never AI img2vid.
- **A/B test idol card 4** (命運醫院) — is the tease card doing work, or is a
  4-card idol post cleaner? Watch swipe-through rates on weeks 1–2.
- **A/B hook copy per idol** — draft 2–3 hook variants per idol, rotate; watch
  which persona converts best (via `threads` tag volume).
- **Grid format performance** — Grid 3 (薪水×生活 scatter) is the sleeper bet;
  use its performance to decide the mix if the series re-runs.
- **Optional: per-post `?ref=`** (e.g. `threads-yemao`, `threads-grid3`) for
  per-post attribution. Worth it once volume is meaningful.
- **FJUH signoff on the practitioner-voiced framing** — leads land in the shared
  drug@ inbox tagged `threads`; worth pre-empting the "why is this in our inbox"
  conversation before series takes off, especially if the 金牛 post performs.
