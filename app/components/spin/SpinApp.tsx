'use client';

import { useState } from 'react';
import type { Job } from '../../lib/types';
import { buildWheelCandidates, pickWeightedSample, type QuizAnswers } from '../../lib/quiz';
import { MBTIQuiz } from './MBTIQuiz';
import { PillboxMaze } from './PillboxMaze';
import { MysteryBox } from './MysteryBox';
import { ResultCard } from './ResultCard';

type Stage = 'intro' | 'quiz' | 'maze' | 'box' | 'result';

const POOL_SIZE = 30;
const PILLBOX_CELLS = 14;

export function SpinApp({ jobs }: { jobs: Job[] }) {
  const [stage, setStage] = useState<Stage>('intro');
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);

  // Stable per-quiz: pick the 14 finalists once when answers commit, so the
  // grid doesn't reshuffle if the component re-renders.
  const [candidates, setCandidates] = useState<ReturnType<typeof pickWeightedSample>>([]);

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
            setStage('box');
          }}
        />
      )}

      {stage === 'box' && winnerIndex !== null && candidates[winnerIndex] && (
        <MysteryBox job={candidates[winnerIndex].job} onOpen={() => setStage('result')} />
      )}

      {stage === 'result' && winnerIndex !== null && candidates[winnerIndex] && (
        <ResultCard job={candidates[winnerIndex].job} onRestart={restart} />
      )}
    </div>
  );
}

function Intro({ onStart, totalHospitals }: { onStart: () => void; totalHospitals: number }) {
  return (
    <div className="mx-auto max-w-xl space-y-6 text-center">
      <h2 className="text-3xl font-bold text-gray-900">💊 找到你的命運醫院</h2>
      <p className="text-gray-600">
        8 題 MBTI 測驗 → 為你篩出 14 家最適合的醫院 → 藥丸在藥盒裡滾來滾去 → 停在哪格，那家就是你的命運。
        <br />
        目前資料庫共 <strong>{totalHospitals}</strong> 家醫院，涵蓋醫學中心與區域醫院。
      </p>
      <button
        type="button"
        onClick={onStart}
        className="rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700"
      >
        開始測驗 →
      </button>
      <p className="text-xs text-gray-400">
        輔大附醫藥劑部 · 純為娛樂
      </p>
    </div>
  );
}
