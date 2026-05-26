'use client';

import { useMemo, useState } from 'react';
import type { ScoredJob } from '../../lib/quiz';
import { pickWeightedIndex } from '../../lib/quiz';
import { safeBrandColor } from '../../lib/styles';

const SIZE = 360;
const RADIUS = SIZE / 2;
const SPIN_DURATION_MS = 4200;
const MIN_FULL_ROTATIONS = 6;

// Soft palette used when a hospital has no brandColor set.
const FALLBACK_PALETTE = [
  '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa',
  '#fb923c', '#22d3ee', '#f472b6', '#84cc16', '#fb7185',
];

export function SpinWheel({
  candidates,
  onResult,
}: {
  candidates: ScoredJob[];
  onResult: (winnerIndex: number) => void;
}) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const slices = useMemo(() => buildSlices(candidates), [candidates]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const winnerIdx = pickWeightedIndex(candidates);
    const slice = slices[winnerIdx];
    // Pointer is at the top (12 o'clock). We rotate so that the *center* of the
    // chosen slice ends up under the pointer. Add some randomness inside the
    // slice so it doesn't land dead-center every time.
    const targetMid = slice.midDeg;
    const jitter = (Math.random() - 0.5) * Math.max(slice.spanDeg * 0.6, 1);
    // Rotation increases visually CW. To put `targetMid` under the top pointer
    // (0deg in our coord system), we need final rotation = -targetMid (mod 360),
    // then add several full spins for drama.
    const target = MIN_FULL_ROTATIONS * 360 + (360 - targetMid + jitter);
    const next = rotation + target;
    setRotation(next);
    setTimeout(() => {
      setSpinning(false);
      onResult(winnerIdx);
    }, SPIN_DURATION_MS + 100);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {/* Pointer */}
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1">
          <div
            className="h-0 w-0"
            style={{
              borderLeft: '14px solid transparent',
              borderRight: '14px solid transparent',
              borderTop: '24px solid #111827',
            }}
          />
        </div>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="rounded-full shadow-xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.17, 0.67, 0.16, 1)`
              : 'none',
          }}
        >
          {slices.map((slice) => (
            <g key={slice.index}>
              <path d={slice.path} fill={slice.color} stroke="white" strokeWidth="1" />
              {slice.spanDeg > 4 && (
                <text
                  x={slice.labelX}
                  y={slice.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={slice.spanDeg > 12 ? 11 : 9}
                  fill="white"
                  fontWeight="600"
                  transform={`rotate(${slice.labelRotation}, ${slice.labelX}, ${slice.labelY})`}
                  style={{ pointerEvents: 'none' }}
                >
                  {slice.label}
                </text>
              )}
            </g>
          ))}
          <circle cx={RADIUS} cy={RADIUS} r={28} fill="#111827" />
          <circle cx={RADIUS} cy={RADIUS} r={6} fill="white" />
        </svg>
      </div>

      <button
        type="button"
        onClick={spin}
        disabled={spinning}
        className="rounded-full bg-gray-900 px-8 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {spinning ? '轉動中…' : '🎯 轉動轉盤'}
      </button>

      <p className="max-w-md text-center text-xs text-gray-500">
        共 {candidates.length} 家候選醫院，越符合你偏好的格子越大。
      </p>
    </div>
  );
}

type Slice = {
  index: number;
  path: string;
  color: string;
  label: string;
  midDeg: number;
  spanDeg: number;
  labelX: number;
  labelY: number;
  labelRotation: number;
};

function buildSlices(candidates: ScoredJob[]): Slice[] {
  const total = candidates.reduce((s, c) => s + c.weight, 0);
  let startDeg = 0;
  return candidates.map(({ job, weight }, i) => {
    const spanDeg = (weight / total) * 360;
    const endDeg = startDeg + spanDeg;
    const midDeg = startDeg + spanDeg / 2;
    const color = safeBrandColor(job.brandColor) ?? FALLBACK_PALETTE[i % FALLBACK_PALETTE.length];
    const labelRadius = RADIUS * 0.62;
    const labelRad = ((midDeg - 90) * Math.PI) / 180;
    const labelX = RADIUS + labelRadius * Math.cos(labelRad);
    const labelY = RADIUS + labelRadius * Math.sin(labelRad);
    // Rotate label to follow slice direction (radial outward).
    const labelRotation = midDeg < 180 ? midDeg - 90 : midDeg - 270;
    const slice: Slice = {
      index: i,
      path: arcPath(startDeg, endDeg),
      color,
      label: shortLabel(job.hospitalBriefName || job.hospitalName),
      midDeg,
      spanDeg,
      labelX,
      labelY,
      labelRotation,
    };
    startDeg = endDeg;
    return slice;
  });
}

function arcPath(startDeg: number, endDeg: number): string {
  const start = polar(startDeg);
  const end = polar(endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${RADIUS} ${RADIUS}`,
    `L ${start.x} ${start.y}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

function polar(deg: number): { x: number; y: number } {
  // 0 deg = top (12 o'clock), increasing clockwise.
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: RADIUS + RADIUS * Math.cos(rad), y: RADIUS + RADIUS * Math.sin(rad) };
}

function shortLabel(name: string): string {
  // SVG label gets cramped — keep at most ~6 chars.
  if (name.length <= 6) return name;
  return name.slice(0, 5) + '…';
}
