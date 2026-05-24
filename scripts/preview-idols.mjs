import { writeFileSync } from 'node:fs';

function backHair(style, hair) {
  if (style !== 'longF') return '';
  return `
    <path d="M 50 60 L 36 200 L 58 200 L 60 80 Z" fill="${hair}"/>
    <path d="M 150 60 L 164 200 L 142 200 L 140 80 Z" fill="${hair}"/>
  `;
}

function ponytailBehind(style, hair) {
  if (style !== 'ponytailF') return '';
  return `
    <path d="M 140 70 Q 170 82 172 130 Q 172 158 164 168 L 152 168 Q 160 152 158 130 Q 158 95 138 75 Z" fill="${hair}"/>
  `;
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

function earringsSvg(enabled, accent) {
  if (!enabled) return '';
  return `
    <circle cx="54" cy="108" r="2.5" fill="${accent}"/>
    <circle cx="146" cy="108" r="2.5" fill="${accent}"/>
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

function monogramPin(monogram, accent) {
  if (!monogram) return '';
  return `
    <g transform="translate(66, 182)">
      <rect x="-11" y="-8" width="22" height="16" rx="2" fill="white" stroke="${accent}" stroke-width="1"/>
      <text x="0" y="4.5" text-anchor="middle" font-size="12" font-weight="bold" fill="${accent}" font-family="-apple-system, BlinkMacSystemFont, 'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei', sans-serif">${monogram}</text>
    </g>
  `;
}

function renderIdol(p) {
  const { accent, accentLight, hair, skin, hairStyle, glasses, expression, earrings, cross, lipstick, monogram } = p;
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
    ${monogramPin(monogram, accent)}

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
    ${earringsSvg(earrings, accent)}
  </svg>`;
}

const idols = [
  {
    hospitalShort: '林口長庚',
    monogram: '長',
    sex: '女',
    accent: '#1e6b3d',
    accentLight: '#d4e8d8',
    hair: '#3a2820',
    skin: '#f5d5b0',
    hairStyle: 'ponytailF',
    glasses: false,
    expression: 'grin',
    earrings: true,
    desc: '私立財團法人 ・ 高效率規模',
    rationale: '主色採長庚體系深綠（源自台塑集團識別）。馬尾＋大笑代表大型私立醫院的高效率年輕氣質。',
  },
  {
    hospitalShort: '北榮桃園',
    monogram: '榮',
    sex: '男',
    accent: '#a93232',
    accentLight: '#f4d8d8',
    hair: '#3a3530',
    skin: '#f0c896',
    hairStyle: 'shortM',
    glasses: true,
    expression: 'smile',
    desc: '榮總公立體系 ・ 沉穩傳統',
    rationale: '主色採榮民系統紅。短髮＋眼鏡＋淺笑代表公立醫院的資深專業形象。',
  },
  {
    hospitalShort: '三軍總院',
    monogram: '三',
    sex: '男',
    accent: '#1f3a5c',
    accentLight: '#d4dde9',
    hair: '#1a1a1a',
    skin: '#d9a37a',
    hairStyle: 'buzzM',
    glasses: false,
    expression: 'serious',
    desc: '國防醫學體系 ・ 軍紀嚴明',
    rationale: '主色採軍方深藍。平頭＋嚴肅表情＋粗直眉代表軍醫院的紀律與權威。',
  },
  {
    hospitalShort: '輔大附醫',
    monogram: '輔',
    sex: '女',
    accent: '#1f3a78',
    accentLight: '#dce2f0',
    hair: '#d4a85a',
    skin: '#ffe8d1',
    hairStyle: 'bobF',
    glasses: true,
    expression: 'happyClosed',
    cross: true,
    desc: '天主教大學附設 ・ 學者氣質',
    rationale: '主色採輔大深藍，搭配領口金色十字架。鮑伯髮＋眼鏡＋笑眼代表書卷氣與宗教溫和感。',
  },
  {
    hospitalShort: '高雄榮總',
    monogram: '高',
    sex: '女',
    accent: '#b53d3d',
    accentLight: '#f4dada',
    hair: '#8b6238',
    skin: '#cc9966',
    hairStyle: 'longF',
    glasses: false,
    expression: 'grin',
    lipstick: '#c44d6e',
    desc: '南部榮總 ・ 南台灣熱情',
    rationale: '主色同樣是榮總紅但略偏南部明亮版。長髮＋深膚色＋大笑代表南台灣的熱情與陽光。',
  },
];

const html = `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8"/>
<title>藥師吉祥物 v4 — 依醫院特性設計</title>
<style>
  body { font-family: system-ui, -apple-system, 'PingFang TC', 'Noto Sans TC', sans-serif; background: #f7f7f8; padding: 32px; margin: 0; color: #1f2937; }
  h1 { font-size: 22px; margin: 0 0 8px; }
  p.sub { color: #6b7280; margin: 0 0 28px; font-size: 13px; line-height: 1.7; max-width: 800px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; max-width: 1200px; margin-bottom: 40px; }
  .card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
  .card .avatar { width: 170px; height: 170px; margin: 0 auto; display: block; }
  .card h3 { margin: 12px 0 4px; font-size: 16px; text-align: center; }
  .sex { display: inline-block; padding: 1px 6px; border-radius: 4px; font-size: 11px; margin-left: 4px; vertical-align: middle; }
  .sex-male { background: #dbeafe; color: #1e40af; }
  .sex-female { background: #fce7f3; color: #9d174d; }
  .desc { color: #6b7280; font-size: 12px; text-align: center; margin-top: 4px; margin-bottom: 8px; }
  .rationale { font-size: 11px; color: #4b5563; line-height: 1.55; padding: 8px 10px; background: #f9fafb; border-left: 3px solid; border-radius: 3px; margin-top: 8px; }
  .integrated { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; max-width: 760px; }
  .integrated h2 { font-size: 16px; margin: 0 0 14px; }
  .job-card { display: flex; gap: 16px; align-items: flex-start; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 10px; }
  .job-card .avatar { width: 64px; height: 64px; border-radius: 50%; flex-shrink: 0; border: 1px solid #e5e7eb; overflow: hidden; background: #fafafa; }
  .job-card h4 { margin: 0; font-size: 16px; }
  .job-card h4 small { color: #6b7280; font-weight: normal; font-size: 13px; margin-left: 4px; }
  .job-card p { margin: 4px 0 0; color: #6b7280; font-size: 13px; }
  .warning { margin-top: 32px; padding: 14px 18px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; font-size: 13px; color: #78350f; max-width: 760px; line-height: 1.7; }
</style>
</head>
<body>
  <h1>藥師吉祥物 v4 — 依醫院特性設計</h1>
  <p class="sub">
    這版每個角色都根據醫院的<strong>品牌色</strong>、<strong>類型</strong>（公立/私立/軍醫/教會）、<strong>地理位置</strong>來決定設計：
    主色取自醫院識別、領口別著該院標誌、髮型表情呼應該院氣質。
  </p>

  <div class="grid">
    ${idols.map(i => `
      <div class="card">
        <div class="avatar">${renderIdol(i)}</div>
        <h3>${i.hospitalShort}<span class="sex sex-${i.sex === '男' ? 'male' : 'female'}">${i.sex}</span></h3>
        <div class="desc">${i.desc}</div>
        <div class="rationale" style="border-color: ${i.accent}">${i.rationale}</div>
      </div>
    `).join('')}
  </div>

  <div class="integrated">
    <h2>JobCard 中的實際大小（64×64 圓形）</h2>
    ${idols.map(i => `
      <div class="job-card">
        <div class="avatar">${renderIdol(i)}</div>
        <div>
          <h4>${i.hospitalShort}醫院 <small>${i.desc}</small></h4>
          <p>桃園市 ・ 一般藥師 ・ 月薪約 50,000</p>
        </div>
      </div>
    `).join('')}
  </div>

  <div class="warning">
    <strong>誠實提醒：</strong> 我無法從容器存取台灣醫院官網（網路政策擋住了 .gov.tw / .edu.tw / .org.tw），
    所以這些主色是我根據對醫院體系的<strong>一般認知</strong>推斷的：長庚 → 台塑深綠、榮總 → 系統紅、
    三總 → 軍方深藍、輔大 → 天主教深藍 + 金十字。
    <br/>
    <strong>如果你知道正確的品牌色 hex code，請告訴我，我直接套用。</strong>
    特別是長庚的綠是否正確？三總是用藍還是綠？輔大實際識別色？
  </div>
</body>
</html>`;

writeFileSync('preview-idols.html', html);
console.log('Wrote preview-idols.html');
