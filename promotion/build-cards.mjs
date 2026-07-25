// Card generator for the Threads idol series (SVG composition — no AI).
//
// Implements the doc's "card-scene renderer": real archetype character SVG at
// 1:1 fidelity + flat scene shapes + baked Traditional-Chinese copy, at
// 1080×1350 (4:5). Text lives in a <g id="text-overlay"> so it can be deleted
// to hand clean art to Canva/Figma.
//
// Run:  node promotion/build-cards.mjs
// Out:  promotion/post-01-yemao/card-1..5.svg  +  index.html (preview + PNG)
//
// Add more posts by registering a character + 5 scene fns and calling build().
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const W = 1080;
const H = 1350;
const FONT = "'Noto Sans TC','PingFang TC','Microsoft JhengHei',system-ui,sans-serif";

// ── Characters ──────────────────────────────────────────────────────────────
// Inner markup copied verbatim from the real archetype components (camelCase →
// kebab-case for raw SVG; accent/secondary colours resolved). viewBox 0 0 100
// 100. This is the ONLY place character art lives — no redrawing per card.
const YEMAO_ACCENT = '#8b5cf6';
const YEMAO_SECONDARY = '#c4b5fd';
const YEMAO = `
  <path d="M30 60 Q50 53 70 60 L78 92 Q50 98 22 92 Z" fill="#FFFFFF" stroke="#D7DCE3" stroke-width="1.6"/>
  <path d="M50 56 L41 92 M50 56 L59 92" stroke="#D7DCE3" stroke-width="1.4" fill="none"/>
  <path d="M50 55 L44 67 L50 73 L56 67 Z" fill="${YEMAO_ACCENT}"/>
  <rect x="45" y="47" width="10" height="11" rx="3" fill="#F0BE92"/>
  <path d="M20 71 Q18 68 20 65 Q22 62 20 59.5" fill="none" stroke="${YEMAO_SECONDARY}" stroke-opacity="0.55" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M25 71 Q23 68 25 65 Q27 62 25 59.5" fill="none" stroke="${YEMAO_SECONDARY}" stroke-opacity="0.55" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M30 77 Q36 77.5 36 81.5 Q36 85.5 30 85" fill="none" stroke="#B9A98C" stroke-width="2.6"/>
  <rect x="15" y="73" width="15" height="15" rx="2.5" fill="#EFE9DD" stroke="#B9A98C" stroke-width="1.6"/>
  <rect x="15.8" y="79" width="13.4" height="3" fill="${YEMAO_SECONDARY}" fill-opacity="0.85"/>
  <ellipse cx="22.5" cy="73.6" rx="6.4" ry="1.7" fill="#5C3D2E"/>
  <circle cx="33" cy="82" r="3.6" fill="#F8D2AC"/>
  <circle cx="50" cy="34" r="17" fill="#F8D2AC"/>
  <circle cx="33.5" cy="35" r="3.2" fill="#F0BE92"/>
  <circle cx="66.5" cy="35" r="3.2" fill="#F0BE92"/>
  <path d="M33 33 Q33 15 50 15 Q67 15 67 33 Q63 24 55 25 Q58 21 52 21 Q54 25 47 24 Q44 20 42 25 Q38 26 36 30 Q34 31 33 33 Z" fill="#2E2A24"/>
  <path d="M39 31.5 Q43 30.5 47 31.5" fill="none" stroke="#2E2A24" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M53 31.5 Q57 30.5 61 31.5" fill="none" stroke="#2E2A24" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M39.5 37 Q43 40 46.5 37" fill="none" stroke="#2B3440" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M53.5 37 Q57 40 60.5 37" fill="none" stroke="#2B3440" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="39.5" cy="43.5" r="2.3" fill="#F4A8A0" fill-opacity="0.65"/>
  <circle cx="60.5" cy="43.5" r="2.3" fill="#F4A8A0" fill-opacity="0.65"/>
  <path d="M46 45.5 Q50 48.5 54 45.5" fill="none" stroke="#B06A4F" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M23 18 H30 L23 26 H30" fill="none" stroke="#4F46E5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-12 24 26)"/>
  <path d="M16 14.5 H21.5 L16 20 H21.5" fill="none" stroke="#4F46E5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-12 18 20)"/>
`;

// 佛系藥師 — accent #10b981 (emerald), secondary #6ee7b7. Open dot-eyes, long
// hair with green side ribbons, pill bottle. Verbatim from ZenPharmacist.tsx.
const ZEN = `
  <path d="M30 51 Q29 16 50 14 Q71 16 70 51 Q70 56 66 60 Q67 48 65 41 Q58 31 50 31 Q42 31 35 41 Q33 48 34 60 Q30 56 30 51 Z" fill="#3A2A1C"/>
  <path d="M30 60 Q50 53 70 60 L78 92 Q50 98 22 92 Z" fill="#FFFFFF" stroke="#D7DCE3" stroke-width="1.6"/>
  <path d="M50 56 L41 92 M50 56 L59 92" stroke="#D7DCE3" stroke-width="1.4" fill="none"/>
  <path d="M50 55 L44 67 L50 73 L56 67 Z" fill="#10b981"/>
  <rect x="45" y="47" width="10" height="11" rx="3" fill="#F0BE92"/>
  <rect x="18.5" y="70" width="11" height="4.5" rx="1.5" fill="#6ee7b7" fill-opacity="0.85"/>
  <rect x="17.5" y="74" width="13" height="14" rx="2" fill="#FFFFFF" stroke="#C7CDD6" stroke-width="1.6"/>
  <rect x="19" y="78" width="10" height="7" rx="1" fill="#6ee7b7" fill-opacity="0.55"/>
  <rect x="23.2" y="79.5" width="1.6" height="4" fill="#6ee7b7" fill-opacity="0.85"/>
  <rect x="21.8" y="80.7" width="4.4" height="1.6" fill="#6ee7b7" fill-opacity="0.85"/>
  <circle cx="31" cy="80" r="3.6" fill="#F8D2AC"/>
  <circle cx="50" cy="34" r="17" fill="#F8D2AC"/>
  <circle cx="33.5" cy="35" r="3.2" fill="#F0BE92"/>
  <circle cx="66.5" cy="35" r="3.2" fill="#F0BE92"/>
  <path d="M34 34 Q34 17 50 16 Q66 17 66 34 Q61 25 53 25 Q56 21 49 21 Q42 22 40 27 Q37 28 34 34 Z" fill="#3A2A1C"/>
  <path d="M32 51.5 C30.5 49 27.5 49.5 29 52 C27.5 54.5 30.5 55 32 52.5 Z" fill="#10b981" fill-opacity="0.85"/>
  <path d="M32 51.5 C33.5 49 36.5 49.5 35 52 C36.5 54.5 33.5 55 32 52.5 Z" fill="#10b981" fill-opacity="0.85"/>
  <path d="M31.5 53 Q30 55 31 56.5" stroke="#10b981" stroke-opacity="0.85" stroke-width="0.8" fill="none" stroke-linecap="round"/>
  <path d="M32.5 53 Q34 55 33 56.5" stroke="#10b981" stroke-opacity="0.85" stroke-width="0.8" fill="none" stroke-linecap="round"/>
  <circle cx="32" cy="52" r="0.75" fill="#10b981" fill-opacity="0.85"/>
  <path d="M68 51.5 C66.5 49 63.5 49.5 65 52 C63.5 54.5 66.5 55 68 52.5 Z" fill="#10b981" fill-opacity="0.85"/>
  <path d="M68 51.5 C69.5 49 72.5 49.5 71 52 C72.5 54.5 69.5 55 68 52.5 Z" fill="#10b981" fill-opacity="0.85"/>
  <path d="M67.5 53 Q66 55 67 56.5" stroke="#10b981" stroke-opacity="0.85" stroke-width="0.8" fill="none" stroke-linecap="round"/>
  <path d="M68.5 53 Q70 55 69 56.5" stroke="#10b981" stroke-opacity="0.85" stroke-width="0.8" fill="none" stroke-linecap="round"/>
  <circle cx="68" cy="52" r="0.75" fill="#10b981" fill-opacity="0.85"/>
  <path d="M39 31 Q43 29.8 47 31" fill="none" stroke="#3A2A1C" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M53 31 Q57 29.8 61 31" fill="none" stroke="#3A2A1C" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M39.5 37 Q43 35.3 46.5 37" fill="none" stroke="#2B3440" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M53.5 37 Q57 35.3 60.5 37" fill="none" stroke="#2B3440" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="43" cy="39" r="2.1" fill="#2B3440"/>
  <circle cx="43.8" cy="38.3" r="0.7" fill="#FFFFFF"/>
  <circle cx="57" cy="39" r="2.1" fill="#2B3440"/>
  <circle cx="57.8" cy="38.3" r="0.7" fill="#FFFFFF"/>
  <path d="M46.8 36.9 L48 36.2 M53.2 36.9 L52 36.2" stroke="#2B3440" stroke-width="0.6" stroke-linecap="round"/>
  <circle cx="39.5" cy="43.5" r="2.3" fill="#F4A8A0" fill-opacity="0.65"/>
  <circle cx="60.5" cy="43.5" r="2.3" fill="#F4A8A0" fill-opacity="0.65"/>
  <path d="M46.5 45.5 Q50 47.8 53.5 45.5" fill="none" stroke="#B06A4F" stroke-width="1.8" stroke-linecap="round"/>
`;

// 金牛藥師 — accent #ca8a04 (gold), secondary #E8B11E. Winking grin, holding a
// gold 元寶 (ingot). Verbatim from JinniuPharmacist.tsx (collar = accent, 元寶 =
// secondary).
const JINNIU_ACCENT = '#ca8a04';
const JINNIU_SECONDARY = '#E8B11E';
const JINNIU = `
  <path d="M30 60 Q50 53 70 60 L78 92 Q50 98 22 92 Z" fill="#FFFFFF" stroke="#D7DCE3" stroke-width="1.6"/>
  <path d="M50 56 L41 92 M50 56 L59 92" stroke="#D7DCE3" stroke-width="1.4" fill="none"/>
  <path d="M50 55 L44 67 L50 73 L56 67 Z" fill="${JINNIU_ACCENT}"/>
  <rect x="45" y="47" width="10" height="11" rx="3" fill="#F0BE92"/>
  <path d="M14 87 Q13 80 19 79 Q25 78 31 79 Q37 80 36 87 Q25 91 14 87 Z" fill="${JINNIU_SECONDARY}" stroke="#B8860B" stroke-width="1.2"/>
  <ellipse cx="25" cy="79.5" rx="7" ry="2.2" fill="#C8941A"/>
  <ellipse cx="25" cy="77" rx="3.6" ry="2.4" fill="${JINNIU_SECONDARY}" stroke="#B8860B" stroke-width="0.8"/>
  <ellipse cx="20.5" cy="84.5" rx="2.2" ry="1" fill="#F7DD86" fill-opacity="0.85"/>
  <circle cx="34" cy="84" r="3.8" fill="#F8D2AC"/>
  <circle cx="33.5" cy="35" r="3.2" fill="#F0BE92"/>
  <circle cx="66.5" cy="35" r="3.2" fill="#F0BE92"/>
  <circle cx="50" cy="34" r="17" fill="#F8D2AC"/>
  <path d="M33 33 Q33 15 50 15 Q67 15 67 33 Q63 24 55 25 Q58 21 50 22 Q44 22 41 26 Q37 28 33 33 Z" fill="#2E2A24"/>
  <path d="M39 30.5 Q43 28.8 47 30.5" fill="none" stroke="#2E2A24" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M53 30.5 Q57 28.8 61 30.5" fill="none" stroke="#2E2A24" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M40 38 Q43 35.3 46 38" fill="none" stroke="#2B3440" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="57" cy="37.5" r="2.4" fill="#2B3440"/>
  <circle cx="57.8" cy="36.7" r="0.8" fill="#FFFFFF"/>
  <circle cx="39.5" cy="43.5" r="2.2" fill="#F4A8A0" fill-opacity="0.6"/>
  <circle cx="60.5" cy="43.5" r="2.2" fill="#F4A8A0" fill-opacity="0.6"/>
  <path d="M44.5 45 Q50 50.5 55.5 45 Z" fill="#C2685B"/>
  <path d="M46 45.4 Q50 47.2 54 45.4" fill="#FFFFFF"/>
`;

// 鐵腕藥師 — accent #dc2626 (red), secondary #9A5E33 (seal-handle wood). Female
// with a pulled-back bun, holding an official seal (印章), 政府 shield-star pin on
// the coat. Adapted from IronArmPharmacist.tsx — ears drawn BEHIND the head.
const IRONARM_ACCENT = '#dc2626';
const IRONARM_SECONDARY = '#9A5E33';
const IRONARM = `
  <ellipse cx="50" cy="13" rx="6" ry="5.5" fill="#2E2A24"/>
  <rect x="46.3" y="17.5" width="7.4" height="2.4" rx="1.2" fill="#211E18"/>
  <path d="M30 60 Q50 53 70 60 L78 92 Q50 98 22 92 Z" fill="#FFFFFF" stroke="#D7DCE3" stroke-width="1.6"/>
  <path d="M50 56 L41 92 M50 56 L59 92" stroke="#D7DCE3" stroke-width="1.4" fill="none"/>
  <path d="M50 55 L44 67 L50 73 L56 67 Z" fill="${IRONARM_ACCENT}"/>
  <rect x="45" y="47" width="10" height="11" rx="3" fill="#F0BE92"/>
  <rect x="17.8" y="76" width="8.4" height="4" rx="1.4" fill="#C0392B" stroke="#8E2A22" stroke-width="1"/>
  <rect x="17.3" y="79.5" width="9.4" height="2.2" rx="1" fill="#7F1D1D"/>
  <rect x="20.8" y="72.5" width="2.4" height="4" fill="${IRONARM_SECONDARY}" fill-opacity="0.55"/>
  <circle cx="22" cy="71.5" r="2.6" fill="${IRONARM_SECONDARY}" fill-opacity="0.85"/>
  <circle cx="22" cy="69" r="3.4" fill="#F8D2AC"/>
  <path d="M40 62.5 L44.5 64 V67.5 Q44.5 70.5 40 72 Q35.5 70.5 35.5 67.5 V64 Z" fill="#C8362F" stroke="#FBE3A1" stroke-width="0.8"/>
  <path d="M40 64.2 L40.8 66 L42.7 66 L41.1 67.2 L41.7 69 L40 67.9 L38.3 69 L38.9 67.2 L37.3 66 L39.2 66 Z" fill="#F5C84B"/>
  <circle cx="33.5" cy="35" r="3.2" fill="#F0BE92"/>
  <circle cx="66.5" cy="35" r="3.2" fill="#F0BE92"/>
  <circle cx="50" cy="34" r="17" fill="#F8D2AC"/>
  <path d="M34 35 Q34 16 50 16 Q66 16 66 35 Q63 27 56 26 Q53 27 50 27 Q47 27 44 26 Q37 27 34 35 Z" fill="#2E2A24"/>
  <path d="M39 30.5 Q43 31.5 47 33" fill="none" stroke="#2E2A24" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M61 30.5 Q57 31.5 53 33" fill="none" stroke="#2E2A24" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M39.5 36.8 Q43 35.4 46.5 36.8" fill="none" stroke="#2B3440" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M53.5 36.8 Q57 35.4 60.5 36.8" fill="none" stroke="#2B3440" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="43" cy="38.4" r="2.1" fill="#2B3440"/>
  <circle cx="43.8" cy="37.7" r="0.7" fill="#FFFFFF"/>
  <circle cx="57" cy="38.4" r="2.1" fill="#2B3440"/>
  <circle cx="57.8" cy="37.7" r="0.7" fill="#FFFFFF"/>
  <circle cx="39.5" cy="43.5" r="2.1" fill="#F4A8A0" fill-opacity="0.55"/>
  <circle cx="60.5" cy="43.5" r="2.1" fill="#F4A8A0" fill-opacity="0.55"/>
  <path d="M45.5 45.2 Q50 48.2 54.5 45.2" fill="none" stroke="#B06A4F" stroke-width="1.8" stroke-linecap="round"/>
`;

// 學霸藥師 — accent #0e7490 (deep teal), secondary #9AA1AB (clipboard grey).
// Glasses, focused brows, holding a clipboard. Adapted from
// AcademicAcePharmacist.tsx — ears drawn behind the head.
const ACE_ACCENT = '#0e7490';
const ACE_SECONDARY = '#9AA1AB';
const ACE = `
  <path d="M30 60 Q50 53 70 60 L78 92 Q50 98 22 92 Z" fill="#FFFFFF" stroke="#D7DCE3" stroke-width="1.6"/>
  <path d="M50 56 L41 92 M50 56 L59 92" stroke="#D7DCE3" stroke-width="1.4" fill="none"/>
  <path d="M50 55 L44 67 L50 73 L56 67 Z" fill="${ACE_ACCENT}"/>
  <rect x="45" y="47" width="10" height="11" rx="3" fill="#F0BE92"/>
  <circle cx="33.5" cy="35" r="3.2" fill="#F0BE92"/>
  <circle cx="66.5" cy="35" r="3.2" fill="#F0BE92"/>
  <circle cx="50" cy="34" r="17" fill="#F8D2AC"/>
  <path d="M33 33 Q33 15 50 15 Q67 15 67 33 Q62 24 53 24 L53 30 Q49 25 44 26 Q38 28 33 33 Z" fill="#3A2E22"/>
  <g stroke="#2B3440" stroke-width="1.8" fill="#FFFFFF" fill-opacity="0.3">
    <rect x="37.5" y="32.5" width="11" height="9" rx="2.5"/>
    <rect x="51.5" y="32.5" width="11" height="9" rx="2.5"/>
  </g>
  <line x1="48.5" y1="36.5" x2="51.5" y2="36.5" stroke="#2B3440" stroke-width="1.8"/>
  <circle cx="43" cy="37" r="1.7" fill="#2B3440"/>
  <circle cx="57" cy="37" r="1.7" fill="#2B3440"/>
  <line x1="38.5" y1="29" x2="47" y2="30.5" stroke="#3A2E22" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="61.5" y1="29" x2="53" y2="30.5" stroke="#3A2E22" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="46" y1="46" x2="54" y2="46" stroke="#B06A4F" stroke-width="1.8" stroke-linecap="round"/>
  <g transform="rotate(-9 26 76)">
    <rect x="15" y="63" width="22" height="27" rx="2" fill="#F4F1EA" stroke="${ACE_SECONDARY}" stroke-opacity="0.55" stroke-width="1.6"/>
    <rect x="22" y="60" width="8" height="5" rx="1.5" fill="${ACE_SECONDARY}" fill-opacity="0.85"/>
    <line x1="19" y1="71" x2="33" y2="71" stroke="#C2C7CF" stroke-width="1.4"/>
    <line x1="19" y1="76" x2="33" y2="76" stroke="#C2C7CF" stroke-width="1.4"/>
    <line x1="19" y1="81" x2="29" y2="81" stroke="#C2C7CF" stroke-width="1.4"/>
  </g>
  <circle cx="36" cy="83" r="4" fill="#F8D2AC"/>
`;

// 北漂藥師 — accent #2563eb (blue), secondary #B5703B (suitcase brown). Open
// smile, no glasses, holding a suitcase. Adapted from BeipiaoPharmacist.tsx —
// ears drawn behind the head.
const BEIPIAO_ACCENT = '#2563eb';
const BEIPIAO_SECONDARY = '#B5703B';
const BEIPIAO = `
  <path d="M30 60 Q50 53 70 60 L78 92 Q50 98 22 92 Z" fill="#FFFFFF" stroke="#D7DCE3" stroke-width="1.6"/>
  <path d="M50 56 L41 92 M50 56 L59 92" stroke="#D7DCE3" stroke-width="1.4" fill="none"/>
  <path d="M50 55 L44 67 L50 73 L56 67 Z" fill="${BEIPIAO_ACCENT}"/>
  <rect x="45" y="47" width="10" height="11" rx="3" fill="#F0BE92"/>
  <circle cx="33.5" cy="35" r="3.2" fill="#F0BE92"/>
  <circle cx="66.5" cy="35" r="3.2" fill="#F0BE92"/>
  <circle cx="50" cy="34" r="17" fill="#F8D2AC"/>
  <path d="M33 33 Q33 15 50 15 Q67 15 67 33 Q63 25 55 24 Q57 20 51 19 Q52 24 46 24 Q39 25 33 33 Z" fill="#4A372A"/>
  <path d="M39 35 Q43 31 47 35" fill="none" stroke="#2B3440" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M53 35 Q57 31 61 35" fill="none" stroke="#2B3440" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="40" cy="42" r="2.4" fill="#F4A8A0" fill-opacity="0.7"/>
  <circle cx="60" cy="42" r="2.4" fill="#F4A8A0" fill-opacity="0.7"/>
  <path d="M44 44 Q50 50 56 44" fill="none" stroke="#B06A4F" stroke-width="1.8" stroke-linecap="round"/>
  <g transform="rotate(-6 25 80)">
    <rect x="14" y="72" width="24" height="18" rx="2.5" fill="${BEIPIAO_SECONDARY}" fill-opacity="0.55" stroke="${BEIPIAO_SECONDARY}" stroke-opacity="0.85" stroke-width="1.6"/>
    <line x1="14" y1="80" x2="38" y2="80" stroke="${BEIPIAO_SECONDARY}" stroke-opacity="0.85" stroke-width="1.4"/>
    <rect x="22" y="76" width="8" height="3" rx="1" fill="${BEIPIAO_SECONDARY}" fill-opacity="0.85"/>
    <path d="M22 72 Q22 67 26 67 L26 67 Q30 67 30 72" fill="none" stroke="${BEIPIAO_SECONDARY}" stroke-opacity="0.85" stroke-width="1.8"/>
  </g>
  <circle cx="26" cy="66" r="3.8" fill="#F8D2AC"/>
`;

// ── Theme ────────────────────────────────────────────────────────────────────
// Per-post palette. `accent` = idol colour (brand mark, pills, chips, icons);
// `hint` = soft swipe-hint tint; `deep` = darker accent for sub-copy text.
// Set `TH` before generating each post's cards.
const THEMES = {
  yemao: { accent: '#8b5cf6', hint: '#a78bda', deep: '#6b21a8' },
  // Deeper emerald so headline/button/chips read strongly on the cream bg
  // (the character art keeps its real #10b981 brand colour).
  foxi: { accent: '#059669', hint: '#34d399', deep: '#065f46' },
  // Gold for 金牛 (money). Brand gold reads on the cream bg; deep brown-gold
  // sub-copy (the character keeps its own #ca8a04/#E8B11E art colours).
  jinniu: { accent: '#ca8a04', hint: '#eab308', deep: '#854d0e' },
  // Iron/red for 鐵腕 (public-sector 鐵飯碗). Strong red reads on the cream bg;
  // deep maroon sub-copy.
  iron: { accent: '#dc2626', hint: '#f87171', deep: '#991b1b' },
  // Deep teal for 學霸 (醫學中心 prestige). Distinct from 佛系 emerald and
  // 北漂 blue; reads on the cream bg.
  ace: { accent: '#0e7490', hint: '#22d3ee', deep: '#155e75' },
  // Blue for 北漂 (relocation). Distinct from 學霸 teal; reads on the cream bg.
  beipiao: { accent: '#2563eb', hint: '#60a5fa', deep: '#1e40af' },
  // Neutral slate for comparison-card furniture (the duotone lives in the
  // panels/characters, so the brand mark / counter stay neutral).
  cmp: { accent: '#475569', hint: '#94a3b8', deep: '#334155' },
};
let TH = THEMES.yemao;

// Idol → character art + theme (extend as more characters are drawn).
const CHAR_OF = { 夜貓: YEMAO, 佛系: ZEN, 金牛: JINNIU, 鐵腕: IRONARM, 學霸: ACE, 北漂: BEIPIAO };
const THEME_OF = { 夜貓: THEMES.yemao, 佛系: THEMES.foxi, 金牛: THEMES.jinniu, 鐵腕: THEMES.iron, 學霸: THEMES.ace, 北漂: THEMES.beipiao };

// ── Primitives ──────────────────────────────────────────────────────────────
const A = YEMAO_ACCENT;

function haloDefs(id, color) {
  return `<radialGradient id="${id}" cx="50%" cy="50%" r="50%">`
    + `<stop offset="0%" stop-color="${color}" stop-opacity="0.5"/>`
    + `<stop offset="60%" stop-color="${color}" stop-opacity="0.16"/>`
    + `<stop offset="100%" stop-color="${color}" stop-opacity="0"/></radialGradient>`;
}

// Place the character (100-unit art) at (x,y) scaled by s, optional halo behind
// and an optional soft ground shadow (grounds "floating" characters on cards
// without a desk/scene anchor).
function character(inner, x, y, s, { halo = true, haloId = 'h', shadow = false } = {}) {
  const box = 100 * s;
  // Coat bottom in art space is ~(50, 86); place the shadow oval there.
  const shadowLayer = shadow
    ? `<ellipse cx="${(x + 50 * s).toFixed(1)}" cy="${(y + 87 * s).toFixed(1)}" rx="${(27 * s).toFixed(1)}" ry="${(5.5 * s).toFixed(1)}" fill="#0f172a" opacity="0.07"/>`
    : '';
  const haloLayer = halo
    ? `<circle cx="${x + box / 2}" cy="${y + box / 2}" r="${box * 0.62}" fill="url(#${haloId})"/>`
    : '';
  // 86% inset so the halo rings the character, matching ArchetypeAvatar.
  const inset = box * 0.07;
  return `${shadowLayer}${haloLayer}<g transform="translate(${x + inset} ${y + inset}) scale(${s * 0.86})">${inner}</g>`;
}

function pill(x, y, rot, s, color = '#000', op = 0.05) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" opacity="${op}">`
    + `<rect x="-40" y="-16" width="80" height="32" rx="16" fill="${color}"/>`
    + `<line x1="0" y1="-16" x2="0" y2="16" stroke="#fff" stroke-width="4"/></g>`;
}

function text(x, y, s, str, { fill = '#1f2937', weight = 700, anchor = 'start', spacing = 0 } = {}) {
  const ls = spacing ? ` letter-spacing="${spacing}"` : '';
  return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${s}" font-weight="${weight}" `
    + `fill="${fill}" text-anchor="${anchor}"${ls}>${str}</text>`;
}

function chip(x, y, label, { bg = TH.accent, fg = '#fff' } = {}) {
  const w = label.length * 40 + 56;
  return `<rect x="${x}" y="${y}" width="${w}" height="60" rx="30" fill="${bg}"/>`
    + text(x + w / 2, y + 41, 34, label, { fill: fg, weight: 800, anchor: 'middle' });
}

// Furniture shared by every card.
function furniture(n, total, { swipe = true } = {}) {
  const brand = text(60, 74, 34, '藥師命運轉盤', { fill: TH.accent, weight: 800 });
  const counter = text(W - 60, 74, 32, `${n} / ${total}`, { fill: '#94a3b8', weight: 700, anchor: 'end' });
  const hint = swipe ? text(W - 60, H - 54, 34, '滑 →', { fill: TH.hint, weight: 800, anchor: 'end' }) : '';
  return brand + counter + hint;
}

function frame(bodyDefs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none">`
    + `<defs>`
    + `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">`
    + `<stop offset="0%" stop-color="#fff7ed"/><stop offset="50%" stop-color="#fdf2f8"/>`
    + `<stop offset="100%" stop-color="#eef2ff"/></linearGradient>`
    + bodyDefs + `</defs>`
    + `<rect width="${W}" height="${H}" fill="url(#bg)"/>`
    // Texture pills kept clear of the top-right corner so the page counter
    // reads cleanly (no stray mark competing with "n / 5").
    + pill(150, 260, -12, 2.2, TH.accent) + pill(170, 780, 8, 1.7, TH.accent)
    + pill(900, 580, 14, 1.8, TH.accent) + pill(180, 1190, 10, 1.6, TH.accent)
    + body
    + `</svg>`;
}

// ── Flat scene icons (on-model with the sticker aesthetic) ──────────────────
function iconCoin(cx, cy, r = 40) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fbbf24" stroke="#d97706" stroke-width="4"/>`
    + `<circle cx="${cx}" cy="${cy}" r="${r - 10}" fill="none" stroke="#d97706" stroke-width="2.5" stroke-opacity="0.5"/>`
    + text(cx, cy + 15, 42, '$', { fill: '#92400e', weight: 800, anchor: 'middle' });
}
function iconShift(cx, cy, r = 40) {
  // two arrows chasing in a circle (rotating shift)
  const c = TH.accent;
  return `<g transform="translate(${cx} ${cy})" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round">`
    + `<path d="M ${-r} 0 A ${r} ${r} 0 0 1 ${r * 0.4} ${-r * 0.9}"/>`
    + `<path d="M ${r} 0 A ${r} ${r} 0 0 1 ${-r * 0.4} ${r * 0.9}"/>`
    + `</g>`
    + `<path d="M ${cx + r * 0.4} ${cy - r * 0.9} l 14 -4 l -10 16 z" fill="${c}"/>`
    + `<path d="M ${cx - r * 0.4} ${cy + r * 0.9} l -14 4 l 10 -16 z" fill="${c}"/>`;
}
function iconMoonSlash(cx, cy, r = 40) {
  // crescent (accent) with a red diagonal slash = "no night shift"
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${TH.accent}"/>`
    + `<circle cx="${cx + r * 0.35}" cy="${cy - r * 0.15}" r="${r * 0.85}" fill="#ffffff"/>`
    + `<line x1="${cx - r}" y1="${cy + r}" x2="${cx + r}" y2="${cy - r}" stroke="#ef4444" stroke-width="8" stroke-linecap="round"/>`;
}
function iconClock5(cx, cy, r = 40) {
  // wall clock reading 5:00 — hour hand to 5 o'clock, minute hand to 12
  const c = TH.accent;
  const hx = cx + Math.cos((60 * Math.PI) / 180) * (r * 0.5);
  const hy = cy + Math.sin((60 * Math.PI) / 180) * (r * 0.5);
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" stroke="${c}" stroke-width="5"/>`
    + `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r * 0.62}" stroke="#334155" stroke-width="5" stroke-linecap="round"/>`
    + `<line x1="${cx}" y1="${cy}" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="#334155" stroke-width="5" stroke-linecap="round"/>`
    + `<circle cx="${cx}" cy="${cy}" r="4" fill="#334155"/>`;
}
function iconCheck(cx, cy, r = 40) {
  // simple, single, dependable — a check disc
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${TH.accent}"/>`
    + `<path d="M ${cx - r * 0.42} ${cy + r * 0.02} l ${r * 0.28} ${r * 0.32} l ${r * 0.6} ${-r * 0.62}" `
    + `fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function iconChart(cx, cy, r = 40) {
  // rising bar chart = salary tier climbing
  const c = TH.accent, base = cy + r * 0.62, bw = r * 0.4, gap = r * 0.2;
  const hs = [r * 0.5, r * 0.85, r * 1.25];
  const bars = hs.map((h, i) => {
    const x = cx - r * 0.72 + i * (bw + gap);
    return `<rect x="${x.toFixed(1)}" y="${(base - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="${c}"/>`;
  }).join('');
  return bars;
}
function iconCoinStack(cx, cy, r = 40) {
  // three stacked coins = allowances piling up
  let g = '';
  for (let i = 0; i < 3; i++) {
    const y = cy + r * 0.5 - i * (r * 0.42);
    g += `<ellipse cx="${cx}" cy="${y.toFixed(1)}" rx="${(r * 0.9).toFixed(1)}" ry="${(r * 0.34).toFixed(1)}" fill="#fbbf24" stroke="#d97706" stroke-width="3"/>`;
  }
  return g;
}
function starPts(cx, cy, R) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const ang = ((-90 + i * 36) * Math.PI) / 180;
    const rad = i % 2 === 0 ? R : R * 0.42;
    d += (i === 0 ? 'M' : 'L') + (cx + rad * Math.cos(ang)).toFixed(1) + ' ' + (cy + rad * Math.sin(ang)).toFixed(1) + ' ';
  }
  return d + 'Z';
}
function iconShield(cx, cy, r = 40) {
  // shield + star = 保障 / 退休制度 (mirrors 鐵腕's badge)
  const c = TH.accent, top = cy - r * 0.92;
  const rx = (r * 0.72).toFixed(1), mid = (top + r * 0.32).toFixed(1);
  return `<path d="M${cx} ${top} L${(cx + r * 0.72).toFixed(1)} ${mid} V${(cy + r * 0.12).toFixed(1)} `
    + `Q${(cx + r * 0.72).toFixed(1)} ${(cy + r * 0.72).toFixed(1)} ${cx} ${(cy + r).toFixed(1)} `
    + `Q${(cx - r * 0.72).toFixed(1)} ${(cy + r * 0.72).toFixed(1)} ${(cx - r * 0.72).toFixed(1)} ${(cy + r * 0.12).toFixed(1)} V${mid} Z" fill="${c}"/>`
    + `<path d="${starPts(cx, cy - r * 0.04, r * 0.34)}" fill="#ffffff"/>`;
}
function iconBuilding(cx, cy, r = 40) {
  // columned institution = 公立/私立
  const c = TH.accent, w = r * 1.6, x0 = cx - w / 2, base = cy + r * 0.72;
  let g = `<path d="M${(cx - r * 0.9).toFixed(1)} ${(cy - r * 0.32).toFixed(1)} L${cx} ${(cy - r * 0.95).toFixed(1)} L${(cx + r * 0.9).toFixed(1)} ${(cy - r * 0.32).toFixed(1)} Z" fill="${c}"/>`;
  g += `<rect x="${x0.toFixed(1)}" y="${(cy - r * 0.32).toFixed(1)}" width="${w.toFixed(1)}" height="${(r * 0.12).toFixed(1)}" fill="${c}"/>`;
  for (let i = 0; i < 3; i++) {
    const x = x0 + r * 0.24 + i * ((w - r * 0.48 - r * 0.2) / 2);
    g += `<rect x="${x.toFixed(1)}" y="${(cy - r * 0.16).toFixed(1)}" width="${(r * 0.2).toFixed(1)}" height="${(base - (cy - r * 0.16)).toFixed(1)}" fill="${c}"/>`;
  }
  g += `<rect x="${(x0 - r * 0.1).toFixed(1)}" y="${base.toFixed(1)}" width="${(w + r * 0.2).toFixed(1)}" height="${(r * 0.14).toFixed(1)}" fill="${c}"/>`;
  return g;
}
function iconClock(cx, cy, r = 40) {
  // plain wall clock = 工時 / 輪班保障
  const c = TH.accent;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" stroke="${c}" stroke-width="5"/>`
    + `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${(cy - r * 0.6).toFixed(1)}" stroke="#334155" stroke-width="5" stroke-linecap="round"/>`
    + `<line x1="${cx}" y1="${cy}" x2="${(cx + r * 0.46).toFixed(1)}" y2="${cy}" stroke="#334155" stroke-width="5" stroke-linecap="round"/>`
    + `<circle cx="${cx}" cy="${cy}" r="4" fill="#334155"/>`;
}
function iconGradCap(cx, cy, r = 40) {
  // mortarboard + tassel = PGY / academic training
  const c = TH.accent, w = r * 1.5;
  const boardY = cy - r * 0.18;
  return `<path d="M${cx} ${(boardY - r * 0.34).toFixed(1)} L${(cx + w / 2).toFixed(1)} ${boardY.toFixed(1)} L${cx} ${(boardY + r * 0.34).toFixed(1)} L${(cx - w / 2).toFixed(1)} ${boardY.toFixed(1)} Z" fill="${c}"/>`
    + `<path d="M${(cx - r * 0.4).toFixed(1)} ${(boardY + r * 0.1).toFixed(1)} V${(cy + r * 0.5).toFixed(1)} Q${cx} ${(cy + r * 0.72).toFixed(1)} ${(cx + r * 0.4).toFixed(1)} ${(cy + r * 0.5).toFixed(1)} V${(boardY + r * 0.1).toFixed(1)}" fill="${c}" fill-opacity="0.55"/>`
    + `<line x1="${(cx + w / 2).toFixed(1)}" y1="${boardY.toFixed(1)}" x2="${(cx + w / 2).toFixed(1)}" y2="${(cy + r * 0.5).toFixed(1)}" stroke="${c}" stroke-width="3"/>`
    + `<circle cx="${(cx + w / 2).toFixed(1)}" cy="${(cy + r * 0.56).toFixed(1)}" r="4" fill="#f59e0b"/>`;
}
function iconSteps(cx, cy, r = 40) {
  // ascending staircase = 進階制度
  const c = TH.accent, u = r * 0.42, base = cy + r * 0.55, x0 = cx - r * 0.72;
  let g = '';
  for (let i = 0; i < 3; i++) {
    g += `<rect x="${(x0 + i * u).toFixed(1)}" y="${(base - (i + 1) * u).toFixed(1)}" width="${(u - 2).toFixed(1)}" height="${((i + 1) * u).toFixed(1)}" rx="2" fill="${c}" fill-opacity="${(0.45 + i * 0.22).toFixed(2)}"/>`;
  }
  return g;
}
function iconBook(cx, cy, r = 40) {
  // open book = 教學研究資源
  const c = TH.accent, w = r * 0.92, h = r * 0.66;
  return `<path d="M${cx} ${(cy - h).toFixed(1)} Q${(cx - w).toFixed(1)} ${(cy - h * 1.15).toFixed(1)} ${(cx - w).toFixed(1)} ${(cy - h * 0.4).toFixed(1)} V${(cy + h).toFixed(1)} Q${(cx - w).toFixed(1)} ${(cy + h * 0.55).toFixed(1)} ${cx} ${(cy + h * 0.7).toFixed(1)} Z" fill="${c}" fill-opacity="0.85"/>`
    + `<path d="M${cx} ${(cy - h).toFixed(1)} Q${(cx + w).toFixed(1)} ${(cy - h * 1.15).toFixed(1)} ${(cx + w).toFixed(1)} ${(cy - h * 0.4).toFixed(1)} V${(cy + h).toFixed(1)} Q${(cx + w).toFixed(1)} ${(cy + h * 0.55).toFixed(1)} ${cx} ${(cy + h * 0.7).toFixed(1)} Z" fill="${c}"/>`
    + `<line x1="${cx}" y1="${(cy - h + 5).toFixed(1)}" x2="${cx}" y2="${(cy + h * 0.6).toFixed(1)}" stroke="#ffffff" stroke-width="2"/>`;
}
function iconHouse(cx, cy, r = 40) {
  // house = 宿舍 / 租屋補助
  const c = TH.accent, w = r * 1.3, eave = cy - r * 0.1, base = cy + r * 0.7;
  return `<path d="M${(cx - w / 2 - 7).toFixed(1)} ${eave.toFixed(1)} L${cx} ${(cy - r * 0.72).toFixed(1)} L${(cx + w / 2 + 7).toFixed(1)} ${eave.toFixed(1)} Z" fill="${c}"/>`
    + `<rect x="${(cx - w / 2).toFixed(1)}" y="${eave.toFixed(1)}" width="${w.toFixed(1)}" height="${(base - eave).toFixed(1)}" fill="${c}" fill-opacity="0.72"/>`
    + `<rect x="${(cx - r * 0.17).toFixed(1)}" y="${(base - r * 0.44).toFixed(1)}" width="${(r * 0.34).toFixed(1)}" height="${(r * 0.44).toFixed(1)}" fill="#fff"/>`;
}
function iconPin(cx, cy, r = 40) {
  // map pin = 宿舍距離
  const c = TH.accent;
  return `<path d="M${cx} ${(cy + r * 0.92).toFixed(1)} Q${(cx - r * 0.74).toFixed(1)} ${(cy + r * 0.05).toFixed(1)} ${(cx - r * 0.74).toFixed(1)} ${(cy - r * 0.28).toFixed(1)} A${(r * 0.74).toFixed(1)} ${(r * 0.74).toFixed(1)} 0 1 1 ${(cx + r * 0.74).toFixed(1)} ${(cy - r * 0.28).toFixed(1)} Q${(cx + r * 0.74).toFixed(1)} ${(cy + r * 0.05).toFixed(1)} ${cx} ${(cy + r * 0.92).toFixed(1)} Z" fill="${c}"/>`
    + `<circle cx="${cx}" cy="${(cy - r * 0.28).toFixed(1)}" r="${(r * 0.26).toFixed(1)}" fill="#fff"/>`;
}
function iconStore(cx, cy, r = 40) {
  // shop with striped awning = 生活機能
  const c = TH.accent, w = r * 1.4, x0 = cx - w / 2, top = cy - r * 0.5, base = cy + r * 0.72;
  let g = `<rect x="${x0.toFixed(1)}" y="${(top + r * 0.28).toFixed(1)}" width="${w.toFixed(1)}" height="${(base - top - r * 0.28).toFixed(1)}" fill="${c}" fill-opacity="0.72"/>`;
  const stripes = 5, sw = w / stripes;
  for (let i = 0; i < stripes; i++) {
    g += `<rect x="${(x0 + i * sw).toFixed(1)}" y="${top.toFixed(1)}" width="${sw.toFixed(1)}" height="${(r * 0.28).toFixed(1)}" fill="${i % 2 ? c : '#ffffff'}"/>`;
  }
  g += `<rect x="${x0.toFixed(1)}" y="${top.toFixed(1)}" width="${w.toFixed(1)}" height="${(r * 0.28).toFixed(1)}" fill="none" stroke="${c}" stroke-width="2"/>`
    + `<rect x="${(cx - r * 0.16).toFixed(1)}" y="${(base - r * 0.5).toFixed(1)}" width="${(r * 0.32).toFixed(1)}" height="${(r * 0.5).toFixed(1)}" fill="#fff"/>`;
  return g;
}
function iconTrain(cx, cy, r = 40) {
  // front-on train = 北漂's badge motif (scene corner)
  const c = TH.accent, w = r * 1.4, h = r * 1.2, x0 = cx - w / 2, y0 = cy - h / 2;
  return `<rect x="${x0.toFixed(1)}" y="${y0.toFixed(1)}" width="${w.toFixed(1)}" height="${(h * 0.7).toFixed(1)}" rx="${(r * 0.3).toFixed(1)}" fill="${c}"/>`
    + `<rect x="${(x0 + r * 0.18).toFixed(1)}" y="${(y0 + r * 0.16).toFixed(1)}" width="${(w - r * 0.36).toFixed(1)}" height="${(r * 0.32).toFixed(1)}" rx="3" fill="#cfe3ff"/>`
    + `<rect x="${x0.toFixed(1)}" y="${(y0 + h * 0.56).toFixed(1)}" width="${w.toFixed(1)}" height="${(r * 0.14).toFixed(1)}" fill="#1e3a8a"/>`
    + `<circle cx="${(x0 + r * 0.32).toFixed(1)}" cy="${(y0 + h * 0.78).toFixed(1)}" r="${(r * 0.15).toFixed(1)}" fill="#1e3a8a"/>`
    + `<circle cx="${(x0 + w - r * 0.32).toFixed(1)}" cy="${(y0 + h * 0.78).toFixed(1)}" r="${(r * 0.15).toFixed(1)}" fill="#1e3a8a"/>`;
}

// ── 夜貓 scenes ──────────────────────────────────────────────────────────────
function yemaoCard1() {
  const defs = haloDefs('h1', A);
  // Headline pulled to the top third so the hook fires ABOVE Threads' 4:5
  // preview fold (~55–65%); character shifted down as the lower hero. The
  // name pill is dropped — the headline already names them.
  const body =
    furniture(1, 5) +
    character(YEMAO, 260, 520, 5.6, { haloId: 'h1', shadow: true }) +
    `<g id="text-overlay">` +
    text(W / 2, 300, 58, '你，也是', { anchor: 'middle', weight: 800, fill: '#334155' }) +
    text(W / 2, 420, 94, '夜貓藥師 嗎？', { anchor: 'middle', weight: 800, fill: A }) +
    `</g>`;
  return frame(defs, body);
}

function yemaoCard2() {
  const defs = haloDefs('h2', A) +
    `<radialGradient id="lamp" cx="50%" cy="50%" r="50%">` +
    `<stop offset="0%" stop-color="#fde68a" stop-opacity="0.9"/>` +
    `<stop offset="100%" stop-color="#fde68a" stop-opacity="0"/></radialGradient>`;
  // night window panel
  const scene =
    `<rect x="90" y="360" width="900" height="380" rx="28" fill="#241f4d"/>` +
    `<circle cx="850" cy="470" r="46" fill="#fde68a"/>` +
    `<circle cx="835" cy="458" r="46" fill="#241f4d"/>` +
    `<circle cx="300" cy="450" r="3" fill="#fff"/><circle cx="420" cy="500" r="2.5" fill="#fff"/>` +
    `<circle cx="560" cy="430" r="2.5" fill="#fff"/><circle cx="680" cy="540" r="3" fill="#fff"/>` +
    `<circle cx="250" cy="560" r="2" fill="#fff"/>` +
    // desk lamp glow + counter
    `<ellipse cx="470" cy="720" rx="360" ry="150" fill="url(#lamp)"/>` +
    `<rect x="70" y="740" width="940" height="26" rx="8" fill="#c8b89a"/>` +
    `<rect x="70" y="766" width="940" height="10" fill="#a89876"/>`;
  const body =
    furniture(2, 5) +
    scene +
    `<g transform="translate(90 150)">${chip(0, 0, '這就是你')}</g>` +
    character(YEMAO, 150, 420, 4.4, { haloId: 'h2' }) +
    `<g id="text-overlay">` +
    text(W / 2, 900, 56, '大夜輪到天亮，咖啡當水喝', { anchor: 'middle', weight: 800, fill: '#1f2937' }) +
    text(W / 2, 985, 56, '別人放假，你在補班', { anchor: 'middle', weight: 800, fill: '#1f2937' }) +
    text(W / 2, 1075, 40, '⋯這畫面是不是很熟悉？', { anchor: 'middle', weight: 600, fill: '#64748b' }) +
    `</g>`;
  return frame(defs, body);
}

function yemaoCard3() {
  const defs = haloDefs('h3', A);
  const tile = (y, icon, label) =>
    `<rect x="540" y="${y}" width="470" height="150" rx="24" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"/>` +
    icon(620, y + 75) +
    text(700, y + 92, 46, label, { weight: 800, fill: '#1f2937' });
  // Instruction line sits ABOVE the three tiles on the right, so its 👇 points
  // straight at them (and it fills the previously-empty right-top, balancing
  // the character on the left).
  const body =
    furniture(3, 5) +
    `<g transform="translate(70 150)">${chip(0, 0, '你該在意的')}</g>` +
    character(YEMAO, 70, 500, 4.6, { haloId: 'h3', shadow: true }) +
    tile(440, iconCoin, '夜班津貼') +
    tile(620, iconShift, '能否包大夜') +
    tile(800, iconMoonSlash, '有無「無大夜」') +
    `<g id="text-overlay">` +
    text(540, 400, 42, '面試前，先問這三件 👇', { weight: 800, fill: '#334155' }) +
    `</g>`;
  return frame(defs, body);
}

function yemaoCard4() {
  const defs = haloDefs('h4', A) +
    `<radialGradient id="wheelglow" cx="50%" cy="50%" r="50%">` +
    `<stop offset="0%" stop-color="${A}" stop-opacity="0.35"/>` +
    `<stop offset="100%" stop-color="${A}" stop-opacity="0"/></radialGradient>`;
  const cx = 700, cy = 600, r = 210;
  const polar = (deg, rad) => [cx + rad * Math.cos((deg * Math.PI) / 180), cy + rad * Math.sin((deg * Math.PI) / 180)];
  const slices = [];
  const shades = ['#ede9fe', '#ddd6fe'];
  for (let i = 0; i < 8; i++) {
    const a0 = i * 45, a1 = a0 + 45;
    const [x0, y0] = polar(a0, r);
    const [x1, y1] = polar(a1, r);
    slices.push(`<path d="M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${shades[i % 2]}"/>`);
  }
  const marks = [];
  for (let i = 0; i < 8; i++) {
    const [mx, my] = polar(i * 45 + 22.5, r * 0.72);
    marks.push(`<g transform="translate(${mx.toFixed(1)} ${my.toFixed(1)})">`
      + `<rect x="-18" y="-18" width="36" height="36" rx="7" fill="#fff" stroke="#c4b5fd" stroke-width="2"/>`
      + `<rect x="-3" y="-11" width="6" height="22" fill="#ef4444"/><rect x="-11" y="-3" width="22" height="6" fill="#ef4444"/></g>`);
  }
  const wheel =
    `<circle cx="${cx}" cy="${cy}" r="${r + 60}" fill="url(#wheelglow)"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="#fff"/>` +
    slices.join('') +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${A}" stroke-width="8"/>` +
    marks.join('') +
    `<circle cx="${cx}" cy="${cy}" r="42" fill="${A}"/>` +
    `<rect x="${cx - 9}" y="${cy - 26}" width="18" height="52" rx="9" fill="#fff"/>` +
    `<line x1="${cx - 9}" y1="${cy}" x2="${cx + 9}" y2="${cy}" stroke="${A}" stroke-width="4"/>` +
    // pointer
    `<path d="M${cx + r + 18} ${cy} l 34 -20 l 0 40 z" fill="#f59e0b"/>`;
  const body =
    furniture(4, 5) +
    `<g transform="translate(70 150)">${chip(0, 0, '命運醫院')}</g>` +
    wheel +
    character(YEMAO, 90, 690, 3.4, { haloId: 'h4' }) +
    `<g id="text-overlay">` +
    text(W / 2, 1035, 60, '你的命運醫院是哪間？', { anchor: 'middle', weight: 800, fill: '#1f2937' }) +
    text(W / 2, 1110, 44, '50+ 家醫院，抽出命定那一間', { anchor: 'middle', weight: 600, fill: '#6b21a8' }) +
    `</g>`;
  return frame(defs, body);
}

function yemaoCard5() {
  const defs = haloDefs('h5', A);
  const btnX = 165, btnY = 900, btnW = 750, btnH = 140;
  const body =
    furniture(5, 5, { swipe: false }) +
    character(YEMAO, 290, 190, 5.0, { haloId: 'h5', shadow: true }) +
    `<g id="text-overlay">` +
    text(W / 2, 800, 50, '換你了 👇', { anchor: 'middle', weight: 700, fill: '#334155' }) +
    `<rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="70" fill="${A}"/>` +
    // slight left shift + a trailing → gives the button a clear "tap me" affordance
    text(W / 2 - 26, btnY + btnH / 2 + 20, 54, '30 秒測出你的命運醫院', { anchor: 'middle', weight: 800, fill: '#fff' }) +
    text(btnX + btnW - 70, btnY + btnH / 2 + 20, 56, '→', { anchor: 'middle', weight: 800, fill: '#fff' }) +
    text(W / 2, 1130, 46, '🔗 連結在留言區', { anchor: 'middle', weight: 700, fill: '#6b21a8' }) +
    `</g>`;
  return frame(defs, body);
}

// ── 佛系藥師 scenes (emerald; sunset-corridor recognition beat) ──────────────
function foxiCard1() {
  const defs = haloDefs('h1', TH.accent);
  const body =
    furniture(1, 5) +
    character(ZEN, 260, 520, 5.6, { haloId: 'h1', shadow: true }) +
    `<g id="text-overlay">` +
    text(W / 2, 300, 58, '你，也是', { anchor: 'middle', weight: 800, fill: '#334155' }) +
    text(W / 2, 420, 94, '佛系藥師 嗎？', { anchor: 'middle', weight: 800, fill: TH.accent }) +
    `</g>`;
  return frame(defs, body);
}

// One-point-perspective corridor receding toward a sunset window (vanishing
// point pushed right, where the light is), with a wall clock reading 5:00.
function sunsetCorridor() {
  const vx = 660, vy = 545; // vanishing point (toward the light)
  const frames = [0.22, 0.42, 0.62]
    .map((t) => {
      const fw = 900 * (1 - t), fh = 380 * (1 - t);
      return `<rect x="${(vx - fw / 2).toFixed(0)}" y="${(vy - fh / 2).toFixed(0)}" width="${fw.toFixed(0)}" height="${fh.toFixed(0)}" rx="14" fill="none" stroke="#e0a06a" stroke-opacity="0.45" stroke-width="3"/>`;
    })
    .join('');
  const winW = 900 * 0.22, winH = 380 * 0.22;
  return `<g clip-path="url(#zp)">`
    + `<rect x="90" y="360" width="900" height="380" fill="url(#sunset)"/>`
    + `<ellipse cx="${vx}" cy="${vy}" rx="200" ry="150" fill="url(#sun)"/>`
    + frames
    + `<rect x="${(vx - winW / 2).toFixed(0)}" y="${(vy - winH / 2).toFixed(0)}" width="${winW.toFixed(0)}" height="${winH.toFixed(0)}" rx="8" fill="#fff2cf"/>`
    + `<circle cx="${vx}" cy="${vy + 8}" r="40" fill="#ffbf57"/>`
    + `<rect x="90" y="690" width="900" height="50" fill="#c98a5e" opacity="0.28"/>`
    + `</g>`
    + iconClock5(200, 470, 42);
}

function foxiCard2() {
  const defs = haloDefs('h2', TH.accent)
    + `<clipPath id="zp"><rect x="90" y="360" width="900" height="380" rx="28"/></clipPath>`
    + `<linearGradient id="sunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffe9b8"/>`
    + `<stop offset="60%" stop-color="#ffc79a"/><stop offset="100%" stop-color="#ffb0a6"/></linearGradient>`
    + `<radialGradient id="sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fff1c4" stop-opacity="0.95"/>`
    + `<stop offset="100%" stop-color="#fff1c4" stop-opacity="0"/></radialGradient>`;
  const body =
    furniture(2, 5) +
    sunsetCorridor() +
    `<g transform="translate(90 150)">${chip(0, 0, '這就是你')}</g>` +
    character(ZEN, 130, 430, 4.4, { haloId: 'h2' }) +
    `<g id="text-overlay">` +
    text(W / 2, 900, 56, '準時下班就是勝利', { anchor: 'middle', weight: 800, fill: '#1f2937' }) +
    text(W / 2, 985, 56, '錢夠用、心不累', { anchor: 'middle', weight: 800, fill: '#1f2937' }) +
    text(W / 2, 1075, 40, '⋯這是你想要的日常嗎？', { anchor: 'middle', weight: 600, fill: '#64748b' }) +
    `</g>`;
  return frame(defs, body);
}

function foxiCard3() {
  const defs = haloDefs('h3', TH.accent);
  const tile = (y, icon, label) =>
    `<rect x="540" y="${y}" width="470" height="150" rx="24" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"/>` +
    icon(620, y + 75) +
    text(700, y + 92, 46, label, { weight: 800, fill: '#1f2937' });
  const body =
    furniture(3, 5) +
    `<g transform="translate(70 150)">${chip(0, 0, '你該在意的')}</g>` +
    character(ZEN, 70, 500, 4.6, { haloId: 'h3', shadow: true }) +
    tile(440, iconClock5, '免/少輪班') +
    tile(620, iconMoonSlash, '有無「無大夜」') +
    tile(800, iconCheck, '工作單純穩定') +
    `<g id="text-overlay">` +
    text(540, 400, 42, '面試前，先問這三件 👇', { weight: 800, fill: '#334155' }) +
    `</g>`;
  return frame(defs, body);
}

function foxiCard4() {
  const defs = haloDefs('h4', TH.accent) +
    `<radialGradient id="wheelglow" cx="50%" cy="50%" r="50%">` +
    `<stop offset="0%" stop-color="${TH.accent}" stop-opacity="0.35"/>` +
    `<stop offset="100%" stop-color="${TH.accent}" stop-opacity="0"/></radialGradient>`;
  const cx = 700, cy = 600, r = 210;
  const polar = (deg, rad) => [cx + rad * Math.cos((deg * Math.PI) / 180), cy + rad * Math.sin((deg * Math.PI) / 180)];
  const shades = ['#d1fae5', '#a7f3d0'];
  const slices = [];
  for (let i = 0; i < 8; i++) {
    const [x0, y0] = polar(i * 45, r);
    const [x1, y1] = polar(i * 45 + 45, r);
    slices.push(`<path d="M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${shades[i % 2]}"/>`);
  }
  const marks = [];
  for (let i = 0; i < 8; i++) {
    const [mx, my] = polar(i * 45 + 22.5, r * 0.72);
    marks.push(`<g transform="translate(${mx.toFixed(1)} ${my.toFixed(1)})">`
      + `<rect x="-18" y="-18" width="36" height="36" rx="7" fill="#fff" stroke="#6ee7b7" stroke-width="2"/>`
      + `<rect x="-3" y="-11" width="6" height="22" fill="#ef4444"/><rect x="-11" y="-3" width="22" height="6" fill="#ef4444"/></g>`);
  }
  const wheel =
    `<circle cx="${cx}" cy="${cy}" r="${r + 60}" fill="url(#wheelglow)"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="#fff"/>` +
    slices.join('') +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${TH.accent}" stroke-width="8"/>` +
    marks.join('') +
    `<circle cx="${cx}" cy="${cy}" r="42" fill="${TH.accent}"/>` +
    `<rect x="${cx - 9}" y="${cy - 26}" width="18" height="52" rx="9" fill="#fff"/>` +
    `<line x1="${cx - 9}" y1="${cy}" x2="${cx + 9}" y2="${cy}" stroke="${TH.accent}" stroke-width="4"/>` +
    `<path d="M${cx + r + 18} ${cy} l 34 -20 l 0 40 z" fill="#f59e0b"/>`;
  const body =
    furniture(4, 5) +
    `<g transform="translate(70 150)">${chip(0, 0, '命運醫院')}</g>` +
    wheel +
    character(ZEN, 90, 690, 3.4, { haloId: 'h4' }) +
    `<g id="text-overlay">` +
    text(W / 2, 1035, 56, '哪間醫院最適合佛系的你？', { anchor: 'middle', weight: 800, fill: '#1f2937' }) +
    text(W / 2, 1110, 44, '50+ 家醫院，抽出命定那一間', { anchor: 'middle', weight: 600, fill: TH.deep }) +
    `</g>`;
  return frame(defs, body);
}

function foxiCard5() {
  const defs = haloDefs('h5', TH.accent);
  const btnX = 165, btnY = 900, btnW = 750, btnH = 140;
  const body =
    furniture(5, 5, { swipe: false }) +
    character(ZEN, 290, 190, 5.0, { haloId: 'h5', shadow: true }) +
    `<g id="text-overlay">` +
    text(W / 2, 800, 50, '換你了 👇', { anchor: 'middle', weight: 700, fill: '#334155' }) +
    `<rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="70" fill="${TH.accent}"/>` +
    text(W / 2 - 26, btnY + btnH / 2 + 20, 54, '30 秒測出你的命運醫院', { anchor: 'middle', weight: 800, fill: '#fff' }) +
    text(btnX + btnW - 70, btnY + btnH / 2 + 20, 56, '→', { anchor: 'middle', weight: 800, fill: '#fff' }) +
    text(W / 2, 1130, 46, '🔗 連結在留言區', { anchor: 'middle', weight: 700, fill: TH.deep }) +
    `</g>`;
  return frame(defs, body);
}

// ── 金牛藥師 scenes (gold; a rising bar chart at golden hour) ─────────────────
function jinniuCard1() {
  const defs = haloDefs('h1', TH.accent);
  const body =
    furniture(1, 5) +
    character(JINNIU, 260, 520, 5.6, { haloId: 'h1', shadow: true }) +
    `<g id="text-overlay">` +
    text(W / 2, 300, 58, '你，也是', { anchor: 'middle', weight: 800, fill: '#334155' }) +
    text(W / 2, 420, 94, '金牛藥師 嗎？', { anchor: 'middle', weight: 800, fill: TH.accent }) +
    `</g>`;
  return frame(defs, body);
}

// Golden-hour panel with a rising bar chart + trend arrow — the "salary climbs"
// beat, 金牛's scene signature (mirrors 佛系's sunset corridor).
function goldHourChart() {
  const bx = 90, by = 360, bw = 900, bh = 380;
  const base = by + bh - 46; // baseline y = 694
  const heights = [95, 150, 205, 260, 315];
  const barW = 78, gap = 46, startX = 360;
  const bars = heights.map((h, i) => {
    const x = startX + i * (barW + gap);
    return `<rect x="${x}" y="${base - h}" width="${barW}" height="${h}" rx="10" fill="#f59e0b" fill-opacity="${(0.5 + i * 0.1).toFixed(2)}"/>`;
  }).join('');
  const x0 = startX + barW / 2, y0 = base - heights[0] - 18;
  const x1 = startX + 4 * (barW + gap) + barW / 2, y1 = base - heights[4] - 18;
  const arrow = `<path d="M${x0} ${y0} L${x1} ${y1}" stroke="#b45309" stroke-width="7" stroke-linecap="round" fill="none"/>`
    + `<path d="M${x1} ${y1} l -26 4 M${x1} ${y1} l -4 26" stroke="#b45309" stroke-width="7" stroke-linecap="round" fill="none"/>`;
  return `<g clip-path="url(#gp)">`
    + `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="url(#goldhour)"/>`
    + `<ellipse cx="815" cy="470" rx="170" ry="130" fill="url(#gsun)"/>`
    + `<circle cx="815" cy="475" r="46" fill="#ffdf80"/>`
    + bars
    + arrow
    + `<rect x="${bx}" y="${base}" width="${bw}" height="6" fill="#c98a5e" opacity="0.4"/>`
    + `</g>`
    + iconCoin(200, 460, 42);
}

function jinniuCard2() {
  const defs = haloDefs('h2', TH.accent)
    + `<clipPath id="gp"><rect x="90" y="360" width="900" height="380" rx="28"/></clipPath>`
    + `<linearGradient id="goldhour" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff0c4"/>`
    + `<stop offset="55%" stop-color="#ffd98a"/><stop offset="100%" stop-color="#ffb877"/></linearGradient>`
    + `<radialGradient id="gsun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fff6d6" stop-opacity="0.95"/>`
    + `<stop offset="100%" stop-color="#fff6d6" stop-opacity="0"/></radialGradient>`;
  const body =
    furniture(2, 5) +
    goldHourChart() +
    `<g transform="translate(90 150)">${chip(0, 0, '這就是你')}</g>` +
    character(JINNIU, 130, 430, 4.4, { haloId: 'h2' }) +
    `<g id="text-overlay">` +
    text(W / 2, 900, 56, '年薪百萬是信仰', { anchor: 'middle', weight: 800, fill: '#1f2937' }) +
    text(W / 2, 985, 52, '簽約金、夜班費一分不放過', { anchor: 'middle', weight: 800, fill: '#1f2937' }) +
    text(W / 2, 1075, 40, '⋯這畫面，是不是很有共鳴？', { anchor: 'middle', weight: 600, fill: '#64748b' }) +
    `</g>`;
  return frame(defs, body);
}

function jinniuCard3() {
  const defs = haloDefs('h3', TH.accent);
  // Longer factor labels than 夜貓/佛系 → font 38, label pushed left to x=686.
  const tile = (y, icon, label) =>
    `<rect x="540" y="${y}" width="470" height="150" rx="24" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"/>` +
    icon(615, y + 75) +
    text(686, y + 90, 38, label, { weight: 800, fill: '#1f2937' });
  const body =
    furniture(3, 5) +
    `<g transform="translate(70 150)">${chip(0, 0, '你該在意的')}</g>` +
    character(JINNIU, 70, 500, 4.6, { haloId: 'h3', shadow: true }) +
    tile(440, iconChart, '薪資等級與年薪') +
    tile(620, iconCoin, '簽約金・留任獎金') +
    tile(800, iconCoinStack, '各項津貼疊加') +
    `<g id="text-overlay">` +
    text(540, 400, 42, '面試前，先問這三件 👇', { weight: 800, fill: '#334155' }) +
    `</g>`;
  return frame(defs, body);
}

function jinniuCard4() {
  const defs = haloDefs('h4', TH.accent) +
    `<radialGradient id="wheelglow" cx="50%" cy="50%" r="50%">` +
    `<stop offset="0%" stop-color="${TH.accent}" stop-opacity="0.35"/>` +
    `<stop offset="100%" stop-color="${TH.accent}" stop-opacity="0"/></radialGradient>`;
  const cx = 700, cy = 600, r = 210;
  const polar = (deg, rad) => [cx + rad * Math.cos((deg * Math.PI) / 180), cy + rad * Math.sin((deg * Math.PI) / 180)];
  const shades = ['#fef3c7', '#fde68a'];
  const slices = [];
  for (let i = 0; i < 8; i++) {
    const [x0, y0] = polar(i * 45, r);
    const [x1, y1] = polar(i * 45 + 45, r);
    slices.push(`<path d="M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${shades[i % 2]}"/>`);
  }
  const marks = [];
  for (let i = 0; i < 8; i++) {
    const [mx, my] = polar(i * 45 + 22.5, r * 0.72);
    marks.push(`<g transform="translate(${mx.toFixed(1)} ${my.toFixed(1)})">`
      + `<rect x="-18" y="-18" width="36" height="36" rx="7" fill="#fff" stroke="#fcd34d" stroke-width="2"/>`
      + `<rect x="-3" y="-11" width="6" height="22" fill="#ef4444"/><rect x="-11" y="-3" width="22" height="6" fill="#ef4444"/></g>`);
  }
  const wheel =
    `<circle cx="${cx}" cy="${cy}" r="${r + 60}" fill="url(#wheelglow)"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="#fff"/>` +
    slices.join('') +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${TH.accent}" stroke-width="8"/>` +
    marks.join('') +
    `<circle cx="${cx}" cy="${cy}" r="42" fill="${TH.accent}"/>` +
    `<rect x="${cx - 9}" y="${cy - 26}" width="18" height="52" rx="9" fill="#fff"/>` +
    `<line x1="${cx - 9}" y1="${cy}" x2="${cx + 9}" y2="${cy}" stroke="${TH.accent}" stroke-width="4"/>` +
    `<path d="M${cx + r + 18} ${cy} l 34 -20 l 0 40 z" fill="#f59e0b"/>`;
  const body =
    furniture(4, 5) +
    `<g transform="translate(70 150)">${chip(0, 0, '命運醫院')}</g>` +
    wheel +
    character(JINNIU, 90, 690, 3.4, { haloId: 'h4' }) +
    `<g id="text-overlay">` +
    text(W / 2, 1035, 54, '哪間醫院能餵飽金牛的你？', { anchor: 'middle', weight: 800, fill: '#1f2937' }) +
    text(W / 2, 1110, 44, '50+ 家醫院，抽出命定那一間', { anchor: 'middle', weight: 600, fill: TH.deep }) +
    `</g>`;
  return frame(defs, body);
}

function jinniuCard5() {
  const defs = haloDefs('h5', TH.accent);
  const btnX = 165, btnY = 900, btnW = 750, btnH = 140;
  const body =
    furniture(5, 5, { swipe: false }) +
    character(JINNIU, 290, 190, 5.0, { haloId: 'h5', shadow: true }) +
    `<g id="text-overlay">` +
    text(W / 2, 800, 50, '換你了 👇', { anchor: 'middle', weight: 700, fill: '#334155' }) +
    `<rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="70" fill="${TH.accent}"/>` +
    text(W / 2 - 26, btnY + btnH / 2 + 20, 54, '30 秒測出你的命運醫院', { anchor: 'middle', weight: 800, fill: '#fff' }) +
    text(btnX + btnW - 70, btnY + btnH / 2 + 20, 56, '→', { anchor: 'middle', weight: 800, fill: '#fff' }) +
    text(W / 2, 1130, 46, '🔗 連結在留言區', { anchor: 'middle', weight: 700, fill: TH.deep }) +
    `</g>`;
  return frame(defs, body);
}

// ── 鐵腕藥師 scenes (red; a solid columned public institution = 鐵飯碗) ────────
function ironCard1() {
  const defs = haloDefs('h1', TH.accent);
  const body =
    furniture(1, 5) +
    character(IRONARM, 260, 520, 5.6, { haloId: 'h1', shadow: true }) +
    `<g id="text-overlay">` +
    text(W / 2, 300, 58, '你，也是', { anchor: 'middle', weight: 800, fill: '#334155' }) +
    text(W / 2, 420, 94, '鐵腕藥師 嗎？', { anchor: 'middle', weight: 800, fill: TH.accent }) +
    `</g>`;
  return frame(defs, body);
}

// Classical columned facade (pediment + entablature + 5 columns + steps) — the
// "public institution / 鐵飯碗" beat, 鐵腕's scene signature.
function govtBuilding() {
  const bx = 90, by = 360, bw = 900, bh = 380;
  const cxc = 540, bLeft = 285, bRight = 795;
  const pedApex = 404, entTop = 460, entH = 26;
  const colTop = entTop + entH, colBot = 670;
  let g = `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="url(#civic)"/>`;
  // steps + platform
  g += `<rect x="${bLeft - 44}" y="690" width="${bRight - bLeft + 88}" height="18" rx="3" fill="#c4bdad"/>`
    + `<rect x="${bLeft - 26}" y="676" width="${bRight - bLeft + 52}" height="16" rx="3" fill="#d6cfbf"/>`
    + `<rect x="${bLeft - 12}" y="${colBot - 4}" width="${bRight - bLeft + 24}" height="12" fill="#e9e4d8"/>`;
  // columns
  const colW = 30, first = 321, gap = 102;
  for (let i = 0; i < 5; i++) {
    const x = first + i * gap;
    g += `<rect x="${x}" y="${colTop}" width="${colW}" height="${colBot - colTop}" fill="#f2eee4"/>`
      + `<rect x="${x - 4}" y="${colTop - 9}" width="${colW + 8}" height="9" fill="#e2dbca"/>`;
  }
  // entablature + pediment + emblem
  g += `<rect x="${bLeft}" y="${entTop}" width="${bRight - bLeft}" height="${entH}" fill="#e2dbca"/>`
    + `<path d="M${bLeft} ${entTop} L${cxc} ${pedApex} L${bRight} ${entTop} Z" fill="${TH.accent}"/>`;
  const sy = 430;
  g += `<path d="M${cxc} ${sy - 12} L${cxc + 13} ${sy - 6} V${sy + 3} Q${cxc + 13} ${sy + 12} ${cxc} ${sy + 17} Q${cxc - 13} ${sy + 12} ${cxc - 13} ${sy + 3} V${sy - 6} Z" fill="#fbe3a1"/>`;
  return `<g clip-path="url(#cp)">` + g + `</g>` + iconShield(200, 470, 40);
}

function ironCard2() {
  const defs = haloDefs('h2', TH.accent)
    + `<clipPath id="cp"><rect x="90" y="360" width="900" height="380" rx="28"/></clipPath>`
    + `<linearGradient id="civic" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e2e8f0"/>`
    + `<stop offset="100%" stop-color="#eef1f6"/></linearGradient>`;
  const body =
    furniture(2, 5) +
    govtBuilding() +
    `<g transform="translate(90 150)">${chip(0, 0, '這就是你')}</g>` +
    character(IRONARM, 130, 430, 4.4, { haloId: 'h2' }) +
    `<g id="text-overlay">` +
    text(W / 2, 900, 56, '追求穩定鐵飯碗', { anchor: 'middle', weight: 800, fill: '#1f2937' }) +
    text(W / 2, 985, 52, '公職保障足、年資完整', { anchor: 'middle', weight: 800, fill: '#1f2937' }) +
    text(W / 2, 1075, 40, '⋯這是你要的安穩嗎？', { anchor: 'middle', weight: 600, fill: '#64748b' }) +
    `</g>`;
  return frame(defs, body);
}

function ironCard3() {
  const defs = haloDefs('h3', TH.accent);
  const tile = (y, icon, label) =>
    `<rect x="540" y="${y}" width="470" height="150" rx="24" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"/>` +
    icon(615, y + 75) +
    text(686, y + 90, 38, label, { weight: 800, fill: '#1f2937' });
  const body =
    furniture(3, 5) +
    `<g transform="translate(70 150)">${chip(0, 0, '你該在意的')}</g>` +
    character(IRONARM, 70, 500, 4.6, { haloId: 'h3', shadow: true }) +
    tile(440, iconBuilding, '公立/私立差別') +
    tile(620, iconShield, '年資與退休制度') +
    tile(800, iconClock, '輪班與工時保障') +
    `<g id="text-overlay">` +
    text(540, 400, 42, '面試前，先問這三件 👇', { weight: 800, fill: '#334155' }) +
    `</g>`;
  return frame(defs, body);
}

function ironCard4() {
  const defs = haloDefs('h4', TH.accent) +
    `<radialGradient id="wheelglow" cx="50%" cy="50%" r="50%">` +
    `<stop offset="0%" stop-color="${TH.accent}" stop-opacity="0.35"/>` +
    `<stop offset="100%" stop-color="${TH.accent}" stop-opacity="0"/></radialGradient>`;
  const cx = 700, cy = 600, r = 210;
  const polar = (deg, rad) => [cx + rad * Math.cos((deg * Math.PI) / 180), cy + rad * Math.sin((deg * Math.PI) / 180)];
  const shades = ['#fee2e2', '#fecaca'];
  const slices = [];
  for (let i = 0; i < 8; i++) {
    const [x0, y0] = polar(i * 45, r);
    const [x1, y1] = polar(i * 45 + 45, r);
    slices.push(`<path d="M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${shades[i % 2]}"/>`);
  }
  const marks = [];
  for (let i = 0; i < 8; i++) {
    const [mx, my] = polar(i * 45 + 22.5, r * 0.72);
    marks.push(`<g transform="translate(${mx.toFixed(1)} ${my.toFixed(1)})">`
      + `<rect x="-18" y="-18" width="36" height="36" rx="7" fill="#fff" stroke="#fca5a5" stroke-width="2"/>`
      + `<rect x="-3" y="-11" width="6" height="22" fill="#ef4444"/><rect x="-11" y="-3" width="22" height="6" fill="#ef4444"/></g>`);
  }
  const wheel =
    `<circle cx="${cx}" cy="${cy}" r="${r + 60}" fill="url(#wheelglow)"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="#fff"/>` +
    slices.join('') +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${TH.accent}" stroke-width="8"/>` +
    marks.join('') +
    `<circle cx="${cx}" cy="${cy}" r="42" fill="${TH.accent}"/>` +
    `<rect x="${cx - 9}" y="${cy - 26}" width="18" height="52" rx="9" fill="#fff"/>` +
    `<line x1="${cx - 9}" y1="${cy}" x2="${cx + 9}" y2="${cy}" stroke="${TH.accent}" stroke-width="4"/>` +
    `<path d="M${cx + r + 18} ${cy} l 34 -20 l 0 40 z" fill="#f59e0b"/>`;
  const body =
    furniture(4, 5) +
    `<g transform="translate(70 150)">${chip(0, 0, '命運醫院')}</g>` +
    wheel +
    character(IRONARM, 90, 690, 3.4, { haloId: 'h4' }) +
    `<g id="text-overlay">` +
    text(W / 2, 1035, 48, '你的命運醫院是哪間公立醫院？', { anchor: 'middle', weight: 800, fill: '#1f2937' }) +
    text(W / 2, 1110, 44, '50+ 家醫院，抽出命定那一間', { anchor: 'middle', weight: 600, fill: TH.deep }) +
    `</g>`;
  return frame(defs, body);
}

function ironCard5() {
  const defs = haloDefs('h5', TH.accent);
  const btnX = 165, btnY = 900, btnW = 750, btnH = 140;
  const body =
    furniture(5, 5, { swipe: false }) +
    character(IRONARM, 290, 190, 5.0, { haloId: 'h5', shadow: true }) +
    `<g id="text-overlay">` +
    text(W / 2, 800, 50, '換你了 👇', { anchor: 'middle', weight: 700, fill: '#334155' }) +
    `<rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="70" fill="${TH.accent}"/>` +
    text(W / 2 - 26, btnY + btnH / 2 + 20, 54, '30 秒測出你的命運醫院', { anchor: 'middle', weight: 800, fill: '#fff' }) +
    text(btnX + btnW - 70, btnY + btnH / 2 + 20, 56, '→', { anchor: 'middle', weight: 800, fill: '#fff' }) +
    text(W / 2, 1130, 46, '🔗 連結在留言區', { anchor: 'middle', weight: 700, fill: TH.deep }) +
    `</g>`;
  return frame(defs, body);
}

// ── 學霸藥師 scenes (teal; a bright medical-center dispensary, shelves拉滿) ────
function aceCard1() {
  const defs = haloDefs('h1', TH.accent);
  const body =
    furniture(1, 5) +
    character(ACE, 260, 520, 5.6, { haloId: 'h1', shadow: true }) +
    `<g id="text-overlay">` +
    text(W / 2, 300, 58, '你，也是', { anchor: 'middle', weight: 800, fill: '#334155' }) +
    text(W / 2, 420, 94, '學霸藥師 嗎？', { anchor: 'middle', weight: 800, fill: TH.accent }) +
    `</g>`;
  return frame(defs, body);
}

// Bright medical-center dispensary — tall shelving stocked with meds (資源拉滿),
// 學霸's scene signature.
function pharmacyShelves() {
  const by = 360, bh = 380, top = by + 30, bot = by + bh - 30;
  const bays = 3, bayW = 250, gap = 35, startX = 145;
  const boxColors = ['#5eead4', '#7dd3fc', '#fca5a5', '#fcd34d', '#c4b5fd', '#86efac', '#fdba74'];
  let g = `<rect x="90" y="${by}" width="900" height="${bh}" fill="url(#ward)"/>`;
  for (let b = 0; b < bays; b++) {
    const x = startX + b * (bayW + gap);
    g += `<rect x="${x}" y="${top}" width="${bayW}" height="${bot - top}" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>`;
    const shelves = 3, sh = (bot - top) / shelves;
    for (let s = 0; s < shelves; s++) {
      const sy = top + s * sh;
      g += `<line x1="${x}" y1="${(sy + sh).toFixed(1)}" x2="${x + bayW}" y2="${(sy + sh).toFixed(1)}" stroke="#cbd5e1" stroke-width="2.5"/>`;
      const boxes = 5, bwid = (bayW - 20) / boxes;
      for (let k = 0; k < boxes; k++) {
        const bxp = x + 10 + k * bwid, boxH = sh * 0.62;
        const col = boxColors[(b * 2 + s + k) % boxColors.length];
        g += `<rect x="${(bxp + 3).toFixed(1)}" y="${(sy + sh - boxH - 5).toFixed(1)}" width="${(bwid - 6).toFixed(1)}" height="${boxH.toFixed(1)}" rx="2" fill="${col}"/>`;
      }
    }
  }
  return `<g clip-path="url(#cp)">` + g + `</g>` + iconGradCap(210, 460, 40);
}

function aceCard2() {
  const defs = haloDefs('h2', TH.accent)
    + `<clipPath id="cp"><rect x="90" y="360" width="900" height="380" rx="28"/></clipPath>`
    + `<linearGradient id="ward" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eaf6fb"/>`
    + `<stop offset="100%" stop-color="#f2f9fc"/></linearGradient>`;
  const body =
    furniture(2, 5) +
    pharmacyShelves() +
    `<g transform="translate(90 150)">${chip(0, 0, '這就是你')}</g>` +
    character(ACE, 130, 430, 4.4, { haloId: 'h2' }) +
    `<g id="text-overlay">` +
    text(W / 2, 900, 52, '醫學中心衝一波，資源光環拉滿', { anchor: 'middle', weight: 800, fill: '#1f2937' }) +
    text(W / 2, 985, 56, '但節奏快到起飛', { anchor: 'middle', weight: 800, fill: '#1f2937' }) +
    text(W / 2, 1075, 40, '⋯這畫面是不是很熟悉？', { anchor: 'middle', weight: 600, fill: '#64748b' }) +
    `</g>`;
  return frame(defs, body);
}

function aceCard3() {
  const defs = haloDefs('h3', TH.accent);
  // Font 34 (not 38) so the longest label 「專科藥師・進階制度」 stays inside the box.
  const tile = (y, icon, label) =>
    `<rect x="540" y="${y}" width="470" height="150" rx="24" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"/>` +
    icon(615, y + 75) +
    text(686, y + 90, 34, label, { weight: 800, fill: '#1f2937' });
  const body =
    furniture(3, 5) +
    `<g transform="translate(70 150)">${chip(0, 0, '你該在意的')}</g>` +
    character(ACE, 70, 500, 4.6, { haloId: 'h3', shadow: true }) +
    tile(440, iconGradCap, 'PGY 訓練') +
    tile(620, iconSteps, '專科藥師・進階制度') +
    tile(800, iconBook, '教學研究資源') +
    `<g id="text-overlay">` +
    text(540, 400, 42, '面試前，先問這三件 👇', { weight: 800, fill: '#334155' }) +
    `</g>`;
  return frame(defs, body);
}

function aceCard4() {
  const defs = haloDefs('h4', TH.accent) +
    `<radialGradient id="wheelglow" cx="50%" cy="50%" r="50%">` +
    `<stop offset="0%" stop-color="${TH.accent}" stop-opacity="0.35"/>` +
    `<stop offset="100%" stop-color="${TH.accent}" stop-opacity="0"/></radialGradient>`;
  const cx = 700, cy = 600, r = 210;
  const polar = (deg, rad) => [cx + rad * Math.cos((deg * Math.PI) / 180), cy + rad * Math.sin((deg * Math.PI) / 180)];
  const shades = ['#cffafe', '#a5f3fc'];
  const slices = [];
  for (let i = 0; i < 8; i++) {
    const [x0, y0] = polar(i * 45, r);
    const [x1, y1] = polar(i * 45 + 45, r);
    slices.push(`<path d="M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${shades[i % 2]}"/>`);
  }
  const marks = [];
  for (let i = 0; i < 8; i++) {
    const [mx, my] = polar(i * 45 + 22.5, r * 0.72);
    marks.push(`<g transform="translate(${mx.toFixed(1)} ${my.toFixed(1)})">`
      + `<rect x="-18" y="-18" width="36" height="36" rx="7" fill="#fff" stroke="#67e8f9" stroke-width="2"/>`
      + `<rect x="-3" y="-11" width="6" height="22" fill="#ef4444"/><rect x="-11" y="-3" width="22" height="6" fill="#ef4444"/></g>`);
  }
  const wheel =
    `<circle cx="${cx}" cy="${cy}" r="${r + 60}" fill="url(#wheelglow)"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="#fff"/>` +
    slices.join('') +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${TH.accent}" stroke-width="8"/>` +
    marks.join('') +
    `<circle cx="${cx}" cy="${cy}" r="42" fill="${TH.accent}"/>` +
    `<rect x="${cx - 9}" y="${cy - 26}" width="18" height="52" rx="9" fill="#fff"/>` +
    `<line x1="${cx - 9}" y1="${cy}" x2="${cx + 9}" y2="${cy}" stroke="${TH.accent}" stroke-width="4"/>` +
    `<path d="M${cx + r + 18} ${cy} l 34 -20 l 0 40 z" fill="#f59e0b"/>`;
  const body =
    furniture(4, 5) +
    `<g transform="translate(70 150)">${chip(0, 0, '命運醫院')}</g>` +
    wheel +
    character(ACE, 90, 690, 3.4, { haloId: 'h4' }) +
    `<g id="text-overlay">` +
    text(W / 2, 1035, 48, '你的命運醫院是哪間醫學中心？', { anchor: 'middle', weight: 800, fill: '#1f2937' }) +
    text(W / 2, 1110, 44, '50+ 家醫院，抽出命定那一間', { anchor: 'middle', weight: 600, fill: TH.deep }) +
    `</g>`;
  return frame(defs, body);
}

function aceCard5() {
  const defs = haloDefs('h5', TH.accent);
  const btnX = 165, btnY = 900, btnW = 750, btnH = 140;
  const body =
    furniture(5, 5, { swipe: false }) +
    character(ACE, 290, 190, 5.0, { haloId: 'h5', shadow: true }) +
    `<g id="text-overlay">` +
    text(W / 2, 800, 50, '換你了 👇', { anchor: 'middle', weight: 700, fill: '#334155' }) +
    `<rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="70" fill="${TH.accent}"/>` +
    text(W / 2 - 26, btnY + btnH / 2 + 20, 54, '30 秒測出你的命運醫院', { anchor: 'middle', weight: 800, fill: '#fff' }) +
    text(btnX + btnW - 70, btnY + btnH / 2 + 20, 56, '→', { anchor: 'middle', weight: 800, fill: '#fff' }) +
    text(W / 2, 1130, 46, '🔗 連結在留言區', { anchor: 'middle', weight: 700, fill: TH.deep }) +
    `</g>`;
  return frame(defs, body);
}

// ── 北漂藥師 scenes (blue; a dusk city skyline — relocated to the big city) ────
function beipiaoCard1() {
  const defs = haloDefs('h1', TH.accent);
  const body =
    furniture(1, 5) +
    character(BEIPIAO, 260, 520, 5.6, { haloId: 'h1', shadow: true }) +
    `<g id="text-overlay">` +
    text(W / 2, 300, 58, '你，也是', { anchor: 'middle', weight: 800, fill: '#334155' }) +
    text(W / 2, 420, 94, '北漂藥師 嗎？', { anchor: 'middle', weight: 800, fill: TH.accent }) +
    `</g>`;
  return frame(defs, body);
}

// Dusk city skyline — the "relocated to the big city" beat, 北漂's signature.
function cityscape() {
  const by = 360, bh = 380, groundY = by + bh - 50;
  const specs = [[150, 150], [240, 220], [335, 120], [420, 260], [520, 180], [620, 290], [720, 150], [820, 230]];
  let bld = '';
  specs.forEach(([bx, h], i) => {
    const w = 74, col = i % 2 ? '#3f74d6' : '#5a8fe6';
    bld += `<rect x="${bx}" y="${groundY - h}" width="${w}" height="${h}" fill="${col}"/>`;
    for (let wy = groundY - h + 16; wy < groundY - 20; wy += 34) {
      bld += `<rect x="${bx + 14}" y="${wy}" width="14" height="18" fill="#fde68a" fill-opacity="0.75"/>`
        + `<rect x="${bx + 44}" y="${wy}" width="14" height="18" fill="#fde68a" fill-opacity="0.5"/>`;
    }
  });
  return `<g clip-path="url(#cp)">`
    + `<rect x="90" y="${by}" width="900" height="${bh}" fill="url(#dusk)"/>`
    + `<circle cx="860" cy="440" r="30" fill="#fde68a" fill-opacity="0.85"/>`
    + bld
    + `<rect x="90" y="${groundY}" width="900" height="8" fill="#1e3a8a"/>`
    + `</g>` + iconTrain(205, 460, 40);
}

function beipiaoCard2() {
  const defs = haloDefs('h2', TH.accent)
    + `<clipPath id="cp"><rect x="90" y="360" width="900" height="380" rx="28"/></clipPath>`
    + `<linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c7dbf5"/>`
    + `<stop offset="100%" stop-color="#e8eff9"/></linearGradient>`;
  const body =
    furniture(2, 5) +
    cityscape() +
    `<g transform="translate(90 150)">${chip(0, 0, '這就是你')}</g>` +
    character(BEIPIAO, 130, 430, 4.4, { haloId: 'h2' }) +
    `<g id="text-overlay">` +
    text(W / 2, 900, 56, '為工作離鄉背井', { anchor: 'middle', weight: 800, fill: '#1f2937' }) +
    text(W / 2, 985, 56, '一卡皮箱闖天涯', { anchor: 'middle', weight: 800, fill: '#1f2937' }) +
    text(W / 2, 1075, 40, '⋯這是你的日常嗎？', { anchor: 'middle', weight: 600, fill: '#64748b' }) +
    `</g>`;
  return frame(defs, body);
}

function beipiaoCard3() {
  const defs = haloDefs('h3', TH.accent);
  const tile = (y, icon, label) =>
    `<rect x="540" y="${y}" width="470" height="150" rx="24" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"/>` +
    icon(615, y + 75) +
    text(686, y + 90, 36, label, { weight: 800, fill: '#1f2937' });
  const body =
    furniture(3, 5) +
    `<g transform="translate(70 150)">${chip(0, 0, '你該在意的')}</g>` +
    character(BEIPIAO, 70, 500, 4.6, { haloId: 'h3', shadow: true }) +
    tile(440, iconHouse, '宿舍/租屋補助') +
    tile(620, iconPin, '宿舍距離與費用') +
    tile(800, iconStore, '生活機能') +
    `<g id="text-overlay">` +
    text(540, 400, 42, '面試前，先問這三件 👇', { weight: 800, fill: '#334155' }) +
    `</g>`;
  return frame(defs, body);
}

function beipiaoCard4() {
  const defs = haloDefs('h4', TH.accent) +
    `<radialGradient id="wheelglow" cx="50%" cy="50%" r="50%">` +
    `<stop offset="0%" stop-color="${TH.accent}" stop-opacity="0.35"/>` +
    `<stop offset="100%" stop-color="${TH.accent}" stop-opacity="0"/></radialGradient>`;
  const cx = 700, cy = 600, r = 210;
  const polar = (deg, rad) => [cx + rad * Math.cos((deg * Math.PI) / 180), cy + rad * Math.sin((deg * Math.PI) / 180)];
  const shades = ['#dbeafe', '#bfdbfe'];
  const slices = [];
  for (let i = 0; i < 8; i++) {
    const [x0, y0] = polar(i * 45, r);
    const [x1, y1] = polar(i * 45 + 45, r);
    slices.push(`<path d="M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${shades[i % 2]}"/>`);
  }
  const marks = [];
  for (let i = 0; i < 8; i++) {
    const [mx, my] = polar(i * 45 + 22.5, r * 0.72);
    marks.push(`<g transform="translate(${mx.toFixed(1)} ${my.toFixed(1)})">`
      + `<rect x="-18" y="-18" width="36" height="36" rx="7" fill="#fff" stroke="#93c5fd" stroke-width="2"/>`
      + `<rect x="-3" y="-11" width="6" height="22" fill="#ef4444"/><rect x="-11" y="-3" width="22" height="6" fill="#ef4444"/></g>`);
  }
  const wheel =
    `<circle cx="${cx}" cy="${cy}" r="${r + 60}" fill="url(#wheelglow)"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="#fff"/>` +
    slices.join('') +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${TH.accent}" stroke-width="8"/>` +
    marks.join('') +
    `<circle cx="${cx}" cy="${cy}" r="42" fill="${TH.accent}"/>` +
    `<rect x="${cx - 9}" y="${cy - 26}" width="18" height="52" rx="9" fill="#fff"/>` +
    `<line x1="${cx - 9}" y1="${cy}" x2="${cx + 9}" y2="${cy}" stroke="${TH.accent}" stroke-width="4"/>` +
    `<path d="M${cx + r + 18} ${cy} l 34 -20 l 0 40 z" fill="#f59e0b"/>`;
  const body =
    furniture(4, 5) +
    `<g transform="translate(70 150)">${chip(0, 0, '命運醫院')}</g>` +
    wheel +
    character(BEIPIAO, 90, 690, 3.4, { haloId: 'h4' }) +
    `<g id="text-overlay">` +
    text(W / 2, 1035, 52, '哪間醫院有你落腳的宿舍？', { anchor: 'middle', weight: 800, fill: '#1f2937' }) +
    text(W / 2, 1110, 44, '50+ 家醫院，抽出命定那一間', { anchor: 'middle', weight: 600, fill: TH.deep }) +
    `</g>`;
  return frame(defs, body);
}

function beipiaoCard5() {
  const defs = haloDefs('h5', TH.accent);
  const btnX = 165, btnY = 900, btnW = 750, btnH = 140;
  const body =
    furniture(5, 5, { swipe: false }) +
    character(BEIPIAO, 290, 190, 5.0, { haloId: 'h5', shadow: true }) +
    `<g id="text-overlay">` +
    text(W / 2, 800, 50, '換你了 👇', { anchor: 'middle', weight: 700, fill: '#334155' }) +
    `<rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="70" fill="${TH.accent}"/>` +
    text(W / 2 - 26, btnY + btnH / 2 + 20, 54, '30 秒測出你的命運醫院', { anchor: 'middle', weight: 800, fill: '#fff' }) +
    text(btnX + btnW - 70, btnY + btnH / 2 + 20, 56, '→', { anchor: 'middle', weight: 800, fill: '#fff' }) +
    text(W / 2, 1130, 46, '🔗 連結在留言區', { anchor: 'middle', weight: 700, fill: TH.deep }) +
    `</g>`;
  return frame(defs, body);
}

// ── Comparison cards (4-card duotone: Hook / 兩種人生 / 硬指標 / CTA) ──────────
// Rendered under TH = THEMES.cmp (neutral furniture); the duotone comes from
// each idol's own theme. Reusable for any comparison post via CHAR_OF/THEME_OF.
function cmpCard1(p) {
  const A = THEME_OF[p.a], B = THEME_OF[p.b];
  const wA = p.a.length * 40 + 56, wB = p.b.length * 40 + 56;
  const defs = haloDefs('hA', A.accent) + haloDefs('hB', B.accent);
  const body =
    furniture(1, 4) +
    text(486, 288, 74, p.a, { anchor: 'end', weight: 800, fill: A.accent }) +
    text(540, 282, 50, 'vs', { anchor: 'middle', weight: 800, fill: '#94a3b8' }) +
    text(594, 288, 74, p.b, { anchor: 'start', weight: 800, fill: B.accent }) +
    text(540, 372, 46, '你更像誰？', { anchor: 'middle', weight: 700, fill: '#334155' }) +
    `<rect x="60" y="440" width="468" height="620" rx="28" fill="${A.accent}" fill-opacity="0.08"/>` +
    `<rect x="552" y="440" width="468" height="620" rx="28" fill="${B.accent}" fill-opacity="0.10"/>` +
    character(CHAR_OF[p.a], 94, 500, 4.0, { haloId: 'hA' }) +
    character(CHAR_OF[p.b], 586, 500, 4.0, { haloId: 'hB' }) +
    `<g transform="translate(${294 - wA / 2} 940)">${chip(0, 0, p.a, { bg: A.accent })}</g>` +
    `<g transform="translate(${786 - wB / 2} 940)">${chip(0, 0, p.b, { bg: B.accent })}</g>` +
    `<circle cx="540" cy="745" r="46" fill="#fff" stroke="#cbd5e1" stroke-width="3"/>` +
    text(540, 761, 34, 'VS', { anchor: 'middle', weight: 800, fill: '#475569' });
  return frame(defs, body);
}

// Derive the two card-2 scenario lines from an `aLine`/`bLine` ("名：X，Y"):
// strip the "名：" prefix, split on the Chinese comma. Posts with explicit
// aParts/bParts (e.g. 03) bypass this.
function cmpParts(line) {
  const body = line.includes('：') ? line.slice(line.indexOf('：') + 1) : line;
  return body.split('，');
}
function cmpCard2(p) {
  const A = THEME_OF[p.a], B = THEME_OF[p.b];
  const aParts = p.aParts || cmpParts(p.aLine);
  const bParts = p.bParts || cmpParts(p.bLine);
  const defs = haloDefs('hA', A.accent) + haloDefs('hB', B.accent);
  const body =
    furniture(2, 4) +
    `<g transform="translate(70 150)">${chip(0, 0, '兩種人生')}</g>` +
    `<rect x="60" y="250" width="960" height="450" rx="28" fill="${A.accent}" fill-opacity="0.08"/>` +
    character(CHAR_OF[p.a], 90, 300, 3.4, { haloId: 'hA' }) +
    text(470, 400, 54, p.a, { weight: 800, fill: A.accent }) +
    text(470, 492, 44, aParts[0], { weight: 700, fill: '#1f2937' }) +
    (aParts[1] ? text(470, 560, 44, aParts[1], { weight: 700, fill: '#1f2937' }) : '') +
    `<rect x="60" y="730" width="960" height="450" rx="28" fill="${B.accent}" fill-opacity="0.10"/>` +
    character(CHAR_OF[p.b], 90, 780, 3.4, { haloId: 'hB' }) +
    text(470, 880, 54, p.b, { weight: 800, fill: B.accent }) +
    text(470, 972, 44, bParts[0], { weight: 700, fill: '#1f2937' }) +
    (bParts[1] ? text(470, 1040, 44, bParts[1], { weight: 700, fill: '#1f2937' }) : '');
  return frame(defs, body);
}

function cmpCard3(p) {
  const A = THEME_OF[p.a], B = THEME_OF[p.b];
  const x0 = 80, xL = 380, xR = 700, x1 = 1020;
  const headY = 420, rowH = 150, rows = p.metrics.length;
  const bodyH = 90 + rowH * rows, tblBottom = headY + bodyH;
  let g = `<rect x="${xL}" y="${headY}" width="${xR - xL}" height="${bodyH}" fill="${A.accent}" fill-opacity="0.06"/>`
    + `<rect x="${xR}" y="${headY}" width="${x1 - xR}" height="${bodyH}" fill="${B.accent}" fill-opacity="0.08"/>`
    + `<rect x="${xL}" y="${headY}" width="${xR - xL}" height="90" rx="0" fill="${A.accent}"/>`
    + `<rect x="${xR}" y="${headY}" width="${x1 - xR}" height="90" fill="${B.accent}"/>`
    + text((xL + xR) / 2, headY + 58, 44, p.a, { anchor: 'middle', weight: 800, fill: '#fff' })
    + text((xR + x1) / 2, headY + 58, 44, p.b, { anchor: 'middle', weight: 800, fill: '#fff' });
  for (let i = 0; i < rows; i++) {
    const ry = headY + 90 + i * rowH, my = ry + rowH / 2 + 14;
    g += `<line x1="${x0}" y1="${ry}" x2="${x1}" y2="${ry}" stroke="#e5e7eb" stroke-width="2"/>`
      + text(x0 + 12, my, 40, p.metrics[i], { weight: 800, fill: '#334155' })
      + text((xL + xR) / 2, my, 40, p.valA[i], { anchor: 'middle', weight: 700, fill: '#1f2937' })
      + text((xR + x1) / 2, my, 40, p.valB[i], { anchor: 'middle', weight: 700, fill: '#1f2937' });
  }
  g += `<line x1="${x0}" y1="${tblBottom}" x2="${x1}" y2="${tblBottom}" stroke="#e5e7eb" stroke-width="2"/>`;
  const body =
    furniture(3, 4) +
    `<g transform="translate(70 150)">${chip(0, 0, '關鍵差異')}</g>` +
    g +
    text(80, tblBottom + 66, 30, '＊實際依各院制度與個人選擇而定', { weight: 600, fill: '#94a3b8' });
  return frame('', body);
}

function cmpCard4(p) {
  const A = THEME_OF[p.a], B = THEME_OF[p.b];
  const defs = haloDefs('hA', A.accent) + haloDefs('hB', B.accent)
    + `<linearGradient id="cta" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${A.accent}"/>`
    + `<stop offset="100%" stop-color="${B.accent}"/></linearGradient>`;
  const btnX = 165, btnY = 900, btnW = 750, btnH = 140;
  const body =
    furniture(4, 4, { swipe: false }) +
    character(CHAR_OF[p.a], 120, 260, 3.8, { haloId: 'hA', shadow: true }) +
    character(CHAR_OF[p.b], 560, 260, 3.8, { haloId: 'hB', shadow: true }) +
    `<g id="text-overlay">` +
    text(540, 800, 56, '你更像哪一種？', { anchor: 'middle', weight: 800, fill: '#334155' }) +
    `<rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="70" fill="url(#cta)"/>` +
    text(540 - 26, btnY + btnH / 2 + 20, 52, '30 秒測出你的屬性', { anchor: 'middle', weight: 800, fill: '#fff' }) +
    text(btnX + btnW - 70, btnY + btnH / 2 + 20, 56, '→', { anchor: 'middle', weight: 800, fill: '#fff' }) +
    text(540, 1130, 46, '🔗 連結在留言區', { anchor: 'middle', weight: 700, fill: '#475569' }) +
    `</g>`;
  return frame(defs, body);
}
const cmpCards = (p) => [cmpCard1(p), cmpCard2(p), cmpCard3(p), cmpCard4(p)];

// ── Build ────────────────────────────────────────────────────────────────────
function build(dir, cards, { title, slug }) {
  const outDir = join(HERE, dir);
  mkdirSync(outDir, { recursive: true });
  cards.forEach((svg, i) => writeFileSync(join(outDir, `card-${i + 1}.svg`), svg));

  const html = `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"/>
<title>${title} — 卡片預覽</title>
<style>
  body{font-family:${FONT};background:#0f172a;color:#e2e8f0;margin:0;padding:28px}
  h1{font-size:18px;margin:0 0 4px} p{color:#94a3b8;font-size:13px;margin:0 0 20px}
  .row{display:flex;gap:18px;flex-wrap:wrap}
  .card{background:#1e293b;border-radius:12px;padding:12px;width:300px}
  .card img{width:100%;border-radius:8px;display:block;background:#fff}
  .card .n{font-size:12px;color:#94a3b8;margin:8px 0 6px;display:flex;justify-content:space-between;align-items:center}
  button{background:#8b5cf6;color:#fff;border:0;border-radius:6px;padding:5px 10px;font-size:12px;cursor:pointer}
  .bar{margin-bottom:16px}
  select{background:#1e293b;color:#e2e8f0;border:1px solid #334155;border-radius:6px;padding:4px 8px}
</style></head><body>
<h1>${title}（5 張卡）</h1>
<p>真實角色 SVG + 場景 + 已套中文字。要交給 Canva 就刪掉每張的 &lt;g id="text-overlay"&gt;。下載 PNG 供 Threads 直接發文。</p>
<div class="bar">PNG 尺寸 <select id="scale"><option value="1">1080×1350</option><option value="2" selected>2160×2700</option></select>
<button onclick="allPng()">全部下載 PNG</button></div>
<div class="row">
${cards.map((_, i) => `<div class="card"><img id="img${i}" src="card-${i + 1}.svg" alt="card ${i + 1}"/>
<div class="n"><span>card-${i + 1}</span><button onclick="png(${i})">下載 PNG</button></div></div>`).join('\n')}
</div>
<script>
async function png(i){
  const scale=+document.getElementById('scale').value, w=1080*scale, h=1350*scale;
  const res=await fetch('card-'+(i+1)+'.svg'); const svg=await res.text();
  const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));
  const img=new Image(); img.width=w; img.height=h;
  await new Promise((ok,err)=>{img.onload=ok;img.onerror=err;img.src=url;});
  const c=document.createElement('canvas'); c.width=w; c.height=h;
  c.getContext('2d').drawImage(img,0,0,w,h); URL.revokeObjectURL(url);
  const a=document.createElement('a'); a.download='${slug}-card-'+(i+1)+'.png';
  a.href=c.toDataURL('image/png'); a.click();
}
async function allPng(){for(let i=0;i<${cards.length};i++){await png(i);await new Promise(r=>setTimeout(r,300));}}
</script>
</body></html>`;
  writeFileSync(join(outDir, 'index.html'), html);
  return outDir;
}

TH = THEMES.yemao;
const yemaoCards = [yemaoCard1(), yemaoCard2(), yemaoCard3(), yemaoCard4(), yemaoCard5()];
const out1 = build('post-01-yemao', yemaoCards, { title: '夜貓藥師 — 第 1 篇', slug: 'yemao' });

TH = THEMES.foxi;
const foxiCards = [foxiCard1(), foxiCard2(), foxiCard3(), foxiCard4(), foxiCard5()];
const out2 = build('post-02-foxi', foxiCards, { title: '佛系藥師 — 第 2 篇', slug: 'foxi' });

TH = THEMES.jinniu;
const jinniuCards = [jinniuCard1(), jinniuCard2(), jinniuCard3(), jinniuCard4(), jinniuCard5()];
const out4 = build('post-04-jinniu', jinniuCards, { title: '金牛藥師 — 第 4 篇', slug: 'jinniu' });

TH = THEMES.iron;
const ironCards = [ironCard1(), ironCard2(), ironCard3(), ironCard4(), ironCard5()];
const out5 = build('post-05-iron', ironCards, { title: '鐵腕藥師 — 第 5 篇', slug: 'iron' });

TH = THEMES.ace;
const aceCards = [aceCard1(), aceCard2(), aceCard3(), aceCard4(), aceCard5()];
const out7 = build('post-07-ace', aceCards, { title: '學霸藥師 — 第 7 篇', slug: 'ace' });

TH = THEMES.beipiao;
const beipiaoCards = [beipiaoCard1(), beipiaoCard2(), beipiaoCard3(), beipiaoCard4(), beipiaoCard5()];
const out8 = build('post-08-beipiao', beipiaoCards, { title: '北漂藥師 — 第 8 篇', slug: 'beipiao' });

console.log('Wrote 夜貓 →', out1);
console.log('Wrote 佛系 →', out2);
console.log('Wrote 金牛 →', out4);
console.log('Wrote 鐵腕 →', out5);
console.log('Wrote 學霸 →', out7);
console.log('Wrote 北漂 →', out8);

// ── Full-series caption deck (SINGLE SOURCE OF TRUTH = the SERIES table) ──────
// Captions are generated from the same strings the cards render. For the two
// posts that have cards (01/02), the build ASSERTS every caption fragment is
// present on the rendered card SVGs — so a caption can never silently drift
// from its card. Posts 03–21 have no cards yet; when their cards are built they
// must read from this same table, keeping them aligned by construction.
const BASE_TAGS = ['#藥師', '#醫院藥師', '#藥師人生', '#藥師命運轉盤'];
const IDOL_TAG = {
  夜貓: '#夜貓藥師', 佛系: '#佛系藥師', 金牛: '#金牛藥師', 鐵腕: '#鐵腕藥師',
  學霸: '#學霸藥師', 北漂: '#北漂藥師', 教魂: '#教魂藥師',
};
const idolFull = (k) => `${k}藥師`;
const FATE_SUB = '50+ 家醫院，抽出命定那一間';
const CTA = '30 秒測出你的命運醫院';

const SERIES = [
  { wk: 1, no: '01', date: 'Tue Jul 28', type: 'idol', k: '夜貓',
    scen: ['大夜輪到天亮，咖啡當水喝', '別人放假，你在補班'], recog: '⋯這畫面是不是很熟悉？',
    factors: ['夜班津貼', '能否包大夜', '有無「無大夜」'], fate: '你的命運醫院是哪間？' },
  { wk: 1, no: '02', date: 'Thu Jul 30', type: 'idol', k: '佛系',
    scen: ['準時下班就是勝利', '錢夠用、心不累'], recog: '⋯這是你想要的日常嗎？',
    factors: ['免/少輪班', '有無「無大夜」', '工作單純穩定'], fate: '哪間醫院最適合佛系的你？' },
  { wk: 1, no: '03', date: 'Sun Aug 2', type: 'cmp', a: '夜貓', b: '佛系',
    aParts: ['凌晨 3 點還在調藥', '別人放假你在補班'], bParts: ['5 點準時下班', '週末不用補班'],
    metrics: ['作息', '大夜班', '心態'],
    valA: ['大夜輪到天亮', '能包就包', '忙一點也甘願'], valB: ['準時下班回家', '要「無大夜」', '錢夠用、心不累'] },
  { wk: 2, no: '04', date: 'Tue Aug 4', type: 'idol', k: '金牛',
    scen: ['年薪百萬是信仰', '簽約金、夜班費一分不放過'], recog: '⋯這畫面，是不是很有共鳴？',
    factors: ['薪資等級與年薪', '簽約金・留任獎金', '各項津貼疊加'], fate: '哪間醫院能餵飽金牛的你？' },
  { wk: 2, no: '05', date: 'Thu Aug 6', type: 'idol', k: '鐵腕',
    scen: ['追求穩定鐵飯碗', '公職保障足、年資完整'], recog: '⋯這是你要的安穩嗎？',
    factors: ['公立/私立差別', '年資與退休制度', '輪班與工時保障'], fate: '你的命運醫院是哪間公立醫院？' },
  { wk: 2, no: '06', date: 'Sun Aug 9', type: 'cmp', a: '金牛', b: '鐵腕',
    aLine: '金牛：私立高薪，津貼疊好疊滿', bLine: '鐵腕：公職穩定，年資退休都有',
    metrics: ['年薪帶', '保障制度', '加班意願'],
    valA: ['拚高薪', '看各院制度', '願加班換錢'], valB: ['穩定領', '公職保障佳', '守時、重保障'] },
  { wk: 3, no: '07', date: 'Tue Aug 11', type: 'idol', k: '學霸',
    scen: ['醫學中心衝一波，資源光環拉滿', '但節奏快到起飛'], recog: '⋯這畫面是不是很熟悉？',
    factors: ['PGY 訓練', '專科藥師・進階制度', '教學研究資源'], fate: '你的命運醫院是哪間醫學中心？' },
  { wk: 3, no: '08', date: 'Thu Aug 13', type: 'idol', k: '北漂',
    scen: ['為工作離鄉背井', '一卡皮箱闖天涯'], recog: '⋯這是你的日常嗎？',
    factors: ['宿舍/租屋補助', '宿舍距離與費用', '生活機能'], fate: '哪間醫院有你落腳的宿舍？' },
  { wk: 3, no: '09', date: 'Sun Aug 16', type: 'idol', k: '教魂',
    scen: ['帶學生比自己上班還累', '但看他們成長就充電'], recog: '⋯這是你的日常嗎？',
    factors: ['教學醫院資源', '帶教制度與時數', '進修・研討公假公費'], fate: '你的命運醫院是哪間教學醫院？' },
  { wk: 4, no: '10', date: 'Tue Aug 18', type: 'cmp', a: '教魂', b: '學霸',
    aLine: '教魂：帶學生，看他們發光', bLine: '學霸：拚研究，看自己發表',
    metrics: ['教學制度', '研究資源', '進修公假'] },
  { wk: 4, no: '11', date: 'Thu Aug 20', type: 'cmp', a: '佛系', b: '金牛',
    aLine: '佛系：錢夠用就好，心不累最重要', bLine: '金牛：拚一波，年薪百萬是信仰',
    metrics: ['月薪帶', '加班程度', '生活品質'] },
  { wk: 4, no: '12', date: 'Sun Aug 23', type: 'grid',
    body: ['藥師命運轉盤 · 全員集合', '', '7 種藥師人格，你是幾號？', '',
      '1. 學霸 · 醫學中心衝一波', '2. 教魂 · 帶學生比自己還累', '3. 北漂 · 一卡皮箱闖天涯',
      '4. 鐵腕 · 公職鐵飯碗', '5. 夜貓 · 大夜換高薪', '6. 佛系 · 準時下班就是勝利',
      '7. 金牛 · 年薪百萬是信仰', '', '留言你的號碼，我猜下一位 👇'].join('\n') },
  { wk: 5, no: '13', date: 'Tue Aug 25', type: 'cmp', a: '夜貓', b: '鐵腕',
    aLine: '夜貓：靠大夜衝收入，日夜顛倒', bLine: '鐵腕：公職少輪班，作息穩穩的',
    metrics: ['輪班強度', '作息', '保障制度'] },
  { wk: 5, no: '14', date: 'Thu Aug 27', type: 'cmp', a: '教魂', b: '北漂',
    aLine: '教魂：留下來，把學生帶起來', bLine: '北漂：離鄉背井，先卡到位子',
    metrics: ['選院動機', '是否離鄉', '成就感來源'] },
  { wk: 5, no: '15', date: 'Sun Aug 30', type: 'grid',
    body: ['藥師命運轉盤 · 7 種藥師的一天', '', '同樣是藥師，一天差很多？', '',
      '😴 夜貓：22:00 上班・03:00 咖啡・08:00 交班',
      '☀️ 佛系：08:30 打卡・17:00 下班・20:00 追劇',
      '📚 學霸：07:30 早查房・12:00 邊啃便當邊查文獻・20:00 還在',
      '👩‍🏫 教魂：08:00 帶學生・14:00 準備課程・18:00 改報告',
      '🎒 北漂：07:00 從宿舍出發・18:00 回宿舍・週末回家',
      '🛡️ 鐵腕：08:00 準時打卡・12:00 便當・17:00 準時下班',
      '💰 金牛：全天算津貼・加班費也算・年終最期待', '',
      '你的日常最像哪一種？留言告訴我 👇'].join('\n') },
  { wk: 6, no: '16', date: 'Tue Sep 1', type: 'cmp', a: '學霸', b: '夜貓',
    aLine: '學霸：資源拉滿，忙在拚研究與訓練', bLine: '夜貓：大夜衝收入，忙在熬夜輪班',
    metrics: ['成長資源', '輪班強度', '累的原因'] },
  { wk: 6, no: '17', date: 'Thu Sep 3', type: 'cmp', a: '教魂', b: '金牛',
    aLine: '教魂：帶學生的成就感，比加薪更實在', bLine: '金牛：能多賺一分是一分，年薪百萬是信仰',
    metrics: ['成就感來源', '對薪水的執著', '加班意願'] },
  { wk: 6, no: '18', date: 'Sun Sep 6', type: 'grid',
    body: ['藥師命運轉盤 · 薪水 × 生活 座標圖', '', '把 7 種藥師放上「薪水 × 生活」地圖：', '',
      '💰 金牛：拿得出高薪，還想兼顧生活',
      '😴 夜貓：高薪但爆肝，用命換錢',
      '📚 學霸：資源拉滿，但也累到不行',
      '🛡️ 鐵腕：中薪但穩，保障是最強護城河',
      '👩‍🏫 教魂：中薪，回報在學生的成長',
      '☀️ 佛系：錢夠用，心不累',
      '🎒 北漂：離家追高薪 + 宿舍，先卡位', '',
      '你落在哪個象限？留言告訴我 👇'].join('\n') },
  { wk: 7, no: '19', date: 'Tue Sep 8', type: 'cmp', a: '學霸', b: '鐵腕',
    aLine: '學霸：醫學中心衝一波，光環拉滿', bLine: '鐵腕：公職鐵飯碗，工時工作有保障',
    metrics: ['成長資源', '工時保障', '升遷天花板'] },
  { wk: 7, no: '20', date: 'Thu Sep 10', type: 'cmp', a: '佛系', b: '北漂',
    aLine: '佛系：待在熟悉的地方，錢夠用就好', bLine: '北漂：離鄉背井，先卡到好位子',
    metrics: ['是否離鄉', '生活步調', '宿舍需求'] },
  { wk: 7, no: '21', date: 'Sun Sep 13', type: 'grid',
    body: ['藥師命運轉盤 · 完結篇', '', '7 週、21 篇、7 種藥師人格。', '你，找到自己了嗎？', '',
      '還沒測過的 —', '30 秒測出你的命運醫院，連結在留言 👇', '',
      '已經測過的 —', '標記一位藥師朋友，告訴他你覺得他是「___藥師」🫵', '',
      '謝謝陪我到最後 🙏'].join('\n') },
];

function idolCaption(p) {
  return [
    `你，也是${idolFull(p.k)}嗎？`, '',
    p.scen[0], p.scen[1], p.recog, '',
    '面試前，先問這三件：', p.factors.join(' / '), '',
    p.fate, FATE_SUB, '',
    '換你了 👇',
  ].join('\n');
}
function cmpCaption(p) {
  const aLine = p.aLine || `${p.a}：${p.aParts.join('，')}`;
  const bLine = p.bLine || `${p.b}：${p.bParts.join('，')}`;
  return [
    p.title || `${p.a} vs ${p.b}：你更像誰？`, '',
    aLine, bLine, '',
    '關鍵差異：', p.metrics.join(' / '), '',
    '30 秒測出你的屬性', '',
    '換你了 👇',
  ].join('\n');
}
const captionOf = (p) => (p.type === 'idol' ? idolCaption(p) : p.type === 'cmp' ? cmpCaption(p) : p.body);
const tagsOf = (p) =>
  (p.type === 'idol' ? [...BASE_TAGS, IDOL_TAG[p.k]]
    : p.type === 'cmp' ? [...BASE_TAGS, IDOL_TAG[p.a], IDOL_TAG[p.b]]
      : BASE_TAGS).join(' ');
const labelOf = (p) =>
  p.type === 'idol' ? `${idolFull(p.k)}（idol）`
    : p.type === 'cmp' ? `${p.a} vs ${p.b}（comparison）`
      : `${p.body.split('\n')[0]}（grid）`;

// Alignment guarantee: every idol caption fragment must appear on its cards.
function assertAligned(name, svgs, p) {
  const hay = svgs.join('');
  const frags = [
    '你，也是', `${idolFull(p.k)} 嗎？`, ...p.scen, p.recog, ...p.factors, p.fate, FATE_SUB, CTA,
  ];
  for (const f of frags) {
    if (!hay.includes(f)) throw new Error(`[align:${name}] 卡片上找不到文案片段：「${f}」— 卡片與文案不一致`);
  }
  console.log(`align OK · ${name}：${frags.length} 段文字與卡片逐字相符`);
}
assertAligned('夜貓', yemaoCards, SERIES.find((p) => p.no === '01'));
assertAligned('佛系', foxiCards, SERIES.find((p) => p.no === '02'));
assertAligned('金牛', jinniuCards, SERIES.find((p) => p.no === '04'));
assertAligned('鐵腕', ironCards, SERIES.find((p) => p.no === '05'));
assertAligned('學霸', aceCards, SERIES.find((p) => p.no === '07'));
assertAligned('北漂', beipiaoCards, SERIES.find((p) => p.no === '08'));

// Comparison post 03 — cards rendered from the same SERIES entry as its caption.
TH = THEMES.cmp;
const p03 = SERIES.find((p) => p.no === '03');
const cmp03Cards = cmpCards(p03);
const out3 = build('post-03-yemao-vs-foxi', cmp03Cards, { title: '夜貓 vs 佛系 — 第 3 篇', slug: 'yemao-vs-foxi' });
function assertCmpAligned(name, svgs, p) {
  const hay = svgs.join('');
  const aParts = p.aParts || cmpParts(p.aLine);
  const bParts = p.bParts || cmpParts(p.bLine);
  const frags = [...aParts, ...bParts, ...p.metrics, ...(p.valA || []), ...(p.valB || []), '你更像誰？', '30 秒測出你的屬性'];
  for (const f of frags) {
    if (!hay.includes(f)) throw new Error(`[align:${name}] 卡片上找不到文案片段：「${f}」`);
  }
  console.log(`align OK · ${name}：${frags.length} 段文字與卡片相符`);
}
assertCmpAligned('夜貓vs佛系', cmp03Cards, p03);
console.log('Wrote 夜貓vs佛系 →', out3);

// Comparison post 06 — 金牛 vs 鐵腕 (aLine/bLine shape + qualitative value table).
const p06 = SERIES.find((p) => p.no === '06');
const cmp06Cards = cmpCards(p06);
const out6 = build('post-06-jinniu-vs-iron', cmp06Cards, { title: '金牛 vs 鐵腕 — 第 6 篇', slug: 'jinniu-vs-iron' });
assertCmpAligned('金牛vs鐵腕', cmp06Cards, p06);
console.log('Wrote 金牛vs鐵腕 →', out6);

let md = '# 藥師命運轉盤 · 全 21 篇貼文文案\n\n'
  + '> 由 `build-cards.mjs` 自動產生，單一來源＝`SERIES` 資料表（與卡片共用同一份文字）。\n'
  + '> 第 1、2 篇已通過「卡片 ↔ 文案」逐字比對；不要手改此檔，要改請改 `SERIES` 後重跑。\n\n'
  + '## 共用元素\n\n'
  + '### 第一則留言（21 篇皆同，發文後 60 秒內補在留言）\n\n'
  + '```\n' + CTA + '\n👉 https://pharm-fortune.vercel.app/?ref=threads\n```\n\n'
  + `### 標籤規則\n基礎：\`${BASE_TAGS.join(' ')}\`。idol 篇＋該偶像標籤；comparison 篇＋兩個偶像標籤；grid 篇僅基礎。\n\n---\n`;
let curWk = 0;
for (const p of SERIES) {
  if (p.wk !== curWk) { curWk = p.wk; md += `\n## Week ${curWk}\n`; }
  md += `\n### Post ${p.no} · ${p.date} · ${labelOf(p)}\n\n`
    + '**貼文：**\n```\n' + captionOf(p) + '\n```\n\n'
    + '**標籤：**\n```\n' + tagsOf(p) + '\n```\n';
}
md += '\n---\n\n## 發文流程（每篇）\n'
  + '1. 依序上傳 5 張 1080×1350 PNG。\n'
  + '2. 從本檔複製「貼文」貼進 Threads 內文，勿手打。\n'
  + '3. 發布輪播。\n'
  + '4. 60 秒內補上「第一則留言」。\n'
  + '5. 時間：台北 21:00–22:30（二／四／日）。\n\n'
  + 'Post 01 發布前：先用表單送一筆測試 lead，確認 Gmail 轉寄的「連結來源: threads」標記正確。\n';
writeFileSync(join(HERE, 'threads-captions.md'), md);
console.log('Wrote 文案 → threads-captions.md（21 篇）');
