// PLACEHOLDER — replace with OpenPeeps SVG export of the 學霸藥師 character.
// Keep the (size) prop and viewBox 0 0 100 100 so HospitalIcon's halo/badge
// alignment continues to work without changes.
import type { ArchetypeComponentProps } from '../types';

export function AcademicAcePharmacist({ size }: ArchetypeComponentProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="學霸藥師 placeholder">
      <circle
        cx="50"
        cy="50"
        r="36"
        fill="#bfdbfe"
        stroke="#1e3a8a"
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
        fill="#1e3a8a"
        style={{ fontFamily: 'system-ui, -apple-system, "Noto Sans TC", sans-serif' }}
      >
        學霸
      </text>
    </svg>
  );
}
