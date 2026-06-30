'use client';

import { Fragment, useMemo, useState } from 'react';
import type { Job } from '../../lib/types';
import { buildWheelCandidates, pickWeightedSample, type QuizAnswers } from '../../lib/quiz';
import { resolveAlternatives } from '../../lib/resolveAlternatives';
import { MBTIQuiz } from './MBTIQuiz';
import { PillboxMaze } from './PillboxMaze';
import { ResultDeck } from './ResultDeck';
import { ArchetypeAvatar } from './icons/HospitalIcon';
import type { ArchetypeKey } from './icons/types';

type Stage = 'intro' | 'quiz' | 'maze' | 'result';

const POOL_SIZE = 30;
// The pillbox ring has 7 compartments (one per weekday — see PillboxMaze's
// TOTAL_CELLS = DAYS = 7), so sample exactly 7 finalists. Sampling more just
// discards the overflow when the maze slices to its 7 cells.
const PILLBOX_CELLS = 7;

export function SpinApp({ jobs }: { jobs: Job[] }) {
  const [stage, setStage] = useState<Stage>('intro');
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);

  // Stable per-quiz: pick the 7 finalists once when answers commit, so the
  // grid doesn't reshuffle if the component re-renders.
  const [candidates, setCandidates] = useState<ReturnType<typeof pickWeightedSample>>([]);

  const winner = winnerIndex !== null ? candidates[winnerIndex]?.job ?? null : null;
  const alternatives = useMemo(
    () => (winner && answers ? resolveAlternatives(winner, jobs, answers) : []),
    [winner, jobs, answers],
  );

  const restart = () => {
    setStage('intro');
    setAnswers(null);
    setWinnerIndex(null);
    setCandidates([]);
  };

  return (
    <div className="space-y-8">
      {stage === 'intro' && <Intro onStart={() => setStage('quiz')} totalHospitals={jobs.length} />}

      {stage === 'quiz' && (
        <MBTIQuiz
          onComplete={(a) => {
            setAnswers(a);
            const scored = buildWheelCandidates(jobs, a);
            setCandidates(pickWeightedSample(scored, POOL_SIZE, PILLBOX_CELLS));
            setStage('maze');
          }}
        />
      )}

      {stage === 'maze' && candidates.length > 0 && (
        <PillboxMaze
          candidates={candidates}
          onResult={(idx) => {
            setWinnerIndex(idx);
            setStage('result');
          }}
        />
      )}

      {stage === 'result' && winner && (
        <ResultDeck
          winner={winner}
          alternatives={alternatives}
          idolRank={answers?.idolRank}
          onRestart={restart}
        />
      )}
    </div>
  );
}

// The six chibi archetypes that make up the landing-page hero cast. Colours are
// medium-saturation so each character reads clearly against the pastel panel;
// the small arc offset (px) lifts the middle pair and drops the ends. Order
// follows the archetype priority order in resolveArchetype.ts.
const HERO_CAST: { archetype: ArchetypeKey; color: string; secondary: string; arc: number }[] = [
  { archetype: '學霸藥師', color: '#6366f1', secondary: '#a5b4fc', arc: 10 },
  { archetype: '教魂藥師', color: '#f59e0b', secondary: '#fbbf24', arc: 2 },
  { archetype: '北漂藥師', color: '#3b82f6', secondary: '#93c5fd', arc: -4 },
  { archetype: '鐵腕藥師', color: '#ef4444', secondary: '#fca5a5', arc: -6 },
  { archetype: '夜貓藥師', color: '#8b5cf6', secondary: '#c4b5fd', arc: -4 },
  { archetype: '佛系藥師', color: '#10b981', secondary: '#6ee7b7', arc: 2 },
  { archetype: '金牛藥師', color: '#ca8a04', secondary: '#fde047', arc: 10 },
];

// "8 題" = the 7 A/B questions in QUIZ (quiz.ts) + the region-select step.
// Intentional — don't "correct" it to 7 by counting only the QUIZ array.
const FLOW_STEPS: { n: string; emoji: string; label: string }[] = [
  { n: '①', emoji: '📝', label: '8 題測驗' },
  { n: '②', emoji: '💊', label: '滾動藥丸' },
  { n: '③', emoji: '🏥', label: '命運醫院' },
];

function Intro({ onStart, totalHospitals }: { onStart: () => void; totalHospitals: number }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-rose-50 to-emerald-50 px-6 py-12 text-center sm:px-10">
      {/* Faint background capsules for texture */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <span className="absolute left-6 top-10 text-6xl">💊</span>
        <span className="absolute right-8 top-24 rotate-12 text-5xl">💊</span>
        <span className="absolute bottom-8 left-12 -rotate-12 text-5xl">💊</span>
        <span className="absolute bottom-14 right-10 text-6xl">💊</span>
      </div>

      <div className="relative space-y-7">
        {/* Hero cast — the seven chibi archetypes. On phones they lock to a
            tidy 4 + 3 (quarter-width cells); on sm+ they flow in one row. */}
        <div className="flex flex-wrap items-center justify-center gap-y-3 sm:gap-x-1">
          {HERO_CAST.map((c, i) => (
            <div
              key={c.archetype}
              className="flex w-1/4 justify-center sm:w-auto"
              style={{ animation: `float 3s ease-in-out ${i * 0.25}s infinite` }}
            >
              <ArchetypeAvatar
                archetype={c.archetype}
                color={c.color}
                secondaryColor={c.secondary}
                size={64}
              />
            </div>
          ))}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            <span className="text-gray-900">藥師</span>
            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              命運轉盤
            </span>
          </h2>
          <p className="text-base font-medium text-gray-700 sm:text-xl">
            8 題測驗，為你抽出命定的那一間。
          </p>
        </div>

        {/* Compact 3-step flow — stacks vertically on phones, row on sm+ */}
        <div className="flex flex-col items-center justify-center gap-1 text-sm font-medium text-gray-600 sm:flex-row sm:gap-2">
          {FLOW_STEPS.map((s, i) => (
            <Fragment key={s.n}>
              <span className="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 shadow-sm">
                <span aria-hidden>{s.emoji}</span>
                {s.label}
              </span>
              {i < FLOW_STEPS.length - 1 && (
                <span className="rotate-90 text-xs leading-none text-gray-300 sm:rotate-0 sm:text-sm" aria-hidden>
                  →
                </span>
              )}
            </Fragment>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={onStart}
            className="rounded-full bg-blue-600 px-10 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30"
          >
            開始測驗 →
          </button>
          <p className="text-xs text-gray-500">
            目前收錄 <strong className="text-gray-700">{totalHospitals}</strong> 家醫院 · 醫學中心 &amp; 區域醫院
          </p>
        </div>
      </div>
    </div>
  );
}
