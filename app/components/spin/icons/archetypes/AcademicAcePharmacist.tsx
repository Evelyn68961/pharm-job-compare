// 學霸藥師 — chibi medical-center pharmacist: glasses, lab coat, clipboard,
// serious focused expression. Character art only (viewBox 0 0 100 100); the
// brand-color halo, hospital badge, and salary sparkle are composed on top by
// HospitalIcon — do not add them here.
import type { ArchetypeComponentProps } from '../types';

export function AcademicAcePharmacist({ size, accentColor, secondaryColor }: ArchetypeComponentProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="學霸藥師"
    >
      <path d="M30 60 Q50 53 70 60 L78 92 Q50 98 22 92 Z" fill="#FFFFFF" stroke="#D7DCE3" strokeWidth="1.6" />
      <path d="M50 56 L41 92 M50 56 L59 92" stroke="#D7DCE3" strokeWidth="1.4" fill="none" />
      <path d="M50 55 L44 67 L50 73 L56 67 Z" fill={accentColor || '#5EC8C2'} />

      <rect x="45" y="47" width="10" height="11" rx="3" fill="#F0BE92" />

      <circle cx="50" cy="34" r="17" fill="#F8D2AC" />
      <circle cx="33.5" cy="35" r="3.2" fill="#F0BE92" />
      <circle cx="66.5" cy="35" r="3.2" fill="#F0BE92" />

      <path d="M33 33 Q33 15 50 15 Q67 15 67 33 Q62 24 53 24 L53 30 Q49 25 44 26 Q38 28 33 33 Z" fill="#3A2E22" />

      <g stroke="#2B3440" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.3">
        <rect x="37.5" y="32.5" width="11" height="9" rx="2.5" />
        <rect x="51.5" y="32.5" width="11" height="9" rx="2.5" />
      </g>
      <line x1="48.5" y1="36.5" x2="51.5" y2="36.5" stroke="#2B3440" strokeWidth="1.8" />
      <circle cx="43" cy="37" r="1.7" fill="#2B3440" />
      <circle cx="57" cy="37" r="1.7" fill="#2B3440" />

      <line x1="38.5" y1="29" x2="47" y2="30.5" stroke="#3A2E22" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="61.5" y1="29" x2="53" y2="30.5" stroke="#3A2E22" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="46" y1="46" x2="54" y2="46" stroke="#B06A4F" strokeWidth="1.8" strokeLinecap="round" />

      <g transform="rotate(-9 26 76)">
        <rect x="15" y="63" width="22" height="27" rx="2" fill="#F4F1EA" stroke={secondaryColor || '#9AA1AB'} strokeOpacity="0.55" strokeWidth="1.6" />
        <rect x="22" y="60" width="8" height="5" rx="1.5" fill={secondaryColor || '#9AA1AB'} fillOpacity="0.85" />
        <line x1="19" y1="71" x2="33" y2="71" stroke="#C2C7CF" strokeWidth="1.4" />
        <line x1="19" y1="76" x2="33" y2="76" stroke="#C2C7CF" strokeWidth="1.4" />
        <line x1="19" y1="81" x2="29" y2="81" stroke="#C2C7CF" strokeWidth="1.4" />
      </g>
      <circle cx="36" cy="83" r="4" fill="#F8D2AC" />
    </svg>
  );
}
