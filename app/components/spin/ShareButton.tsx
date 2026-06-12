'use client';

import { useState } from 'react';
import type { Job } from '../../lib/types';
import { hospitalDisplayName } from '../../lib/styles';
import { ARCHETYPE_SLUG } from '../../lib/archetypeSlug';
import { jobCode } from '../../lib/shareCode';
import { resolveArchetype } from './icons/resolveArchetype';
import type { ArchetypeKey } from './icons/types';

// Dynamic Open Graph share: we share a short LINK; LINE / Threads / Telegram /
// Facebook fetch the page's og:image (an individualized landscape card built by
// generateMetadata from the ?j=<code> param) and render it as a TAPPABLE preview
// card that opens the game. The card image must be landscape (1200x630) — OG
// cards crop/break portrait images.
export function ShareButton({ job, archetype: forced }: { job: Job; archetype?: ArchetypeKey }) {
  const [status, setStatus] = useState<'idle' | 'copied'>('idle');

  const archetype = forced ?? resolveArchetype(job);
  const { header } = hospitalDisplayName(job.hospitalName, job.hospitalBriefName);

  const handleShare = async () => {
    const p = new URLSearchParams({ j: jobCode(job.id), a: ARCHETYPE_SLUG[archetype] });
    const url = `${window.location.origin}/?${p.toString()}`;
    const text = `我有機會成為${archetype}，命運醫院是${header}！你呢？`;

    if (navigator.share) {
      try {
        await navigator.share({ title: '藥師命運轉盤', text, url });
      } catch {
        // User cancelled the share sheet.
      }
      return;
    }

    // Desktop fallback — copy the link to paste anywhere.
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
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
      className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
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
