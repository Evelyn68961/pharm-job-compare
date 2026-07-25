# Idol card art — why the AI prompts drifted, and the on-model fix

Companion to [threads-promo-idol-cards.md](threads-promo-idol-cards.md). The image
prompt kit in that doc produced characters that **don't look like our icons**.
This explains why, and gives the corrected workflow + a rewritten style anchor.

## Why the prompts drift (three causes)

1. **Raster AI can't reproduce flat vector.** Our idols are literal SVG paths
   ([app/components/spin/icons/archetypes/](../app/components/spin/icons/archetypes/)):
   hard edges, flat fills, **zero shading**, no gradient on the character (the
   halo is a separate layer). Midjourney / img2img always add soft lighting,
   gradients and painterly outlines — a glossy sticker render that reads as
   "generic AI chibi," never our crisp geometric mascot. No prompt fixes this.

2. **The old STYLE ANCHOR described a different character than ours:**

   | Old prompt said | Our icons actually are |
   |---|---|
   | "2-heads-tall, big head / small body" | ~3 heads tall; the coat is a small trapezoid (`y 55–98`) |
   | "simple dot eyes" | per-archetype **arcs** (夜貓 sleepy downturned curves, etc.), not dots |
   | "minimal flat shading… high detail" | **zero** shading; "high detail" pushes MJ the wrong way |
   | *(silent on hair)* | each archetype has a **specific dark hair shape** (`#2E2A24`) + skin `#F8D2AC` |
   | *(implied glasses on all)* | **only 學霸** wears glasses |
   | "neckerchief" | a **diamond chest-pin** (`M50 55 L44 67 L50 73 L56 67 Z`), accent-coloured |

3. **The `--cref` reference and the style text fought each other.** A paragraph
   of generic-chibi description pulls generation *away* from the character
   reference → a blend of neither.

## The fix: don't AI-generate the characters at all

We already have the exact art as code. Render it, don't redraw it.

> **Export tool:** `npm run dev` → open **`/preview/idol-export`**
> ([app/preview/idol-export/page.tsx](../app/preview/idol-export/page.tsx)).
> It renders the real SVG components and rasterises them client-side:
> - **PNG (transparent)** at 1024²/2048²/4096², halo on/off — for compositing
>   onto AI-generated scenes.
> - **SVG (transparent)** — vector, best for Canva/Figma.
> - **4:5 card (1080×1350)** — character on the app pastel gradient, generous
>   bottom space for the text overlay (matches this series' card spec).
>
> Per-card colour pickers let you retint to any hospital's real Notion
> 識別色 / 輔助色. Output is pixel-for-pixel on-model, zero drift, free.

**Recommended card workflow (matches the doc's stated intent — "prompt drives
the scene, reference locks the character," just composited instead of one-shot):**

1. Export the real character as a transparent PNG/SVG from `/preview/idol-export`.
2. Use AI for the **background / scene / props only** (night pharmacy counter,
   rolling suitcase, fortune-wheel) — **never the character**.
3. Composite the real character on top in Canva/Figma; add the Chinese text.

For grid posts (week 4+) this is already zero-new-generation — reuse the exports.

## If you must AI-generate a character (poses the SVG can't do)

Our icons are bust/upper-body only. For a full-body wave etc., either draw a new
SVG variant, or accept "in the spirit of" and use the rewritten anchor below.
It will still never be exact — prefer compositing the real art whenever possible.

### Rewritten STYLE ANCHOR (on-model)

```
Flat vector mascot illustration, hard clean outlines, SOLID FLAT FILLS, NO
shading, NO gradients, NO gloss — sticker-flat. Chibi pharmacist, ~3 heads tall,
large round head on a small white lab-coat trapezoid body. Peachy skin (#F8D2AC),
dark hair (#2E2A24) in a simple shape, a small diamond chest-pin at the collar in
the character's accent colour. Eyes are simple curved arcs (not dots). Background:
soft pastel gradient (amber-cream #fffbeb -> rose #fff1f2 -> mint #ecfdf5) with a
few faint pill-capsule shapes. Centered, generous empty space for text overlay.
NO text, no letters. 4:5 vertical. --ar 4:5
```

Avoid: `photorealistic, 3D, soft shading, gradient shading, glossy, rim light,
painterly, high detail, dot eyes, glasses (unless 學霸), text, watermark, extra
characters, busy background`

### Per-archetype specifics (only 學霸 has glasses)

| Idol | Accent | Prop (secondary-tinted) | Distinctive |
|---|---|---|---|
| 學霸藥師 | `#6366f1` | clipboard | **round glasses** |
| 教魂藥師 | `#f59e0b` | whiteboard marker | mentor smile |
| 北漂藥師 | `#3b82f6` | rolling suitcase | hopeful |
| 鐵腕藥師 | `#ef4444` | red seal (印章) | firm/proud |
| 夜貓藥師 | `#8b5cf6` | coffee mug + floating z's | sleepy half-closed eyes |
| 佛系藥師 | `#10b981` | pill bottle | calm closed-eye smile |
| 金牛藥師 | `#ca8a04` | gold ingot (元寶) | sparkly eyes |

Colours and full anatomy: [hospital-icons-guide.md](../hospital-icons-guide.md).
Badge emblems (graduation cap / open book / train / shield+star / crescent+star /
lotus / ancient coin) are a separate overlay — the promo character art uses the
`ArchetypeAvatar` look (character + halo, **no badge**).
