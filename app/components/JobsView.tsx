'use client';

import { useMemo, useState } from 'react';
import type { Job, SalaryTier, Tag } from '../lib/types';
import { extractCity, rankCity } from '../lib/styles';
import { JobCard } from './JobCard';
import { ComparisonTable } from './ComparisonTable';
import { FieldCompareView } from './FieldCompareView';

type ViewMode = 'cards' | 'table' | 'field';

export function JobsView({ jobs }: { jobs: Job[] }) {
  const [activeTags, setActiveTags] = useState<Set<Tag>>(new Set());
  const [activeTiers, setActiveTiers] = useState<Set<SalaryTier>>(new Set());
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  const cities = useMemo(() => {
    const set = new Set<string>();
    for (const job of jobs) {
      const c = extractCity(job.location);
      if (c) set.add(c);
    }
    return [...set].sort((a, b) => rankCity(a) - rankCity(b));
  }, [jobs]);

  const toggleTag = (tag: Tag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const toggleTier = (tier: SalaryTier) => {
    setActiveTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) next.delete(tier);
      else next.add(tier);
      return next;
    });
  };

  const clearAll = () => {
    setActiveTags(new Set());
    setActiveTiers(new Set());
    setActiveCity(null);
  };

  const hasFilters = activeTags.size > 0 || activeTiers.size > 0 || activeCity !== null;

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (activeTiers.size > 0 && (!job.salaryTier || !activeTiers.has(job.salaryTier))) {
        return false;
      }
      if (activeCity && extractCity(job.location) !== activeCity) {
        return false;
      }
      if (activeTags.size > 0) {
        for (const tag of activeTags) {
          if (!job.tags.includes(tag)) return false;
        }
      }
      return true;
    });
  }, [jobs, activeTags, activeTiers, activeCity]);

  return (
    <>
      <div className="mb-4 space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <FilterRow label="薪資">
          <FilterPill
            label="突出"
            active={activeTiers.has('突出')}
            color="orange"
            onClick={() => toggleTier('突出')}
          />
          <FilterPill
            label="一般"
            active={activeTiers.has('一般')}
            color="gray"
            onClick={() => toggleTier('一般')}
          />
        </FilterRow>

        {cities.length > 0 && (
          <FilterRow label="地點">
            <FilterPill
              label="全部"
              active={activeCity === null}
              color="slate"
              onClick={() => setActiveCity(null)}
            />
            {cities.map((city) => (
              <FilterPill
                key={city}
                label={city}
                active={activeCity === city}
                color="slate"
                onClick={() => setActiveCity(activeCity === city ? null : city)}
              />
            ))}
          </FilterRow>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
          <p className="text-sm text-gray-600">
            {hasFilters
              ? `${filteredJobs.length} / ${jobs.length} 筆符合篩選`
              : `共 ${jobs.length} 筆`}
            {hasFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="ml-3 text-sm font-medium text-blue-700 hover:underline"
              >
                清除全部
              </button>
            )}
          </p>

          <div className="inline-flex overflow-hidden rounded-md border border-gray-300">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 text-sm font-medium ${
                viewMode === 'cards'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              aria-pressed={viewMode === 'cards'}
            >
              卡片
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`border-l border-gray-300 px-3 py-1 text-sm font-medium ${
                viewMode === 'table'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              aria-pressed={viewMode === 'table'}
            >
              比較表
            </button>
            <button
              type="button"
              onClick={() => setViewMode('field')}
              className={`border-l border-gray-300 px-3 py-1 text-sm font-medium ${
                viewMode === 'field'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              aria-pressed={viewMode === 'field'}
            >
              依欄位
            </button>
          </div>
        </div>
      </div>

      {activeTags.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-600">標籤篩選：</span>
          {[...activeTags].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white hover:bg-blue-700"
              aria-label={`移除 ${tag} 篩選`}
            >
              {tag} ✕
            </button>
          ))}
        </div>
      )}

      {filteredJobs.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-600">
          <p>沒有符合篩選的職缺。</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-2 text-sm font-medium text-blue-600 hover:underline"
          >
            清除篩選
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        <ul className="space-y-4">
          {filteredJobs.map((job) => (
            <li key={job.id}>
              <JobCard job={job} activeTags={activeTags} onTagClick={toggleTag} />
            </li>
          ))}
        </ul>
      ) : viewMode === 'table' ? (
        <ComparisonTable jobs={filteredJobs} activeTags={activeTags} onTagClick={toggleTag} />
      ) : (
        <FieldCompareView jobs={filteredJobs} activeTags={activeTags} onTagClick={toggleTag} />
      )}
    </>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="min-w-[3rem] text-sm font-medium text-gray-700">{label}：</span>
      {children}
    </div>
  );
}

function FilterPill({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: 'orange' | 'gray' | 'slate';
  onClick: () => void;
}) {
  const styles: Record<typeof color, string> = {
    orange: active
      ? 'bg-orange-600 text-white border-orange-700 hover:bg-orange-700'
      : 'bg-white text-orange-700 border-orange-300 hover:bg-orange-50',
    gray: active
      ? 'bg-gray-700 text-white border-gray-800 hover:bg-gray-800'
      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
    slate: active
      ? 'bg-slate-700 text-white border-slate-800 hover:bg-slate-800'
      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full border px-3 py-0.5 text-xs font-medium transition-colors ${styles[color]}`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
