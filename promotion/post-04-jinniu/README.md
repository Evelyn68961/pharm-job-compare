# Post 04 · 金牛藥師 (Week 2 Tue, 2026-08-04)

5-card idol deep-dive. Character = the **real** `JinniuPharmacist` SVG (winking
grin, gold 元寶/ingot — zero drift). Gold theme. Scene signature: a **golden-hour
rising bar chart** (salary climbing) with a trend arrow, mirroring 夜貓's night
window and 佛系's sunset corridor.

## Files

- `card-1..5.svg` — source, 1080×1350. Text is inside `<g id="text-overlay">`.
- `card-1..5.png` — rendered at **2×** (2160×2700), ready to post.
- `index.html` — preview all 5 + re-download PNGs at 1×/2×.

## Card arc (copy from threads-captions.md)

1. Hook — 「你，也是金牛藥師嗎？」
2. 這就是你 — 年薪百萬是信仰 · 簽約金、夜班費一分不放過 · ⋯這畫面，是不是很有共鳴？
3. 你該在意的 — 薪資等級與年薪 / 簽約金・留任獎金 / 各項津貼疊加
4. 命運醫院 — 哪間醫院能餵飽金牛的你？50+ 家抽一間
5. CTA — 30 秒測出你的命運醫院 · 🔗 連結在留言區

Link for the first comment: `https://pharm-fortune.vercel.app/?ref=threads`

## Notes

- Card 3's factor labels are longer than 夜貓/佛系's, so its tiles use font 38
  (vs 46) and push the label to x=686 — see `jinniuCard3` in
  [../build-cards.mjs](../build-cards.mjs).
- Money icons added for this post: `iconChart` (rising bars = salary tier),
  `iconCoin` (簽約金/獎金), `iconCoinStack` (疊加津貼).

## Regenerate

`node promotion/build-cards.mjs` writes all posts, then rasterize with headless
Chrome/Edge (see [../post-01-yemao/README.md](../post-01-yemao/README.md)). The
`THEMES.jinniu` palette + the `JINNIU` character constant in build-cards.mjs drive
colour and art.
