# Hospital icons — system guide

The icon system at [app/components/spin/icons/](app/components/spin/icons/) renders the per-hospital chibi character icon. It's a four-layer SVG composition where the character art and overlays are driven by **two** Notion colours: `job.brandColor` (識別色, the primary) and `job.secondaryColor` (輔助色, the accessory colour — falls back to the primary when blank/invalid).

The icon appears in:
- [ResultDeck](app/components/spin/ResultDeck.tsx) — a 96 px [HospitalIcon](app/components/spin/icons/HospitalIcon.tsx) on each of the 4 result cards (winner + 3 recommendations)
- The landing-page hero cast — `ArchetypeAvatar` (exported from [HospitalIcon.tsx](app/components/spin/icons/HospitalIcon.tsx)): character + halo only, **no badge/sparkle**, since there's no `Job` to resolve, just an archetype + colours
- The dynamic OG image at [app/og/route.tsx](app/og/route.tsx) for shareable previews — note: the OG route **draws its own** glyphs, it does not import these components (Edge runtime)

A separate component, [MazeEmblem.tsx](app/components/spin/MazeEmblem.tsx), sprinkles small per-archetype glyphs into [PillboxMaze](app/components/spin/PillboxMaze.tsx) cells. It echoes the badge emblems visually but is its own copy — the icon system itself stays untouched by the maze.

---

## The 4-layer composition

```
┌──────────────────────────────────┐
│  Layer 1: ArchetypeHalo          │  ← radial brandColor glow (accentColor)
│      ╭─────────────╮             │
│      │  Layer 2:   │             │  ← 1 of 7 archetype SVGs:
│      │  Character  │                  neckerchief tinted by accentColor,
│      │             │                  accessory tinted by secondaryColor
│      ╰─────────────╯             │
│                  ╭───╮           │
│                  │ 🎓│           │  ← Layer 3: HospitalBadge
│                  ╰───╯           │      brandColor circle (78,82 r=16) +
│                                  │      per-archetype white emblem
│   ✨ (if tag 簽約金)             │  ← Layer 4: SalarySparkle (78,18)
└──────────────────────────────────┘
```

Per-hospital variation comes from:
- **Halo** — `accentColor` (= `job.brandColor`) as a radial gradient (low opacity)
- **Character neckerchief / chest pin** — `accentColor` at full opacity
- **Character accessory / prop** — `secondaryColor` tinted at 0.85 / 0.55 opacity
- **Badge background** — `brandColor` (white emblem on top)
- **Badge emblem** — per-archetype (graduation cap, train, open book, crescent+star, water lily, shield+star, ancient coin)
- **Sparkle** — only renders when `job.tags` includes `簽約金` (the signing-bonus tag)

`safeBrandColor(...)` in [styles.ts](app/lib/styles.ts) validates each colour. If `job.brandColor` is missing or invalid, the halo and badge fall back to slate (`#94a3b8`). `secondaryColor` resolves to `safeBrandColor(job.secondaryColor) ?? brandColor`, so a hospital with a blank or `—` 輔助色 renders as an intentional single-colour icon. Each tinted surface in the character SVG additionally falls back to its original hand-picked hex (the `|| '#hex'` pattern), so paths stay visible even if a colour breaks (see "The two-colour contract" below).

---

## The 7 archetypes

The character lineup has **7** entries, all following the `{2-char}藥師` naming convention:

| Archetype | Badge emblem | Character prop | Resolver rule (priority) |
|---|---|---|---|
| **學霸藥師** | graduation cap | clipboard + glasses | 1 — `hospitalTier === '醫學中心'` |
| **教魂藥師** | open book | whiteboard marker | 2 — tags include any teaching tag¹ |
| **北漂藥師** | train (side view) | suitcase | 3 — tags include `提供宿舍` |
| **鐵腕藥師** | shield + star | seal (印章) + 政府 pin | 4 — `publicPrivate === '公立'` |
| **夜貓藥師** | crescent moon + star | coffee mug + floating z's | 5 — tags include `夜班津貼優渥` |
| **佛系藥師** | water lily | pill bottle + green side ribbons | 6 / fallback — tags include any chill tag² |
| **金牛藥師** | ancient coin (古錢) | gold ingot (元寶) | — **not in the resolver** (see below) |

¹ Teaching tags: `專科藥師訓練`, `進階制度`, `全面藥事訓練`, `外派進修機會`.
² Chill tags: `工作單純`, `免/少輪班`, `無大夜`. 佛系 is also the fallback when no rule matches.

### 金牛藥師 is special — it's never auto-resolved from a hospital

[resolveArchetype.ts](app/components/spin/icons/resolveArchetype.ts) has only **6 priority rules** (top-down, first match wins, fallback `佛系藥師`). 金牛 is deliberately **not** one of them — no hospital ever resolves to 金牛 from its data. Instead 金牛 surfaces only where an archetype is supplied explicitly:
- As an **idol** — it's the `QUESTION_IDOL` for the 薪資 quiz question ([quiz.ts](app/lib/quiz.ts)). On the result cards, [HospitalIcon](app/components/spin/icons/HospitalIcon.tsx) is passed a `forced` archetype from the user's idol ranking (`idolRank[i]`), bypassing the resolver.
- In the **landing hero cast** (`HERO_CAST` in [SpinApp.tsx](app/components/spin/SpinApp.tsx)).
- As a random **maze emblem** ([MazeEmblem.tsx](app/components/spin/MazeEmblem.tsx)).

So all 7 archetype SVGs exist and render, but only 6 are reachable by the hospital→archetype resolver.

> **Changing priority is high-impact.** The order is `tier-prestige > teaching > dormitory > public-sector > night-shift > chill`. Because 醫學中心 wins first, those hospitals resolve to 學霸 even when they also carry teaching/dorm tags. Reorder cautiously — it shifts many hospitals' archetypes at once.

---

## The two-colour contract

Each archetype SVG receives `accentColor?` and `secondaryColor?` ([types.ts](app/components/spin/icons/types.ts) — `ArchetypeComponentProps`). [HospitalIcon](app/components/spin/icons/HospitalIcon.tsx) wires them up:

```tsx
// HospitalIcon.tsx
<Character size={...} accentColor={brandColor} secondaryColor={secondaryColor} />
```

- **`accentColor`** (識別色, primary) paints the **neckerchief / chest-pin diamond** at full opacity, and also drives the halo and badge circle (composed by HospitalIcon, not the character).
- **`secondaryColor`** (輔助色, accessory) paints the **held prop/accessory** at two opacities.

The accessory pattern across archetypes:

```tsx
// Neckerchief / chest pin — accentColor, full opacity
<path d="M50 55 L44 67 L50 73 L56 67 Z" fill={accentColor || '#5EC8C2'} />

// Accessory "punch" surface — secondaryColor at 0.85 (saturated)
<rect ... fill={secondaryColor || '#9AA1AB'} fillOpacity="0.85" />

// Accessory "background" surface — secondaryColor at 0.55 (soft wash)
<rect ... fill={secondaryColor || '#F4F1EA'} strokeOpacity="0.55" />
```

Two opacities of the same `secondaryColor` over the white card produce both the muting AND the within-accessory contrast — no colour-mixing helper needed.

**The `|| '#hex'` fallback is critical.** Without it, `fill={undefined}` inherits `fill="none"` from the SVG root and the path renders invisible. The fallback hex is the path's pre-tint colour, so the icon stays viewable even when a colour is missing or empty. (This is belt-and-suspenders: HospitalIcon already substitutes `brandColor` for a blank `secondaryColor`, so a missing colour normally degrades to single-colour, not to the hex fallback.)

### Per-archetype tint targets

The neckerchief (accentColor) is identical across all 7 archetypes — the path `M50 55 L44 67 L50 73 L56 67 Z`. The accessory (secondaryColor) differs:

| Archetype | Accessory punch (0.85) | Accessory background (0.55) | Stays untouched |
|---|---|---|---|
| **學霸** | clipboard clip rect | clipboard outer border (stroke) | paper, paper lines |
| **北漂** | destination tag + body border + divider + handle | suitcase body fill | — |
| **夜貓** | mug band | steam squiggles | cream mug body, dark coffee, indigo z's |
| **教魂** | marker cap band | marker body | slate marker tip, white sleeve |
| **佛系** | bottle cap + green "+" cross + ribbon centres + bow petals + strings | bottle label background | white bottle body |
| **鐵腕** | seal knob | seal stem | red seal base, red ink pad, gold gov shield+star |
| **金牛** | 元寶 body + top knob ellipse | (single-tone ingot — highlight stays gold) | face, collar |

To re-tune: each file in [archetypes/](app/components/spin/icons/archetypes/) has the tint values inline on its `fill`/`stroke` attributes. Search for `Opacity="0.85"` or `Opacity="0.55"` to find the surfaces.

---

## The viewBox contract

All archetype SVGs **must use `viewBox="0 0 100 100"`** so the [HospitalBadge](app/components/spin/icons/HospitalBadge.tsx) and [SalarySparkle](app/components/spin/icons/SalarySparkle.tsx) overlays align correctly. The badge sits at `(78, 82)` r=16, the sparkle at `(78, 18)`.

Within that 100×100 space, the established anatomy is:

| Y range | Element |
|---|---|
| 14–34 | hair / head |
| 33–51 | face (glasses, brows, eyes, cheeks, mouth) |
| 47–58 | neck rect |
| 55–73 | neckerchief / chest-pin diamond (`M50 55 L44 67 L50 73 L56 67 Z`) |
| 53–98 | lab coat |
| 60–95 | accessory (clipboard, suitcase, mug, marker, pill bottle, seal, ingot) |

The neckerchief path is identical across all 7 archetypes — only its `accentColor` fill differs.

---

## MazeEmblem (the maze sprinkle)

[MazeEmblem.tsx](app/components/spin/MazeEmblem.tsx) renders one of the 7 badge-style emblems at a chosen colour, with viewBox `66 69 26 26` (exported as `MAZE_EMBLEM_VIEWBOX`) that crops to just the emblem region. It's used in [PillboxMaze](app/components/spin/PillboxMaze.tsx) to scatter faint per-archetype glyphs across the **7 maze cells** (`TOTAL_CELLS = DAYS = 7` — one compartment per weekday) with neighbour-avoidance, so adjacent compartments (including the wrap from 日 back to 一) never share an emblem.

`MAZE_EMBLEM_ARCHETYPES` lists all 7 archetypes (incl. 金牛). The crescent moon for 夜貓 uses a two-circle cutout that needs the cell's `bgColor` to carve the crescent — same trick as the badge.

If you ever change a badge emblem's shape, the maze sprinkle won't update automatically — MazeEmblem is a deliberate copy so the badge can evolve without touching the maze.

---

## Customization knobs

### Tweak the opacity values
Search any archetype file for `Opacity="0.85"` (punch) or `Opacity="0.55"` (background). Both `fillOpacity` and `strokeOpacity` exist; treat them the same.

### Change badge position
Edit `cx` / `cy` in [HospitalBadge.tsx](app/components/spin/icons/HospitalBadge.tsx). The viewBox is 0–100. Default is `(78, 82)` (bottom-right corner).

### Change a badge emblem
Edit the `BadgeEmblem` switch in [HospitalBadge.tsx](app/components/spin/icons/HospitalBadge.tsx). Emblems use stroke/fill `white` for visibility against any brandColor. 夜貓's crescent depends on the carving circle matching the badge `brandColor`.

### Change halo intensity
Edit the `stopOpacity` values in [ArchetypeHalo.tsx](app/components/spin/icons/ArchetypeHalo.tsx). Currently `0.5 → 0.18 → 0`.

### Change archetype priority / rules
Edit `ARCHETYPE_PRIORITY` in [resolveArchetype.ts](app/components/spin/icons/resolveArchetype.ts). It's a single ordered array. (Remember 金牛 isn't in it by design — see above.)

### Add an 8th archetype
1. Add the key to the `ArchetypeKey` union in [types.ts](app/components/spin/icons/types.ts)
2. (Optional) Add a rule to `ARCHETYPE_PRIORITY` in [resolveArchetype.ts](app/components/spin/icons/resolveArchetype.ts) — skip this if it's idol-only like 金牛
3. Create a new file in [archetypes/](app/components/spin/icons/archetypes/) — copy an existing one, change the props (`accentColor` neckerchief + `secondaryColor` accessory) and `aria-label`
4. Add it to `ARCHETYPE_COMPONENTS` in [HospitalIcon.tsx](app/components/spin/icons/HospitalIcon.tsx)
5. Add a badge emblem case to `BadgeEmblem` in [HospitalBadge.tsx](app/components/spin/icons/HospitalBadge.tsx)
6. Add it to `MAZE_EMBLEM_ARCHETYPES` in [MazeEmblem.tsx](app/components/spin/MazeEmblem.tsx) and add an emblem case there
7. Update the table in this file

### Add custom art for specific hospitals (escape hatch, not built)
Add an `iconUrl` field to [Job](app/lib/types.ts), and in [HospitalIcon.tsx](app/components/spin/icons/HospitalIcon.tsx) check `job.iconUrl` first — if present, render `<img src={job.iconUrl} />` instead of the archetype component. Useful for headliner hospitals.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| A tinted path renders invisible | `accentColor`/`secondaryColor` was passed as `""` or `undefined` and the path lacks the `|| '#hex'` fallback | Add the fallback hex to the `fill` / `stroke` |
| Accessory shows the wrong colour | The accessory is reading `accentColor` instead of `secondaryColor` (or vice versa) | Neckerchief = `accentColor`; prop = `secondaryColor` |
| Character appears tiny in corner of icon | The archetype SVG's `viewBox` isn't `0 0 100 100` | Fix the viewBox |
| Badge overlaps face / accessory | Character art extends into bottom-right corner of the 100×100 space | Move the badge (`cx`/`cy` in HospitalBadge.tsx) or redraw the conflicting paths |
| Halo not showing | Hospital has invalid `brandColor` in Notion | Falls back to slate-400 — verify Notion data has `#RRGGBB` format |
| Hospital renders single-colour when two were expected | `輔助色` is blank or `—` in Notion (intentional convention) or fails `safeBrandColor` | Set a valid `#RRGGBB` 輔助色 in Notion to enable the accessory tint |
| Sparkle missing on a high-salary hospital | Sparkle keys off the `簽約金` **tag**, not a salary tier | Add the `簽約金` tag in Notion if the job has a signing bonus |
| Maze emblem missing for one archetype | New archetype added to `ArchetypeKey` but `MazeEmblem` switch has no case | Add the case in `MazeEmblem.tsx` |
| OG image renders Chinese as boxes in production | Google Fonts subset fetch failed at Edge runtime | Check the Vercel function logs; consider bundling an explicit TTF |

---

## File map

```
app/components/spin/icons/
├── HospitalIcon.tsx           ← public API: <HospitalIcon job={job} size={96} />
│                                 + ArchetypeAvatar (character+halo, no badge) for the hero cast
├── resolveArchetype.ts        ← Job → archetype resolver (6 priority rules; 金牛 excluded by design)
├── types.ts                   ← ArchetypeKey union (7) + ArchetypeComponentProps (accentColor, secondaryColor)
├── ArchetypeHalo.tsx          ← Layer 1: brandColor radial gradient
├── HospitalBadge.tsx          ← Layer 3: brandColor circle + per-archetype white emblem
├── SalarySparkle.tsx          ← Layer 4: gold ✨ for the 簽約金 tag (legacy name; rename pending)
└── archetypes/                ← Layer 2 candidates (1 of 7)
    ├── BeipiaoPharmacist.tsx       ← 北漂藥師 — suitcase
    ├── TeachingSoulPharmacist.tsx  ← 教魂藥師 — whiteboard marker
    ├── NightOwlPharmacist.tsx      ← 夜貓藥師 — coffee mug + z's
    ├── ZenPharmacist.tsx           ← 佛系藥師 — pill bottle + side ribbons
    ├── AcademicAcePharmacist.tsx   ← 學霸藥師 — clipboard + glasses
    ├── IronArmPharmacist.tsx       ← 鐵腕藥師 — seal + 政府 pin
    └── JinniuPharmacist.tsx        ← 金牛藥師 — gold 元寶 (idol-only, salary)

app/components/spin/
├── MazeEmblem.tsx             ← Standalone copy of the 7 badge glyphs for PillboxMaze cells
└── PillboxMaze.tsx            ← 7-cell pillbox ring; cells sprinkled with MazeEmblem
```
