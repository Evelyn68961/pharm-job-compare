'use client';

import { useState } from 'react';
import {
  IDOL_PRIORITIES,
  QUIZ,
  QUIZ_REGIONS,
  type QuizAnswers,
  type QuizChoice,
} from '../../lib/quiz';
import type { Region } from '../../lib/types';
import type { ArchetypeKey } from './icons/types';

// Steps: the QUIZ A/B questions, then a region multi-select, then an idol-
// priority ranking. The A/B answers pick the hospital; the ranking picks the
// idol that renders on the result card.
const REGION_STEP = QUIZ.length;
const RANK_STEP = QUIZ.length + 1;
const TOTAL_STEPS = QUIZ.length + 2;

export function MBTIQuiz({ onComplete }: { onComplete: (answers: QuizAnswers) => void }) {
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<QuizChoice[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [idolRank, setIdolRank] = useState<ArchetypeKey[]>([]);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const chooseAB = (choice: QuizChoice) => {
    const next = [...choices];
    next[step] = choice;
    setChoices(next);
    setStep(step + 1);
  };

  const toggleRegion = (region: Region) => {
    setRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region],
    );
  };

  const tapIdol = (archetype: ArchetypeKey) => {
    // Tap to add (appends to the ranking); tap again to remove. Removing a
    // middle item renumbers the rest automatically (rank = indexOf).
    setIdolRank((prev) =>
      prev.includes(archetype) ? prev.filter((a) => a !== archetype) : [...prev, archetype],
    );
  };

  const back = () => {
    if (step === 0) return;
    setStep(step - 1);
  };

  const finish = () => onComplete({ choices, regions, idolRank });

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
          <span>
            第 {step + 1} / {TOTAL_STEPS} 步
          </span>
          {step > 0 && (
            <button type="button" onClick={back} className="text-blue-600 hover:underline">
              ← 上一步
            </button>
          )}
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {step < QUIZ.length && (
        <>
          <h2 className="mb-8 text-2xl font-bold text-gray-900">{QUIZ[step].prompt}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <ChoiceCard
              letter="A"
              label={QUIZ[step].options.A.label}
              hint={QUIZ[step].options.A.hint}
              onClick={() => chooseAB('A')}
            />
            <ChoiceCard
              letter="B"
              label={QUIZ[step].options.B.label}
              hint={QUIZ[step].options.B.hint}
              onClick={() => chooseAB('B')}
            />
          </div>
        </>
      )}

      {step === REGION_STEP && (
        <>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">想去哪些區域？</h2>
          <p className="mb-6 text-sm text-gray-500">可複選；不選代表沒有特別偏好。</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {QUIZ_REGIONS.map((region) => {
              const active = regions.includes(region);
              return (
                <button
                  key={region}
                  type="button"
                  onClick={() => toggleRegion(region)}
                  className={`rounded-xl border-2 px-4 py-3 text-base font-medium transition-all ${
                    active
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {region}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setStep(RANK_STEP)}
            className="mt-8 w-full rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700"
          >
            下一步 →
          </button>
        </>
      )}

      {step === RANK_STEP && (
        <>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">最後，排出你的優先順序</h2>
          <p className="mb-6 text-sm text-gray-500">
            依在意程度點選（第一個點的最重要）。排完 6 項才能完成。
          </p>
          <div className="space-y-3">
            {IDOL_PRIORITIES.map((priority) => {
              const rank = idolRank.indexOf(priority.archetype);
              const ranked = rank >= 0;
              return (
                <button
                  key={priority.archetype}
                  type="button"
                  onClick={() => tapIdol(priority.archetype)}
                  className={`flex w-full items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all ${
                    ranked
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      ranked ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {ranked ? rank + 1 : '·'}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-lg font-semibold text-gray-900">{priority.label}</span>
                    <span className="block text-sm text-gray-500">{priority.hint}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIdolRank([])}
              disabled={idolRank.length === 0}
              className="text-sm text-gray-500 hover:underline disabled:opacity-40"
            >
              重設排序
            </button>
            <button
              type="button"
              onClick={finish}
              disabled={idolRank.length < IDOL_PRIORITIES.length}
              className="rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              看結果 →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ChoiceCard({
  letter,
  label,
  hint,
  onClick,
}: {
  letter: 'A' | 'B';
  label: string;
  hint: string;
  onClick: () => void;
}) {
  const color = letter === 'A' ? 'border-blue-300 hover:border-blue-500 hover:bg-blue-50' : 'border-purple-300 hover:border-purple-500 hover:bg-purple-50';
  const badge = letter === 'A' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-col items-start gap-3 rounded-xl border-2 bg-white p-6 text-left transition-all ${color}`}
    >
      <span className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${badge}`}>
        {letter}
      </span>
      <div>
        <div className="text-lg font-semibold text-gray-900">{label}</div>
        <div className="mt-1 text-sm text-gray-500">{hint}</div>
      </div>
    </button>
  );
}
