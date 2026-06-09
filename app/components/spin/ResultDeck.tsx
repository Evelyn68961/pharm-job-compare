'use client';

import { useRef, useState } from 'react';
import type { Job } from '../../lib/types';
import { HOSPITAL_TIER_BADGE, TIER_BADGE, hospitalDisplayName } from '../../lib/styles';
import { HospitalIcon } from './icons/HospitalIcon';
import { ShareButton } from './ShareButton';
import type { ArchetypeKey } from './icons/types';

// The result screen is a horizontal swipe deck (no vertical scroll): card 1 is
// the 命運醫院 winner, cards 2–4 are recommendations. FJUH may be seeded into
// the recommendations upstream (resolveAlternatives) — by design it looks like
// any other card here, never a labelled ad.
export function ResultDeck({
  winner,
  alternatives,
  idolRank,
  onRestart,
}: {
  winner: Job;
  alternatives: Job[];
  idolRank?: ArchetypeKey[];
  onRestart: () => void;
}) {
  const cards = [winner, ...alternatives].slice(0, 4);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(cards.length - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="relative">
        {/* Swipe track */}
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        >
          {cards.map((job, i) => (
            <div key={job.id} className="w-full shrink-0 snap-center px-0.5">
              <DeckCard
                job={job}
                archetype={idolRank?.[i]}
                isWinner={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Desktop arrows */}
        {active > 0 && (
          <ArrowButton side="left" onClick={() => goTo(active - 1)} />
        )}
        {active < cards.length - 1 && (
          <ArrowButton side="right" onClick={() => goTo(active + 1)} />
        )}
      </div>

      {/* Pagination dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {cards.map((job, i) => (
          <button
            key={job.id}
            type="button"
            aria-label={`第 ${i + 1} 張`}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === active ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Footer: restart + tiny credit (only persistent FJUH mention) */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          🎲 再玩一次
        </button>
        <p className="text-xs text-gray-400">輔大附醫藥劑部製作</p>
      </div>
    </div>
  );
}

function DeckCard({
  job,
  archetype,
  isWinner,
}: {
  job: Job;
  archetype?: ArchetypeKey;
  isWinner: boolean;
}) {
  const { header, subtitle } = hospitalDisplayName(job.hospitalName, job.hospitalBriefName);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
      <p className="text-sm font-medium text-gray-500">
        {isWinner ? '✨ 你的命運醫院' : '也推薦給你'}
      </p>

      <div className="mt-4 flex items-center gap-4">
        <HospitalIcon job={job} size={96} archetype={archetype} />
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{header}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {job.hospitalTier && (
              <span
                className={`rounded-full border px-2 py-0.5 text-xs font-medium ${HOSPITAL_TIER_BADGE[job.hospitalTier]}`}
              >
                {job.hospitalTier}
              </span>
            )}
            {job.publicPrivate && (
              <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-600">
                {job.publicPrivate}
              </span>
            )}
            {job.salaryTier && (
              <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${TIER_BADGE[job.salaryTier]}`}>
                薪資 {job.salaryTier}
              </span>
            )}
            {job.region && (
              <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-600">
                {job.region}
              </span>
            )}
          </div>
        </div>
      </div>

      {(job.salaryDisplay || job.shiftDescription) && (
        <dl className="mt-5 space-y-2.5 border-t border-gray-100 pt-4 text-sm">
          {job.salaryDisplay && <Field label="薪資" value={job.salaryDisplay} />}
          {job.shiftDescription && <Field label="班別" value={job.shiftDescription} />}
        </dl>
      )}

      {job.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-gray-100 pt-4">
          {job.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
        {job.sourceUrl104 && (
          <a
            href={job.sourceUrl104}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
          >
            查看 104 職缺 →
          </a>
        )}
        <ShareButton job={job} archetype={archetype} />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[4rem_1fr] gap-2">
      <dt className="text-gray-500">{label}</dt>
      <dd className="whitespace-pre-wrap text-gray-900">{value}</dd>
    </div>
  );
}

function ArrowButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? '上一張' : '下一張'}
      className={`absolute top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md transition-colors hover:bg-gray-50 sm:flex ${
        side === 'left' ? '-left-4' : '-right-4'
      }`}
    >
      {side === 'left' ? '‹' : '›'}
    </button>
  );
}
