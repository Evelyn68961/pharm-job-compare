// Per-roll randomized pill rendered as inline SVG. Replaces the static 💊
// emoji in PillboxMaze. Each call to pickRandomPill() returns a fresh (shape,
// colour) combination — capsules get two colours split down the middle, solid
// tablets get one colour plus slate score lines. The palette sits in the
// Tailwind 200-300 range so it reads as pale-pharmacy aesthetic and does not
// collide with the saturated brand colours assigned to the maze cells.

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

const SHAPES: PillShape[] = ['capsule-h', 'capsule-v', 'round', 'oval', 'cross'];

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
}: {
  variant: PillVariant;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="藥丸">
      {renderShape(variant)}
    </svg>
  );
}

function renderShape(v: PillVariant) {
  switch (v.shape) {
    case 'capsule-h':
      // Horizontal capsule, bbox (8,14)–(32,26). Two coloured halves meet at x=20.
      return (
        <>
          <path d="M 20 14 H 14 A 6 6 0 0 0 14 26 H 20 Z" fill={v.primaryColor} />
          <path d="M 20 14 H 26 A 6 6 0 0 1 26 26 H 20 Z" fill={v.secondaryColor} />
          <rect x="8" y="14" width="24" height="12" rx="6" fill="none" stroke={PILL_OUTLINE} strokeWidth="1.4" />
          <line x1="20" y1="14" x2="20" y2="26" stroke={PILL_OUTLINE} strokeWidth="1" />
        </>
      );
    case 'capsule-v':
      // Vertical capsule, bbox (14,8)–(26,32).
      return (
        <>
          <path d="M 14 20 V 14 A 6 6 0 0 1 26 14 V 20 Z" fill={v.primaryColor} />
          <path d="M 14 20 V 26 A 6 6 0 0 0 26 26 V 20 Z" fill={v.secondaryColor} />
          <rect x="14" y="8" width="12" height="24" rx="6" fill="none" stroke={PILL_OUTLINE} strokeWidth="1.4" />
          <line x1="14" y1="20" x2="26" y2="20" stroke={PILL_OUTLINE} strokeWidth="1" />
        </>
      );
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
