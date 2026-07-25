# Post 05 · 鐵腕藥師 (Week 2 Wed, 2026-08-05)

5-card idol deep-dive. Character = the **real** `IronArmPharmacist` SVG (female,
pulled-back bun, official seal 印章, 政府 shield-star pin — ears drawn behind the
head). Red theme. Scene signature: a **classical columned public institution**
(pediment + columns + steps) = the 鐵飯碗 / 公職穩定 beat.

## Files

- `card-1..5.svg` — source, 1080×1350. Text is inside `<g id="text-overlay">`.
- `card-1..5.png` — rendered at **2×** (2160×2700), ready to post.
- `index.html` — preview all 5 + re-download PNGs at 1×/2×.

## Card arc (copy from threads-captions.md)

1. Hook — 「你，也是鐵腕藥師嗎？」
2. 這就是你 — 追求穩定鐵飯碗 · 公職保障足、年資完整 · ⋯這是你要的安穩嗎？
3. 你該在意的 — 公立/私立差別 / 年資與退休制度 / 輪班與工時保障
4. 命運醫院 — 你的命運醫院是哪間公立醫院？50+ 家抽一間
5. CTA — 30 秒測出你的命運醫院 · 🔗 連結在留言區

Link for the first comment: `https://pharm-fortune.vercel.app/?ref=threads`

## Notes

- Icons added for this post: `iconBuilding` (columned institution = 公立/私立),
  `iconShield` (shield + star = 保障/退休, mirrors 鐵腕's badge), `iconClock`
  (plain wall clock = 工時). Plus a `starPts` helper and the `govtBuilding` scene.
- Card 3 factor labels are long → font 38, label at x=686 (same as 金牛).
- Card 4's fate headline is 14 chars → font 48.

## Regenerate

`node promotion/build-cards.mjs` writes all posts, then rasterize with headless
Chrome/Edge (see [../post-01-yemao/README.md](../post-01-yemao/README.md)). The
`THEMES.iron` palette + the `IRONARM` character constant drive colour and art.
