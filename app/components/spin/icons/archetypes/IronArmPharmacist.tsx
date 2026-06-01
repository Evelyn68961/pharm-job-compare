// 鐵腕藥師 — confident public-sector pharmacist: female with a sleek pulled-back
// bun, strong brows, holding an official seal (印章), with a 政府 shield-and-star
// pin on the lab coat. Character art only (viewBox 0 0 100 100); the brand-color
// halo, hospital badge, and salary sparkle are composed on top by HospitalIcon
// — do not add them here.
import type { ArchetypeComponentProps } from '../types';

export function IronArmPharmacist({ size }: ArchetypeComponentProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="鐵腕藥師"
    >
      <ellipse cx="50" cy="13" rx="6" ry="5.5" fill="#2E2A24" />
      <rect x="46.3" y="17.5" width="7.4" height="2.4" rx="1.2" fill="#211E18" />

      <path d="M30 60 Q50 53 70 60 L78 92 Q50 98 22 92 Z" fill="#FFFFFF" stroke="#D7DCE3" strokeWidth="1.6" />
      <path d="M50 56 L41 92 M50 56 L59 92" stroke="#D7DCE3" strokeWidth="1.4" fill="none" />
      <path d="M50 55 L44 67 L50 73 L56 67 Z" fill="#FCA5A5" />

      <rect x="45" y="47" width="10" height="11" rx="3" fill="#F0BE92" />

      <rect x="17.8" y="76" width="8.4" height="4" rx="1.4" fill="#C0392B" stroke="#8E2A22" strokeWidth="1" />
      <rect x="17.3" y="79.5" width="9.4" height="2.2" rx="1" fill="#7F1D1D" />
      <rect x="20.8" y="72.5" width="2.4" height="4" fill="#9A5E33" />
      <circle cx="22" cy="71.5" r="2.6" fill="#8A5128" />
      <circle cx="22" cy="69" r="3.4" fill="#F8D2AC" />

      <path d="M40 62.5 L44.5 64 V67.5 Q44.5 70.5 40 72 Q35.5 70.5 35.5 67.5 V64 Z" fill="#C8362F" stroke="#FBE3A1" strokeWidth="0.8" />
      <path d="M40 64.2 L40.8 66 L42.7 66 L41.1 67.2 L41.7 69 L40 67.9 L38.3 69 L38.9 67.2 L37.3 66 L39.2 66 Z" fill="#F5C84B" />

      <circle cx="50" cy="34" r="17" fill="#F8D2AC" />
      <circle cx="33.5" cy="35" r="3.2" fill="#F0BE92" />
      <circle cx="66.5" cy="35" r="3.2" fill="#F0BE92" />

      <path d="M34 35 Q34 16 50 16 Q66 16 66 35 Q63 27 56 26 Q53 27 50 27 Q47 27 44 26 Q37 27 34 35 Z" fill="#2E2A24" />

      <path d="M39 30.5 Q43 31.5 47 33" fill="none" stroke="#2E2A24" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M61 30.5 Q57 31.5 53 33" fill="none" stroke="#2E2A24" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M39.5 36.8 Q43 35.4 46.5 36.8" fill="none" stroke="#2B3440" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M53.5 36.8 Q57 35.4 60.5 36.8" fill="none" stroke="#2B3440" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="43" cy="38.4" r="2.1" fill="#2B3440" />
      <circle cx="43.8" cy="37.7" r="0.7" fill="#FFFFFF" />
      <circle cx="57" cy="38.4" r="2.1" fill="#2B3440" />
      <circle cx="57.8" cy="37.7" r="0.7" fill="#FFFFFF" />
      <circle cx="39.5" cy="43.5" r="2.1" fill="#F4A8A0" fillOpacity="0.55" />
      <circle cx="60.5" cy="43.5" r="2.1" fill="#F4A8A0" fillOpacity="0.55" />
      <path d="M45.5 45.2 Q50 48.2 54.5 45.2" fill="none" stroke="#B06A4F" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
