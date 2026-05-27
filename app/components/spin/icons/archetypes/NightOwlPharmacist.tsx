// PLACEHOLDER — replace with OpenPeeps SVG export of the 夜貓藥師 character.
// Keep the (size) prop and viewBox 0 0 100 100 so HospitalIcon's halo/badge
// alignment continues to work without changes.
import type { ArchetypeComponentProps } from '../types';

export function NightOwlPharmacist({ size }: ArchetypeComponentProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="夜貓藥師 placeholder">
      <circle
        cx="50"
        cy="50"
        r="36"
        fill="#c7d2fe"
        stroke="#3730a3"
        strokeWidth="2"
        strokeDasharray="4 2"
      />
      <text
        x="50"
        y="52"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontWeight={700}
        fill="#312e81"
        style={{ fontFamily: 'system-ui, -apple-system, "Noto Sans TC", sans-serif' }}
      >
        夜貓
      </text>
    </svg>
  );
}
