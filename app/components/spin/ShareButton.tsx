'use client';

import { useState } from 'react';
import type { Job } from '../../lib/types';
import { hospitalDisplayName, safeBrandColor } from '../../lib/styles';
import { resolveArchetype } from './icons/resolveArchetype';

export function ShareButton({ job }: { job: Job }) {
  const [status, setStatus] = useState<'idle' | 'copied'>('idle');

  const archetype = resolveArchetype(job);
  const { header } = hospitalDisplayName(job.hospitalName, job.hospitalBriefName);
  const brand = safeBrandColor(job.brandColor)?.slice(1);

  const handleShare = async () => {
    const params = new URLSearchParams({
      archetype,
      hospital: header,
    });
    if (brand) params.set('color', brand);
    const shareUrl = `${window.location.origin}/?${params.toString()}`;
    const shareText = `我抽到 ${archetype}：${header}！你呢？`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '藥師命運轉盤',
          text: shareText,
          url: shareUrl,
        });
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

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
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
          <span>分享</span>
        </>
      )}
    </button>
  );
}
