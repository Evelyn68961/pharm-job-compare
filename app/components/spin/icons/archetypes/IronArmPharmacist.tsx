// PLACEHOLDER — replace with OpenPeeps SVG export of the 鐵腕藥師 character.
// Keep the (size) prop and viewBox 0 0 100 100 so HospitalIcon's halo/badge
// alignment continues to work without changes.
import type { ArchetypeComponentProps } from '../types';

export function IronArmPharmacist({ size }: ArchetypeComponentProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="鐵腕藥師 placeholder">
      <circle
        cx="50"
        cy="50"
        r="36"
        fill="#cbd5e1"
        stroke="#1e293b"
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
        fill="#1e293b"
        style={{ fontFamily: 'system-ui, -apple-system, "Noto Sans TC", sans-serif' }}
      >
        鐵腕
      </text>
    </svg>
  );
}
