# Post 07 · 學霸藥師 (Week 3 Mon, 2026-08-10)

5-card idol deep-dive. Character = the **real** `AcademicAcePharmacist` SVG
(glasses, focused brows, clipboard — ears drawn behind the head). Deep-teal
theme. Scene signature: a **bright medical-center dispensary** with tall
shelving 資源拉滿 (mirrors 夜貓's night window, 佛系's sunset corridor, etc.).

## Files

- `card-1..5.svg` — source, 1080×1350. Text is inside `<g id="text-overlay">`.
- `card-1..5.png` — rendered at **2×** (2160×2700), ready to post.
- `index.html` — preview all 5 + re-download PNGs at 1×/2×.

## Card arc (copy from threads-captions.md)

1. Hook — 「你，也是學霸藥師嗎？」
2. 這就是你 — 醫學中心衝一波，資源光環拉滿 · 但節奏快到飛起 · ⋯這畫面是不是很熟悉？
3. 你該在意的 — PGY 訓練 / 專科藥師・進階制度 / 教學研究資源
4. 命運醫院 — 你的命運醫院是哪間醫學中心？50+ 家抽一間
5. CTA — 30 秒測出你的命運醫院 · 🔗 連結在留言區

Link for the first comment: `https://pharm-fortune.vercel.app/?ref=threads`

## Notes

- Icons added for this post: `iconGradCap` (mortarboard = PGY/訓練),
  `iconSteps` (ascending staircase = 進階制度), `iconBook` (open book = 教學研究).
- The `pharmacyShelves` scene draws 3 bays × 3 shelves of colored med boxes.
- Card 3 factor labels are long → font 38, label at x=686 (same as 金牛/鐵腕).

## Regenerate

`node promotion/build-cards.mjs` writes all posts, then rasterize with headless
Chrome/Edge (see [../post-01-yemao/README.md](../post-01-yemao/README.md)). The
`THEMES.ace` palette + the `ACE` character constant drive colour and art.
