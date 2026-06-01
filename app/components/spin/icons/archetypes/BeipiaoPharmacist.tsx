// 北漂藥師 — hopeful chibi pharmacist who relocated for the job: suitcase,
// open smile, no glasses. Character art only (viewBox 0 0 100 100); the
// brand-color halo, hospital badge, and salary sparkle are composed on top by
// HospitalIcon — do not add them here.
import type { ArchetypeComponentProps } from '../types';

export function BeipiaoPharmacist({ size, accentColor }: ArchetypeComponentProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="北漂藥師"
    >
      <path d="M30 60 Q50 53 70 60 L78 92 Q50 98 22 92 Z" fill="#FFFFFF" stroke="#D7DCE3" strokeWidth="1.6" />
      <path d="M50 56 L41 92 M50 56 L59 92" stroke="#D7DCE3" strokeWidth="1.4" fill="none" />
      <path d="M50 55 L44 67 L50 73 L56 67 Z" fill={accentColor || '#7DD3FC'} />

      <rect x="45" y="47" width="10" height="11" rx="3" fill="#F0BE92" />

      <circle cx="50" cy="34" r="17" fill="#F8D2AC" />
      <circle cx="33.5" cy="35" r="3.2" fill="#F0BE92" />
      <circle cx="66.5" cy="35" r="3.2" fill="#F0BE92" />

      <path d="M33 33 Q33 15 50 15 Q67 15 67 33 Q63 25 55 24 Q57 20 51 19 Q52 24 46 24 Q39 25 33 33 Z" fill="#4A372A" />

      <path d="M39 35 Q43 31 47 35" fill="none" stroke="#2B3440" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M53 35 Q57 31 61 35" fill="none" stroke="#2B3440" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="40" cy="42" r="2.4" fill="#F4A8A0" fillOpacity="0.7" />
      <circle cx="60" cy="42" r="2.4" fill="#F4A8A0" fillOpacity="0.7" />
      <path d="M44 44 Q50 50 56 44" fill="none" stroke="#B06A4F" strokeWidth="1.8" strokeLinecap="round" />

      <g transform="rotate(-6 25 80)">
        <rect x="14" y="72" width="24" height="18" rx="2.5" fill="#B5703B" stroke="#8A5128" strokeWidth="1.6" />
        <line x1="14" y1="80" x2="38" y2="80" stroke="#8A5128" strokeWidth="1.4" />
        <rect x="22" y="76" width="8" height="3" rx="1" fill={accentColor || '#D9A66B'} fillOpacity="0.85" />
        <path d="M22 72 Q22 67 26 67 L26 67 Q30 67 30 72" fill="none" stroke={accentColor || '#8A5128'} strokeOpacity="0.55" strokeWidth="1.8" />
      </g>
      <circle cx="26" cy="66" r="3.8" fill="#F8D2AC" />
    </svg>
  );
}
