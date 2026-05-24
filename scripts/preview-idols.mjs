import { writeFileSync } from 'node:fs';

function backHair(style, hair) {
  if (style !== 'longF') return '';
  return `
    <path d="M 50 60 L 36 200 L 58 200 L 60 80 Z" fill="${hair}"/>
    <path d="M 150 60 L 164 200 L 142 200 L 140 80 Z" fill="${hair}"/>
  `;
}

function topHair(style, hair) {
  switch (style) {
    case 'shortM':
      return `<path d="M 54 78 Q 54 36, 100 30 Q 146 36, 146 78 Q 132 74, 124 78 Q 100 66, 76 78 Q 68 74, 54 78 Z" fill="${hair}"/>`;
    case 'longF':
      return `<path d="M 50 88 Q 50 32, 100 28 Q 150 32, 150 88 Q 135 74, 122 84 Q 110 92, 100 80 Q 90 92, 78 84 Q 65 74, 50 88 Z" fill="${hair}"/>`;
    case 'spikyM':
      return `<path d="M 54 80 L 60 48 L 72 64 L 80 36 L 92 58 L 100 30 L 108 58 L 120 36 L 128 64 L 140 48 L 146 80 Q 130 74, 122 80 Q 100 68, 78 80 Q 70 74, 54 80 Z" fill="${hair}"/>`;
    case 'bobF':
      return `<path d="M 50 120 L 50 50 Q 60 28, 100 28 Q 140 28, 150 50 L 150 120 Q 148 125, 142 122 L 142 86 Q 125 78, 100 72 Q 75 78, 58 86 L 58 122 Q 52 125, 50 120 Z" fill="${hair}"/>`;
    case 'beanieM':
      return `
        <rect x="46" y="34" width="108" height="40" rx="8" fill="${hair}"/>
        <rect x="46" y="64" width="108" height="10" fill="#000" opacity="0.22"/>
        <circle cx="100" cy="32" r="6" fill="${hair}"/>
        <circle cx="56" cy="78" r="5" fill="${hair}"/>
        <circle cx="144" cy="78" r="5" fill="${hair}"/>
        <circle cx="64" cy="85" r="4" fill="${hair}"/>
        <circle cx="136" cy="85" r="4" fill="${hair}"/>
      `;
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

function mouth(expression, lipstick) {
  const color = lipstick || '#3a2820';
  switch (expression) {
    case 'grin':
      return `
        <path d="M 86 116 Q 100 132 114 116 Q 100 124 86 116 Z" fill="#3a2820"/>
        <path d="M 90 120 Q 100 124 110 120" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      `;
    case 'smirk':
      return `<path d="M 90 120 Q 100 121 112 114" stroke="${color}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    case 'happyClosed':
    case 'smile':
    default:
      return `<path d="M 92 117 Q 100 124 108 117" stroke="${color}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  }
}

function brows(hair, hairStyle) {
  if (hairStyle === 'bobF') return '';
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

function earringsSvg(enabled, accent) {
  if (!enabled) return '';
  return `
    <circle cx="54" cy="108" r="2.5" fill="${accent}"/>
    <circle cx="146" cy="108" r="2.5" fill="${accent}"/>
  `;
}

function renderIdol(p) {
  const { accent, accentLight, hair, skin, hairStyle, glasses, expression, earrings, lipstick } = p;
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <circle cx="100" cy="100" r="100" fill="${accentLight}"/>

    ${backHair(hairStyle, hair)}

    <rect x="22" y="148" width="22" height="55" rx="4" fill="${skin}"/>
    <rect x="40" y="148" width="4" height="55" fill="#000" opacity="0.12"/>
    <rect x="156" y="148" width="22" height="55" rx="4" fill="${skin}"/>
    <rect x="156" y="148" width="4" height="55" fill="#000" opacity="0.12"/>

    <rect x="46" y="148" width="108" height="60" fill="${accent}"/>
    <rect x="138" y="148" width="16" height="60" fill="#000" opacity="0.10"/>
    <path d="M 80 148 L 100 170 L 120 148 Z" fill="white"/>
    <rect x="46" y="146" width="108" height="2.5" fill="#000" opacity="0.20"/>

    <rect x="86" y="138" width="28" height="10" fill="${skin}"/>
    <rect x="86" y="144" width="28" height="4" fill="#000" opacity="0.15"/>

    <ellipse cx="100" cy="92" rx="46" ry="48" fill="${skin}"/>

    ${topHair(hairStyle, hair)}

    ${brows(hair, hairStyle)}
    ${eyes(expression)}

    <ellipse cx="68" cy="110" rx="6" ry="3.5" fill="#ffaaaa" opacity="0.55"/>
    <ellipse cx="132" cy="110" rx="6" ry="3.5" fill="#ffaaaa" opacity="0.55"/>

    ${mouth(expression, lipstick)}
    ${glassesSvg(glasses)}
    ${earringsSvg(earrings, accent)}
  </svg>`;
}

const idols = [
  {
    hospitalShort: '林口長庚',
    sex: '男',
    accent: '#ef9a6b', accentLight: '#fbe1d0', hair: '#3a2820', skin: '#f4c89b',
    hairStyle: 'shortM', glasses: false, expression: 'smile',
    desc: '俐落短髮 ・ 微笑',
  },
  {
    hospitalShort: '北榮桃園',
    sex: '女',
    accent: '#3fb796', accentLight: '#d6f0e7', hair: '#1a1a1a', skin: '#ffe0c4',
    hairStyle: 'longF', glasses: false, expression: 'smile',
    earrings: true, lipstick: '#c44d6e',
    desc: '黑長直 ・ 耳環 ・ 淡妝',
  },
  {
    hospitalShort: '三軍總院',
    sex: '男',
    accent: '#e88599', accentLight: '#fae0e6', hair: '#5a3a20', skin: '#d9a37a',
    hairStyle: 'spikyM', glasses: false, expression: 'grin',
    desc: '蓬亂尖髮 ・ 大笑',
  },
  {
    hospitalShort: '輔大附醫',
    sex: '女',
    accent: '#9b87cc', accentLight: '#ebe4f7', hair: '#e0c878', skin: '#ffe8d1',
    hairStyle: 'bobF', glasses: true, expression: 'happyClosed',
    earrings: true,
    desc: '金色短鮑 ・ 眼鏡 ・ 笑眼',
  },
  {
    hospitalShort: '高雄榮總',
    sex: '男',
    accent: '#6db4d9', accentLight: '#d6ecf7', hair: '#2d2018', skin: '#a87a55',
    hairStyle: 'beanieM', glasses: false, expression: 'smirk',
    desc: '毛帽 ・ 壞笑',
  },
];

const html = `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8"/>
<title>藥師吉祥物預覽 v3 — 多樣化</title>
<style>
  body { font-family: system-ui, -apple-system, 'PingFang TC', 'Noto Sans TC', sans-serif; background: #f7f7f8; padding: 32px; margin: 0; color: #1f2937; }
  h1 { font-size: 22px; margin: 0 0 8px; }
  p.sub { color: #6b7280; margin: 0 0 28px; font-size: 13px; line-height: 1.7; max-width: 760px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; max-width: 1200px; margin-bottom: 40px; }
  .card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; text-align: center; }
  .card .avatar { width: 170px; height: 170px; margin: 0 auto; }
  .card h3 { margin: 12px 0 4px; font-size: 16px; }
  .sex { display: inline-block; padding: 1px 6px; border-radius: 4px; font-size: 11px; margin-left: 4px; vertical-align: middle; }
  .sex-male { background: #dbeafe; color: #1e40af; }
  .sex-female { background: #fce7f3; color: #9d174d; }
  .desc { color: #6b7280; font-size: 12px; margin-top: 4px; }
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
  <h1>藥師吉祥物 v3 — 多樣化版（5 個樣本）</h1>
  <p class="sub">
    每個角色獨立設計：性別、髮型、髮色、膚色、表情、配件（眼鏡、耳環、毛帽、口紅）全都不同。<br/>
    頭部改用橢圓形（不再方框），保留「Roblox 風格」的塊狀身體 + 區塊縫隙。
  </p>

  <div class="grid">
    ${idols.map(i => `
      <div class="card">
        <div class="avatar">${renderIdol(i)}</div>
        <h3>${i.hospitalShort}<span class="sex sex-${i.sex === '男' ? 'male' : 'female'}">${i.sex}</span></h3>
        <div class="desc">${i.desc}</div>
      </div>
    `).join('')}
  </div>

  <div class="integrated">
    <h2>JobCard 中的實際大小（64×64 圓形）</h2>
    ${idols.map(i => `
      <div class="job-card">
        <div class="avatar">${renderIdol(i)}</div>
        <div>
          <h4>${i.hospitalShort}醫院 <small>(公立)</small></h4>
          <p>${i.desc}</p>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

writeFileSync('preview-idols.html', html);
console.log('Wrote preview-idols.html');
