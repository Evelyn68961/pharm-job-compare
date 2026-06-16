'use client';

import { useEffect, useState } from 'react';
import type { Job } from '../../lib/types';
import { hospitalDisplayName, safeBrandColor } from '../../lib/styles';
import { resolveArchetype } from './icons/resolveArchetype';
import type { ArchetypeKey } from './icons/types';

// One share: a LINK to the site carrying ?archetype&hospital&color. Chat apps
// (LINE/WhatsApp/IG) fetch the page's OG tags and render a PERSONALIZED, tappable
// preview card that opens pharm-job-compare.vercel.app (see page.tsx
// generateMetadata + /og). We deliberately do NOT attach an image file: on LINE
// a shared file is just a photo — not a link — and the URL gets dropped
// alongside it (w3c/web-share#279).
export function ShareButton({ job, archetype: forced }: { job: Job; archetype?: ArchetypeKey }) {
  const [status, setStatus] = useState<'idle' | 'copied'>('idle');

  const archetype = forced ?? resolveArchetype(job);
  const { header } = hospitalDisplayName(job.hospitalName, job.hospitalBriefName);
  const brand = safeBrandColor(job.brandColor)?.slice(1);

  // The public link, personalized via query params so the preview card matches
  // this result. Always the production domain (even from the dev server) so
  // recipients get pharm-job-compare.vercel.app, not a LAN IP. Update if the
  // production domain changes.
  const linkParams = new URLSearchParams({ archetype, hospital: header });
  if (brand) linkParams.set('color', brand);
  const siteLink = `https://pharm-job-compare.vercel.app/?${linkParams.toString()}`;
  const shareMessage = `我有機會成為${archetype}，命運醫院是${header}！你呢？`;
  // Desktop/clipboard fallback has no share sheet, so glue the link onto the text.
  const shareText = `${shareMessage}\n${siteLink}`;

  // Prime the landscape OG image so the receiving app's first scrape of the
  // preview card is served warm from the CDN instead of a cold render. Same
  // origin in production = the real Vercel CDN; best-effort, errors ignored.
  useEffect(() => {
    const og = new URLSearchParams({ archetype, hospital: header });
    if (brand) og.set('color', brand);
    fetch(`${window.location.origin}/og?${og.toString()}`).catch(() => {});
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

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
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
  );
}
