'use client';

import type { Job } from '../../lib/types';
import {
  HOSPITAL_TIER_BADGE,
  TIER_BADGE,
  hospitalDisplayName,
} from '../../lib/styles';
import { HospitalIcon } from './icons/HospitalIcon';

export function ResultCard({
  job,
  onRestart,
}: {
  job: Job;
  onRestart: () => void;
}) {
  const { header, subtitle } = hospitalDisplayName(job.hospitalName, job.hospitalBriefName);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
        <p className="text-center text-sm text-gray-500">你的命運醫院是</p>
        <div className="mt-4 flex items-center gap-4">
          <HospitalIcon job={job} size={96} />
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

        {(job.salaryDisplay || job.shiftDescription || job.jobSummary) && (
          <dl className="mt-6 space-y-3 border-t border-gray-100 pt-4 text-sm">
            {job.salaryDisplay && <Field label="薪資" value={job.salaryDisplay} />}
            {job.shiftDescription && <Field label="班別" value={job.shiftDescription} />}
            {job.jobSummary && <Field label="職務" value={job.jobSummary} />}
            {job.dormitory && <Field label="宿舍" value={job.dormitory} />}
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

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onRestart}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ← 再玩一次
          </button>
          {job.sourceUrl104 && (
            <a
              href={job.sourceUrl104}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              查看 104 職缺 →
            </a>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs text-amber-900">
        本網站由 <strong>輔大附醫藥劑部</strong> 整理，僅供參考。職缺資訊以
        104 與醫院官網實際公告為準。
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[5rem_1fr] gap-2">
      <dt className="text-gray-500">{label}</dt>
      <dd className="whitespace-pre-wrap text-gray-900">{value}</dd>
    </div>
  );
}
