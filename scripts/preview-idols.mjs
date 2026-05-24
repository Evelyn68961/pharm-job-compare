import { writeFileSync } from 'node:fs';

function lighten(hex, amount = 0.85) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const nr = Math.round(r + (255 - r) * amount);
  const ng = Math.round(g + (255 - g) * amount);
  const nb = Math.round(b + (255 - b) * amount);
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}

function backHair(style, hair) {
  if (style !== 'longF') return '';
  return `
    <path d="M 50 60 L 36 200 L 58 200 L 60 80 Z" fill="${hair}"/>
    <path d="M 150 60 L 164 200 L 142 200 L 140 80 Z" fill="${hair}"/>
  `;
}

function ponytailBehind(style, hair) {
  if (style !== 'ponytailF') return '';
  return `<path d="M 140 70 Q 170 82 172 130 Q 172 158 164 168 L 152 168 Q 160 152 158 130 Q 158 95 138 75 Z" fill="${hair}"/>`;
}

function topHair(style, hair) {
  switch (style) {
    case 'shortM':
      return `<path d="M 54 78 Q 54 36, 100 30 Q 146 36, 146 78 Q 132 74, 124 78 Q 100 66, 76 78 Q 68 74, 54 78 Z" fill="${hair}"/>`;
    case 'buzzM':
      return `<rect x="60" y="44" width="80" height="32" rx="4" fill="${hair}"/>`;
    case 'longF':
      return `<path d="M 50 88 Q 50 32, 100 28 Q 150 32, 150 88 Q 135 74, 122 84 Q 110 92, 100 80 Q 90 92, 78 84 Q 65 74, 50 88 Z" fill="${hair}"/>`;
    case 'ponytailF':
      return `<path d="M 54 76 Q 56 32, 100 28 Q 144 32, 146 76 Q 132 74, 124 76 Q 100 64, 76 76 Q 68 74, 54 76 Z" fill="${hair}"/>`;
    case 'bobF':
      return `<path d="M 50 120 L 50 50 Q 60 28, 100 28 Q 140 28, 150 50 L 150 120 Q 148 125, 142 122 L 142 86 Q 125 78, 100 72 Q 75 78, 58 86 L 58 122 Q 52 125, 50 120 Z" fill="${hair}"/>`;
    case 'spikyM':
      return `<path d="M 54 80 L 60 48 L 72 64 L 80 36 L 92 58 L 100 30 L 108 58 L 120 36 L 128 64 L 140 48 L 146 80 Q 130 74, 122 80 Q 100 68, 78 80 Q 70 74, 54 80 Z" fill="${hair}"/>`;
    default:
      return '';
  }
}

function eyes(expression) {
  if (expression === 'happyClosed') {
    return `
      <path d="M 73 96 Q 82 88 91 96" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M 109 96 Q 118 88 127 96" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    `;
  }
  return `
    <ellipse cx="82" cy="94" rx="6.5" ry="8.5" fill="#1a1a1a"/>
    <ellipse cx="84" cy="91" rx="2.2" ry="1.8" fill="white"/>
    <circle cx="80" cy="98" r="1" fill="white"/>
    <ellipse cx="118" cy="94" rx="6.5" ry="8.5" fill="#1a1a1a"/>
    <ellipse cx="120" cy="91" rx="2.2" ry="1.8" fill="white"/>
    <circle cx="116" cy="98" r="1" fill="white"/>
  `;
}

function mouthSvg(expression, lipstick) {
  const color = lipstick || '#3a2820';
  switch (expression) {
    case 'grin':
      return `
        <path d="M 86 116 Q 100 132 114 116 Q 100 124 86 116 Z" fill="#3a2820"/>
        <path d="M 90 120 Q 100 124 110 120" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      `;
    case 'serious':
      return `<path d="M 92 120 L 108 120" stroke="${color}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    case 'smirk':
      return `<path d="M 90 120 Q 100 121 112 114" stroke="${color}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    case 'happyClosed':
    case 'smile':
    default:
      return `<path d="M 92 117 Q 100 124 108 117" stroke="${color}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  }
}

function browsSvg(hair, hairStyle, expression) {
  if (hairStyle === 'bobF') return '';
  if (expression === 'serious') {
    return `
      <rect x="71" y="80" width="16" height="3.5" rx="0.5" fill="${hair}"/>
      <rect x="113" y="80" width="16" height="3.5" rx="0.5" fill="${hair}"/>
    `;
  }
  return `
    <rect x="73" y="80" width="14" height="3" rx="1.5" fill="${hair}"/>
    <rect x="113" y="80" width="14" height="3" rx="1.5" fill="${hair}"/>
  `;
}

function glassesSvg(enabled) {
  if (!enabled) return '';
  return `
    <g stroke="#1a1a1a" stroke-width="2" fill="none" stroke-linejoin="round">
      <rect x="69" y="86" width="24" height="17" rx="3"/>
      <rect x="107" y="86" width="24" height="17" rx="3"/>
      <path d="M 93 94 L 107 94"/>
    </g>
  `;
}

function crossSvg(enabled) {
  if (!enabled) return '';
  return `
    <g transform="translate(100, 158)">
      <rect x="-0.9" y="-3.5" width="1.8" height="8" fill="#c89028"/>
      <rect x="-3" y="-1" width="6" height="1.8" fill="#c89028"/>
    </g>
  `;
}

function iconSvg(name, accent) {
  const icons = {
    shield: `
      <path d="M -5 -6 L 5 -6 L 5 1 Q 5 6 0 7 Q -5 6 -5 1 Z" fill="${accent}"/>
      <path d="M -1 -3 L 1 -3 L 1 -1 L 3 -1 L 3 1 L 1 1 L 1 4 L -1 4 L -1 1 L -3 1 L -3 -1 L -1 -1 Z" fill="white"/>
    `,
    caduceus: `
      <rect x="-0.7" y="-6.5" width="1.4" height="13" fill="${accent}"/>
      <path d="M 0 -5 Q -4 -2, 0 0 Q 4 2, 0 5" stroke="${accent}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M 0 -5 Q 4 -2, 0 0 Q -4 2, 0 5" stroke="${accent}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M -3 -6 L 3 -6 L 0 -8 Z" fill="${accent}"/>
    `,
    heart: `<path d="M 0 -4 C -5 -10, -11 -3, 0 7 C 11 -3, 5 -10, 0 -4 Z" fill="${accent}" transform="scale(0.7)"/>`,
    dove: `
      <path d="M -7 1 Q -3 -5, 1 -2 Q 5 -6, 7 -1 L 5 3 L 2 1 L -1 3 L -4 1 Z" fill="${accent}"/>
      <circle cx="6" cy="-1" r="0.6" fill="white"/>
    `,
    cross: `
      <rect x="-1.3" y="-7" width="2.6" height="14" fill="${accent}"/>
      <rect x="-5.5" y="-1.3" width="11" height="2.6" fill="${accent}"/>
    `,
    plumBlossom: `
      <g fill="${accent}">
        <circle cx="0" cy="-4.3" r="2.7"/>
        <circle cx="4.1" cy="-1.3" r="2.7"/>
        <circle cx="2.55" cy="3.5" r="2.7"/>
        <circle cx="-2.55" cy="3.5" r="2.7"/>
        <circle cx="-4.1" cy="-1.3" r="2.7"/>
      </g>
      <circle r="1.4" fill="white"/>
    `,
    star: `<polygon points="0,-7.5 2.1,-2.3 7.5,-2.3 3.2,1.4 4.8,7 0,3.7 -4.8,7 -3.2,1.4 -7.5,-2.3 -2.1,-2.3" fill="${accent}"/>`,
    crossInHeart: `
      <path d="M 0 -3 C -5 -10, -11 -3, 0 7 C 11 -3, 5 -10, 0 -3 Z" fill="${accent}" transform="scale(0.75)"/>
      <rect x="-0.7" y="-2" width="1.4" height="5" fill="white"/>
      <rect x="-2" y="-0.5" width="4" height="1.4" fill="white"/>
    `,
    tree: `
      <rect x="-0.8" y="2" width="1.6" height="5" fill="#6b3e1f"/>
      <path d="M 0 -7 L 6 0 L 4 0 L 7 4 L -7 4 L -4 0 L -6 0 Z" fill="${accent}"/>
    `,
    yinYang: `
      <circle r="7" fill="${accent}"/>
      <path d="M 0 -7 A 7 7 0 0 1 0 7 A 3.5 3.5 0 0 1 0 0 A 3.5 3.5 0 0 0 0 -7 Z" fill="white"/>
      <circle cx="0" cy="-3.5" r="1.1" fill="white"/>
      <circle cx="0" cy="3.5" r="1.1" fill="${accent}"/>
    `,
    circleCross: `
      <circle r="7" fill="none" stroke="${accent}" stroke-width="1.5"/>
      <rect x="-0.9" y="-4" width="1.8" height="8" fill="${accent}"/>
      <rect x="-4" y="-0.9" width="8" height="1.8" fill="${accent}"/>
    `,
    starCross: `
      <polygon points="0,-7.5 2.1,-2.3 7.5,-2.3 3.2,1.4 4.8,7 0,3.7 -4.8,7 -3.2,1.4 -7.5,-2.3 -2.1,-2.3" fill="${accent}"/>
      <rect x="-0.6" y="-1.8" width="1.2" height="3.6" fill="white"/>
      <rect x="-1.8" y="-0.6" width="3.6" height="1.2" fill="white"/>
    `,
  };
  return icons[name] || '';
}

function logoPin(iconName, accent) {
  if (!iconName) return '';
  return `
    <g transform="translate(66, 182)">
      <circle r="11" fill="white" stroke="${accent}" stroke-width="1.3"/>
      ${iconSvg(iconName, accent)}
    </g>
  `;
}

function renderIdol(p) {
  const accent = p.accent;
  const accentLight = lighten(accent, 0.82);
  const { hair, skin, hairStyle, glasses, expression, cross, lipstick, icon } = p;
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <circle cx="100" cy="100" r="100" fill="${accentLight}"/>

    ${backHair(hairStyle, hair)}
    ${ponytailBehind(hairStyle, hair)}

    <rect x="22" y="148" width="22" height="55" rx="4" fill="${skin}"/>
    <rect x="40" y="148" width="4" height="55" fill="#000" opacity="0.12"/>
    <rect x="156" y="148" width="22" height="55" rx="4" fill="${skin}"/>
    <rect x="156" y="148" width="4" height="55" fill="#000" opacity="0.12"/>

    <rect x="46" y="148" width="108" height="60" fill="${accent}"/>
    <rect x="138" y="148" width="16" height="60" fill="#000" opacity="0.10"/>
    <path d="M 80 148 L 100 170 L 120 148 Z" fill="white"/>
    <rect x="46" y="146" width="108" height="2.5" fill="#000" opacity="0.20"/>

    ${crossSvg(cross)}
    ${logoPin(icon, accent)}

    <rect x="86" y="138" width="28" height="10" fill="${skin}"/>
    <rect x="86" y="144" width="28" height="4" fill="#000" opacity="0.15"/>

    <ellipse cx="100" cy="92" rx="46" ry="48" fill="${skin}"/>

    ${topHair(hairStyle, hair)}

    ${browsSvg(hair, hairStyle, expression)}
    ${eyes(expression)}

    <ellipse cx="68" cy="110" rx="6" ry="3.5" fill="#ffaaaa" opacity="0.50"/>
    <ellipse cx="132" cy="110" rx="6" ry="3.5" fill="#ffaaaa" opacity="0.50"/>

    ${mouthSvg(expression, lipstick)}
    ${glassesSvg(glasses)}
  </svg>`;
}

const idols = [
  { hospitalShort: '北榮桃園分院', icon: 'shield', sex: '男', accent: '#2a8b8b', hair: '#3a3530', skin: '#f0c896', hairStyle: 'shortM', glasses: true, expression: 'smile', desc: '榮民系統 ・ 沉穩', iconWhy: '盾牌：公立榮總體系權威' },
  { hospitalShort: '萬芳醫院', icon: 'caduceus', sex: '女', accent: '#6a3d8e', hair: '#2d1f17', skin: '#f5d5b0', hairStyle: 'ponytailF', glasses: false, expression: 'grin', desc: '北醫體系 ・ 朝氣', iconWhy: '醫神杖：醫學中心級' },
  { hospitalShort: '秉坤婦幼醫院', icon: 'heart', sex: '女', accent: '#e88faa', hair: '#5a3a20', skin: '#ffe0c4', hairStyle: 'longF', glasses: false, expression: 'smile', lipstick: '#c44d6e', desc: '婦幼專科 ・ 溫柔', iconWhy: '愛心：婦幼專科' },
  { hospitalShort: '大里仁愛醫院', icon: 'dove', sex: '女', accent: '#c84545', hair: '#1a1a1a', skin: '#ffe8d1', hairStyle: 'bobF', glasses: false, expression: 'smile', desc: '私立中型 ・ 親切', iconWhy: '白鴿：仁愛博愛之意' },
  { hospitalShort: '永和耕莘醫院', icon: 'cross', sex: '女', accent: '#1f4a8a', hair: '#3a2820', skin: '#ffe8d1', hairStyle: 'bobF', glasses: true, expression: 'happyClosed', cross: true, desc: '天主教耕莘 ・ 學者', iconWhy: '十字架：天主教耕莘' },
  { hospitalShort: '中山醫大附醫', icon: 'plumBlossom', sex: '男', accent: '#1f5fa0', hair: '#1a1a1a', skin: '#f0c896', hairStyle: 'shortM', glasses: true, expression: 'smile', desc: '醫學中心 ・ 專業', iconWhy: '梅花：中山校徽核心元素' },
  { hospitalShort: '三總北投分院', icon: 'star', sex: '男', accent: '#1f3a5c', hair: '#1a1a1a', skin: '#d9a37a', hairStyle: 'buzzM', glasses: false, expression: 'serious', desc: '國防醫學 ・ 軍紀', iconWhy: '五角星：軍方識別' },
  { hospitalShort: '輔大附醫', icon: 'crossInHeart', sex: '女', accent: '#0d8a8a', hair: '#3a2820', skin: '#ffe0c4', hairStyle: 'longF', glasses: false, expression: 'smile', cross: true, desc: '天主教輔大 ・ 端莊', iconWhy: '聖心十字：天主教輔大' },
  { hospitalShort: '國泰綜合醫院', icon: 'tree', sex: '男', accent: '#2d7a3d', hair: '#2d1f17', skin: '#f4c89b', hairStyle: 'shortM', glasses: false, expression: 'smile', desc: '國泰集團 ・ 沉穩', iconWhy: '樹：國泰集團識別主視覺' },
  { hospitalShort: '中醫大臺北分院', icon: 'yinYang', sex: '女', accent: '#c44545', hair: '#1a1a1a', skin: '#f5d5b0', hairStyle: 'bobF', glasses: false, expression: 'grin', desc: '中國醫藥大學 ・ 親和', iconWhy: '太極：中醫傳統' },
  { hospitalShort: '安南醫院', icon: 'circleCross', sex: '男', accent: '#c44545', hair: '#3a2820', skin: '#d9a37a', hairStyle: 'spikyM', glasses: false, expression: 'grin', desc: '台南市立 ・ 熱情', iconWhy: '圓中十字：市立公醫' },
  { hospitalShort: '新國民醫院', icon: 'starCross', sex: '女', accent: '#6a3d8e', hair: '#5a3a20', skin: '#ffe0c4', hairStyle: 'ponytailF', glasses: false, expression: 'happyClosed', desc: '北醫體系小院 ・ 溫暖', iconWhy: '星十字：北醫小型院區' },
];

const html = `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8"/>
<title>藥師吉祥物 v5 — 真實 12 院</title>
<style>
  body { font-family: system-ui, -apple-system, 'PingFang TC', 'Noto Sans TC', sans-serif; background: #f7f7f8; padding: 32px; margin: 0; color: #1f2937; }
  h1 { font-size: 22px; margin: 0 0 8px; }
  p.sub { color: #6b7280; margin: 0 0 28px; font-size: 13px; line-height: 1.7; max-width: 760px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 16px; max-width: 1300px; margin-bottom: 40px; }
  .card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px; text-align: center; }
  .card .avatar { width: 150px; height: 150px; margin: 0 auto; }
  .card h3 { margin: 8px 0 2px; font-size: 14px; }
  .sex { display: inline-block; padding: 1px 5px; border-radius: 4px; font-size: 10px; margin-left: 3px; vertical-align: middle; }
  .sex-male { background: #dbeafe; color: #1e40af; }
  .sex-female { background: #fce7f3; color: #9d174d; }
  .desc { color: #6b7280; font-size: 11px; margin-top: 2px; }
  .swatch { display: inline-block; width: 10px; height: 10px; border-radius: 50%; vertical-align: middle; margin-right: 3px; border: 1px solid rgba(0,0,0,0.08); }
  .hex { font-family: ui-monospace, monospace; font-size: 10px; color: #6b7280; }
  .integrated { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; max-width: 760px; }
  .integrated h2 { font-size: 16px; margin: 0 0 14px; }
  .job-card { display: flex; gap: 16px; align-items: flex-start; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 10px; }
  .job-card .avatar { width: 64px; height: 64px; border-radius: 50%; flex-shrink: 0; border: 1px solid #e5e7eb; overflow: hidden; background: #fafafa; }
  .job-card h4 { margin: 0; font-size: 16px; }
  .job-card h4 small { color: #6b7280; font-weight: normal; font-size: 13px; margin-left: 4px; }
  .job-card p { margin: 4px 0 0; color: #6b7280; font-size: 13px; }
</style>
</head>
<body>
  <h1>藥師吉祥物 v5 — 你 Notion 裡的 12 家醫院</h1>
  <p class="sub">
    主色直接從 Notion 的「識別色」欄位讀取（目前是我預設值；你在 Notion 改任何 hex，下次刷新就會生效）。
    背景淺色自動由主色生成。每家醫院的性別/髮型/表情/配件根據其體系（公立/私立、軍醫/教會/婦幼）來區分。
  </p>

  <div class="grid">
    ${idols.map(i => `
      <div class="card">
        <div class="avatar">${renderIdol(i)}</div>
        <h3>${i.hospitalShort}<span class="sex sex-${i.sex === '男' ? 'male' : 'female'}">${i.sex}</span></h3>
        <div class="desc">${i.desc}</div>
        <div style="margin-top:6px"><span class="swatch" style="background:${i.accent}"></span><span class="hex">${i.accent}</span></div>
        <div style="margin-top:4px;font-size:10px;color:#9ca3af">${i.iconWhy}</div>
      </div>
    `).join('')}
  </div>

  <div class="integrated">
    <h2>JobCard 中的實際大小（64×64 圓形）— 前 5 家</h2>
    ${idols.slice(0, 5).map(i => `
      <div class="job-card">
        <div class="avatar">${renderIdol(i)}</div>
        <div>
          <h4>${i.hospitalShort} <small>${i.desc}</small></h4>
          <p>${i.accent} ・ ${i.sex}</p>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

writeFileSync('preview-idols.html', html);
console.log('Wrote preview-idols.html');
