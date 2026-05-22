import type { Job, Tag } from '../lib/types';
import { TIER_BADGE } from '../lib/styles';
import { TagButton } from './TagButton';

export function JobCard({
  job,
  activeTags,
  onTagClick,
}: {
  job: Job;
  activeTags: Set<Tag>;
  onTagClick: (tag: Tag) => void;
}) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold">
          {job.hospitalName || '—'}
          {job.publicPrivate && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({job.publicPrivate})
            </span>
          )}
        </h2>
        {job.salaryTier && (
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${TIER_BADGE[job.salaryTier]}`}
          >
            薪資 {job.salaryTier}
          </span>
        )}
      </div>

      <p className="mt-1 text-sm text-gray-600">{job.location || '—'}</p>

      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <Field label="薪資" value={job.salaryDisplay} />
        <Field label="輪班" value={job.shiftDescription} />
        <Field label="職務內容" value={job.jobSummary} />
        <Field label="學歷" value={job.educationRequirement} />
        <Field label="證照" value={job.certification} />
        <Field label="宿舍" value={job.dormitory} />
        <Field label="需求人數" value={job.headcount} />
        <Field label="更新" value={job.updatedDate} />
      </dl>

      {job.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {job.tags.map((tag) => (
            <li key={tag}>
              <TagButton tag={tag} active={activeTags.has(tag)} onClick={onTagClick} />
            </li>
          ))}
        </ul>
      )}

      {job.sourceUrl && (
        <div className="mt-4">
          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            查看 104 原始職缺 →
          </a>
        </div>
      )}
    </article>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="font-medium text-gray-500">{label}</dt>
      <dd className="text-gray-900">{value || '—'}</dd>
    </div>
  );
}
