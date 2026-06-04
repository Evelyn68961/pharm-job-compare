'use client';

import type { Job } from '../../lib/types';
import {
  HOSPITAL_TIER_BADGE,
  TIER_BADGE,
  hospitalDisplayName,
} from '../../lib/styles';
import { HospitalIcon } from './icons/HospitalIcon';
import type { ArchetypeKey } from './icons/types';

export function AlternativesView({
  winner,
  alternatives,
  fjuhJob,
  idolRank,
  onRestart,
}: {
  winner: Job;
  alternatives: Job[];
  fjuhJob: Job | null;
  idolRank?: ArchetypeKey[];
  onRestart: () => void;
}) {
  const includeFjuhBelow = fjuhJob && fjuhJob.id !== winner.id;

  return (
    <div className="space-y-10">
      <header className="space-y-2 border-t border-gray-100 pt-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">也很適合你的選擇</h2>
        <p className="text-sm text-gray-600">這些醫院跟你抽到的很相近，也值得列入考慮</p>
      </header>

      {alternatives.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
          目前資料庫中沒有其他相近的醫院
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {alternatives.map((job, i) => (
            <li key={job.id}>
              {/* idol = the user's #2/#3/#4 ranked priority (result card uses #1) */}
              <AlternativeCard job={job} archetype={idolRank?.[i + 1]} />
            </li>
          ))}
        </ul>
      )}

      <FjuhSection fjuhJob={includeFjuhBelow ? fjuhJob : null} />

      <div className="flex items-center justify-center border-t border-gray-100 pt-8">
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

function AlternativeCard({
  job,
  archetype,
  layout = 'stack',
}: {
  job: Job;
  archetype?: ArchetypeKey;
  layout?: 'stack' | 'row';
}) {
  const { header, subtitle } = hospitalDisplayName(job.hospitalName, job.hospitalBriefName);
  const link = job.sourceUrl104;

  const badges = (
    <div className={`mt-1.5 flex flex-wrap gap-1 ${layout === 'stack' ? 'justify-center' : ''}`}>
      {job.hospitalTier && (
        <span
          className={`rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${HOSPITAL_TIER_BADGE[job.hospitalTier]}`}
        >
          {job.hospitalTier}
        </span>
      )}
      {job.salaryTier === '突出' && (
        <span
          className={`rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${TIER_BADGE[job.salaryTier]}`}
        >
          薪資突出
        </span>
      )}
      {job.region && (
        <span className="rounded-full border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-600">
          {job.region}
        </span>
      )}
      {job.tags.slice(0, 6).map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-700"
        >
          {tag}
        </span>
      ))}
    </div>
  );

  const linkEl = link ? (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs font-medium text-blue-600 hover:underline"
    >
      查看 104 職缺 →
    </a>
  ) : (
    <span className="text-xs text-gray-400">尚無連結</span>
  );

  // Wide row layout (full-width FJUH card): icon left, info in the middle, and a
  // recruiting CTA pinned to the right edge so the card fills its width.
  if (layout === 'row') {
    return (
      <article className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:gap-6">
        <HospitalIcon job={job} size={112} archetype={archetype} />
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-gray-900">{header}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          {badges}
        </div>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            查看徵才職缺 →
          </a>
        ) : (
          <span className="shrink-0 text-xs text-gray-400">尚無連結</span>
        )}
      </article>
    );
  }

  // Stacked layout (the 3 narrow grid cards): icon on top, info centered below.
  return (
    <article className="flex h-full flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md">
      <HospitalIcon job={job} size={112} archetype={archetype} />
      <div className="w-full min-w-0">
        <h3 className="truncate text-base font-bold text-gray-900">{header}</h3>
        {subtitle && <p className="truncate text-xs text-gray-500">{subtitle}</p>}
        {badges}
      </div>
      <div className="mt-auto self-end">{linkEl}</div>
    </article>
  );
}

function FjuhSection({ fjuhJob }: { fjuhJob: Job | null }) {
  return (
    <section className="space-y-4 border-t border-gray-200 pt-8">
      <header className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-gray-900">關於這個網站</h2>
      </header>
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900 sm:p-6">
        <p>
          這個網站由<strong>輔大附醫藥劑部</strong>整理，把各家醫院的薪資、班別、宿舍等資訊
          收在一起，方便正在找工作的藥師一次比較。
        </p>
        <p className="mt-3">
          如果剛剛抽到的醫院正合你意——偷偷說，輔大附醫也在徵藥師，歡迎往下看看 ↓
        </p>
      </div>
      {fjuhJob ? (
        // FJUH is a university teaching hospital — pin it to 教魂 (teaching).
        // Wide row layout so the full-width card doesn't look empty.
        <AlternativeCard job={fjuhJob} archetype="教魂藥師" layout="row" />
      ) : (
        <p className="text-center text-xs text-gray-500">
          目前 Notion 資料庫中尚未列入輔大附醫的職缺資料。
        </p>
      )}
    </section>
  );
}
