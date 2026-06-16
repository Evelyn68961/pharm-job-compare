import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import type { ComponentType, ReactNode } from 'react';
import type { ArchetypeComponentProps, ArchetypeKey } from '../components/spin/icons/types';
import { AcademicAcePharmacist } from '../components/spin/icons/archetypes/AcademicAcePharmacist';
import { BeipiaoPharmacist } from '../components/spin/icons/archetypes/BeipiaoPharmacist';
import { IronArmPharmacist } from '../components/spin/icons/archetypes/IronArmPharmacist';
import { JinniuPharmacist } from '../components/spin/icons/archetypes/JinniuPharmacist';
import { NightOwlPharmacist } from '../components/spin/icons/archetypes/NightOwlPharmacist';
import { TeachingSoulPharmacist } from '../components/spin/icons/archetypes/TeachingSoulPharmacist';
import { ZenPharmacist } from '../components/spin/icons/archetypes/ZenPharmacist';
import { MazeEmblem } from '../components/spin/MazeEmblem';

export const runtime = 'edge';

// Every Chinese glyph + CJK punctuation rendered by either layout must be listed
// here so the Google Fonts `&text=` subset includes it — anything missing
// renders as tofu (□).
const FIXED_CHARS = '藥師命運轉盤你玩過嗎我有機會成為醫院呢尋找的「」：？';

// The URL + arrow are Latin/symbol, not CJK — they must be in the subset too or
// the printed link (pharm-job-compare.vercel.app) and the → render as tofu. The
// host is built from query params at request time, so include the full ASCII set
// a domain can use rather than trying to subset the exact host string.
const ASCII_CHARS =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:/-_→';

const CHAR_BY_NAME: Record<string, ComponentType<ArchetypeComponentProps>> = {
  學霸藥師: AcademicAcePharmacist,
  北漂藥師: BeipiaoPharmacist,
  鐵腕藥師: IronArmPharmacist,
  金牛藥師: JinniuPharmacist,
  夜貓藥師: NightOwlPharmacist,
  教魂藥師: TeachingSoulPharmacist,
  佛系藥師: ZenPharmacist,
};

async function loadFont(text: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const cssRes = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@${weight}&text=${encodeURIComponent(text)}&display=swap`,
      {
        // An old User-Agent forces Google Fonts to serve TrueType (.ttf). A
        // modern UA returns WOFF2, which satori (next/og) cannot parse —
        // "Unsupported OpenType signature wOF2" → the route 500s.
        headers: { 'User-Agent': 'Mozilla/4.0' },
      },
    );
    if (!cssRes.ok) return null;
    const css = await cssRes.text();
    const fontUrl = css.match(/src: url\((https?:\/\/[^)]+)\)/)?.[1];
    if (!fontUrl) return null;
    const fontRes = await fetch(fontUrl);
    if (!fontRes.ok) return null;
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

function safeColor(raw: string | null): string {
  if (!raw) return '#3b82f6';
  const hex = raw.startsWith('#') ? raw.slice(1) : raw;
  return /^[0-9a-fA-F]{6}$/.test(hex) ? `#${hex}` : '#3b82f6';
}

// Blend a hex colour toward white. Returns a FULLY OPAQUE hex so the rendered
// PNG has no transparency — a translucent background goes black on Instagram
// Stories / dark viewers and swallows the dark text.
function tint(hex: string, whiteRatio: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * whiteRatio);
  const toHex = (c: number) => mix(c).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export async function GET(req: NextRequest) {
  const { searchParams, host } = new URL(req.url);
  const archetype = searchParams.get('archetype')?.slice(0, 20) ?? '';
  const hospital = searchParams.get('hospital')?.slice(0, 30) ?? '';
  const color = safeColor(searchParams.get('color'));
  // `format=story` → 1080×1920 portrait, for sharing as an image file to
  // Instagram Stories / Threads. The default 1200×630 stays for link previews.
  const isStory = searchParams.get('format') === 'story';

  // The address printed on the image. Prefer the canonical site URL so it's
  // always the real domain (not a Vercel preview host or the LAN IP in dev).
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const displayHost = siteUrl ? new URL(siteUrl).host : host;

  const personalized = Boolean(archetype || hospital);
  const text = FIXED_CHARS + ASCII_CHARS + archetype + hospital;
  const [regular, bold] = await Promise.all([loadFont(text, 400), loadFont(text, 700)]);
  const fonts = [
    regular && { name: 'NotoSansTC', data: regular, weight: 400 as const, style: 'normal' as const },
    bold && { name: 'NotoSansTC', data: bold, weight: 700 as const, style: 'normal' as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400 | 700; style: 'normal' }[];

  const Character = CHAR_BY_NAME[archetype];
  const emblemKey = archetype in CHAR_BY_NAME ? (archetype as ArchetypeKey) : null;
  const background = `linear-gradient(160deg, ${tint(color, 0.93)} 0%, ${tint(color, 0.68)} 100%)`;

  // Big character art on a soft white disc (no border per design); the disc just
  // keeps the white-coat art legible over the tinted watermark.
  const idol = (diameter: number) =>
    Character ? (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: diameter,
          height: diameter,
          borderRadius: diameter,
          backgroundColor: '#ffffff',
          boxShadow: `0 20px 60px ${tint(color, 0.25)}`,
        }}
      >
        <Character size={Math.round(diameter * 0.84)} accentColor={color} secondaryColor={color} />
      </div>
    ) : null;

  // Faint per-archetype emblem watermark. MazeEmblem returns a React fragment;
  // satori does NOT flatten fragments inside <svg>, so its paths must be pulled
  // out and placed as DIRECT children of the <svg> or nothing renders.
  const emblemPaths: ReactNode = emblemKey
    ? (MazeEmblem({ archetype: emblemKey, color, bgColor: tint(color, 0.93) }) as { props: { children: ReactNode } } | null)
        ?.props.children
    : null;
  const mark = (left: number, top: number, size: number, opacity: number) =>
    emblemPaths ? (
      <div style={{ position: 'absolute', left, top, width: size, height: size, display: 'flex', opacity }}>
        <svg width={size} height={size} viewBox="66 69 26 26">
          {emblemPaths}
        </svg>
      </div>
    ) : null;

  const header = (size: number) => (
    <div style={{ display: 'flex', fontSize: size, color: '#64748b' }}>
      <div style={{ display: 'flex', fontWeight: 400 }}>你玩過「</div>
      <div style={{ display: 'flex', fontWeight: 700, color: '#0f172a' }}>藥師命運轉盤</div>
      <div style={{ display: 'flex', fontWeight: 400 }}>」嗎</div>
    </div>
  );

  const element = isStory ? (
    <div
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        display: 'flex',
        background,
        fontFamily: 'NotoSansTC',
      }}
    >
      {/* Watermark layer */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex' }}>
        {mark(-90, 130, 380, 0.16)}
        {mark(790, 380, 300, 0.13)}
        {mark(-60, 1150, 400, 0.13)}
        {mark(820, 1470, 280, 0.16)}
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 90,
        }}
      >
        {header(42)}

        {personalized ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {idol(520)}
            {archetype && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 44 }}>
                <div style={{ display: 'flex', fontSize: 46, fontWeight: 400, color: '#475569', marginBottom: 12 }}>
                  我有機會成為
                </div>
                <div style={{ display: 'flex', fontSize: 104, fontWeight: 700, color: '#0f172a' }}>
                  {archetype}
                </div>
              </div>
            )}
            {hospital && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
                <div style={{ display: 'flex', fontSize: 38, fontWeight: 400, color: '#475569', marginBottom: 16 }}>
                  命運醫院
                </div>
                <div
                  style={{
                    display: 'flex',
                    padding: '30px 60px',
                    backgroundColor: color,
                    color: 'white',
                    borderRadius: 140,
                    fontSize: 72,
                    fontWeight: 700,
                    boxShadow: `0 16px 48px ${tint(color, 0.2)}`,
                  }}
                >
                  {hospital}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', fontSize: 110, fontWeight: 700, color: '#0f172a' }}>
            尋找你的命運醫院
          </div>
        )}

        {/* CTA + host: on LINE the share-sheet link is dropped, so this printed
            URL is the ONLY way the address reaches the recipient — keep it bold
            and high-contrast in a pill so it reads clearly as "go here". */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', fontSize: 44, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>
            你呢？尋找你的命運醫院 →
          </div>
          <div
            style={{
              display: 'flex',
              padding: '20px 44px',
              backgroundColor: '#ffffff',
              border: `4px solid ${color}`,
              borderRadius: 999,
              fontSize: 40,
              fontWeight: 700,
              color: '#0f172a',
            }}
          >
            {displayHost}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        display: 'flex',
        background,
        fontFamily: 'NotoSansTC',
      }}
    >
      {/* Watermark layer */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex' }}>
        {mark(980, -50, 320, 0.15)}
        {mark(-60, 350, 300, 0.13)}
        {mark(450, 430, 200, 0.12)}
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 56,
          padding: 72,
        }}
      >
        {/* marginLeft nudges the idol toward the middle so it doesn't hug the
            left edge; a centred flex row passes half the margin to the idol. */}
        {personalized && (
          <div style={{ display: 'flex', marginLeft: 120 }}>{idol(380)}</div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {header(30)}

          {personalized ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              {archetype && (
                <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 20 }}>
                  <div style={{ display: 'flex', fontSize: 34, fontWeight: 400, color: '#475569' }}>我有機會成為</div>
                </div>
              )}
              {archetype && (
                <div style={{ display: 'flex', fontSize: 66, fontWeight: 700, color: '#0f172a', marginTop: 6 }}>
                  {archetype}
                </div>
              )}
              {hospital && (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 24 }}>
                  <div style={{ display: 'flex', fontSize: 32, fontWeight: 400, color: '#475569', marginRight: 16 }}>
                    命運醫院
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      padding: '18px 40px',
                      backgroundColor: color,
                      color: 'white',
                      borderRadius: 100,
                      fontSize: 48,
                      fontWeight: 700,
                      boxShadow: `0 12px 32px ${tint(color, 0.2)}`,
                    }}
                  >
                    {hospital}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', fontSize: 84, fontWeight: 700, color: '#0f172a', marginTop: 12 }}>
              尋找你的命運醫院
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return new ImageResponse(element, {
    width: isStory ? 1080 : 1200,
    height: isStory ? 1920 : 630,
    fonts: fonts.length ? fonts : undefined,
    headers: {
      // The image is a pure function of the query params, so let the CDN cache
      // it hard — first hit pays the font-fetch + render cost, every repeat
      // (and every other user with the same archetype/hospital/colour) is
      // served instantly from the edge instead of re-rendering.
      'Cache-Control': 'public, immutable, no-transform, max-age=31536000',
    },
  });
}
