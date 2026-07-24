# Threads 推廣計畫 — 藥師人格圖鑑（idol 卡片輪播）

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
- **Generate card art via image prompts** (this doc), but for on-model fidelity
  feed the **real rendered idol** as a character/style reference (Midjourney
  `--cref` / img2img) so the prompt drives the *scene* and the reference locks
  the *character*. Text is overlaid separately (image models can't do Chinese).
- **One idol per post.** Each carousel is a 4–5 card deep-dive on ONE persona.
  7 idols → a 7-post 「藥師人格圖鑑」 series. Each post is themed in that idol's
  accent color for cohesion.

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
- **Accent:** the whole post themed in that idol's accent color.
- **Text overlay** (added in Canva/Figma, NOT in the AI image): bold sans,
  Traditional Chinese, practitioner voice. Never "student project / 學生作品".
- **Furniture:** small `藥師命運轉盤` brand mark, position counter (2/5), swipe
  hint (→) on all but the last card.

## The 5-card arc (every post)

| Card | Role | Purpose |
|---|---|---|
| 1 Hook | big idol + name + 「你，也是___藥師嗎？」 | stop the scroll |
| 2 這就是你 | relatable "this is your life" scenario | recognition |
| 3 你該在意的 | 2–3 job factors this type should check | practitioner value |
| 4 命運醫院 | tease the quiz payoff (50+ 醫院抽一間) | curiosity |
| 5 CTA | 30 秒測驗 + `?ref=threads` link | the click |

---

## Image prompt kit

### A. STYLE ANCHOR — paste into every prompt (keeps all cards consistent)

```
Kawaii chibi mascot illustration, flat vector style, clean thick outlines,
big head / small body (2-heads-tall), wearing a white pharmacist lab coat
with a small diamond neckerchief, simple dot eyes, soft blush cheeks,
sticker-like, minimal flat shading. Background: soft pastel gradient
(warm amber-cream -> rose -> mint) with a few faint pill-capsule shapes as
texture. Centered, generous empty space for text overlay. NO text, no
letters, no words in the image. 4:5 vertical, high detail. --ar 4:5
```
Avoid: `photorealistic, 3D, text, watermark, busy background, extra characters, cluttered`

### B. CHARACTER BLOCKS — pick one per post

- **夜貓藥師:** `sleepy-but-determined chibi pharmacist, violet #8b5cf6 neckerchief, holding a cream coffee mug with a violet band and rising steam, tiny floating "zzz" marks, faint crescent-moon-and-star motif`
- **學霸藥師:** `sharp confident chibi pharmacist with round glasses, indigo #6366f1 neckerchief, holding a clipboard checklist, small graduation-cap motif`
- **教魂藥師:** `enthusiastic mentor chibi pharmacist, amber #f59e0b neckerchief, holding a whiteboard marker mid-explaining, small open-book motif`
- **北漂藥師:** `hopeful young chibi pharmacist, blue #3b82f6 neckerchief, pulling a small rolling suitcase, tiny train motif`
- **鐵腕藥師:** `steady dependable chibi civil-servant pharmacist, red #ef4444 neckerchief, holding a red official seal stamp, small shield-and-star gov motif`
- **佛系藥師:** `serene relaxed chibi pharmacist, emerald #10b981 neckerchief, holding a pill bottle, calm closed-eye smile, soft green side ribbons, small lotus motif`
- **金牛藥師:** `cheerful money-savvy chibi pharmacist, gold #ca8a04 neckerchief, holding a shiny gold ingot (元寶), sparkly eyes, small ancient-coin motif`

### C. SCENE TEMPLATE — 5 cards (append after style + character block)

`{PROP}` = that idol's prop; `{ICON1/2/3}` = the card-3 job-factor icons.

1. **Hook:** `full-body hero pose holding {PROP}, friendly look at viewer, {ACCENT} glow halo behind, large empty top+bottom for a headline`
2. **這就是你:** `{idol-specific scenario, see per-idol below}, relatable mood, empty side for text`
3. **你該在意的:** `standing beside three simple floating flat icons — {ICON1}, {ICON2}, {ICON3} — gesturing toward them, clean minimal, space for a list`
4. **命運醫院:** `beside a colorful spinning fortune-wheel pillbox dial ringed with tiny hospital-building icons, hopeful look, wheel glowing, bottom space for text`
5. **CTA:** `waving/pointing toward viewer, inviting "come try" energy, subtle tap/arrow motif, bright cheerful {ACCENT} palette, large clear bottom area for a button`

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

## Production workflow

1. Pick an idol → assemble prompt = **Style anchor + character block + scene line**.
2. Generate 5 images (feed the real idol screenshot as `--cref`/img2img reference
   for on-model consistency).
3. Overlay the Traditional-Chinese copy in Canva/Figma (1080×1350 template);
   theme in the idol's accent; add brand mark + swipe hint + counter.
4. Export 5 PNGs → post as one Threads carousel.

## Distribution & tracking

- **Link:** put `https://pharm-fortune.vercel.app/?ref=threads` in the **first
  comment** (Threads throttles in-body links). The `?ref=threads` overrides the
  build default but is the same value — belt-and-suspenders for attribution.
- **Attribution:** every resulting lead arrives tagged `連結來源: threads` in the
  email (Gmail + drug@), so Threads leads are distinguishable from `official`
  (pharmfate) leads in the shared inbox.
- **Cadence:** one idol per post; 7-post series. Can loop / re-run best performers.

## Open questions / later

- Phase 2 video = motion-graphics of the SVGs (on-model), not AI img2vid.
- A/B the hook copy per idol; watch which persona converts best (via `threads` tag volume).
- Optional: a distinct `?ref=` per post (e.g. `threads-yemao`) for per-post attribution.
