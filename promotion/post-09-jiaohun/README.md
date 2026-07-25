# Post 09 · 教魂藥師 (Week 3 Sun, 2026-08-16)

5-card idol deep-dive. Character = the **real** `TeachingSoulPharmacist` SVG
(long hair, open enthusiastic smile, holding a whiteboard marker — ears drawn
behind the head). Warm-orange theme. Scene signature: a **classroom whiteboard**
with a lesson written up (mirrors 夜貓's night window, 學霸's dispensary, 北漂's
dusk skyline, etc.).

Note: post 09 was the 教魂 **idol** after the Tue/Thu/Sun re-cadence + comparison
rebalance moved it up from post 10, so all 7 idols are introduced by post 09.

## Files

- `card-1..5.svg` — source, 1080×1350. Text is inside `<g id="text-overlay">`.
- `card-1..5.png` — rendered at **2×** (2160×2700), ready to post.
- `index.html` — preview all 5 + re-download PNGs at 1×/2×.

## Card arc (copy from threads-captions.md)

1. Hook — 「你，也是教魂藥師嗎？」
2. 這就是你 — 帶學生比自己上班還累 · 但看他們成長就充電 · ⋯這是你的日常嗎？
3. 你該在意的 — 教學醫院資源 / 帶教制度與時數 / 進修・研討公假公費
4. 命運醫院 — 你的命運醫院是哪間教學醫院？50+ 家抽一間
5. CTA — 30 秒測出你的命運醫院 · 🔗 連結在留言區

Link for the first comment: `https://pharm-fortune.vercel.app/?ref=threads`

## Notes

- Icons added for this post: `iconChalkboard` (教學醫院資源), `iconMentor`
  (帶教制度與時數 — a taller teacher + a shorter student), `iconCert`
  (進修・研討公假公費 — a certificate with a ribbon seal).
- Card 3 factor labels are long → font 34 (same as 學霸), so 「進修・研討公假公費」
  stays inside the tile.
- The `teachingScene` draws a whiteboard with an Rx lesson + a pill glyph; the
  corner icon is `iconMentor`.
- Two-colour contract: `accentColor` #ea580c (orange neckerchief/halo),
  `secondaryColor` #2563eb (blue whiteboard marker) — faithful to the app icon.

## Regenerate

`node promotion/build-cards.mjs` writes all posts, then rasterize with headless
Chrome/Edge (see [../post-01-yemao/README.md](../post-01-yemao/README.md)). The
`THEMES.jiaohun` palette + the `JIAOHUN` character constant drive colour and art.
