# Hospital icons — system guide

The icon system at [app/components/spin/icons/](app/components/spin/icons/) renders the per-hospital character icon. It's a four-layer SVG composition where three of the four layers vary by hospital, driven by `job.brandColor` from Notion.

The icon appears in:
- [ResultCard](app/components/spin/ResultCard.tsx) at 96 px (the spin reveal)
- [AlternativesView](app/components/spin/AlternativesView.tsx) at 56 px (stage 2 alternative cards)
- The dynamic OG image at [app/og/route.tsx](app/og/route.tsx) for shareable previews

A separate component, [MazeEmblem.tsx](app/components/spin/MazeEmblem.tsx), sprinkles small per-archetype glyphs into [PillboxMaze](app/components/spin/PillboxMaze.tsx) cells. It echoes the badge emblems visually but is its own copy — the icon system itself stays untouched by the maze.

---

## The 4-layer composition

```
┌──────────────────────────────────┐
│  Layer 1: ArchetypeHalo          │  ← radial brand-color glow
│      ╭─────────────╮             │
│      │  Layer 2:   │             │  ← 1 of 6 archetype SVGs
│      │  Character  │                  with brand-color tints on
│      │             │                  chest pin + accessory
│      ╰─────────────╯             │
│                  ╭───╮           │
│                  │ 🎓│           │  ← Layer 3: HospitalBadge
│                  ╰───╯           │      brand-color circle +
│                                  │      per-archetype white emblem
│   ✨ (if 薪資突出)               │  ← Layer 4: SalarySparkle
└──────────────────────────────────┘
```

Per-hospital variation comes from:
- **Halo** — `job.brandColor` as a radial gradient (low opacity)
- **Character chest pin and accessories** — `accentColor` (= `brandColor`) tinted at 0.85 / 0.55 opacity
- **Badge background** — `job.brandColor` (white emblem on top)
- **Badge emblem** — per-archetype (graduation cap, train, open book, crescent+star, water lily, shield+star)
- **Sparkle** — only renders when `job.salaryTier === '突出'`

If `job.brandColor` is missing or invalid, the halo and badge fall back to slate (`#94a3b8`). Each tinted surface in the character SVG falls back to its original hand-picked hex, so paths stay visible even if `accentColor` breaks (see "The accentColor contract" below).

---

## The 6 archetypes

Selected by [resolveArchetype.ts](app/components/spin/icons/resolveArchetype.ts) — top-down priority, first match wins, fallback is `佛系藥師`.

| Priority | Archetype | Wins when... | Badge emblem | Character prop |
|---|---|---|---|---|
| 1 | **學霸藥師** | `hospitalTier === '醫學中心'` | graduation cap | clipboard + glasses |
| 2 | **教魂藥師** | tags include any of: `教學醫院`, `重視教學`, `全面藥事訓練`, `外派進修機會` | open book | whiteboard marker |
| 3 | **北漂藥師** | tags include `提供宿舍` | train (side view) | suitcase |
| 4 | **鐵腕藥師** | `publicPrivate === '公立'` | shield + star | seal (印章) + 政府 pin |
| 5 | **夜貓藥師** | tags include `夜班津貼優渥` | crescent moon + star | coffee mug + floating z's |
| 6 | **佛系藥師** | tags include any of: `工作單純`, `免/少輪班`, `無大夜` | water lily | pill bottle + green side ribbons |

Naming convention: every archetype is `{2-char}藥師`. Preserve this if proposing additions.

---

## The accentColor contract

Each archetype SVG component receives an `accentColor?: string` prop ([types.ts](app/components/spin/icons/types.ts)). [HospitalIcon](app/components/spin/icons/HospitalIcon.tsx) passes `brandColor` as `accentColor`; the character uses it on the chest pin and on chosen accessory paths.

The pattern across all 6 archetypes:

```tsx
// Chest pin (small, semantically neutral) — full opacity
<path d="M50 55 L44 67 L50 73 L56 67 Z" fill={accentColor || '#5EC8C2'} />

// Accessory "punch" surface — 0.85 opacity (saturated accent)
<rect ... fill={accentColor || '#9AA1AB'} fillOpacity="0.85" />

// Accessory "background" surface — 0.55 opacity (soft wash)
<rect ... fill={accentColor || '#F4F1EA'} fillOpacity="0.55" />
```

Two opacities of the same `brandColor` over the white card background produce both the muting AND the within-accessory contrast — no color-mixing helper needed.

**The `|| '#hex'` fallback is critical.** Without it, `fill={undefined}` inherits `fill="none"` from the SVG root and the path renders invisible. The fallback hex is the path's pre-tint colour, so the icon stays viewable even when `accentColor` is missing or empty.

### Per-archetype tint targets

| Archetype | Chest pin | Punch (0.85) | Background (0.55) | Stays untouched |
|---|---|---|---|---|
| **學霸** | ✓ | clipboard metal clip | clipboard outer border (stroke) | paper, paper lines |
| **北漂** | ✓ | destination tag + body border + divider + handle (all `stroke`/`fill` at 0.85) | suitcase body fill | — |
| **夜貓** | ✓ | mug band | steam squiggles | cream mug body, dark coffee, indigo z's |
| **教魂** | ✓ | marker cap band | marker body | slate marker tip, white sleeve |
| **佛系** | ✓ | bottle cap + green "+" cross + ribbon center circles + bow petals + trailing strings (all 0.85) | bottle label background | white bottle body |
| **鐵腕** | ✓ | seal knob | seal stem | red seal base, red ink pad, gold gov shield+star |

To re-tune: each archetype file in [archetypes/](app/components/spin/icons/archetypes/) has the tint values inline on its `fill`/`stroke` attributes. Search for `Opacity="0.85"` or `Opacity="0.55"` to find the surfaces.

---

## The viewBox contract

All archetype SVGs **must use `viewBox="0 0 100 100"`** so the [HospitalBadge](app/components/spin/icons/HospitalBadge.tsx) and [SalarySparkle](app/components/spin/icons/SalarySparkle.tsx) overlays align correctly. The badge sits at `(78, 82)` r=16, the sparkle at `(78, 18)`.

Within that 100×100 space, the established anatomy is:

| Y range | Element |
|---|---|
| 14–34 | hair / head |
| 33–51 | face (glasses, brows, eyes, cheeks, mouth) |
| 47–58 | neck rect |
| 55–73 | chest pin diamond (`M50 55 L44 67 L50 73 L56 67 Z`) |
| 53–98 | lab coat |
| 60–95 | accessory (clipboard, suitcase, mug, marker, pill bottle, seal) |

The chest pin path is identical across all 6 archetypes — only its fill differs.

---

## MazeEmblem (the maze sprinkle)

[MazeEmblem.tsx](app/components/spin/MazeEmblem.tsx) renders one of the 6 badge-style emblems at a chosen colour, with a viewBox `66 69 26 26` that crops to just the emblem region. It's used in [PillboxMaze](app/components/spin/PillboxMaze.tsx) to scatter faint per-archetype glyphs across the 14 cells with neighbour-avoidance (adjacent cells never share an emblem).

The crescent moon for 夜貓 uses a different drawing technique than the badge does — a two-circle cutout that needs the cell's `bgColor` to render the carved-out crescent. The badge does the same trick.

If you ever change a badge emblem's shape, the maze sprinkle won't update automatically — MazeEmblem is a deliberate copy so the badge can evolve without touching the maze.

---

## Customization knobs

### Tweak the opacity values
Search any archetype file for `Opacity="0.85"` (punch) or `Opacity="0.55"` (background). Both `fillOpacity` and `strokeOpacity` exist; treat them the same.

### Change badge position
Edit `cx` / `cy` in [HospitalBadge.tsx](app/components/spin/icons/HospitalBadge.tsx). The viewBox is 0–100. Default is `(78, 82)` (bottom-right corner).

### Change a badge emblem
Edit the `<BadgeEmblem>` switch in [HospitalBadge.tsx](app/components/spin/icons/HospitalBadge.tsx). Emblems use stroke/fill `white` for visibility against any brandColor. 夜貓's crescent depends on the carving circle matching the badge `brandColor`.

### Change halo intensity
Edit the `stopOpacity` values in [ArchetypeHalo.tsx](app/components/spin/icons/ArchetypeHalo.tsx). Currently `0.5 → 0.18 → 0`.

### Change archetype priority / rules
Edit [resolveArchetype.ts](app/components/spin/icons/resolveArchetype.ts). It's a single ordered array.

### Add a 7th archetype
1. Add the key to `ArchetypeKey` union in [types.ts](app/components/spin/icons/types.ts)
2. Add a rule to `ARCHETYPE_PRIORITY` in [resolveArchetype.ts](app/components/spin/icons/resolveArchetype.ts)
3. Create a new file in [archetypes/](app/components/spin/icons/archetypes/) — copy an existing one as a starting point, change the prop, accessory, and `aria-label`
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
| A tinted path renders invisible | `accentColor` was passed as `""` or `undefined` and the path lacks the `|| '#hex'` fallback | Add the fallback hex to the `fill` / `stroke` |
| Character appears tiny in corner of icon | The archetype SVG's `viewBox` isn't `0 0 100 100` | Fix the viewBox |
| Badge overlaps face / accessory | Character art extends into bottom-right corner of the 100×100 space | Move the badge (`cx`/`cy` in HospitalBadge.tsx) or redraw the conflicting paths |
| Halo not showing | Hospital has invalid `brandColor` in Notion | Falls back to slate-400 — verify Notion data has `#RRGGBB` format |
| Brand color is hot pink / clashes with archetype | Brand colors close to red/magenta can wash green-coded accessories oddly | Either accept it (tint is meant to be loud), drop the offending surface from tinting, or bump opacity toward `0.4` to mute further |
| Maze emblem missing for one archetype | New archetype added to `ArchetypeKey` but `MazeEmblem` switch doesn't have a case for it | Add the case in `MazeEmblem.tsx` |
| OG image renders Chinese as boxes in production | Google Fonts subset fetch failed at Edge runtime | Check the Vercel function logs; consider bundling an explicit TTF |

---

## File map

```
app/components/spin/icons/
├── HospitalIcon.tsx           ← public API: <HospitalIcon job={job} size={96} />
├── resolveArchetype.ts        ← Job → archetype priority resolver
├── types.ts                   ← ArchetypeKey union + ArchetypeComponentProps (with accentColor?)
├── ArchetypeHalo.tsx          ← Layer 1: brand-color radial gradient
├── HospitalBadge.tsx          ← Layer 3: brand-color circle + per-archetype white emblem
├── SalarySparkle.tsx          ← Layer 4: gold ✨ for 薪資突出 jobs
└── archetypes/                ← Layer 2 candidates (1 of 6, picked by resolver)
    ├── BeipiaoPharmacist.tsx       ← 北漂藥師 — suitcase
    ├── TeachingSoulPharmacist.tsx  ← 教魂藥師 — whiteboard marker
    ├── NightOwlPharmacist.tsx      ← 夜貓藥師 — coffee mug + z's
    ├── ZenPharmacist.tsx           ← 佛系藥師 — pill bottle + side ribbons
    ├── AcademicAcePharmacist.tsx   ← 學霸藥師 — clipboard + glasses
    └── IronArmPharmacist.tsx       ← 鐵腕藥師 — seal + 政府 pin

app/components/spin/
├── MazeEmblem.tsx             ← Standalone copy of badge glyphs for PillboxMaze cells
└── PillboxMaze.tsx            ← 7×2 maze grid; cells sprinkled with MazeEmblem
```
