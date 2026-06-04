// Per-roll randomized capsule rendered as inline SVG. Replaces the static 💊
// emoji in PillboxMaze. Each call to pickRandomPill() returns a fresh (shape,
// colour) combination — always a two-tone capsule (horizontal or vertical),
// split down the middle. When `opening` is set the two halves slide apart and a
// little powder burst appears, so the capsule itself reveals the result (the
// old MysteryBox step is gone). The palette sits in the Tailwind 200-300 range
// so it reads as pale-pharmacy aesthetic and does not collide with the
// saturated brand colours assigned to the maze cells.

export type PillShape = 'capsule-h' | 'capsule-v' | 'round' | 'oval' | 'cross';

export type PillVariant = {
  shape: PillShape;
  primaryColor: string;
  secondaryColor: string;
};

const PILL_PALETTE = [
  '#ffffff', // white
  '#fef3c7', // cream
  '#fbcfe8', // soft pink
  '#a7f3d0', // mint
  '#bae6fd', // powder blue
  '#e9d5ff', // lilac
  '#fed7aa', // peach
  '#fde68a', // butter yellow
];

const PILL_OUTLINE = '#1e293b'; // slate-800 — strong silhouette against any cell tint
const PILL_SCORE = '#0f172a';   // slate-900 — score line on tablets

// Capsules only — the rolling pill must be able to "open" into two halves to
// reveal the result, which solid tablets can't do.
const SHAPES: PillShape[] = ['capsule-h', 'capsule-v'];

export function pickRandomPill(): PillVariant {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const primaryColor = PILL_PALETTE[Math.floor(Math.random() * PILL_PALETTE.length)];
  let secondaryColor = primaryColor;
  while (secondaryColor === primaryColor) {
    secondaryColor = PILL_PALETTE[Math.floor(Math.random() * PILL_PALETTE.length)];
  }
  return { shape, primaryColor, secondaryColor };
}

export function RollingPill({
  variant,
  className,
  opening = false,
}: {
  variant: PillVariant;
  className?: string;
  opening?: boolean;
}) {
  return (
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="藥丸">
      {renderShape(variant, opening)}
    </svg>
  );
}

// Spring-y ease for the halves popping apart on open.
const HALF_TRANSITION = 'transform 480ms cubic-bezier(.34,1.56,.64,1)';

function renderShape(v: PillVariant, opening: boolean) {
  switch (v.shape) {
    case 'capsule-h': {
      // Horizontal capsule, bbox (8,14)–(32,26). Two coloured half-shells meet
      // at x=20; on open they slide apart along x.
      const shift = opening ? 7 : 0;
      return (
        <>
          <g style={{ transform: `translateX(${-shift}px)`, transition: HALF_TRANSITION }}>
            <path
              d="M 20 14 H 14 A 6 6 0 0 0 14 26 H 20 Z"
              fill={v.primaryColor}
              stroke={PILL_OUTLINE}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </g>
          <g style={{ transform: `translateX(${shift}px)`, transition: HALF_TRANSITION }}>
            <path
              d="M 20 14 H 26 A 6 6 0 0 1 26 26 H 20 Z"
              fill={v.secondaryColor}
              stroke={PILL_OUTLINE}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </g>
          {opening && <PowderBurst />}
        </>
      );
    }
    case 'capsule-v': {
      // Vertical capsule, bbox (14,8)–(26,32). Halves slide apart along y.
      const shift = opening ? 7 : 0;
      return (
        <>
          <g style={{ transform: `translateY(${-shift}px)`, transition: HALF_TRANSITION }}>
            <path
              d="M 14 20 V 14 A 6 6 0 0 1 26 14 V 20 Z"
              fill={v.primaryColor}
              stroke={PILL_OUTLINE}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </g>
          <g style={{ transform: `translateY(${shift}px)`, transition: HALF_TRANSITION }}>
            <path
              d="M 14 20 V 26 A 6 6 0 0 0 26 26 V 20 Z"
              fill={v.secondaryColor}
              stroke={PILL_OUTLINE}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </g>
          {opening && <PowderBurst />}
        </>
      );
    }
    case 'round':
      return (
        <>
          <circle cx="20" cy="20" r="10" fill={v.primaryColor} stroke={PILL_OUTLINE} strokeWidth="1.4" />
          <line x1="11" y1="20" x2="29" y2="20" stroke={PILL_SCORE} strokeWidth="1.4" />
        </>
      );
    case 'oval':
      return (
        <>
          <ellipse cx="20" cy="20" rx="12" ry="7" fill={v.primaryColor} stroke={PILL_OUTLINE} strokeWidth="1.4" />
          <line x1="9" y1="20" x2="31" y2="20" stroke={PILL_SCORE} strokeWidth="1.4" />
        </>
      );
    case 'cross':
      return (
        <>
          <circle cx="20" cy="20" r="10" fill={v.primaryColor} stroke={PILL_OUTLINE} strokeWidth="1.4" />
          <line x1="11" y1="20" x2="29" y2="20" stroke={PILL_SCORE} strokeWidth="1.4" />
          <line x1="20" y1="11" x2="20" y2="29" stroke={PILL_SCORE} strokeWidth="1.4" />
        </>
      );
  }
}

// Tiny "powder" specks spilling out of the opened capsule, centred at (20,20).
function PowderBurst() {
  const specks = [
    { cx: 20, cy: 20, r: 2.4 },
    { cx: 15, cy: 17, r: 1.3 },
    { cx: 25, cy: 23, r: 1.3 },
    { cx: 17, cy: 24, r: 1 },
    { cx: 24, cy: 16, r: 1 },
  ];
  return (
    <g style={{ opacity: 0.95 }}>
      {specks.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#fff" stroke={PILL_SCORE} strokeWidth="0.5" />
      ))}
    </g>
  );
}
