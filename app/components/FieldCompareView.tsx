import { useMemo, useState } from 'react';
import type { HospitalTier, Job, PublicPrivate, SalaryTier, Tag } from '../lib/types';
import { HOSPITAL_TIER_BADGE, TIER_BADGE, breakOnParens, hospitalDisplayName, rankCity } from '../lib/styles';
import { TagButton } from './TagButton';

type FieldRenderer = (
  job: Job,
  activeTags: Set<Tag>,
  onTagClick: (tag: Tag) => void,
) => React.ReactNode;

type SortMode = 'off' | 'asc' | 'desc';

type Field = {
  key: string;
  label: string;
  render: FieldRenderer;
  sort?: (a: Job, b: Job) => number;
  defaultDirection?: 'asc' | 'desc';
};

const PUBLIC_PRIVATE_ORDER: Record<PublicPrivate, number> = { 公立: 0, 私立: 1 };
const SALARY_TIER_ORDER: Record<SalaryTier, number> = { 突出: 0, 一般: 1 };
const HOSPITAL_TIER_ORDER: Record<HospitalTier, number> = {
  醫學中心: 0,
  區域醫院: 1,
  地區醫院: 2,
  其他: 3,
};

function rankPublicPrivate(value: PublicPrivate | null): number {
  return value ? PUBLIC_PRIVATE_ORDER[value] : 2;
}

function rankSalaryTier(value: SalaryTier | null): number {
  return value ? SALARY_TIER_ORDER[value] : 2;
}

function rankHospitalTier(value: HospitalTier | null): number {
  return value ? HOSPITAL_TIER_ORDER[value] : 4;
}

const FIELDS: Field[] = [
  {
    key: 'hospitalTier',
    label: '醫院等級',
    render: (j) =>
      j.hospitalTier ? (
        <span
          className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${HOSPITAL_TIER_BADGE[j.hospitalTier]}`}
        >
          {j.hospitalTier}
        </span>
      ) : (
        dash()
      ),
    sort: (a, b) => rankHospitalTier(a.hospitalTier) - rankHospitalTier(b.hospitalTier),
    defaultDirection: 'asc',
  },
  {
    key: 'publicPrivate',
    label: '公/私立',
    render: (j) => textOrDash(j.publicPrivate),
    sort: (a, b) => rankPublicPrivate(a.publicPrivate) - rankPublicPrivate(b.publicPrivate),
    defaultDirection: 'asc',
  },
  {
    key: 'location',
    label: '地點',
    render: (j) => textOrDash(j.location),
    sort: (a, b) => rankCity(a.city) - rankCity(b.city),
    defaultDirection: 'asc',
  },
  {
    key: 'salaryDisplay',
    label: '薪資',
    render: (j) => textOrDash(breakOnParens(j.salaryDisplay)),
  },
  {
    key: 'salaryTier',
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
    sort: (a, b) => rankSalaryTier(a.salaryTier) - rankSalaryTier(b.salaryTier),
    defaultDirection: 'asc',
  },
  {
    key: 'shift',
    label: '輪班',
    render: (j) => textOrDash(breakOnParens(j.shiftDescription)),
  },
  { key: 'jobSummary', label: '職務內容', render: (j) => textOrDash(j.jobSummary) },
  { key: 'education', label: '學歷', render: (j) => textOrDash(j.educationRequirement) },
  { key: 'certification', label: '證照', render: (j) => textOrDash(j.certification) },
  { key: 'dormitory', label: '宿舍', render: (j) => textOrDash(j.dormitory) },
  {
    key: 'tags',
    label: '特色標籤',
    render: (j, activeTags, onTagClick) =>
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
    sort: (a, b) => a.tags.length - b.tags.length,
    defaultDirection: 'desc',
  },
];

const DEFAULT_FIELD = 'salaryDisplay';

export function FieldCompareView({
  jobs,
  activeTags,
  onTagClick,
}: {
  jobs: Job[];
  activeTags: Set<Tag>;
  onTagClick: (tag: Tag) => void;
}) {
  const [activeKey, setActiveKey] = useState<string>(DEFAULT_FIELD);
  const initialField = FIELDS.find((f) => f.key === DEFAULT_FIELD);
  const [sortMode, setSortMode] = useState<SortMode>(initialField?.defaultDirection ?? 'off');

  const activeField = FIELDS.find((f) => f.key === activeKey) ?? FIELDS[0];

  const handleFieldChange = (key: string) => {
    setActiveKey(key);
    const f = FIELDS.find((field) => field.key === key);
    setSortMode(f?.defaultDirection ?? 'off');
  };

  const cycleSort = () => {
    setSortMode((m) => (m === 'off' ? 'asc' : m === 'asc' ? 'desc' : 'off'));
  };

  const displayJobs = useMemo(() => {
    if (sortMode === 'off' || !activeField.sort) return jobs;
    const sorted = [...jobs].sort(activeField.sort);
    return sortMode === 'asc' ? sorted : sorted.reverse();
  }, [jobs, sortMode, activeField]);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto border-b border-gray-200 bg-gray-50">
        <div className="flex min-w-max gap-1 p-2">
          {FIELDS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => handleFieldChange(f.key)}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                activeKey === f.key
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
              aria-pressed={activeKey === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100 bg-blue-50 px-4 py-2 text-sm">
        <span className="font-medium text-blue-900">欄位：{activeField.label}</span>
        {activeField.sort ? (
          <button
            type="button"
            onClick={cycleSort}
            className={`rounded-full border px-2 py-0.5 text-xs font-medium transition-colors ${
              sortMode === 'off'
                ? 'border-blue-300 bg-white text-blue-700 hover:bg-blue-50'
                : 'border-blue-700 bg-blue-600 text-white hover:bg-blue-700'
            }`}
            aria-label="切換排序方向"
          >
            {sortMode === 'off'
              ? '預設順序'
              : sortMode === 'asc'
                ? `↑ 依${activeField.label}排序`
                : `↓ 依${activeField.label}排序`}
          </button>
        ) : (
          <span className="text-xs text-blue-700/70">此欄位無法排序</span>
        )}
      </div>

      <ul className="divide-y divide-gray-100">
        {displayJobs.map((job) => {
          const { header, subtitle } = hospitalDisplayName(job.hospitalName, job.hospitalBriefName);
          return (
            <li key={job.id} className="px-4 py-3">
              <div className="flex items-baseline gap-2">
                <div className="text-base font-semibold text-gray-900">{header || '—'}</div>
                {job.publicPrivate && (
                  <span className="text-xs font-normal text-gray-500">({job.publicPrivate})</span>
                )}
              </div>
              {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
              <div className="mt-1 text-sm text-gray-700">
                {activeField.render(job, activeTags, onTagClick)}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function dash() {
  return <span className="text-gray-400">—</span>;
}

function textOrDash(value: string | null) {
  if (!value) return dash();
  return <span className="whitespace-pre-wrap">{value}</span>;
}
