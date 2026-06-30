'use client';

import { useRef, useState, type ReactNode } from 'react';
import type { Job } from '../../lib/types';
import { HOSPITAL_TIER_BADGE, TIER_BADGE, hospitalDisplayName } from '../../lib/styles';
import { HospitalIcon } from './icons/HospitalIcon';
import { ShareButton } from './ShareButton';
import { FjuhContactForm } from './FjuhContactForm';
import { isFjuh } from '../../lib/fjuh';
import type { ArchetypeKey } from './icons/types';

// The result screen is a horizontal swipe deck (no vertical scroll): card 1 is
// the 命運醫院 winner, cards 2–4 are recommendations. FJUH may be seeded into
// the recommendations upstream (resolveAlternatives) — by design it looks like
// any other card here, never a labelled ad.
type CompareCol = { job: Job; fjuh: boolean };

export function ResultDeck({
  winner,
  alternatives,
  idolRank,
  fjuh,
  onRestart,
}: {
  winner: Job;
  alternatives: Job[];
  idolRank?: ArchetypeKey[];
  fjuh?: Job | null;
  onRestart: () => void;
}) {
  const cards = [winner, ...alternatives].slice(0, 4);

  // Comparison card columns: the result hospitals, plus 輔大附醫 always present —
  // appended as an extra column only when it isn't already among the results
  // (deduped via isFjuh). Tapping the FJUH column jumps to a 輔大附醫 card so the
  // visitor can leave contact info (see fjuhTargetIdx / onPickFjuh below).
  const compareCols: CompareCol[] = cards.map((job) => ({ job, fjuh: isFjuh(job) }));
  const fjuhResultIdx = cards.findIndex((j) => isFjuh(j));
  const fjuhBenchmark = fjuh && fjuhResultIdx < 0 ? fjuh : null;
  if (fjuhBenchmark) {
    compareCols.push({ job: fjuhBenchmark, fjuh: true });
  }
  const showCompare = compareCols.length >= 2;

  // Slide order: result cards · comparison · (FJUH benchmark card, if appended).
  // The benchmark card is a real 輔大附醫 card (with the contact form) so a visitor
  // who taps the FJUH column lands somewhere they can leave contact info, even
  // when FJUH wasn't one of their results.
  const benchmarkSlideIdx = cards.length + (showCompare ? 1 : 0);
  const totalSlides = cards.length + (showCompare ? 1 : 0) + (fjuhBenchmark ? 1 : 0);
  const fjuhTargetIdx =
    fjuhResultIdx >= 0 ? fjuhResultIdx : fjuhBenchmark ? benchmarkSlideIdx : -1;

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
    const clamped = Math.max(0, Math.min(totalSlides - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="relative">
        {/* Swipe track */}
        {/* items-stretch (default) + flex-1 on each card = every slide takes the
            tallest card's height, so no dead space and the dots sit right under. */}
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        >
          {cards.map((job, i) => (
            <div key={job.id} className="flex w-full shrink-0 snap-center flex-col px-0.5 py-1">
              <DeckCard
                job={job}
                archetype={idolRank?.[i]}
                isWinner={i === 0}
              />
            </div>
          ))}
          {showCompare && (
            <div className="flex w-full shrink-0 snap-center flex-col px-0.5 py-1">
              <ComparisonCard
                columns={compareCols}
                onPickFjuh={fjuhTargetIdx >= 0 ? () => goTo(fjuhTargetIdx) : undefined}
              />
            </div>
          )}
          {fjuhBenchmark && (
            <div key={`fjuh-${fjuhBenchmark.id}`} className="flex w-full shrink-0 snap-center flex-col px-0.5 py-1">
              <DeckCard job={fjuhBenchmark} label="也可參考" />
            </div>
          )}
        </div>

        {/* Desktop arrows */}
        {active > 0 && (
          <ArrowButton side="left" onClick={() => goTo(active - 1)} />
        )}
        {active < totalSlides - 1 && (
          <ArrowButton side="right" onClick={() => goTo(active + 1)} />
        )}
      </div>

      {/* Swipe hint — sits directly under the cards (phones hide the desktop
          arrows: hidden sm:flex, so touch users get no cue more cards exist).
          First card only, clears once they swipe, mobile-only. */}
      {totalSlides > 1 && active === 0 && (
        <p className="mt-3 animate-pulse text-center text-xs font-medium text-gray-500 sm:hidden">
          👈 左右滑動，看推薦與比較 👉
        </p>
      )}

      {/* Pagination dots */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`第 ${i + 1} 張`}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === active ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Footer: restart */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          🎲 再玩一次
        </button>
      </div>
    </div>
  );
}

function DeckCard({
  job,
  archetype,
  isWinner = false,
  label,
}: {
  job: Job;
  archetype?: ArchetypeKey;
  isWinner?: boolean;
  label?: string;
}) {
  const { header, subtitle } = hospitalDisplayName(job.hospitalName, job.hospitalBriefName);

  return (
    <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
      <p className="text-base font-medium text-gray-500">
        {label ?? (isWinner ? '✨ 你的命運醫院' : '也推薦給你')}
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
        <dl className="mt-6 space-y-4 border-t border-gray-100 pt-5 text-base">
          {job.salaryDisplay && <Field label="薪資" value={job.salaryDisplay} />}
          {job.shiftDescription && <Field label="班別" value={job.shiftDescription} />}
        </dl>
      )}

      {job.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-5">
          {job.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-2 border-t border-gray-100 pt-5">
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

      {/* FJUH-only: a quiet "leave your contact" form that emails the team. */}
      {isFjuh(job) && <FjuhContactForm job={job} />}
    </div>
  );
}

// The selectable comparison attributes. Each renders a single hospital's value
// for that attribute; missing data shows an em dash. The 104 link is NOT here —
// it sits permanently under every hospital name instead (see the row markup).
const COMPARE_ROWS: { label: string; render: (job: Job) => ReactNode }[] = [
  { label: '薪資', render: (j) => j.salaryDisplay || '—' },
  { label: '輪班', render: (j) => j.shiftDescription || '—' },
  { label: '宿舍', render: (j) => j.dormitory || '—' },
  { label: '工作內容', render: (j) => j.jobSummary || '—' },
  { label: '特色', render: (j) => (j.tags.length ? j.tags.join('、') : '—') },
];

// The 5th deck slide: an attribute-at-a-time comparison. A segmented selector
// bar (薪資 / 輪班 / 宿舍 / 工作內容 / 特色) picks ONE attribute; all hospitals are listed
// as rows showing just that value — every hospital fits in one view, no scroll.
// Each row shows the hospital name with its 104 link underneath. 輔大附醫 is always
// one of the rows (appended upstream when it isn't a result); its WHOLE ROW is a
// tappable button (hover highlight) that jumps to its contact-form card — the
// inner 104 link stops propagation so it still opens independently. Per CLAUDE.md
// it is never labelled as the maker.
function ComparisonCard({
  columns,
  onPickFjuh,
}: {
  columns: CompareCol[];
  onPickFjuh?: () => void;
}) {
  const [sel, setSel] = useState(0);
  const active = COMPARE_ROWS[sel];

  return (
    <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
      <p className="text-sm font-medium text-gray-500">📊 一次比較</p>
      <h2 className="mt-1 text-xl font-bold text-gray-900">幫你排排看</h2>

      {/* Attribute selector — pick one thing to compare across all hospitals. */}
      <div className="mt-4 flex gap-1 rounded-xl bg-gray-100 p-1">
        {COMPARE_ROWS.map((row, i) => (
          <button
            key={row.label}
            type="button"
            onClick={() => setSel(i)}
            aria-pressed={i === sel}
            className={`flex-1 whitespace-nowrap rounded-lg px-1 py-1.5 text-xs font-medium transition-colors ${
              i === sel
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {row.label}
          </button>
        ))}
      </div>

      {/* All hospitals as rows, showing only the selected attribute. */}
      <div className="mt-4">
        {columns.map((c) => {
          const { header } = hospitalDisplayName(c.job.hospitalName, c.job.hospitalBriefName);
          const clickable = c.fjuh && onPickFjuh;
          return (
            <div
              key={c.job.id}
              onClick={clickable ? onPickFjuh : undefined}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              onKeyDown={
                clickable
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onPickFjuh();
                      }
                    }
                  : undefined
              }
              className={`flex items-center justify-between gap-3 border-t border-gray-100 px-2 py-3 ${
                c.fjuh ? 'bg-blue-50/60' : ''
              } ${clickable ? 'cursor-pointer transition-colors hover:bg-blue-100' : ''}`}
            >
              <div className="min-w-0">
                <span className="font-semibold text-gray-900">{header}</span>
                {c.job.sourceUrl104 && (
                  <a
                    href={c.job.sourceUrl104}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-0.5 block text-[11px] font-medium text-blue-600 underline"
                  >
                    104 →
                  </a>
                )}
              </div>
              <div className="line-clamp-4 max-w-[60%] whitespace-pre-wrap text-right text-sm text-gray-800">
                {active.render(c.job)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[5rem_1fr] gap-3">
      <dt className="font-medium text-gray-500">{label}</dt>
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
      className={`absolute top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-3xl leading-none text-gray-700 shadow-lg transition-all hover:scale-105 hover:bg-gray-50 hover:text-gray-900 active:scale-95 sm:flex ${
        side === 'left' ? '-left-6' : '-right-6'
      }`}
    >
      {side === 'left' ? '‹' : '›'}
    </button>
  );
}
