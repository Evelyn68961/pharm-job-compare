// 教魂藥師 — bright female teaching-loving pharmacist: long hair, arm holding a
// whiteboard marker at waist height, open enthusiastic smile. Character art only
// (viewBox 0 0 100 100); the brand-color halo, hospital badge, and salary
// sparkle are composed on top by HospitalIcon — do not add them here.
import type { ArchetypeComponentProps } from '../types';

export function TeachingSoulPharmacist({ size, accentColor }: ArchetypeComponentProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="教魂藥師"
    >
      <path d="M30 51 Q29 16 50 14 Q71 16 70 51 Q70 56 66 60 Q67 48 65 41 Q58 31 50 31 Q42 31 35 41 Q33 48 34 60 Q30 56 30 51 Z" fill="#3A2A1C" />

      <path d="M30 60 Q50 53 70 60 L78 92 Q50 98 22 92 Z" fill="#FFFFFF" stroke="#D7DCE3" strokeWidth="1.6" />
      <path d="M50 56 L41 92 M50 56 L59 92" stroke="#D7DCE3" strokeWidth="1.4" fill="none" />
      <path d="M50 55 L44 67 L50 73 L56 67 Z" fill={accentColor} />

      <rect x="45" y="47" width="10" height="11" rx="3" fill="#F0BE92" />

      <path d="M30 74 Q23 74 25 67" stroke="#D7DCE3" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M30 74 Q23 74 25 67" stroke="#FFFFFF" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      <path d="M23.5 50 L26 45.5 L28.5 50 Z" fill="#475569" />
      <rect x="23" y="50" width="6" height="16" rx="2" fill={accentColor} fillOpacity="0.55" />
      <rect x="22.6" y="59" width="6.8" height="4" rx="1.2" fill={accentColor} fillOpacity="0.85" />
      <circle cx="26" cy="65" r="4.2" fill="#F8D2AC" />

      <circle cx="50" cy="34" r="17" fill="#F8D2AC" />
      <circle cx="33.5" cy="35" r="3.2" fill="#F0BE92" />
      <circle cx="66.5" cy="35" r="3.2" fill="#F0BE92" />

      <path d="M34 34 Q34 17 50 16 Q66 17 66 34 Q61 25 53 25 Q56 21 49 21 Q42 22 40 27 Q37 28 34 34 Z" fill="#3A2A1C" />

      <path d="M39 31 Q43 27.5 47 31" fill="none" stroke="#3A2A1C" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M53 31 Q57 27.5 61 31" fill="none" stroke="#3A2A1C" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M40 35 L38.5 33.5 M43 34.5 L42.5 33" stroke="#3A2A1C" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M60 35 L61.5 33.5 M57 34.5 L57.5 33" stroke="#3A2A1C" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="43" cy="37.5" r="2.5" fill="#2B3440" />
      <circle cx="43.9" cy="36.6" r="0.85" fill="#FFFFFF" />
      <circle cx="57" cy="37.5" r="2.5" fill="#2B3440" />
      <circle cx="57.9" cy="36.6" r="0.85" fill="#FFFFFF" />
      <circle cx="39.5" cy="43" r="2.2" fill="#F4A8A0" fillOpacity="0.7" />
      <circle cx="60.5" cy="43" r="2.2" fill="#F4A8A0" fillOpacity="0.7" />
      <path d="M45 44 Q50 51 55 44 Z" fill="#C2685B" />
      <path d="M46.3 44.4 Q50 46 53.7 44.4" fill="#FFFFFF" />
    </svg>
  );
}
