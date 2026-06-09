'use client';

import { useState } from 'react';
import type { Job } from '../../lib/types';
import { hospitalDisplayName, safeBrandColor } from '../../lib/styles';
import { resolveArchetype } from './icons/resolveArchetype';
import type { ArchetypeKey } from './icons/types';

// Two share actions, because the two targets are mutually exclusive in one tap:
//
//   分享連結 (link)  → navigator.share({ url }) with NO file. LINE / Threads /
//     Facebook / WhatsApp turn the link into a TAPPABLE preview card (the OG
//     image + title that opens the game). This is the "no typing, just tap" path.
//
//   分享圖片 (image) → navigator.share({ files }) with the portrait story PNG.
//     Instagram only accepts images (never URLs), so this is the ONLY way to
//     reach IG Stories. The posted image is NOT tappable — that's an Instagram
//     restriction — so the story image has the site URL printed on it.
export function ShareButton({ job, archetype: forced }: { job: Job; archetype?: ArchetypeKey }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'copied'>('idle');

  const archetype = forced ?? resolveArchetype(job);
  const { header } = hospitalDisplayName(job.hospitalName, job.hospitalBriefName);
  const brand = safeBrandColor(job.brandColor)?.slice(1);

  // Clean, user-facing link: short ASCII params only. generateMetadata resolves
  // ?j=<id> back to the hospital and builds the personalized OG card.
  // The plain site link — no query params, so it stays short in chat. The
  // personalized result rides along in the share text (and in the image that
  // 分享圖片 sends); the link itself previews the generic card.
  const shareUrl = () => `${window.location.origin}/`;
  // Internal: the /og image route still takes the real Chinese names.
  const ogParams = () => {
    const params = new URLSearchParams({ archetype, hospital: header });
    if (brand) params.set('color', brand);
    return params;
  };
  const shareText = `我有機會成為${archetype}，命運醫院是${header}！你呢？`;

  // Link share → tappable preview card on LINE / Threads / FB / WhatsApp.
  const handleLinkShare = async () => {
    const url = shareUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title: '藥師命運轉盤', text: shareText, url });
      } catch {
        // User cancelled the share sheet.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${shareText} ${url}`);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      // Clipboard API unavailable — silently fail.
    }
  };

  // Image share → the portrait story PNG, so Instagram appears in the sheet.
  const handleImageShare = async () => {
    const url = shareUrl();
    const imgUrl = `${window.location.origin}/og?${ogParams().toString()}&format=story`;
    try {
      setStatus('loading');
      const res = await fetch(imgUrl);
      if (!res.ok) throw new Error('og fetch failed');
      const blob = await res.blob();
      const file = new File([blob], 'pharm-fate.png', { type: blob.type || 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText, url });
      } else {
        // Desktop / no file-share: download the image so it can be posted manually.
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = 'pharm-fate.png';
        a.click();
        URL.revokeObjectURL(objectUrl);
      }
    } catch (err) {
      // AbortError = user dismissed the sheet on purpose; otherwise silent.
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        // no-op: image share is best-effort
      }
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="flex w-full items-center gap-2">
      <button
        type="button"
        onClick={handleLinkShare}
        className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
        aria-label="分享連結"
      >
        {status === 'copied' ? (
          <>
            <span>✓</span>
            <span>已複製</span>
          </>
        ) : (
          <>
            <span>🔗</span>
            <span>分享連結</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleImageShare}
        disabled={status === 'loading'}
        className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
        aria-label="分享圖片到 Instagram"
      >
        {status === 'loading' ? (
          <>
            <span>⏳</span>
            <span>準備中…</span>
          </>
        ) : (
          <>
            <span>📷</span>
            <span>分享圖片</span>
          </>
        )}
      </button>
    </div>
  );
}
