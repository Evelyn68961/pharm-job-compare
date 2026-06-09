'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ScoredJob } from '../../lib/quiz';
import { pickWeightedIndex } from '../../lib/quiz';
import { safeBrandColor } from '../../lib/styles';
import { MAZE_EMBLEM_ARCHETYPES, MAZE_EMBLEM_VIEWBOX, MazeEmblem } from './MazeEmblem';
import { type PillVariant, RollingPill, pickRandomPill } from './RollingPill';
import type { ArchetypeKey } from './icons/types';

const DAYS = 7;
const TOTAL_CELLS = DAYS; // one compartment per weekday
const TOTAL_HOPS = 18;
const FALLBACK_PALETTE = [
  '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa',
  '#fb923c', '#22d3ee',
];

const DAY_LABELS = ['一', '二', '三', '四', '五', '六', '日'];

// Playful "服用須知" disclaimer, laid out like a drug label: a short tag in the
// left column, the note in the right. Tags are all 2 chars so the column aligns.
const DISCLAIMER_ROWS: { tag: string; text: string }[] = [
  { tag: '收錄', text: '主要收錄醫學中心與區域教學醫院，並非全台名冊。' },
  { tag: '來源', text: '每筆都由藥師手動整理自 104 與官方網站，找得到才有，可能有缺漏或時間差。' },
  { tag: '警語', text: '求職請以原始職缺公告為準，本品純屬參考與娛樂。' },
];

// Oval-ring geometry (a virtual coordinate box; everything is rendered as a
// percentage of it so the whole organizer scales fluidly with its width).
const BOX_W = 360;
const BOX_H = 300;
const RX = 134; // horizontal ring radius
const RY = 100; // vertical ring radius
const CELL_PCT = 19.5; // compartment width as % of box width
const HUB_PCT = 30; // hub button width as % of box width

// Position of compartment `i` on the oval ring, as percentages of the box,
// starting at the top (一) and going clockwise.
function cellPos(i: number): { xPct: number; yPct: number } {
  const a = (-90 + i * (360 / DAYS)) * (Math.PI / 180);
  return {
    xPct: ((BOX_W / 2 + RX * Math.cos(a)) / BOX_W) * 100,
    yPct: ((BOX_H / 2 + RY * Math.sin(a)) / BOX_H) * 100,
  };
}

// Pre-assign one archetype emblem + small rotation to each compartment.
// Neighbours around the ring (including the wrap from 日 back to 一) get a
// different emblem so adjacent compartments never share the same glyph.
function assignEmblems(): { archetype: ArchetypeKey; rotation: number }[] {
  const result: { archetype: ArchetypeKey; rotation: number }[] = [];
  for (let i = 0; i < TOTAL_CELLS; i++) {
    const forbidden = new Set<ArchetypeKey>();
    if (i > 0) forbidden.add(result[i - 1].archetype);
    if (i === TOTAL_CELLS - 1) forbidden.add(result[0].archetype); // wrap neighbour
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
  const [centering, setCentering] = useState(false);
  const [opening, setOpening] = useState(false);
  const [pillVariant, setPillVariant] = useState<PillVariant>(() => pickRandomPill());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pad / truncate to exactly TOTAL_CELLS slots so the ring always fills.
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
    setCentering(false);
    setOpening(false);

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
        // Settle on the winning cell → lift the capsule to the centre and grow
        // it → crack it open there and reveal. No separate gift-box step.
        timerRef.current = setTimeout(() => {
          setCentering(true);
          timerRef.current = setTimeout(() => {
            setOpening(true);
            timerRef.current = setTimeout(() => {
              setRolling(false);
              onResult(winnerIdx);
            }, 1100);
          }, 560);
        }, 350);
      }
    };
    tick();
  };

  const winnerCell = highlight !== null ? cells[highlight] : undefined;
  const winnerColor =
    (winnerCell && safeBrandColor(winnerCell.job.brandColor)) ??
    (highlight !== null ? FALLBACK_PALETTE[highlight % FALLBACK_PALETTE.length] : '#94a3b8');

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6">
      {/* Oval weekly pill organizer: 7 day-compartments around the ring with
          the shuffle button in the hub. */}
      <div
        className="relative w-full"
        style={{ maxWidth: BOX_W, aspectRatio: `${BOX_W} / ${BOX_H}` }}
      >
        {/* Oval shell */}
        <div className="absolute inset-0 rounded-[50%] border border-gray-200 bg-gradient-to-b from-white to-gray-100 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.35)]" />

        {/* Day compartments around the ring */}
        {Array.from({ length: TOTAL_CELLS }).map((_, idx) => {
          const cell = cells[idx];
          const { xPct, yPct } = cellPos(idx);
          const isPill = idx === pillIndex;
          const isHighlight = highlight === idx;
          const baseColor = cell
            ? safeBrandColor(cell.job.brandColor) ?? FALLBACK_PALETTE[idx % FALLBACK_PALETTE.length]
            : '#e5e7eb';
          return (
            <div
              key={`cell-${idx}`}
              className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-transform duration-150 ${
                isHighlight ? 'z-20 scale-110' : 'z-10'
              }`}
              style={{ left: `${xPct}%`, top: `${yPct}%`, width: `${CELL_PCT}%` }}
            >
              <div className="relative w-full" style={{ aspectRatio: '1' }}>
                {/* Soft glow under the landed/winning cell */}
                {isHighlight && (
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ background: `radial-gradient(circle, ${baseColor}55 0%, transparent 70%)` }}
                  />
                )}
                {/* Emblem — random per cell, adjacent cells never share */}
                <div
                  className="pointer-events-none absolute inset-1 flex items-center justify-center"
                  style={{ transform: `rotate(${emblems[idx].rotation}deg)` }}
                >
                  <svg
                    viewBox={MAZE_EMBLEM_VIEWBOX}
                    preserveAspectRatio="xMidYMid meet"
                    className="h-full w-full"
                    style={{ opacity: isHighlight ? 0.95 : 0.5 }}
                    aria-hidden
                  >
                    <MazeEmblem
                      archetype={emblems[idx].archetype}
                      color={baseColor}
                      bgColor="#ffffff"
                    />
                  </svg>
                </div>
                {/* In-cell capsule — hidden once it lifts off to the centre */}
                {isPill && !centering && (
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
              {/* Day label */}
              <span
                className={`mt-1 text-xs font-semibold ${
                  isHighlight ? 'text-amber-600' : 'text-gray-500'
                }`}
              >
                {DAY_LABELS[idx]}
              </span>
            </div>
          );
        })}

        {/* Hub: shuffle button in the middle of the oval */}
        <button
          type="button"
          onClick={roll}
          disabled={rolling}
          className="absolute z-30 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-gray-900 text-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)] transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ left: '50%', top: '50%', width: `${HUB_PCT}%`, aspectRatio: '1' }}
        >
          <span className="text-2xl leading-none">💊</span>
          <span className="mt-1 text-sm font-semibold">{rolling ? '滾動中…' : '滾動藥丸'}</span>
        </button>

        {/* Centred reveal — the winning capsule lifts to the middle, grows,
            then cracks open. Overlays the whole organizer. */}
        {(centering || opening) && (
          <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
            {/* Backdrop so the ring recedes and the capsule reads clearly */}
            <div
              className="absolute inset-0 rounded-[50%] bg-white/70"
              style={{ animation: 'maze-fade 350ms ease forwards' }}
            />
            {/* Glow bloom behind the capsule */}
            <div
              className="absolute h-44 w-44 rounded-full"
              style={{
                background: `radial-gradient(circle, ${winnerColor}99 0%, transparent 70%)`,
                animation: 'maze-glow 600ms ease-out forwards',
              }}
            />
            <div
              className="relative"
              style={{
                animation: 'capsule-rise 500ms cubic-bezier(.34,1.56,.64,1) forwards',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
              }}
            >
              <RollingPill variant={pillVariant} opening={opening} className="h-32 w-32" />
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-xs leading-relaxed text-gray-500" style={{ maxWidth: BOX_W }}>
        一週七格，每天一家為你量身篩選的醫院；
        <br />
        膠囊停在哪格，就是你的命運醫院。
      </p>

      {/* 服用須知 — playful prescription-label disclaimer. Width matches the oval
          so its edges align; tag/note columns keep wrapped lines tidy. */}
      <div
        className="w-full overflow-hidden rounded-2xl border border-amber-200 bg-amber-50 shadow-sm"
        style={{ maxWidth: BOX_W * 0.9 }}
      >
        <div className="flex items-center gap-2 border-b border-dashed border-amber-300 bg-amber-100 px-4 py-2">
          <span aria-hidden className="text-base">💊</span>
          <span className="text-sm font-extrabold tracking-wide text-amber-900">服用須知</span>
          <span className="ml-auto text-[10px] font-medium text-amber-600">用藥前請詳閱 🎲</span>
        </div>
        <dl className="divide-y divide-amber-100/90 px-4">
          {DISCLAIMER_ROWS.map((row) => (
            <div key={row.tag} className="flex items-start gap-3 py-2.5">
              <dt className="shrink-0">
                <span className="inline-block rounded-md bg-amber-200/80 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                  {row.tag}
                </span>
              </dt>
              <dd className="flex-1 text-[12px] leading-relaxed text-amber-900/90">{row.text}</dd>
            </div>
          ))}
        </dl>
      </div>
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
