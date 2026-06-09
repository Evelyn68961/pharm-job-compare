// 夜貓藥師 — night-shift pharmacist: sleepy half-closed eyes, relaxed smile,
// holding a steaming coffee mug with floating "z"s. Character art only
// (viewBox 0 0 100 100); the brand-color halo, hospital badge, and salary
// sparkle are composed on top by HospitalIcon — do not add them here.
import type { ArchetypeComponentProps } from '../types';

export function NightOwlPharmacist({ size, accentColor, secondaryColor }: ArchetypeComponentProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="夜貓藥師"
    >
      <path d="M30 60 Q50 53 70 60 L78 92 Q50 98 22 92 Z" fill="#FFFFFF" stroke="#D7DCE3" strokeWidth="1.6" />
      <path d="M50 56 L41 92 M50 56 L59 92" stroke="#D7DCE3" strokeWidth="1.4" fill="none" />
      <path d="M50 55 L44 67 L50 73 L56 67 Z" fill={accentColor || '#A5B4FC'} />

      <rect x="45" y="47" width="10" height="11" rx="3" fill="#F0BE92" />

      <path d="M20 71 Q18 68 20 65 Q22 62 20 59.5" fill="none" stroke={secondaryColor || '#C7CDD6'} strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M25 71 Q23 68 25 65 Q27 62 25 59.5" fill="none" stroke={secondaryColor || '#C7CDD6'} strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M30 77 Q36 77.5 36 81.5 Q36 85.5 30 85" fill="none" stroke="#B9A98C" strokeWidth="2.6" />
      <rect x="15" y="73" width="15" height="15" rx="2.5" fill="#EFE9DD" stroke="#B9A98C" strokeWidth="1.6" />
      <rect x="15.8" y="79" width="13.4" height="3" fill={secondaryColor || '#6366F1'} fillOpacity="0.85" />
      <ellipse cx="22.5" cy="73.6" rx="6.4" ry="1.7" fill="#5C3D2E" />
      <circle cx="33" cy="82" r="3.6" fill="#F8D2AC" />

      <circle cx="50" cy="34" r="17" fill="#F8D2AC" />
      <circle cx="33.5" cy="35" r="3.2" fill="#F0BE92" />
      <circle cx="66.5" cy="35" r="3.2" fill="#F0BE92" />

      <path d="M33 33 Q33 15 50 15 Q67 15 67 33 Q63 24 55 25 Q58 21 52 21 Q54 25 47 24 Q44 20 42 25 Q38 26 36 30 Q34 31 33 33 Z" fill="#2E2A24" />

      <path d="M39 31.5 Q43 30.5 47 31.5" fill="none" stroke="#2E2A24" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M53 31.5 Q57 30.5 61 31.5" fill="none" stroke="#2E2A24" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M39.5 37 Q43 40 46.5 37" fill="none" stroke="#2B3440" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M53.5 37 Q57 40 60.5 37" fill="none" stroke="#2B3440" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="39.5" cy="43.5" r="2.3" fill="#F4A8A0" fillOpacity="0.65" />
      <circle cx="60.5" cy="43.5" r="2.3" fill="#F4A8A0" fillOpacity="0.65" />
      <path d="M46 45.5 Q50 48.5 54 45.5" fill="none" stroke="#B06A4F" strokeWidth="1.8" strokeLinecap="round" />

      {/* Floating sleepy "z"s as stroked paths — satori (the OG image renderer)
          does not support <text> nodes, so these must stay as <path>. */}
      <path d="M23 18 H30 L23 26 H30" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-12 24 26)" />
      <path d="M16 14.5 H21.5 L16 20 H21.5" fill="none" stroke="#4F46E5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-12 18 20)" />
    </svg>
  );
}
