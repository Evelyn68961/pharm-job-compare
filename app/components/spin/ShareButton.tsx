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

  const buildParams = () => {
    const params = new URLSearchParams({ archetype, hospital: header });
    if (brand) params.set('color', brand);
    return params;
  };
  const shareText = `我有機會成為${archetype}，命運醫院是${header}！你呢？`;

  // Link share → tappable preview card on LINE / Threads / FB / WhatsApp.
  const handleLinkShare = async () => {
    const shareUrl = `${window.location.origin}/?${buildParams().toString()}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: '藥師命運轉盤', text: shareText, url: shareUrl });
      } catch {
        // User cancelled the share sheet.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      // Clipboard API unavailable — silently fail.
    }
  };

  // Image share → the portrait story PNG, so Instagram appears in the sheet.
  const handleImageShare = async () => {
    const params = buildParams();
    const shareUrl = `${window.location.origin}/?${params.toString()}`;
    const imgUrl = `${window.location.origin}/og?${params.toString()}&format=story`;
    try {
      setStatus('loading');
      const res = await fetch(imgUrl);
      if (!res.ok) throw new Error('og fetch failed');
      const blob = await res.blob();
      const file = new File([blob], 'pharm-fate.png', { type: blob.type || 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText, url: shareUrl });
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
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleLinkShare}
        className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
        aria-label="分享連結"
      >
        {status === 'copied' ? (
          <>
            <span>✓</span>
            <span>已複製連結</span>
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
        className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
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
