# Post 01 · 夜貓藥師 (Week 1 Mon, 2026-07-27)

5-card idol deep-dive. Character = the **real** `NightOwlPharmacist` SVG (zero
drift), scenes + Traditional-Chinese copy composed in SVG.

## Files

- `card-1..5.svg` — source, 1080×1350. Text is inside `<g id="text-overlay">`;
  delete that group to hand clean art to Canva/Figma.
- `card-1..5.png` — rendered at **2×** (2160×2700), ready to post to Threads.
- `index.html` — open in a browser to preview all 5 and re-download PNGs at
  1× or 2×.

## Card arc (copy from threads-promo-idol-cards.md)

1. Hook — 「你，也是夜貓藥師嗎？」
2. 這就是你 — 大夜輪到天亮，咖啡當水喝 · 別人放假，你在補班
3. 你該在意的 — 夜班津貼 / 能否包大夜 / 有無「無大夜」
4. 命運醫院 — 你的命運醫院是哪間？50+ 家抽一間
5. CTA — 30 秒測出你的命運醫院 · 🔗 連結在留言區

Link for the first comment: `https://pharm-fortune.vercel.app/?ref=threads`

## Regenerate

```sh
node promotion/build-cards.mjs          # writes the 5 SVGs + index.html
# then rasterize (headless Chrome/Edge), e.g.:
#   chrome --headless --force-device-scale-factor=2 --window-size=1080,1350 \
#     --default-background-color=00000000 --screenshot=card-1.png file:///…/card-1.svg
```

Edit copy/scenes in [../build-cards.mjs](../build-cards.mjs) (the `yemaoCard*`
functions). The character registry there is reused for every future post.
