'use client';

import { useEffect, useState } from 'react';
import type { Job } from '../../lib/types';
import { safeBrandColor } from '../../lib/styles';

export function MysteryBox({
  job,
  onOpen,
}: {
  job: Job;
  onOpen: () => void;
}) {
  const [opening, setOpening] = useState(false);
  const brand = safeBrandColor(job.brandColor) ?? '#94a3b8';

  // Small "appear" entrance the moment this component mounts.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    // Wait for the open animation, then commit to reveal.
    setTimeout(onOpen, 700);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6">
      <p className="text-center text-sm text-gray-600">
        🎁 你的命運醫院已經抽出，點擊禮盒開箱
      </p>

      <button
        type="button"
        onClick={handleOpen}
        disabled={opening}
        aria-label="開箱"
        className="group relative h-56 w-56 cursor-pointer transition-transform duration-700"
        style={{
          transform: opening
            ? 'scale(1.15) rotateY(180deg)'
            : mounted
              ? 'scale(1) rotate(0deg)'
              : 'scale(0.5) rotate(-12deg)',
          transformStyle: 'preserve-3d',
          opacity: mounted ? 1 : 0,
        }}
      >
        {/* Box body */}
        <div
          className="absolute inset-0 rounded-2xl shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${brand} 0%, ${shade(brand, -0.25)} 100%)`,
          }}
        />
        {/* Ribbon vertical */}
        <div
          className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2 opacity-90"
          style={{ backgroundColor: shade(brand, 0.35) }}
        />
        {/* Ribbon horizontal */}
        <div
          className="absolute left-0 top-1/2 h-6 w-full -translate-y-1/2 opacity-90"
          style={{ backgroundColor: shade(brand, 0.35) }}
        />
        {/* Bow knot */}
        <div
          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-3xl shadow-md"
          style={{ backgroundColor: shade(brand, 0.45) }}
        >
          🎀
        </div>
        {/* Hover hint */}
        <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-500 opacity-0 transition-opacity group-hover:opacity-100">
          點擊開箱
        </span>
      </button>

      <p className="text-xs text-gray-400">{opening ? '正在開箱…' : '點一下禮盒'}</p>
    </div>
  );
}

// Lighten (positive amt) or darken (negative amt) a hex color by amt in [-1, 1].
function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = clamp((n >> 16) & 0xff, amt);
  const g = clamp((n >> 8) & 0xff, amt);
  const b = clamp(n & 0xff, amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function clamp(channel: number, amt: number): number {
  const adjusted = amt >= 0 ? channel + (255 - channel) * amt : channel * (1 + amt);
  return Math.max(0, Math.min(255, Math.round(adjusted)));
}
