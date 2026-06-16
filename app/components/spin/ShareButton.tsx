'use client';

import { useEffect, useState } from 'react';
import type { Job } from '../../lib/types';
import { hospitalDisplayName, safeBrandColor } from '../../lib/styles';
import { ARCHETYPE_SLUG } from '../../lib/archetypeSlug';
import { jobCode } from '../../lib/shareCode';
import { resolveArchetype } from './icons/resolveArchetype';
import type { ArchetypeKey } from './icons/types';

// Two ways to share, for two different surfaces:
//   • Primary 「分享我的命運醫院」 → shares a LINK carrying ?archetype&hospital&color.
//     Chat apps (LINE/WhatsApp/Telegram) fetch the page's OG tags and render a
//     PERSONALIZED, tappable preview card that opens pharm-job-compare.vercel.app
//     (see page.tsx generateMetadata + /og). We deliberately do NOT attach an
//     image here: on LINE a shared file is just a photo — not a link — and the
//     URL gets dropped alongside it (w3c/web-share#279).
//   • Secondary 「存圖」 → saves/shares the 1080×1920 PORTRAIT image
//     (/og?…&format=story) for vertical story surfaces (IG/FB Stories, WhatsApp
//     Status), where it's posted as a photo rather than a link preview.
export function ShareButton({ job, archetype: forced }: { job: Job; archetype?: ArchetypeKey }) {
  const [status, setStatus] = useState<'idle' | 'copied'>('idle');
  const [portrait, setPortrait] = useState<'idle' | 'loading' | 'saved'>('idle');

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
  // (even from the dev server) so recipients get pharm-job-compare.vercel.app,
  // not a LAN IP. Update if the production domain changes.
  const linkParams = new URLSearchParams({ j: jobCode(job.id), a: ARCHETYPE_SLUG[archetype] });
  const siteLink = `https://pharm-job-compare.vercel.app/?${linkParams.toString()}`;
  const shareMessage = `我有機會成為${archetype}，命運醫院是${header}！你呢？`;
  // Desktop/clipboard fallback has no share sheet, so glue the link onto the text.
  const shareText = `${shareMessage}\n${siteLink}`;

  // Prime the landscape OG image so the receiving app's first scrape of the
  // preview card is served warm from the CDN instead of a cold render. Same
  // origin in production = the real Vercel CDN; best-effort, errors ignored.
  useEffect(() => {
    fetch(`${window.location.origin}/og?${ogParams()}`).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = async () => {
    try {
      // Share the LINK (no file) so the app renders the personalized preview card.
      if (navigator.share) {
        await navigator.share({ title: '藥師命運轉盤', text: shareMessage, url: siteLink });
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

  // Save/share the tall portrait for Stories. Mobile gets a native share sheet
  // (→ post to IG/FB Stories or save); desktop downloads the PNG.
  const handleSavePortrait = async () => {
    try {
      setPortrait('loading');
      const imgUrl = `${window.location.origin}/og?${ogParams({ format: 'story' })}`;
      const res = await fetch(imgUrl);
      if (!res.ok) throw new Error('og story fetch failed');
      const blob = await res.blob();
      const file = new File([blob], 'pharm-fate.png', { type: blob.type || 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
        setPortrait('idle');
        return;
      }
      // No file-share support → download the image.
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = 'pharm-fate.png';
      a.click();
      URL.revokeObjectURL(objectUrl);
      setPortrait('saved');
      setTimeout(() => setPortrait('idle'), 2000);
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        // best-effort: swallow other errors
      }
      setPortrait('idle');
    }
  };

  return (
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
            <span>分享我的命運醫院</span>
          </>
        )}
      </button>
      <button
        type="button"
        onClick={handleSavePortrait}
        disabled={portrait === 'loading'}
        className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
        aria-label="存成限時動態圖片"
      >
        {portrait === 'saved' ? (
          <>
            <span>✓</span>
            <span>已存圖</span>
          </>
        ) : portrait === 'loading' ? (
          <>
            <span>⏳</span>
            <span>準備中…</span>
          </>
        ) : (
          <>
            <span>🖼️</span>
            <span>存圖</span>
          </>
        )}
      </button>
    </div>
  );
}
