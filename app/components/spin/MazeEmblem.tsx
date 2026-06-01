// Decorative emblems sprinkled across the pillbox maze cells. Visually echoes
// the per-archetype glyphs from HospitalBadge but is a standalone copy — the
// badge code stays untouched. The crescent moon uses a single Bézier path here
// (instead of the two-circle cutout used in the badge) so it renders correctly
// against the cell's varying background colour without needing brandColor.
import type { ArchetypeKey } from './icons/types';

// Bounding box that comfortably contains every emblem; use this as the SVG
// viewBox so the glyph sits centred in whatever container renders it.
export const MAZE_EMBLEM_VIEWBOX = '66 69 26 26';

export const MAZE_EMBLEM_ARCHETYPES: ArchetypeKey[] = [
  '北漂藥師',
  '教魂藥師',
  '夜貓藥師',
  '佛系藥師',
  '學霸藥師',
  '鐵腕藥師',
];

export function MazeEmblem({
  archetype,
  color,
  bgColor,
}: {
  archetype: ArchetypeKey;
  color: string;
  // Used only by 夜貓 to carve the crescent out of the moon disc — must match
  // the cell background colour the emblem sits on. Same trick as HospitalBadge.
  bgColor: string;
}) {
  switch (archetype) {
    case '學霸藥師': // graduation cap
      return (
        <>
          <path d="M69 79 L78 75.5 L87 79 L78 82.5 Z" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d="M73 80.8 V84.5 Q73 86 78 86 Q83 86 83 84.5 V80.8" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M87 79 V84" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="87" cy="84.6" r="1.1" fill={color} />
        </>
      );
    case '北漂藥師': // train (side view)
      return (
        <>
          <path d="M69.5 78.5 H82 Q86 78.5 86 82.5 V86 H69.5 Z" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <rect x="71.3" y="80" width="3.2" height="2.8" rx="0.6" fill={color} />
          <rect x="76" y="80" width="3.2" height="2.8" rx="0.6" fill={color} />
          <path d="M81.2 80.4 Q83.6 80.4 84 82.8 L81.2 82.8 Z" fill={color} />
          <circle cx="73.5" cy="87.5" r="1.4" fill="none" stroke={color} strokeWidth="1.3" />
          <circle cx="82" cy="87.5" r="1.4" fill="none" stroke={color} strokeWidth="1.3" />
          <path d="M68.5 89.4 H87" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        </>
      );
    case '教魂藥師': // open book
      return (
        <>
          <path d="M78 78 C74.5 76 70.5 76 68 77.5 L68 86 C70.5 84.5 74.5 84.5 78 86.5 C81.5 84.5 85.5 84.5 88 86 L88 77.5 C85.5 76 81.5 76 78 78 Z" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d="M78 78 V86.5" stroke={color} strokeWidth="1.6" />
        </>
      );
    case '夜貓藥師': // crescent moon (two-circle cutout, copied from HospitalBadge) + star (1.2× bigger, shifted to clear the moon)
      return (
        <>
          <circle cx="81" cy="82" r="6.8" fill={color} />
          <circle cx="84.3" cy="79.9" r="6.2" fill={bgColor} />
          <path d="M71 79 L71.84 81.16 L74 82 L71.84 82.84 L71 85 L70.16 82.84 L68 82 L70.16 81.16 Z" fill={color} />
        </>
      );
    case '佛系藥師': // water lily
      return (
        <>
          <path d="M78 75.5 C81 79 81 83 78 85.5 C75 83 75 79 78 75.5 Z" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d="M70 80 C73 78 77 80 78 84.5 C74 84.5 70.5 83 70 80 Z" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d="M86 80 C83 78 79 80 78 84.5 C82 84.5 85.5 83 86 80 Z" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d="M70 86.5 Q78 88.5 86 86.5" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        </>
      );
    case '鐵腕藥師': // shield + star
      return (
        <>
          <path d="M78 75 L85 77.2 V82 C85 86.3 78 89.3 78 89.3 C78 89.3 71 86.3 71 82 V77.2 Z" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d="M78 79.2 L78.9 81.1 L81 81.3 L79.4 82.7 L79.9 84.8 L78 83.7 L76.1 84.8 L76.6 82.7 L75 81.3 L77.1 81.1 Z" fill={color} />
        </>
      );
    default:
      return null;
  }
}
