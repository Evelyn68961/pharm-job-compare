# Post 08 · 北漂藥師 (Week 3 Thu, 2026-08-13)

5-card idol deep-dive. Character = the **real** `BeipiaoPharmacist` SVG (open
smile, no glasses, suitcase — ears drawn behind the head). Blue theme. Scene
signature: a **dusk city skyline** with lit windows + a train (relocated to the
big city).

## Files

- `card-1..5.svg` — source, 1080×1350. Text is inside `<g id="text-overlay">`.
- `card-1..5.png` — rendered at **2×** (2160×2700), ready to post.
- `index.html` — preview all 5 + re-download PNGs at 1×/2×.

## Card arc (copy from threads-captions.md)

1. Hook — 「你，也是北漂藥師嗎？」
2. 這就是你 — 為工作離鄉背井 · 一卡皮箱闖天涯 · ⋯這是你的日常嗎？
3. 你該在意的 — 宿舍/租屋補助 / 宿舍距離與費用 / 生活機能
4. 命運醫院 — 哪間醫院有你落腳的宿舍？50+ 家抽一間
5. CTA — 30 秒測出你的命運醫院 · 🔗 連結在留言區

Link for the first comment: `https://pharm-fortune.vercel.app/?ref=threads`

## Notes

- Icons added for this post: `iconHouse` (宿舍), `iconPin` (距離), `iconStore`
  (生活機能), `iconTrain` (scene corner, matches 北漂's train badge).
- **Factor wording:** the SERIES factor was 「宿舍離醫院多近、多少錢」 (11 chars —
  too long for a tile). Shortened to **「宿舍距離與費用」** to fit and match the
  series' punchy factor style. Change this in the `SERIES` entry if a different
  wording is wanted.
- The `cityscape` scene draws 8 dusk buildings with lit windows + a moon.

## Regenerate

`node promotion/build-cards.mjs` writes all posts, then rasterize with headless
Chrome/Edge (see [../post-01-yemao/README.md](../post-01-yemao/README.md)). The
`THEMES.beipiao` palette + the `BEIPIAO` character constant drive colour and art.
