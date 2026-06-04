// Bottom-right floating badge in brand color, with a per-archetype emblem.
// Positioned in the SVG corner rather than on the character chest so it stays
// aligned regardless of which archetype art is below it. The emblems are white
// line-icons so they stay legible against any brandColor and in dark mode; the
// per-hospital color comes from the circle's brandColor fill.
import type { ArchetypeKey } from './types';

function BadgeEmblem({
  archetype,
  brandColor,
}: {
  archetype: ArchetypeKey;
  brandColor: string;
}) {
  switch (archetype) {
    case '學霸藥師': // graduation cap
      return (
        <>
          <path d="M69 79 L78 75.5 L87 79 L78 82.5 Z" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <path d="M73 80.8 V84.5 Q73 86 78 86 Q83 86 83 84.5 V80.8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M87 79 V84" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="87" cy="84.6" r="1.1" fill="white" />
        </>
      );
    case '北漂藥師': // train (side view)
      return (
        <>
          <path d="M69.5 78.5 H82 Q86 78.5 86 82.5 V86 H69.5 Z" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <rect x="71.3" y="80" width="3.2" height="2.8" rx="0.6" fill="white" />
          <rect x="76" y="80" width="3.2" height="2.8" rx="0.6" fill="white" />
          <path d="M81.2 80.4 Q83.6 80.4 84 82.8 L81.2 82.8 Z" fill="white" />
          <circle cx="73.5" cy="87.5" r="1.4" fill="none" stroke="white" strokeWidth="1.3" />
          <circle cx="82" cy="87.5" r="1.4" fill="none" stroke="white" strokeWidth="1.3" />
          <path d="M68.5 89.4 H87" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </>
      );
    case '教魂藥師': // open book
      return (
        <>
          <path d="M78 78 C74.5 76 70.5 76 68 77.5 L68 86 C70.5 84.5 74.5 84.5 78 86.5 C81.5 84.5 85.5 84.5 88 86 L88 77.5 C85.5 76 81.5 76 78 78 Z" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <path d="M78 78 V86.5" stroke="white" strokeWidth="1.6" />
        </>
      );
    case '夜貓藥師': // crescent moon (right) + star (left), carved with a brandColor circle
      return (
        <>
          <circle cx="81" cy="82" r="6.8" fill="white" />
          <circle cx="84.3" cy="79.9" r="6.2" fill={brandColor} />
          <path d="M70.5 78.8 L71.2 80.6 L73 81.3 L71.2 82 L70.5 83.8 L69.8 82 L68 81.3 L69.8 80.6 Z" fill="white" />
        </>
      );
    case '佛系藥師': // water lily
      return (
        <>
          <path d="M78 75.5 C81 79 81 83 78 85.5 C75 83 75 79 78 75.5 Z" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <path d="M70 80 C73 78 77 80 78 84.5 C74 84.5 70.5 83 70 80 Z" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <path d="M86 80 C83 78 79 80 78 84.5 C82 84.5 85.5 83 86 80 Z" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <path d="M70 86.5 Q78 88.5 86 86.5" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </>
      );
    case '鐵腕藥師': // shield + star
      return (
        <>
          <path d="M78 75 L85 77.2 V82 C85 86.3 78 89.3 78 89.3 C78 89.3 71 86.3 71 82 V77.2 Z" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <path d="M78 79.2 L78.9 81.1 L81 81.3 L79.4 82.7 L79.9 84.8 L78 83.7 L76.1 84.8 L76.6 82.7 L75 81.3 L77.1 81.1 Z" fill="white" />
        </>
      );
    case '金牛藥師': // ancient coin (round, square hole) = wealth / salary
      return (
        <>
          <circle cx="78" cy="82" r="6.6" fill="none" stroke="white" strokeWidth="2" />
          <rect x="75.4" y="79.4" width="5.2" height="5.2" rx="0.6" fill="none" stroke="white" strokeWidth="1.6" />
        </>
      );
    default:
      return null;
  }
}

export function HospitalBadge({
  brandColor,
  archetype,
  size,
}: {
  brandColor: string;
  archetype: ArchetypeKey;
  size: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0"
      aria-hidden
    >
      <circle cx="78" cy="82" r="16" fill={brandColor} stroke="white" strokeWidth="2.5" />
      <BadgeEmblem archetype={archetype} brandColor={brandColor} />
    </svg>
  );
}
