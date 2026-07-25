'use client';

// Dev-only export tool for the Threads promo cards. Renders the REAL archetype
// SVG components (same ones the site ships) and rasterizes them client-side to
// transparent PNG / SVG at high resolution — so the exported art is pixel-for-
// pixel on-model, with zero AI drift. Also exports a 4:5 pastel card matching
// the promo doc's 1080×1350 spec, ready for text overlay in Canva/Figma.
//
// Not linked from the live site. Run `npm run dev`, open /preview/idol-export.
// Delete this folder when the promo series is shipped.
import { useCallback, useMemo, useRef, useState } from 'react';
import { AcademicAcePharmacist } from '../../components/spin/icons/archetypes/AcademicAcePharmacist';
import { BeipiaoPharmacist } from '../../components/spin/icons/archetypes/BeipiaoPharmacist';
import { IronArmPharmacist } from '../../components/spin/icons/archetypes/IronArmPharmacist';
import { JinniuPharmacist } from '../../components/spin/icons/archetypes/JinniuPharmacist';
import { NightOwlPharmacist } from '../../components/spin/icons/archetypes/NightOwlPharmacist';
import { TeachingSoulPharmacist } from '../../components/spin/icons/archetypes/TeachingSoulPharmacist';
import { ZenPharmacist } from '../../components/spin/icons/archetypes/ZenPharmacist';
import type { ArchetypeComponentProps } from '../../components/spin/icons/types';

type Arch = {
  key: string;
  slug: string;
  Character: React.ComponentType<ArchetypeComponentProps>;
  accent: string;
  secondary: string;
};

// Defaults = the canonical landing-hero look (HERO_CAST in SpinApp.tsx): accent
// drives the halo + neckerchief, secondary tints the held prop. Editable below
// so you can retint to any hospital's real Notion 識別色 / 輔助色.
const DEFAULTS: Arch[] = [
  { key: '學霸藥師', slug: 'academic-ace', Character: AcademicAcePharmacist, accent: '#6366f1', secondary: '#a5b4fc' },
  { key: '教魂藥師', slug: 'teaching-soul', Character: TeachingSoulPharmacist, accent: '#f59e0b', secondary: '#fbbf24' },
  { key: '北漂藥師', slug: 'beipiao', Character: BeipiaoPharmacist, accent: '#3b82f6', secondary: '#93c5fd' },
  { key: '鐵腕藥師', slug: 'iron-arm', Character: IronArmPharmacist, accent: '#ef4444', secondary: '#fca5a5' },
  { key: '夜貓藥師', slug: 'night-owl', Character: NightOwlPharmacist, accent: '#8b5cf6', secondary: '#c4b5fd' },
  { key: '佛系藥師', slug: 'zen', Character: ZenPharmacist, accent: '#10b981', secondary: '#6ee7b7' },
  { key: '金牛藥師', slug: 'jinniu', Character: JinniuPharmacist, accent: '#ca8a04', secondary: '#fde047' },
];

// Matches ArchetypeHalo.tsx (radial 0.5 → 0.18 → 0) so the exported halo is
// identical to the on-site one.
function haloDefs(id: string, color: string): string {
  return `<defs><radialGradient id="${id}" cx="50%" cy="50%" r="50%">`
    + `<stop offset="0%" stop-color="${color}" stop-opacity="0.5"/>`
    + `<stop offset="60%" stop-color="${color}" stop-opacity="0.18"/>`
    + `<stop offset="100%" stop-color="${color}" stop-opacity="0"/>`
    + `</radialGradient></defs>`;
}

// Grab the exact inner markup of a live, rendered archetype <svg> — the real
// DOM node, so attribute names are already valid SVG (stroke-width etc.). This
// is why there's no drift: we never re-type the paths.
function characterInner(el: SVGSVGElement | null): string {
  return el ? el.innerHTML : '';
}

// Character-only or character+halo, in a 100×100 viewBox. When halo is on the
// character is inset to 86% (translate 7, scale 0.86) so the glow rings around
// it — same framing as ArchetypeAvatar.
function composeSquare(inner: string, accent: string, withHalo: boolean, px: number): string {
  const haloId = 'halo';
  const halo = withHalo
    ? haloDefs(haloId, accent) + `<circle cx="50" cy="50" r="50" fill="url(#${haloId})"/>`
    : '';
  const charGroup = withHalo
    ? `<g transform="translate(7 7) scale(0.86)">${inner}</g>`
    : inner;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" `
    + `viewBox="0 0 100 100" fill="none">${halo}${charGroup}</svg>`;
}

// 1080×1350 (4:5) pastel card — app gradient (amber-50 → rose-50 → emerald-50)
// + faint capsule texture, character upper-centre, generous bottom space for
// the text overlay. Matches the promo doc's card format.
function composeCard(inner: string, accent: string, w = 1080, h = 1350): string {
  const pill = (x: number, y: number, rot: number, s: number) =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" opacity="0.06">`
    + `<rect x="-40" y="-16" width="80" height="32" rx="16" fill="#000"/>`
    + `<line x1="0" y1="-16" x2="0" y2="16" stroke="#fff" stroke-width="3"/></g>`;
  // Character block: 640px wide, centred, upper area — leaves ~460px at the
  // bottom for a headline + CTA.
  const s = 6.4;
  const tx = (w - 100 * s) / 2;
  const ty = 250;
  const charBlock =
    `<g transform="translate(${tx} ${ty}) scale(${s})">`
    + haloDefs('cardHalo', accent)
    + `<circle cx="50" cy="50" r="50" fill="url(#cardHalo)"/>`
    + `<g transform="translate(7 7) scale(0.86)">${inner}</g>`
    + `</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" `
    + `viewBox="0 0 ${w} ${h}" fill="none">`
    + `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">`
    + `<stop offset="0%" stop-color="#fffbeb"/>`
    + `<stop offset="50%" stop-color="#fff1f2"/>`
    + `<stop offset="100%" stop-color="#ecfdf5"/></linearGradient></defs>`
    + `<rect width="${w}" height="${h}" fill="url(#bg)"/>`
    + pill(140, 220, -12, 2.2) + pill(940, 180, 14, 1.8)
    + pill(180, 1120, 10, 1.6) + pill(920, 1180, -8, 2.0)
    + charBlock
    + `</svg>`;
}

async function svgToPngBlob(svg: string, w: number, h: number): Promise<Blob> {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = new Image();
    img.width = w;
    img.height = h;
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error('svg load failed'));
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no 2d context');
    ctx.drawImage(img, 0, 0, w, h); // transparent by default (card svg paints its own bg)
    return await new Promise<Blob>((res, rej) =>
      canvas.toBlob((b) => (b ? res(b) : rej(new Error('toBlob failed'))), 'image/png'),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function IdolExportPage() {
  const [arches, setArches] = useState<Arch[]>(DEFAULTS);
  const [res, setRes] = useState(2048);
  const [withHalo, setWithHalo] = useState(true);
  const [busy, setBusy] = useState(false);
  const svgRefs = useRef<Record<string, SVGSVGElement | null>>({});

  const setColor = (slug: string, field: 'accent' | 'secondary', value: string) =>
    setArches((prev) => prev.map((a) => (a.slug === slug ? { ...a, [field]: value } : a)));

  const exportPng = useCallback(
    async (a: Arch) => {
      const inner = characterInner(svgRefs.current[a.slug]);
      const svg = composeSquare(inner, a.accent, withHalo, res);
      download(await svgToPngBlob(svg, res, res), `${a.slug}${withHalo ? '' : '-nohalo'}-${res}.png`);
    },
    [res, withHalo],
  );

  const exportSvg = useCallback(
    (a: Arch) => {
      const inner = characterInner(svgRefs.current[a.slug]);
      const svg = composeSquare(inner, a.accent, withHalo, res);
      download(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), `${a.slug}${withHalo ? '' : '-nohalo'}.svg`);
    },
    [res, withHalo],
  );

  const exportCard = useCallback(async (a: Arch) => {
    const inner = characterInner(svgRefs.current[a.slug]);
    download(await svgToPngBlob(composeCard(inner, a.accent), 1080, 1350), `${a.slug}-card-1080x1350.png`);
  }, []);

  const exportAllPng = useCallback(async () => {
    setBusy(true);
    try {
      for (const a of arches) {
        // sequential so the browser doesn't drop rapid-fire download clicks
        // eslint-disable-next-line no-await-in-loop
        await exportPng(a);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 250));
      }
    } finally {
      setBusy(false);
    }
  }, [arches, exportPng]);

  const controls = useMemo(
    () => (
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-sm">
        <label className="flex items-center gap-2">
          解析度
          <select
            value={res}
            onChange={(e) => setRes(Number(e.target.value))}
            className="rounded border border-slate-300 px-2 py-1"
          >
            <option value={1024}>1024²</option>
            <option value={2048}>2048²</option>
            <option value={4096}>4096²</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={withHalo} onChange={(e) => setWithHalo(e.target.checked)} />
          含光暈 halo
        </label>
        <button
          type="button"
          onClick={exportAllPng}
          disabled={busy}
          className="rounded-full bg-blue-600 px-4 py-1.5 font-medium text-white disabled:opacity-50"
        >
          {busy ? '匯出中…' : '全部下載 PNG（透明）'}
        </button>
        <span className="text-xs text-slate-500">
          透明 PNG / SVG 供合成到 AI 生成的場景上；4:5 卡片直接套文字。
        </span>
      </div>
    ),
    [res, withHalo, busy, exportAllPng],
  );

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-bold">藥師吉祥物 — 匯出工具（Threads 素材）</h1>
        <p className="mt-1 text-sm text-slate-600">
          這裡渲染的是網站上真正的角色 SVG 元件，直接點陣化成高解析 PNG / 向量 SVG，
          <strong>零走樣、100% on-model</strong>。不要再用 AI 重畫角色 — AI 只拿來生成背景場景，
          角色貼上真實輸出即可。
        </p>
      </header>

      {controls}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {arches.map((a) => {
          const Character = a.Character;
          return (
            <div key={a.slug} className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
              <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
                {withHalo && (
                  <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
                    <defs>
                      <radialGradient id={`prev-halo-${a.slug}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={a.accent} stopOpacity="0.5" />
                        <stop offset="60%" stopColor={a.accent} stopOpacity="0.18" />
                        <stop offset="100%" stopColor={a.accent} stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="50" fill={`url(#prev-halo-${a.slug})`} />
                  </svg>
                )}
                <div
                  className="relative"
                  ref={(el) => {
                    svgRefs.current[a.slug] = el?.querySelector('svg') ?? null;
                  }}
                >
                  <Character size={withHalo ? 138 : 160} accentColor={a.accent} secondaryColor={a.secondary} />
                </div>
              </div>

              <div className="text-center text-sm font-semibold">{a.key}</div>

              <div className="flex items-center justify-center gap-2 text-xs">
                <label className="flex items-center gap-1" title="識別色（halo + 領巾）">
                  <input
                    type="color"
                    value={a.accent}
                    onChange={(e) => setColor(a.slug, 'accent', e.target.value)}
                    className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0"
                  />
                  主
                </label>
                <label className="flex items-center gap-1" title="輔助色（配件）">
                  <input
                    type="color"
                    value={a.secondary}
                    onChange={(e) => setColor(a.slug, 'secondary', e.target.value)}
                    className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0"
                  />
                  輔
                </label>
              </div>

              <div className="grid grid-cols-3 gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => exportPng(a)}
                  className="rounded bg-slate-800 px-2 py-1 font-medium text-white"
                >
                  PNG
                </button>
                <button
                  type="button"
                  onClick={() => exportSvg(a)}
                  className="rounded bg-slate-200 px-2 py-1 font-medium text-slate-800"
                >
                  SVG
                </button>
                <button
                  type="button"
                  onClick={() => exportCard(a)}
                  className="rounded bg-emerald-600 px-2 py-1 font-medium text-white"
                  title="1080×1350 淡彩卡片，直接套文字"
                >
                  4:5
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
