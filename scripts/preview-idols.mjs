import { writeFileSync } from 'node:fs';

function renderIdol({ accent, accentLight, hair, skin = '#fad9b8' }) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <circle cx="100" cy="100" r="100" fill="${accentLight}"/>

    <rect x="22" y="148" width="22" height="55" rx="4" fill="${skin}"/>
    <rect x="40" y="148" width="4" height="55" fill="#000" opacity="0.12"/>
    <rect x="156" y="148" width="22" height="55" rx="4" fill="${skin}"/>
    <rect x="156" y="148" width="4" height="55" fill="#000" opacity="0.12"/>

    <rect x="46" y="148" width="108" height="60" fill="${accent}"/>
    <rect x="138" y="148" width="16" height="60" fill="#000" opacity="0.10"/>
    <path d="M 80 148 L 100 170 L 120 148 Z" fill="white"/>
    <path d="M 80 148 L 100 170 L 120 148" stroke="#000" stroke-width="0.6" fill="none" opacity="0.18"/>

    <rect x="46" y="146" width="108" height="2.5" fill="#000" opacity="0.20"/>

    <rect x="86" y="132" width="28" height="14" fill="${skin}"/>
    <rect x="86" y="142" width="28" height="4" fill="#000" opacity="0.15"/>

    <rect x="55" y="46" width="90" height="92" rx="14" fill="${skin}"/>
    <rect x="130" y="46" width="15" height="92" rx="10" fill="#000" opacity="0.08"/>
    <rect x="55" y="128" width="90" height="10" rx="6" fill="#000" opacity="0.06"/>

    <path d="M 50 92 L 50 52 Q 60 28, 100 28 Q 140 28, 150 52 L 150 92 Q 135 72, 122 82 Q 112 92, 100 80 Q 88 92, 78 82 Q 65 72, 50 92 Z" fill="${hair}"/>

    <path d="M 50 82 L 48 118 Q 52 125, 58 122 L 60 95 Z" fill="${hair}"/>
    <path d="M 150 82 L 152 118 Q 148 125, 142 122 L 140 95 Z" fill="${hair}"/>

    <ellipse cx="82" cy="94" rx="7" ry="9" fill="#1a1a1a"/>
    <ellipse cx="84" cy="91" rx="2.5" ry="2" fill="white"/>
    <circle cx="80" cy="98" r="1.2" fill="white"/>

    <ellipse cx="118" cy="94" rx="7" ry="9" fill="#1a1a1a"/>
    <ellipse cx="120" cy="91" rx="2.5" ry="2" fill="white"/>
    <circle cx="116" cy="98" r="1.2" fill="white"/>

    <rect x="73" y="80" width="14" height="3" rx="1.5" fill="${hair}"/>
    <rect x="113" y="80" width="14" height="3" rx="1.5" fill="${hair}"/>

    <ellipse cx="68" cy="110" rx="6" ry="3.5" fill="#ffaaaa" opacity="0.55"/>
    <ellipse cx="132" cy="110" rx="6" ry="3.5" fill="#ffaaaa" opacity="0.55"/>

    <path d="M 92 117 Q 100 124 108 117" stroke="#3a2820" stroke-width="2.2" fill="none" stroke-linecap="round"/>
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
<title>藥師吉祥物預覽 — Roblox 風格</title>
<style>
  body { font-family: system-ui, -apple-system, 'PingFang TC', 'Noto Sans TC', sans-serif; background: #f7f7f8; padding: 32px; margin: 0; color: #1f2937; }
  h1 { font-size: 22px; margin: 0 0 8px; }
  p.sub { color: #6b7280; margin: 0 0 28px; font-size: 13px; line-height: 1.6; max-width: 760px; }
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
  .note { margin-top: 32px; padding: 14px 18px; background: #fef9c3; border-left: 4px solid #facc15; border-radius: 4px; font-size: 13px; color: #713f12; max-width: 760px; line-height: 1.7; }
</style>
</head>
<body>
  <h1>藥師吉祥物 — Roblox 風格嘗試（5 個範例）</h1>
  <p class="sub">
    特徵：圓角方頭、區塊化身體、深色細縫分隔頭/頸/身/手、扁平眼眉、白色 V 領（藥師袍）。
    每家醫院仍只改三個變數：<code>accent</code>、<code>accentLight</code>、<code>hair</code>。
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

  <div class="note">
    <strong>誠實提醒：</strong> 真正 Roblox 風格是 3D 渲染（立體方塊頭、漸層光影、肢體分件）。
    SVG 只能模擬「Roblox 視覺語彙」（圓角方頭、區塊化、扁平特徵），所以結果是「致敬版」而非「正版 Roblox 截圖」。
    如果你想要真正像 Roblox 玩家頭像那種立體感，建議走方案二：用 ChatGPT / Gemini 圖片生成 API
    （每張約 USD $0.02–$0.10），我可以寫好腳本，你跑一次就有 20 張。
  </div>
</body>
</html>`;

writeFileSync('preview-idols.html', html);
console.log('Wrote preview-idols.html');
