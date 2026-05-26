'use client';

import { useMemo, useState } from 'react';
import type { Job } from '../../lib/types';
import { buildWheelCandidates, type QuizAnswers } from '../../lib/quiz';
import { MBTIQuiz } from './MBTIQuiz';
import { SpinWheel } from './SpinWheel';
import { MysteryBox } from './MysteryBox';
import { ResultCard } from './ResultCard';

type Stage = 'intro' | 'quiz' | 'wheel' | 'box' | 'result';

export function SpinApp({ jobs }: { jobs: Job[] }) {
  const [stage, setStage] = useState<Stage>('intro');
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);

  const candidates = useMemo(
    () => (answers ? buildWheelCandidates(jobs, answers) : []),
    [jobs, answers],
  );

  const restart = () => {
    setStage('intro');
    setAnswers(null);
    setWinnerIndex(null);
  };

  return (
    <div className="space-y-8">
      {stage === 'intro' && <Intro onStart={() => setStage('quiz')} totalHospitals={jobs.length} />}

      {stage === 'quiz' && (
        <MBTIQuiz
          onComplete={(a) => {
            setAnswers(a);
            setStage('wheel');
          }}
        />
      )}

      {stage === 'wheel' && candidates.length > 0 && (
        <div className="space-y-4">
          <p className="text-center text-sm text-gray-600">
            根據你的偏好，{candidates.length} 家醫院進入轉盤，越符合你的偏好格子越大
          </p>
          <SpinWheel
            candidates={candidates}
            onResult={(idx) => {
              setWinnerIndex(idx);
              setStage('box');
            }}
          />
        </div>
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
      <h2 className="text-3xl font-bold text-gray-900">🎯 找到你的命運醫院</h2>
      <p className="text-gray-600">
        8 題 MBTI 測驗，根據你的偏好幫你篩選並加權，然後轉動轉盤——抽中哪一家就是你的命運。
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
        輔仁大學藥劑部學生作品 · 純娛樂用
      </p>
    </div>
  );
}
