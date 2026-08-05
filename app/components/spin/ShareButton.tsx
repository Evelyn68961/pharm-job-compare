'use client';

import { useEffect, useState } from 'react';
import type { Job } from '../../lib/types';
import { hospitalDisplayName, safeBrandColor } from '../../lib/styles';
import { ARCHETYPE_SLUG } from '../../lib/archetypeSlug';
import { jobCode } from '../../lib/shareCode';
import { resolveArchetype } from './icons/resolveArchetype';
import type { ArchetypeKey } from './icons/types';

// Two ways to share, for two different surfaces:
//   • Primary 「分享結果」 → shares a LINK carrying ?j&a. Chat apps
//     (LINE/WhatsApp/Telegram) fetch the page's OG tags and render a
//     PERSONALIZED, tappable preview card that opens pharmfate.vercel.app
//     (see page.tsx generateMetadata + /og). We deliberately do NOT attach an
//     image here: on LINE a shared file is just a photo — not a link — and the
//     URL gets dropped alongside it (w3c/web-share#279).
//   • Secondary 「存圖」 → shows the 1080×1920 PORTRAIT image
//     (/og?…&format=story) INLINE in a sheet, for the user to long-press and
//     save to their camera roll (see SaveImageSheet for why it works this way).
export function ShareButton({ job, archetype: forced }: { job: Job; archetype?: ArchetypeKey }) {
  const [status, setStatus] = useState<'idle' | 'copied'>('idle');
  const [sheetOpen, setSheetOpen] = useState(false);

  const archetype = forced ?? resolveArchetype(job);
  const { header } = hospitalDisplayName(job.hospitalName, job.hospitalBriefName);
  const brand = safeBrandColor(job.brandColor)?.slice(1);

  // Base OG params shared by both the link card and the portrait image.
  const ogParams = (extra?: Record<string, string>) => {
    const p = new URLSearchParams({ archetype, hospital: header, ...extra });
    if (brand) p.set('color', brand);
    return p.toString();
  };

  // The public link, personalized via SHORT ASCII params (`?j=<job code>&a=<slug>`)
  // so it stays tidy in chat apps — page.tsx's generateMetadata resolves them
  // back to the real names for the preview card. Always the production domain
  // (even from the dev server) so recipients get pharmfate.vercel.app, not a LAN
  // IP. Sourced from NEXT_PUBLIC_SITE_URL (set in Vercel) with the production
  // domain as fallback, so the canonical host lives in one place and the dev
  // server still hands out the real domain. Update the fallback if it changes.
  const linkParams = new URLSearchParams({ j: jobCode(job.id), a: ARCHETYPE_SLUG[archetype] });
  const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://pharmfate.vercel.app').replace(/\/$/, '');
  const siteLink = `${siteOrigin}/?${linkParams.toString()}`;
  const shareMessage = `我有機會成為${archetype}，命運醫院是${header}！你呢？快來測測看！`;

  // Prime the landscape OG image so the receiving app's first scrape of the
  // preview card is served warm from the CDN instead of a cold render. Same
  // origin in production = the real Vercel CDN; best-effort, errors ignored.
  // NOT done for the story image: it's 335 KB × 4 cards on the result screen,
  // and the sheet shows its own loading state instead of spending that upfront.
  useEffect(() => {
    fetch(`${window.location.origin}/og?${ogParams()}`).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = async () => {
    // Propagate the inbound ?ref= tag into the shared link so source attribution
    // sticks through the share chain: a lead from someone who arrived via
    // ?ref=evelyn and re-shared still counts as evelyn (see FjuhContactForm).
    const ref = new URLSearchParams(window.location.search).get('ref');
    const url = ref
      ? `${siteLink}&ref=${encodeURIComponent(ref.trim().slice(0, 40))}`
      : siteLink;
    const shareText = `${shareMessage}\n${url}`;
    try {
      // Share the LINK (no file) so the app renders the personalized preview card.
      if (navigator.share) {
        await navigator.share({ title: '藥師命運轉盤', text: shareMessage, url });
        return;
      }
      // No Web Share (desktop) → copy the message + link to the clipboard.
      await navigator.clipboard.writeText(shareText);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        // best-effort: swallow other errors
      }
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
          aria-label="分享結果"
        >
          {status === 'copied' ? (
            <>
              <span>✓</span>
              <span>已複製連結</span>
            </>
          ) : (
            <>
              <span>📤</span>
              <span>分享結果</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          aria-label="存成限時動態圖片"
        >
          <span>🖼️</span>
          <span>存圖</span>
        </button>
      </div>

      {sheetOpen && (
        <SaveImageSheet
          src={`/og?${ogParams({ format: 'story' })}`}
          filename={`藥師命運轉盤-${header}.png`}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </>
  );
}

// Why the image is shown INLINE rather than pushed at the OS:
//
// Saving to the camera roll is the whole point (the image is for IG/FB Stories),
// and no web API can write there. `a.download` lands in Files/Downloads — the
// wrong place — and `navigator.share({files})` is the only API that reaches
// Photos, but it needs to be called while the tap is still "fresh". The story
// PNG takes 5–9s to render cold on the edge, which blows past that window, so
// the share call was being rejected and the failure swallowed. It also isn't
// available at all in the Threads/LINE in-app browsers, where much of this
// site's traffic arrives.
//
// A plain <img> needs none of that: the browser's own long-press menu offers
// 儲存影像 → straight to 相簿, works in every webview, and the slow render
// becomes a visible loading state instead of a silent failure. The displayed
// image is scaled down to fit, but long-press saves the ORIGINAL 1080×1920 file.
function SaveImageSheet({
  src,
  filename,
  onClose,
}: {
  src: string;
  filename: string;
  onClose: () => void;
}) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  // Bumped by 重試 to remount the <img> and re-request the source.
  const [attempt, setAttempt] = useState(0);
  // Touch devices save via long-press; mouse devices get a real download link
  // (same-origin, so the `download` attribute is honoured — no blob, no JS).
  // Read lazily: this component only ever mounts client-side, after a tap.
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
  );

  // Close on Escape, and hold the page still while the sheet is up.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="儲存圖片"
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/70 p-5"
    >
      {/* Stop taps inside the panel from closing the sheet — a long-press on the
          image must not be read as a backdrop tap. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full w-full max-w-xs flex-col items-center gap-3"
      >
        <div className="flex max-h-[65vh] w-full items-center justify-center overflow-hidden rounded-xl bg-white/10">
          {state === 'error' ? (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <p className="text-sm text-white">圖片產生失敗</p>
              <button
                type="button"
                onClick={() => {
                  setState('loading');
                  setAttempt((n) => n + 1);
                }}
                className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-gray-800"
              >
                重試
              </button>
            </div>
          ) : (
            <>
              {state === 'loading' && (
                <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
                  <span className="text-2xl">⏳</span>
                  <p className="text-sm text-white">圖片產生中…</p>
                  <p className="text-xs text-white/60">第一次約需幾秒</p>
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={attempt}
                src={src}
                alt="我的命運醫院"
                onLoad={() => setState('ready')}
                onError={() => setState('error')}
                className={`max-h-[65vh] w-auto rounded-xl ${state === 'ready' ? 'block' : 'hidden'}`}
              />
            </>
          )}
        </div>

        {state === 'ready' &&
          (isTouch ? (
            <p className="text-center text-sm font-medium text-white">
              長按圖片 → 儲存影像，就會存到相簿
            </p>
          ) : (
            <a
              href={src}
              download={filename}
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100"
            >
              ⬇️ 下載圖片
            </a>
          ))}

        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/40 px-5 py-1.5 text-sm text-white transition-colors hover:bg-white/10"
        >
          關閉
        </button>
      </div>
    </div>
  );
}
