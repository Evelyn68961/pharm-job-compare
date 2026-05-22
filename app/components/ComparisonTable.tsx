import type { Job, Tag } from '../lib/types';
import { TIER_BADGE, breakOnParens } from '../lib/styles';
import { TagButton } from './TagButton';

type RowDef = { label: string; render: (job: Job) => React.ReactNode };

export function ComparisonTable({
  jobs,
  activeTags,
  onTagClick,
}: {
  jobs: Job[];
  activeTags: Set<Tag>;
  onTagClick: (tag: Tag) => void;
}) {
  const rows: RowDef[] = [
    { label: '公/私立', render: (j) => textOrDash(j.publicPrivate) },
    { label: '地點', render: (j) => textOrDash(j.location) },
    { label: '薪資', render: (j) => textOrDash(breakOnParens(j.salaryDisplay)) },
    {
      label: '薪資等級',
      render: (j) =>
        j.salaryTier ? (
          <span
            className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${TIER_BADGE[j.salaryTier]}`}
          >
            {j.salaryTier}
          </span>
        ) : (
          dash()
        ),
    },
    { label: '輪班', render: (j) => textOrDash(breakOnParens(j.shiftDescription)) },
    { label: '職務內容', render: (j) => textOrDash(j.jobSummary) },
    { label: '學歷', render: (j) => textOrDash(j.educationRequirement) },
    { label: '證照', render: (j) => textOrDash(j.certification) },
    { label: '宿舍', render: (j) => textOrDash(j.dormitory) },
    { label: '需求人數', render: (j) => textOrDash(j.headcount) },
    { label: '更新', render: (j) => textOrDash(j.updatedDate) },
    {
      label: '特色標籤',
      render: (j) =>
        j.tags.length === 0 ? (
          dash()
        ) : (
          <ul className="flex flex-wrap gap-1">
            {j.tags.map((tag) => (
              <li key={tag}>
                <TagButton tag={tag} active={activeTags.has(tag)} onClick={onTagClick} />
              </li>
            ))}
          </ul>
        ),
    },
    {
      label: '連結',
      render: (j) =>
        j.sourceUrl ? (
          <a
            href={j.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            104 →
          </a>
        ) : (
          dash()
        ),
    },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th
              scope="col"
              className="sticky left-0 z-10 min-w-[5rem] border-b border-r border-gray-200 bg-gray-50 px-3 py-2 text-left font-medium text-gray-700"
            >
              欄位
            </th>
            {jobs.map((job) => (
              <th
                key={job.id}
                scope="col"
                className="min-w-[10rem] border-b border-gray-200 px-3 py-2 text-left font-semibold text-gray-900"
              >
                <div className="whitespace-pre-wrap">
                  {breakOnParens(job.hospitalName) || '—'}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-gray-100 last:border-b-0">
              <th
                scope="row"
                className="sticky left-0 z-10 whitespace-nowrap border-r border-gray-200 bg-white px-3 py-2 text-left align-top font-medium text-gray-500"
              >
                {row.label}
              </th>
              {jobs.map((job) => (
                <td key={job.id} className="px-3 py-2 align-top text-gray-900">
                  {row.render(job)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function dash() {
  return <span className="text-gray-400">—</span>;
}

function textOrDash(value: string | null) {
  if (!value) return dash();
  return (
    <span className="whitespace-pre-wrap [text-wrap:balance]">{value}</span>
  );
}

