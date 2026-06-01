import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const FIXED_CHARS = '藥師命運轉盤抽到你呢來找職醫院';

async function loadFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const cssRes = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@700&text=${encodeURIComponent(text)}&display=swap`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const archetype = searchParams.get('archetype')?.slice(0, 20) ?? '';
  const hospital = searchParams.get('hospital')?.slice(0, 30) ?? '';
  const color = safeColor(searchParams.get('color'));

  const personalized = Boolean(archetype || hospital);
  const text = FIXED_CHARS + archetype + hospital;
  const fontData = await loadFont(text);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${color}22 0%, ${color}66 100%)`,
          padding: 60,
          fontFamily: 'NotoSansTC',
        }}
      >
        <div
          style={{
            fontSize: 32,
            color: '#475569',
            letterSpacing: 2,
            marginBottom: 24,
          }}
        >
          藥師命運轉盤
        </div>

        {personalized ? (
          <>
            {archetype && (
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: 24,
                }}
              >
                我抽到 {archetype}
              </div>
            )}
            {hospital && (
              <div
                style={{
                  display: 'flex',
                  padding: '24px 48px',
                  backgroundColor: color,
                  color: 'white',
                  borderRadius: 100,
                  fontSize: 56,
                  fontWeight: 700,
                  marginBottom: 40,
                  boxShadow: `0 12px 32px ${color}55`,
                }}
              >
                {hospital}
              </div>
            )}
            <div style={{ fontSize: 30, color: '#64748b' }}>
              來找你的命運醫院 →
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                fontSize: 96,
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: 24,
              }}
            >
              你的命運醫院
            </div>
            <div style={{ fontSize: 36, color: '#475569' }}>
              來抽一張你的職業命運
            </div>
          </>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontData
        ? [{ name: 'NotoSansTC', data: fontData, weight: 700, style: 'normal' }]
        : undefined,
    },
  );
}
