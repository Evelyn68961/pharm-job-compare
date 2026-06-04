// 金牛藥師 — money-savvy pharmacist: winking grin, holding a gold 元寶 (ingot).
// Character art only (viewBox 0 0 100 100); the brand-color halo, hospital
// badge, and salary sparkle are composed on top by HospitalIcon — do not add
// them here. Collar = accentColor (primary); 元寶 = secondaryColor (accessory).
import type { ArchetypeComponentProps } from '../types';

export function JinniuPharmacist({ size, accentColor, secondaryColor }: ArchetypeComponentProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="金牛藥師"
    >
      <path d="M30 60 Q50 53 70 60 L78 92 Q50 98 22 92 Z" fill="#FFFFFF" stroke="#D7DCE3" strokeWidth="1.6" />
      <path d="M50 56 L41 92 M50 56 L59 92" stroke="#D7DCE3" strokeWidth="1.4" fill="none" />
      <path d="M50 55 L44 67 L50 73 L56 67 Z" fill={accentColor || '#D9A521'} />

      <rect x="45" y="47" width="10" height="11" rx="3" fill="#F0BE92" />

      <path d="M14 87 Q13 80 19 79 Q25 78 31 79 Q37 80 36 87 Q25 91 14 87 Z" fill={secondaryColor || '#E8B11E'} stroke="#B8860B" strokeWidth="1.2" />
      <ellipse cx="25" cy="79.5" rx="7" ry="2.2" fill="#C8941A" />
      <ellipse cx="25" cy="77" rx="3.6" ry="2.4" fill={secondaryColor || '#E8B11E'} stroke="#B8860B" strokeWidth="0.8" />
      <ellipse cx="20.5" cy="84.5" rx="2.2" ry="1" fill="#F7DD86" fillOpacity="0.85" />
      <circle cx="34" cy="84" r="3.8" fill="#F8D2AC" />

      <circle cx="50" cy="34" r="17" fill="#F8D2AC" />
      <circle cx="33.5" cy="35" r="3.2" fill="#F0BE92" />
      <circle cx="66.5" cy="35" r="3.2" fill="#F0BE92" />

      <path d="M33 33 Q33 15 50 15 Q67 15 67 33 Q63 24 55 25 Q58 21 50 22 Q44 22 41 26 Q37 28 33 33 Z" fill="#2E2A24" />

      <path d="M39 30.5 Q43 28.8 47 30.5" fill="none" stroke="#2E2A24" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M53 30.5 Q57 28.8 61 30.5" fill="none" stroke="#2E2A24" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M40 38 Q43 35.3 46 38" fill="none" stroke="#2B3440" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="57" cy="37.5" r="2.4" fill="#2B3440" />
      <circle cx="57.8" cy="36.7" r="0.8" fill="#FFFFFF" />
      <circle cx="39.5" cy="43.5" r="2.2" fill="#F4A8A0" fillOpacity="0.6" />
      <circle cx="60.5" cy="43.5" r="2.2" fill="#F4A8A0" fillOpacity="0.6" />
      <path d="M44.5 45 Q50 50.5 55.5 45 Z" fill="#C2685B" />
      <path d="M46 45.4 Q50 47.2 54 45.4" fill="#FFFFFF" />
    </svg>
  );
}
