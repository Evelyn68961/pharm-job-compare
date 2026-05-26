'use client';

import { useMemo, useState } from 'react';
import type { HospitalTier, Job, Region, SalaryTier, Tag } from '../lib/types';
import { FILTERABLE_HOSPITAL_TIERS, REGIONS } from '../lib/types';
import { REGION_PILL, rankCity } from '../lib/styles';
import { JobCard } from './JobCard';
import { ComparisonTable } from './ComparisonTable';
import { FieldCompareView } from './FieldCompareView';

type ViewMode = 'cards' | 'table' | 'field';

const COMPARE_VIEW_MAX = 20;

export function JobsView({ jobs }: { jobs: Job[] }) {
  const [activeTags, setActiveTags] = useState<Set<Tag>>(new Set());
  const [activeTiers, setActiveTiers] = useState<Set<SalaryTier>>(new Set());
  const [activeHospitalTiers, setActiveHospitalTiers] = useState<Set<HospitalTier>>(new Set());
  const [activeRegion, setActiveRegion] = useState<Region | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  const cities = useMemo(() => {
    const set = new Set<string>();
    for (const job of jobs) {
      if (!job.city) continue;
      if (activeRegion && job.region !== activeRegion) continue;
      set.add(job.city);
    }
    return [...set].sort((a, b) => rankCity(a) - rankCity(b));
  }, [jobs, activeRegion]);

  const regionCounts = useMemo(() => {
    const counts: Partial<Record<Region, number>> = {};
    for (const job of jobs) {
      if (job.region) counts[job.region] = (counts[job.region] ?? 0) + 1;
    }
    return counts;
  }, [jobs]);

  const toggleTag = (tag: Tag) => {
    setActiveTags((prev) => toggleInSet(prev, tag));
  };

  const toggleSalaryTier = (tier: SalaryTier) => {
    setActiveTiers((prev) => toggleInSet(prev, tier));
  };

  const toggleHospitalTier = (tier: HospitalTier) => {
    setActiveHospitalTiers((prev) => toggleInSet(prev, tier));
  };

  const selectRegion = (r: Region | null) => {
    setActiveRegion(r);
    if (activeCity && r && !jobs.some((j) => j.region === r && j.city === activeCity)) {
      setActiveCity(null);
    }
  };

  const clearAll = () => {
    setActiveTags(new Set());
    setActiveTiers(new Set());
    setActiveHospitalTiers(new Set());
    setActiveRegion(null);
    setActiveCity(null);
  };

  const hasFilters =
    activeTags.size > 0 ||
    activeTiers.size > 0 ||
    activeHospitalTiers.size > 0 ||
    activeRegion !== null ||
    activeCity !== null;

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (activeRegion && job.region !== activeRegion) return false;
      if (activeCity && job.city !== activeCity) return false;
      if (activeHospitalTiers.size > 0) {
        if (!job.hospitalTier || !activeHospitalTiers.has(job.hospitalTier)) return false;
      }
      if (activeTiers.size > 0) {
        if (!job.salaryTier || !activeTiers.has(job.salaryTier)) return false;
      }
      if (activeTags.size > 0) {
        for (const tag of activeTags) {
          if (!job.tags.includes(tag)) return false;
        }
      }
      return true;
    });
  }, [jobs, activeTags, activeTiers, activeHospitalTiers, activeRegion, activeCity]);

  const compareDisabled = filteredJobs.length > COMPARE_VIEW_MAX;
  const effectiveViewMode: ViewMode = compareDisabled && viewMode !== 'cards' ? 'cards' : viewMode;

  return (
    <>
      <div className="mb-4 space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <FilterRow label="地區">
          <RegionChip label="全部" active={activeRegion === null} onClick={() => selectRegion(null)} />
          {REGIONS.map((r) => (
            <RegionChip
              key={r}
              region={r}
              label={`${r}${regionCounts[r] ? ` (${regionCounts[r]})` : ''}`}
              active={activeRegion === r}
              onClick={() => selectRegion(activeRegion === r ? null : r)}
            />
          ))}
        </FilterRow>

        <FilterRow label="等級">
          {FILTERABLE_HOSPITAL_TIERS.map((tier) => (
            <FilterPill
              key={tier}
              label={tier}
              active={activeHospitalTiers.has(tier)}
              color="slate"
              onClick={() => toggleHospitalTier(tier)}
            />
          ))}
        </FilterRow>

        <FilterRow label="薪資">
          <FilterPill
            label="突出"
            active={activeTiers.has('突出')}
            color="orange"
            onClick={() => toggleSalaryTier('突出')}
          />
          <FilterPill
            label="一般"
            active={activeTiers.has('一般')}
            color="gray"
            onClick={() => toggleSalaryTier('一般')}
          />
        </FilterRow>

        {cities.length > 1 && (
          <FilterRow label="縣市">
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
            <ViewModeButton
              label="卡片"
              active={effectiveViewMode === 'cards'}
              onClick={() => setViewMode('cards')}
            />
            <ViewModeButton
              label="比較表"
              active={effectiveViewMode === 'table'}
              disabled={compareDisabled}
              disabledHint={`請先篩選至 ${COMPARE_VIEW_MAX} 筆以內`}
              onClick={() => setViewMode('table')}
              borderLeft
            />
            <ViewModeButton
              label="依欄位"
              active={effectiveViewMode === 'field'}
              disabled={compareDisabled}
              disabledHint={`請先篩選至 ${COMPARE_VIEW_MAX} 筆以內`}
              onClick={() => setViewMode('field')}
              borderLeft
            />
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
      ) : effectiveViewMode === 'cards' ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job) => (
            <li key={job.id}>
              <JobCard job={job} activeTags={activeTags} onTagClick={toggleTag} />
            </li>
          ))}
        </ul>
      ) : effectiveViewMode === 'table' ? (
        <ComparisonTable jobs={filteredJobs} activeTags={activeTags} onTagClick={toggleTag} />
      ) : (
        <FieldCompareView jobs={filteredJobs} activeTags={activeTags} onTagClick={toggleTag} />
      )}
    </>
  );
}

function toggleInSet<T>(prev: Set<T>, value: T): Set<T> {
  const next = new Set(prev);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="min-w-[3rem] text-sm font-medium text-gray-700">{label}：</span>
      {children}
    </div>
  );
}

function RegionChip({
  region,
  label,
  active,
  onClick,
}: {
  region?: Region;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const style = region
    ? active
      ? REGION_PILL[region].active
      : REGION_PILL[region].base
    : active
      ? 'bg-gray-900 text-white border-gray-900'
      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full border px-3 py-0.5 text-xs font-medium transition-colors ${style}`}
      aria-pressed={active}
    >
      {label}
    </button>
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

function ViewModeButton({
  label,
  active,
  disabled,
  disabledHint,
  onClick,
  borderLeft,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  disabledHint?: string;
  onClick: () => void;
  borderLeft?: boolean;
}) {
  const base = borderLeft ? 'border-l border-gray-300 ' : '';
  if (disabled) {
    return (
      <span
        className={`${base}cursor-not-allowed bg-gray-50 px-3 py-1 text-sm font-medium text-gray-400`}
        title={disabledHint}
      >
        {label}
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base}px-3 py-1 text-sm font-medium ${
        active ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
