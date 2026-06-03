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
  onBack,
}: {
  winner: Job;
  alternatives: Job[];
  fjuhJob: Job | null;
  idolRank?: ArchetypeKey[];
  onRestart: () => void;
  onBack: () => void;
}) {
  const winnerName = hospitalDisplayName(winner.hospitalName, winner.hospitalBriefName).header;
  const includeFjuhBelow = fjuhJob && fjuhJob.id !== winner.id;

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <header className="space-y-2 text-center">
        <p className="text-xs text-gray-500">你剛剛抽到 {winnerName}</p>
        <h2 className="text-2xl font-bold text-gray-900">也很適合你的選擇</h2>
        <p className="text-sm text-gray-600">這些醫院的氣氛跟你抽到的相近，也值得列入考慮</p>
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

      <div className="flex flex-col items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          ← 回到結果
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          🎲 再玩一次
        </button>
        <a
          href="/all"
          className="text-xs text-gray-500 hover:text-gray-700 hover:underline"
        >
          進階：瀏覽所有醫院 →
        </a>
      </div>
    </div>
  );
}

function AlternativeCard({ job, archetype }: { job: Job; archetype?: ArchetypeKey }) {
  const { header, subtitle } = hospitalDisplayName(job.hospitalName, job.hospitalBriefName);
  const link = job.sourceUrl104;

  return (
    <article className="flex h-full flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <HospitalIcon job={job} size={72} archetype={archetype} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-gray-900">{header}</h3>
          {subtitle && <p className="truncate text-xs text-gray-500">{subtitle}</p>}
          <div className="mt-1.5 flex flex-wrap gap-1">
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
          </div>
        </div>
      </div>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto self-end text-xs font-medium text-blue-600 hover:underline"
        >
          查看 104 職缺 →
        </a>
      ) : (
        <span className="mt-auto self-end text-xs text-gray-400">尚無連結</span>
      )}
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
          這個網站是<strong>輔大附醫藥劑部</strong>幾位藥師整理的。
        </p>
        <p className="mt-3">
          當年我們自己在找工作時，沒有一個地方能一次看完所有醫院的薪資、班別、宿舍跟氣氛，
          所以就動手做了這個。
        </p>
        <p className="mt-3">
          如果剛才轉到的氣氛跟你想要的工作環境很搭——順帶一提，輔大附醫也在徵藥師。
          這裡有更多資訊。
        </p>
      </div>
      {fjuhJob ? (
        // FJUH is a university teaching hospital — pin it to 教魂 (teaching).
        <AlternativeCard job={fjuhJob} archetype="教魂藥師" />
      ) : (
        <p className="text-center text-xs text-gray-500">
          目前 Notion 資料庫中尚未列入輔大附醫的職缺資料。
        </p>
      )}
    </section>
  );
}
