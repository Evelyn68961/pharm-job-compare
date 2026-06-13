'use client';

import { useState } from 'react';
import type { Job } from '../../lib/types';
import { hospitalDisplayName, safeBrandColor } from '../../lib/styles';
import { resolveArchetype } from './icons/resolveArchetype';
import type { ArchetypeKey } from './icons/types';

// One share: the PERSONALIZED portrait image sent together with the bare site
// link (no query string). The recipient sees the personalized portrait and a
// clean `pharm-job-compare.vercel.app` link. Personalization lives in the image,
// so the link itself can stay bare.
export function ShareButton({ job, archetype: forced }: { job: Job; archetype?: ArchetypeKey }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'copied'>('idle');

  const archetype = forced ?? resolveArchetype(job);
  const { header } = hospitalDisplayName(job.hospitalName, job.hospitalBriefName);
  const brand = safeBrandColor(job.brandColor)?.slice(1);
  // The real, public link — always shared (even from the dev server) so
  // recipients get pharm-job-compare.vercel.app, not a LAN IP. It lives in the
  // share TEXT so it reliably appears alongside the image (apps sometimes drop a
  // separate url when a file is attached). Update if the production domain changes.
  const siteLink = 'https://pharm-job-compare.vercel.app';
  const shareText = `我有機會成為${archetype}，命運醫院是${header}！你呢？\n${siteLink}`;

  const handleShare = async () => {
    // The image is fetched from whatever server runs this page (works on the dev
    // server too); the shared LINK is always the production one (in shareText).
    const origin = window.location.origin;
    const og = new URLSearchParams({ archetype, hospital: header });
    if (brand) og.set('color', brand);
    const imgUrl = `${origin}/og?${og.toString()}&format=story`;

    try {
      setStatus('loading');
      const res = await fetch(imgUrl);
      if (!res.ok) throw new Error('og fetch failed');
      const blob = await res.blob();
      const file = new File([blob], 'pharm-fate.png', { type: blob.type || 'image/png' });

      // One tap: image first, with the vercel app link alongside it (in text).
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText });
        setStatus('idle');
        return;
      }
      // No file-share support → share the text (which carries the link).
      if (navigator.share) {
        await navigator.share({ title: '藥師命運轉盤', text: shareText });
        setStatus('idle');
        return;
      }
      // No Web Share (desktop) → download the image and copy the text + link.
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = 'pharm-fate.png';
      a.click();
      URL.revokeObjectURL(objectUrl);
      await navigator.clipboard.writeText(shareText);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        // best-effort: swallow other errors
      }
      setStatus('idle');
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={status === 'loading'}
      className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
      aria-label="分享結果"
    >
      {status === 'copied' ? (
        <>
          <span>✓</span>
          <span>已複製連結</span>
        </>
      ) : status === 'loading' ? (
        <>
          <span>⏳</span>
          <span>準備中…</span>
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
