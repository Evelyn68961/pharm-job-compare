'use client';

import { useState } from 'react';
import { QUIZ, type QuizAnswers, type QuizChoice } from '../../lib/quiz';

export function MBTIQuiz({ onComplete }: { onComplete: (answers: QuizAnswers) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>([]);

  const total = QUIZ.length;
  const question = QUIZ[step];
  const progress = ((step + 1) / total) * 100;

  const choose = (choice: QuizChoice) => {
    const next = [...answers, choice];
    if (step + 1 < total) {
      setAnswers(next);
      setStep(step + 1);
    } else {
      onComplete(next);
    }
  };

  const back = () => {
    if (step === 0) return;
    setStep(step - 1);
    setAnswers(answers.slice(0, -1));
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
          <span>
            第 {step + 1} / {total} 題
          </span>
          {step > 0 && (
            <button type="button" onClick={back} className="text-blue-600 hover:underline">
              ← 上一題
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

      <h2 className="mb-8 text-2xl font-bold text-gray-900">{question.prompt}</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <ChoiceCard
          letter="A"
          label={question.options.A.label}
          hint={question.options.A.hint}
          onClick={() => choose('A')}
        />
        <ChoiceCard
          letter="B"
          label={question.options.B.label}
          hint={question.options.B.hint}
          onClick={() => choose('B')}
        />
      </div>
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
