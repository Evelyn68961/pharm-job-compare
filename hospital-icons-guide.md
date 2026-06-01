# Hospital icons — workflow guide

The icon system at [app/components/spin/icons/](app/components/spin/icons/) renders the per-hospital character icon on the [ResultCard](app/components/spin/ResultCard.tsx). It currently uses **placeholder SVGs** (dashed pastel circles labeled with the 2-char archetype name). When real art is ready, swap files in [app/components/spin/icons/archetypes/](app/components/spin/icons/archetypes/) one at a time — no other code changes needed.

---

## How the icon is composed

```
┌──────────────────────────────────┐
│  brand-color radial halo         │ ← ArchetypeHalo.tsx (uses job.brandColor)
│      ╭─────────────╮             │
│      │  archetype  │             │ ← archetypes/*.tsx (1 of 6 by resolver)
│      │  character  │             │
│      │             │             │
│      ╰─────────────╯             │
│                  ╭───╮           │
│                  │馬偕│ ← HospitalBadge.tsx (initials + brandColor, corner)
│                  ╰───╯           │
│   ✨ (if 薪資突出)               │ ← SalarySparkle.tsx
└──────────────────────────────────┘
```

The halo, badge, and sparkle all work today against real Notion data — only the **character art** is placeholder.

---

## The 6 archetypes

| Archetype | Vibe / prop | Assigned when... | File to replace |
|---|---|---|---|
| **北漂藥師** | suitcase, hopeful — pharmacist who relocated for the job | `tags.includes('提供宿舍')` | [BeipiaoPharmacist.tsx](app/components/spin/icons/archetypes/BeipiaoPharmacist.tsx) |
| **教魂藥師** | whiteboard marker / pointing pose, bright — loves to teach | tags include any of: 教學醫院, 重視教學, 全面藥事訓練, 外派進修機會 | [TeachingSoulPharmacist.tsx](app/components/spin/icons/archetypes/TeachingSoulPharmacist.tsx) |
| **夜貓藥師** | coffee mug, sleepy-happy — night-shift specialist | `tags.includes('夜班津貼優渥')` | [NightOwlPharmacist.tsx](app/components/spin/icons/archetypes/NightOwlPharmacist.tsx) |
| **佛系藥師** | pill bottle held gently, peaceful — work-life balance | tags include any of: 工作單純, 免/少輪班, 無大夜 | [ZenPharmacist.tsx](app/components/spin/icons/archetypes/ZenPharmacist.tsx) |
| **學霸藥師** | clipboard + glasses, serious — medical center elite | `hospitalTier === '醫學中心'` | [AcademicAcePharmacist.tsx](app/components/spin/icons/archetypes/AcademicAcePharmacist.tsx) |
| **鐵腕藥師** | 政府 pin badge, confident — public sector stalwart | `publicPrivate === '公立'` | [IronArmPharmacist.tsx](app/components/spin/icons/archetypes/IronArmPharmacist.tsx) |

**Priority is top-down — first match wins.** Default fallback (nothing matches) is **佛系藥師**.

To change the priority order or rules: edit [resolveArchetype.ts](app/components/spin/icons/resolveArchetype.ts).

---

## Part 1: Produce SVGs in Figma with OpenPeeps

Estimated time: ~3 hours total (slower for archetype #1, faster after).

### Step 1: Figma account + file setup (5 min)

1. Sign up at **figma.com** (Google login works) → choose **Starter (Free)** plan
2. Click **+ Design file** in your drafts
3. Press **F** for the Frame tool → drag on canvas to create a **256 × 256** frame (verify size in the right-side panel)
4. Repeat to create **6 frames in a row**
5. Click each frame name in the left layers panel and rename to:
   - `BeipiaoPharmacist`
   - `TeachingSoulPharmacist`
   - `NightOwlPharmacist`
   - `ZenPharmacist`
   - `AcademicAcePharmacist`
   - `IronArmPharmacist`
6. Save the file (Cmd/Ctrl + S) — call it something like `pharm-icons`

### Step 2: Install OpenPeeps (3 min)

1. Top-right menu (or right-click on canvas) → **Plugins** → **Browse plugins in Community**
2. Search **"Open Peeps"** by Pablo Stanley → click **Run** or **Install**
3. The OpenPeeps panel opens with a randomized character — you can re-roll, swap head/hair/expression/accessories

### Step 3: Build your first archetype (recommend starting with 學霸藥師)

Why 學霸藥師 first: most "default" pharmacist look, easiest to evaluate against your aesthetic bar before you commit to the workflow.

1. Click into the `AcademicAcePharmacist` frame
2. Open OpenPeeps plugin → click **Insert** to drop a character
3. Scale the character to ~80% of frame height using corner handles
4. Use the plugin's **shuffle/swap** buttons to find:
   - **Glasses** (OpenPeeps has glasses options)
   - **Serious / focused expression**
   - **Standing or holding-something pose**
5. Once happy, click **Insert** to commit the character as flat SVG paths
6. **Add the clipboard prop** — press **R** for rectangle → draw a small rectangle (~30×40px) beside one hand. Fill = white, stroke = gray. Add 2–3 thin gray lines inside for "paper lines"
7. **Add a lab coat (optional)** — press **R** → draw a white rectangle covering the torso. Fill = white, stroke = light gray (#E5E7EB) 2px. In layers panel, drag this layer just below the head so the face sits on top
8. Click outside to deselect → eyeball it. Should look like a chibi student-pharmacist with glasses, clipboard, and lab coat

> 💡 **If the lab coat step feels hard, skip it.** OpenPeeps' built-in clothing options sometimes include a white top — try those first. The chest badge that the code adds on top usually communicates "pharmacist" well enough even without an explicit lab coat.

### Step 4: Repeat for the other 5 archetypes

Same pattern — pick OpenPeeps character matching the vibe, add prop, optional lab coat:

| Archetype | OpenPeeps vibe to find | Prop to add |
|---|---|---|
| **北漂藥師** | hopeful smile, standing pose, no glasses | small suitcase (brown rectangle ~40×30px + tiny gray handle) |
| **教魂藥師** | bright, mouth open, pointing or arms-up pose | thin whiteboard marker (skinny vertical rectangle) |
| **夜貓藥師** | sleepy half-smile, relaxed pose | coffee mug — OpenPeeps has one built-in! |
| **佛系藥師** | calm, eyes closed if available | pill bottle (small rounded rectangle, white body + colored cap) |
| **鐵腕藥師** | confident, arms crossed or hands on hips | nothing extra — the 政府 pin badge can be a small star or shield on the lab coat |

**Don't aim for perfect.** Aim for *cute and visually distinguishable from the other 5.* The brand-color halo and chest badge that the code adds will tie each character to its specific hospital.

### Step 5: Export the SVGs (5 min)

1. Click on a frame name in the left layers panel (e.g. `AcademicAcePharmacist`)
2. Right-side panel → scroll to **Export** section → click **+**
3. Set format to **SVG**, scale **1×**
4. Click **Export AcademicAcePharmacist** → save the `.svg` file
5. Repeat for all 6 frames (or shift-click to select all 6 frames first, then **Export 6 layers**)
6. **Optimize each file** — drop into [svgomg.net](https://svgomg.net) → click the download icon → replaces with optimized version (~50% smaller). Figma's raw SVG export is bloated.

---

## Part 2: Drop SVGs into the codebase

For each archetype, repeat these steps:

### Step 1: Open the matching component file

For example, to install the 學霸藥師 art, open [AcademicAcePharmacist.tsx](app/components/spin/icons/archetypes/AcademicAcePharmacist.tsx).

The current placeholder looks like:

```tsx
import type { ArchetypeComponentProps } from '../types';

export function AcademicAcePharmacist({ size }: ArchetypeComponentProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="學霸藥師 placeholder">
      <circle ... />
      <text ...>學霸</text>
    </svg>
  );
}
```

### Step 2: Open your exported SVG file

Open the `.svg` file from Figma in any text editor (VS Code, Notepad). It looks something like:

```xml
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g><path d="..."/><path d="..."/>...</g>
</svg>
```

### Step 3: Replace the placeholder JSX

Replace the placeholder's `<svg>...</svg>` with your exported one, with **3 required modifications**:

1. **Change `viewBox` to `"0 0 100 100"`** (or scale your paths — see contract below)
2. **Replace `width="256" height="256"`** with `width={size} height={size}`
3. **Update `aria-label`** to `"學霸藥師"` (remove "placeholder")

The result looks like:

```tsx
import type { ArchetypeComponentProps } from '../types';

export function AcademicAcePharmacist({ size }: ArchetypeComponentProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="學霸藥師"
    >
      <g>
        <path d="..." />
        {/* ... your paths from Figma ... */}
      </g>
    </svg>
  );
}
```

### Step 4: Save and verify

```sh
npm run dev
```

Visit http://localhost:3000 → run through the quiz → land on a hospital that matches that archetype. Eyeball the result card.

If you don't know which hospitals match which archetype, the title attribute on the icon shows it on hover (e.g. *"學霸藥師 · 臺大醫院"*).

---

## The viewBox contract (important!)

All archetype SVGs **must use `viewBox="0 0 100 100"`** so the [HospitalBadge](app/components/spin/icons/HospitalBadge.tsx) and [SalarySparkle](app/components/spin/icons/SalarySparkle.tsx) overlays align correctly. The badge is hardcoded at coordinates `(78, 82)` within that 100×100 space, sparkle at `(78, 18)`.

### Two ways to satisfy the contract

**Option A: Change Figma frame size to 100×100 from the start**
- Cleanest. Build characters within a 100-unit-wide frame.
- Smaller working area in Figma, can feel cramped.

**Option B: Build in 256×256, then scale paths on export**
- More comfortable to work in Figma.
- After export, wrap your SVG's contents in `<g transform="scale(0.39)">` (0.39 ≈ 100/256) before pasting into the React file. Or just change the `viewBox` attribute from `"0 0 256 256"` to `"0 0 100 100"` — SVG will auto-scale paths to fit.

**Recommended:** start with Option A (build at 100×100) if you can stomach the smaller workspace.

---

## Customization knobs (if you want to tweak later)

### Change badge position
Edit `cx` / `cy` in [HospitalBadge.tsx](app/components/spin/icons/HospitalBadge.tsx). The viewBox is 0–100. Default is `(78, 82)` (bottom-right). To put it on the character's chest, try `(50, 70)`.

### Change halo color intensity
Edit the `stopOpacity` values in [ArchetypeHalo.tsx](app/components/spin/icons/ArchetypeHalo.tsx). Currently `0.5 → 0.18 → 0`. Increase to make brand color more dominant, decrease for subtler.

### Change archetype priority / rules
Edit [resolveArchetype.ts](app/components/spin/icons/resolveArchetype.ts). It's a simple ordered array — reorder entries or change the `test:` predicates.

### Drop the sparkle
Remove the conditional render in [HospitalIcon.tsx](app/components/spin/icons/HospitalIcon.tsx): delete the line with `{showSparkle && <SalarySparkle size={size} />}`.

### Add custom art for specific hospitals (escape hatch)
Not built yet, but the architecture is ready for it. Add an `iconUrl` field to [Job](app/lib/types.ts), and in [HospitalIcon.tsx](app/components/spin/icons/HospitalIcon.tsx) check `job.iconUrl` first — if present, render `<img src={job.iconUrl} />` instead of the archetype component. Good for headliner hospitals like FJUH itself.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Character appears tiny in corner of icon | Your SVG's `viewBox` doesn't match the contract | Change `viewBox` to `"0 0 100 100"` |
| Character appears huge / clipped | Same — wrong viewBox | Same fix |
| Badge overlaps face | Character art extends into bottom-right | Move badge: edit `cx`/`cy` in HospitalBadge.tsx |
| Halo not showing | Hospital has invalid `brandColor` in Notion | Falls back to slate-400 — verify Notion data has `#RRGGBB` format |
| TypeScript error after editing archetype file | Probably removed the `import type { ArchetypeComponentProps }` line, or the `size` prop | Compare against another archetype file as reference |
| Build fails after edit | Run `npm run typecheck` to see the exact line | |

---

## File map (cheatsheet)

```
app/components/spin/icons/
├── HospitalIcon.tsx           ← public API: <HospitalIcon job={job} size={96} />
├── resolveArchetype.ts        ← Job → archetype priority resolver
├── initials.ts                ← hospitalBriefName → 2-char badge text
├── types.ts                   ← ArchetypeKey union + prop types
├── ArchetypeHalo.tsx          ← brand-color radial gradient backdrop
├── HospitalBadge.tsx          ← brand-color circle with initials (corner)
├── SalarySparkle.tsx          ← gold ✨ for 薪資突出
└── archetypes/
    ├── BeipiaoPharmacist.tsx        ← 北漂藥師   (替換為實際 SVG)
    ├── TeachingSoulPharmacist.tsx   ← 教魂藥師   (替換為實際 SVG)
    ├── NightOwlPharmacist.tsx       ← 夜貓藥師   (替換為實際 SVG)
    ├── ZenPharmacist.tsx            ← 佛系藥師   (替換為實際 SVG)
    ├── AcademicAcePharmacist.tsx    ← 學霸藥師   (替換為實際 SVG)
    └── IronArmPharmacist.tsx        ← 鐵腕藥師   (替換為實際 SVG)
```
