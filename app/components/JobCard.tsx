import type { Job, Tag } from '../lib/types';
import { applyUrl, hasJobDetail } from '../lib/types';
import { HOSPITAL_TIER_BADGE, TIER_BADGE, hospitalDisplayName, safeBrandColor } from '../lib/styles';
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
  const brand = safeBrandColor(job.brandColor);
  const link = applyUrl(job);
  const linkLabel = job.sourceUrl104 ? '查看 104 原始職缺 →' : '前往醫院官網職缺 →';
  const showDetails = hasJobDetail(job);
  const { header, subtitle } = hospitalDisplayName(job.hospitalName, job.hospitalBriefName);
  const meta = [job.hospitalTier, job.publicPrivate, job.region, job.location]
    .filter(Boolean)
    .join(' · ');

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <header className="flex items-start gap-3">
        <div
          aria-hidden
          className="h-12 w-12 flex-shrink-0 rounded-full border border-gray-200"
          style={{ backgroundColor: brand ?? '#e5e7eb' }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-bold">{header}</h2>
            <div className="flex flex-wrap gap-1">
              {job.hospitalTier && (
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-medium ${HOSPITAL_TIER_BADGE[job.hospitalTier]}`}
                >
                  {job.hospitalTier}
                </span>
              )}
              {job.salaryTier && (
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-medium ${TIER_BADGE[job.salaryTier]}`}
                >
                  薪資 {job.salaryTier}
                </span>
              )}
            </div>
          </div>
          {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
          {meta && <p className="mt-1 text-sm text-gray-600">{meta}</p>}
          {job.phone && (
            <p className="mt-0.5 text-sm text-gray-500">
              <a href={`tel:${job.phone}`} className="hover:text-gray-700">
                📞 {job.phone}
              </a>
            </p>
          )}
        </div>
      </header>

      {showDetails && (
        <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {job.salaryDisplay && <Field label="薪資" value={job.salaryDisplay} />}
          {job.shiftDescription && <Field label="輪班" value={job.shiftDescription} />}
          {job.jobSummary && <Field label="職務內容" value={job.jobSummary} />}
          {job.dormitory && <Field label="宿舍" value={job.dormitory} />}
        </dl>
      )}

      {job.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {job.tags.map((tag) => (
            <li key={tag}>
              <TagButton tag={tag} active={activeTags.has(tag)} onClick={onTagClick} />
            </li>
          ))}
        </ul>
      )}

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        {job.updatedDate ? (
          <span className="text-xs text-gray-500">更新於 {job.updatedDate}</span>
        ) : (
          <span />
        )}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline"
          >
            {linkLabel}
          </a>
        )}
      </footer>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-gray-500">{label}</dt>
      <dd className="whitespace-pre-wrap text-gray-900">{value}</dd>
    </div>
  );
}
