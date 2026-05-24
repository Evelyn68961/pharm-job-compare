import { writeFileSync } from 'node:fs';

function renderIdol({ accent, accentLight, hair, skin = '#fde4cc' }) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <circle cx="100" cy="100" r="100" fill="${accentLight}"/>

    <g fill="white" opacity="0.9">
      <path d="M 28 32 L 30 28 L 32 32 L 36 34 L 32 36 L 30 40 L 28 36 L 24 34 Z"/>
      <path d="M 170 35 L 172 31 L 174 35 L 178 37 L 174 39 L 172 43 L 170 39 L 166 37 Z"/>
      <path d="M 22 145 L 24 141 L 26 145 L 30 147 L 26 149 L 24 153 L 22 149 L 18 147 Z"/>
      <path d="M 175 150 L 177 146 L 179 150 L 183 152 L 179 154 L 177 158 L 175 154 L 171 152 Z"/>
    </g>

    <path d="M 15 200 Q 15 160 100 160 Q 185 160 185 200 Z" fill="white" stroke="${accent}" stroke-width="1.5"/>
    <path d="M 80 160 L 100 178 L 88 188 Z" fill="${accent}" opacity="0.85"/>
    <path d="M 120 160 L 100 178 L 112 188 Z" fill="${accent}" opacity="0.85"/>

    <ellipse cx="100" cy="148" rx="13" ry="11" fill="${skin}"/>

    <path d="M 55 92 C 55 44, 145 44, 145 92 L 145 128 C 134 120, 118 116, 100 116 C 82 116, 66 120, 55 128 Z" fill="${hair}"/>

    <ellipse cx="100" cy="100" rx="40" ry="44" fill="${skin}"/>

    <path d="M 62 86 Q 78 52 100 64 Q 122 52 138 86 Q 124 80 110 82 Q 100 90 90 82 Q 76 80 62 86 Z" fill="${hair}"/>

    <g transform="translate(132, 66)">
      <path d="M -9 0 Q -5 -5 0 -1 Q 5 -5 9 0 Q 5 5 0 1 Q -5 5 -9 0 Z" fill="${accent}"/>
      <circle r="2" fill="${accent}" opacity="0.7"/>
    </g>

    <ellipse cx="76" cy="120" rx="7" ry="4" fill="#ffaaaa" opacity="0.5"/>
    <ellipse cx="124" cy="120" rx="7" ry="4" fill="#ffaaaa" opacity="0.5"/>

    <ellipse cx="82" cy="108" rx="8" ry="11" fill="white"/>
    <ellipse cx="82" cy="109" rx="6" ry="9" fill="${accent}"/>
    <circle cx="82" cy="110" r="3" fill="#1a1a1a"/>
    <ellipse cx="84" cy="104" rx="2.5" ry="2" fill="white"/>
    <circle cx="80" cy="113" r="1" fill="white"/>

    <ellipse cx="118" cy="108" rx="8" ry="11" fill="white"/>
    <ellipse cx="118" cy="109" rx="6" ry="9" fill="${accent}"/>
    <circle cx="118" cy="110" r="3" fill="#1a1a1a"/>
    <ellipse cx="120" cy="104" rx="2.5" ry="2" fill="white"/>
    <circle cx="116" cy="113" r="1" fill="white"/>

    <path d="M 72 92 Q 82 88 92 92" stroke="${hair}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M 108 92 Q 118 88 128 92" stroke="${hair}" stroke-width="2.2" fill="none" stroke-linecap="round"/>

    <path d="M 94 128 Q 100 133 106 128" stroke="#a85060" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  </svg>`;
}

const idols = [
  { hospitalShort: '北榮桃園', accent: '#3fb796', accentLight: '#d6f0e7', hair: '#2d1f17' },
  { hospitalShort: '輔大附醫', accent: '#9b87cc', accentLight: '#ebe4f7', hair: '#1a1a1a' },
  { hospitalShort: '三軍總院', accent: '#e88599', accentLight: '#fae0e6', hair: '#6b3e1f' },
  { hospitalShort: '林口長庚', accent: '#ef9a6b', accentLight: '#fbe1d0', hair: '#c08a5a' },
  { hospitalShort: '高雄榮總', accent: '#6db4d9', accentLight: '#d6ecf7', hair: '#2d1f17' },
];

const html = `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8"/>
<title>藥師吉祥物預覽</title>
<style>
  body { font-family: system-ui, -apple-system, 'PingFang TC', 'Noto Sans TC', sans-serif; background: #f7f7f8; padding: 32px; margin: 0; color: #1f2937; }
  h1 { font-size: 22px; margin: 0 0 8px; }
  p.sub { color: #6b7280; margin: 0 0 28px; font-size: 13px; line-height: 1.6; max-width: 700px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; max-width: 1200px; margin-bottom: 40px; }
  .card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; text-align: center; }
  .card .avatar { width: 160px; height: 160px; margin: 0 auto; }
  .card h3 { margin: 12px 0 6px; font-size: 16px; }
  .swatch { display: inline-block; width: 11px; height: 11px; border-radius: 2px; vertical-align: middle; margin-right: 3px; border: 1px solid rgba(0,0,0,0.05); }
  .meta { color: #6b7280; font-size: 11px; font-family: ui-monospace, monospace; }
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
  <h1>藥師吉祥物 SVG 預覽（5 個範例）</h1>
  <p class="sub">
    純 SVG 程式生成 — 無外部圖檔、無 API 費用、無過期連結。每家醫院只需指定三個參數：
    <code>accent</code>（主色，影響制服領、眼睛、髮飾、邊框）、
    <code>accentLight</code>（背景淺色）、
    <code>hair</code>（髮色）。
    醫院名稱顯示於 JobCard 的標題，不在頭像內，所以可以是純 64×64 圓形。
  </p>

  <div class="grid">
    ${idols.map(i => `
      <div class="card">
        <div class="avatar">${renderIdol(i)}</div>
        <h3>${i.hospitalShort}</h3>
        <div class="meta">
          <span class="swatch" style="background:${i.accent}"></span>${i.accent}
          &nbsp;
          <span class="swatch" style="background:${i.hair}"></span>${i.hair}
        </div>
      </div>
    `).join('')}
  </div>

  <div class="integrated">
    <h2>JobCard 中的實際大小（64×64 圓形）</h2>
    ${idols.slice(0, 3).map(i => `
      <div class="job-card">
        <div class="avatar">${renderIdol(i)}</div>
        <div>
          <h4>${i.hospitalShort}醫院 <small>(公立)</small></h4>
          <p>桃園市 ・ 一般藥師 ・ 月薪約 50,000</p>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

writeFileSync('preview-idols.html', html);
console.log('Wrote preview-idols.html');
