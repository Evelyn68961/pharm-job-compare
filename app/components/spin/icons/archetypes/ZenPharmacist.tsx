// 佛系藥師 — work-life-balance pharmacist: female with long hair and green side
// ribbons, serene closed eyes and soft smile, gently holding a pill bottle.
// Character art only
// (viewBox 0 0 100 100); the brand-color halo, hospital badge, and salary
// sparkle are composed on top by HospitalIcon — do not add them here.
import type { ArchetypeComponentProps } from '../types';

export function ZenPharmacist({ size, accentColor, secondaryColor }: ArchetypeComponentProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="佛系藥師"
    >
      <path d="M30 51 Q29 16 50 14 Q71 16 70 51 Q70 56 66 60 Q67 48 65 41 Q58 31 50 31 Q42 31 35 41 Q33 48 34 60 Q30 56 30 51 Z" fill="#3A2A1C" />

      <path d="M30 60 Q50 53 70 60 L78 92 Q50 98 22 92 Z" fill="#FFFFFF" stroke="#D7DCE3" strokeWidth="1.6" />
      <path d="M50 56 L41 92 M50 56 L59 92" stroke="#D7DCE3" strokeWidth="1.4" fill="none" />
      <path d="M50 55 L44 67 L50 73 L56 67 Z" fill={accentColor || '#6EE7B7'} />

      <rect x="45" y="47" width="10" height="11" rx="3" fill="#F0BE92" />

      <rect x="18.5" y="70" width="11" height="4.5" rx="1.5" fill={secondaryColor || '#059669'} fillOpacity="0.85" />
      <rect x="17.5" y="74" width="13" height="14" rx="2" fill="#FFFFFF" stroke="#C7CDD6" strokeWidth="1.6" />
      <rect x="19" y="78" width="10" height="7" rx="1" fill={secondaryColor || '#D1FAE5'} fillOpacity="0.55" />
      <rect x="23.2" y="79.5" width="1.6" height="4" fill={secondaryColor || '#059669'} fillOpacity="0.85" />
      <rect x="21.8" y="80.7" width="4.4" height="1.6" fill={secondaryColor || '#059669'} fillOpacity="0.85" />
      <circle cx="31" cy="80" r="3.6" fill="#F8D2AC" />

      <circle cx="50" cy="34" r="17" fill="#F8D2AC" />
      <circle cx="33.5" cy="35" r="3.2" fill="#F0BE92" />
      <circle cx="66.5" cy="35" r="3.2" fill="#F0BE92" />

      <path d="M34 34 Q34 17 50 16 Q66 17 66 34 Q61 25 53 25 Q56 21 49 21 Q42 22 40 27 Q37 28 34 34 Z" fill="#3A2A1C" />

      <path d="M32 51.5 C30.5 49 27.5 49.5 29 52 C27.5 54.5 30.5 55 32 52.5 Z" fill={accentColor || '#059669'} fillOpacity="0.85" />
      <path d="M32 51.5 C33.5 49 36.5 49.5 35 52 C36.5 54.5 33.5 55 32 52.5 Z" fill={accentColor || '#059669'} fillOpacity="0.85" />
      <path d="M31.5 53 Q30 55 31 56.5" stroke={accentColor || '#059669'} strokeOpacity="0.85" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M32.5 53 Q34 55 33 56.5" stroke={accentColor || '#059669'} strokeOpacity="0.85" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="52" r="0.75" fill={accentColor || '#047857'} fillOpacity="0.85" />
      <path d="M68 51.5 C66.5 49 63.5 49.5 65 52 C63.5 54.5 66.5 55 68 52.5 Z" fill={accentColor || '#059669'} fillOpacity="0.85" />
      <path d="M68 51.5 C69.5 49 72.5 49.5 71 52 C72.5 54.5 69.5 55 68 52.5 Z" fill={accentColor || '#059669'} fillOpacity="0.85" />
      <path d="M67.5 53 Q66 55 67 56.5" stroke={accentColor || '#059669'} strokeOpacity="0.85" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M68.5 53 Q70 55 69 56.5" stroke={accentColor || '#059669'} strokeOpacity="0.85" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <circle cx="68" cy="52" r="0.75" fill={accentColor || '#047857'} fillOpacity="0.85" />

      <path d="M39 31 Q43 29.8 47 31" fill="none" stroke="#3A2A1C" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M53 31 Q57 29.8 61 31" fill="none" stroke="#3A2A1C" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M39.5 37 Q43 35.3 46.5 37" fill="none" stroke="#2B3440" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M53.5 37 Q57 35.3 60.5 37" fill="none" stroke="#2B3440" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="43" cy="39" r="2.1" fill="#2B3440" />
      <circle cx="43.8" cy="38.3" r="0.7" fill="#FFFFFF" />
      <circle cx="57" cy="39" r="2.1" fill="#2B3440" />
      <circle cx="57.8" cy="38.3" r="0.7" fill="#FFFFFF" />
      <path d="M46.8 36.9 L48 36.2 M53.2 36.9 L52 36.2" stroke="#2B3440" strokeWidth="0.6" strokeLinecap="round" />
      <circle cx="39.5" cy="43.5" r="2.3" fill="#F4A8A0" fillOpacity="0.65" />
      <circle cx="60.5" cy="43.5" r="2.3" fill="#F4A8A0" fillOpacity="0.65" />
      <path d="M46.5 45.5 Q50 47.8 53.5 45.5" fill="none" stroke="#B06A4F" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
