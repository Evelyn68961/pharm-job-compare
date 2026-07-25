# Post 02 · 佛系藥師 (Week 1 Thu, 2026-07-30)

5-card idol deep-dive. Character = the **real** `ZenPharmacist` SVG (long hair,
green side ribbons, pill bottle — zero drift). Emerald theme. Same scene
structure as post 01, different mood: a **sunset-corridor** recognition beat
with a 5:00 wall clock.

## Files

- `card-1..5.svg` — source, 1080×1350. Text is inside `<g id="text-overlay">`.
- `card-1..5.png` — rendered at **2×** (2160×2700), ready to post.
- `index.html` — preview all 5 + re-download PNGs at 1×/2×.

## Card arc (copy from threads-promo-idol-cards.md)

1. Hook — 「你，也是佛系藥師嗎？」
2. 這就是你 — 準時下班就是勝利 · 錢夠用、心不累 · ⋯多久沒這樣準時走了？
3. 你該在意的 — 免/少輪班 / 有無「無大夜」 / 工作單純穩定
4. 命運醫院 — 哪間醫院最適合佛系的你？50+ 家抽一間
5. CTA — 30 秒測出你的命運醫院 · 🔗 連結在留言區

Link for the first comment: `https://pharm-fortune.vercel.app/?ref=threads`

## Notes

- Card 2's sub-copy is a recognition question (「⋯多久沒這樣準時走了？」) — the
  pattern from post 01, carried through the series.
- The **per-idol scene signature**: same corridor/panel structure, remoodled per
  idol (佛系 = sunset corridor + 5:00 clock; 金牛 = rising bar chart at gold-hour;
  學霸 = daylight medical-center with tall shelves). Add each as a scene fn in
  [../build-cards.mjs](../build-cards.mjs).

## Regenerate

`node promotion/build-cards.mjs` writes **both** posts, then rasterize with
headless Chrome/Edge (see [../post-01-yemao/README.md](../post-01-yemao/README.md)).
The `THEMES` map + per-idol `character` constants in build-cards.mjs drive colour
and art; 夜貓 and 佛系 share every furniture/wheel/icon helper.
