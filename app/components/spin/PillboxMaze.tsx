'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ScoredJob } from '../../lib/quiz';
import { pickWeightedIndex } from '../../lib/quiz';
import { safeBrandColor } from '../../lib/styles';
import { MAZE_EMBLEM_ARCHETYPES, MAZE_EMBLEM_VIEWBOX, MazeEmblem } from './MazeEmblem';
import { type PillVariant, RollingPill, pickRandomPill } from './RollingPill';
import type { ArchetypeKey } from './icons/types';

const COLS = 7;
const ROWS = 2;
const TOTAL_CELLS = COLS * ROWS; // 14
const TOTAL_HOPS = 18;
const FALLBACK_PALETTE = [
  '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa',
  '#fb923c', '#22d3ee', '#f472b6', '#84cc16', '#fb7185',
  '#38bdf8', '#facc15', '#c084fc', '#ef4444',
];

const DAY_LABELS = ['一', '二', '三', '四', '五', '六', '日'];
const ROW_LABELS = ['早', '晚'];

// Pre-assign one archetype emblem + small rotation to each cell. Neighbors
// (left, up) get a different emblem so adjacent cells never share the same
// glyph — keeps the grid feeling scattered rather than gridded.
function assignEmblems(): { archetype: ArchetypeKey; rotation: number }[] {
  const result: { archetype: ArchetypeKey; rotation: number }[] = [];
  for (let i = 0; i < TOTAL_CELLS; i++) {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    const forbidden = new Set<ArchetypeKey>();
    if (col > 0) forbidden.add(result[i - 1].archetype);
    if (row > 0) forbidden.add(result[i - COLS].archetype);
    const choices = MAZE_EMBLEM_ARCHETYPES.filter((a) => !forbidden.has(a));
    const archetype = choices[Math.floor(Math.random() * choices.length)];
    result.push({ archetype, rotation: Math.random() * 24 - 12 });
  }
  return result;
}

export function PillboxMaze({
  candidates,
  onResult,
}: {
  candidates: ScoredJob[];
  onResult: (winnerIndex: number) => void;
}) {
  const [pillIndex, setPillIndex] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [highlight, setHighlight] = useState<number | null>(null);
  const [pillVariant, setPillVariant] = useState<PillVariant>(() => pickRandomPill());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pad / truncate to exactly TOTAL_CELLS slots so the grid always fills.
  const cells = useMemo(() => candidates.slice(0, TOTAL_CELLS), [candidates]);
  const emblems = useMemo(() => assignEmblems(), []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const roll = () => {
    if (rolling || cells.length === 0) return;
    setRolling(true);
    setHighlight(null);

    const winnerIdx = pickWeightedIndex(cells);
    const path = buildPath(pillIndex, winnerIdx, TOTAL_HOPS, cells.length);

    let step = 0;
    const tick = () => {
      const next = path[step];
      setPillIndex(next);
      step += 1;
      if (step < path.length) {
        // Slow down as we approach the end.
        const ratio = step / path.length;
        const delay = 90 + Math.pow(ratio, 2.2) * 320;
        timerRef.current = setTimeout(tick, delay);
      } else {
        setHighlight(winnerIdx);
        timerRef.current = setTimeout(() => {
          setRolling(false);
          onResult(winnerIdx);
        }, 800);
      }
    };
    tick();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Day header */}
      <div className="grid w-full max-w-2xl" style={{ gridTemplateColumns: `2rem repeat(${COLS}, 1fr)` }}>
        <div />
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-500">
            {d}
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="grid gap-2" style={{ gridTemplateColumns: `2rem repeat(${COLS}, 1fr)` }}>
          {Array.from({ length: ROWS }).flatMap((_, row) => [
            // Row label
            <div
              key={`label-${row}`}
              className="flex items-center justify-center text-xs font-medium text-gray-500"
            >
              {ROW_LABELS[row]}
            </div>,
            // Cells in this row
            ...Array.from({ length: COLS }).map((_, col) => {
              const idx = row * COLS + col;
              const cell = cells[idx];
              const isPill = idx === pillIndex;
              const isHighlight = highlight === idx;
              const baseColor = cell
                ? safeBrandColor(cell.job.brandColor) ?? FALLBACK_PALETTE[idx % FALLBACK_PALETTE.length]
                : '#e5e7eb';
              return (
                <div
                  key={`cell-${idx}`}
                  className={`relative aspect-square rounded-lg border-2 transition-all duration-150 ${
                    isHighlight
                      ? 'border-amber-400 ring-4 ring-amber-200 scale-110'
                      : 'border-gray-200'
                  }`}
                  style={{
                    backgroundColor: isHighlight ? baseColor : '#f9fafb',
                  }}
                >
                  {/* Slot inset */}
                  <div
                    className="absolute inset-1.5 rounded-md"
                    style={{
                      backgroundColor: isHighlight ? 'transparent' : `${baseColor}22`,
                      boxShadow: isHighlight ? 'none' : 'inset 0 2px 4px rgba(0,0,0,0.06)',
                    }}
                  />
                  {/* Emblem watermark — random per cell, adjacent cells never share */}
                  <div
                    className="pointer-events-none absolute inset-2 flex items-center justify-center"
                    style={{ transform: `rotate(${emblems[idx].rotation}deg)` }}
                  >
                    <svg
                      viewBox={MAZE_EMBLEM_VIEWBOX}
                      preserveAspectRatio="xMidYMid meet"
                      className="h-full w-full"
                      style={{ opacity: isHighlight ? 0.85 : 0.28 }}
                      aria-hidden
                    >
                      <MazeEmblem
                        archetype={emblems[idx].archetype}
                        color={isHighlight ? 'white' : '#475569'}
                        bgColor={baseColor}
                      />
                    </svg>
                  </div>
                  {isPill && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        transition: 'transform 150ms ease',
                        filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.35))',
                      }}
                    >
                      <RollingPill variant={pillVariant} className="h-3/4 w-3/4" />
                    </div>
                  )}
                </div>
              );
            }),
          ])}
        </div>
      </div>

      <button
        type="button"
        onClick={roll}
        disabled={rolling}
        className="rounded-full bg-gray-900 px-8 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {rolling ? '滾動中…' : '💊 滾動藥丸'}
      </button>

      <p className="max-w-md text-center text-xs text-gray-500">
        共 {cells.length} 家為你量身篩選的醫院（MBTI top-30 加權抽 14）。
        <br />
        藥丸停在哪格，就是你的命運醫院。
      </p>
    </div>
  );
}

// Generate a path from `start` to `end` with `steps` hops, sprinkled with
// random intermediate cells so the pill looks like it's rolling around.
function buildPath(start: number, end: number, steps: number, cellCount: number): number[] {
  const path: number[] = [];
  let prev = start;
  for (let i = 0; i < steps - 1; i++) {
    let next;
    do {
      next = Math.floor(Math.random() * cellCount);
    } while (next === prev);
    path.push(next);
    prev = next;
  }
  path.push(end);
  return path;
}
