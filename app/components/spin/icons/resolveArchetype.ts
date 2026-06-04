import type { Job, Tag } from '../../../lib/types';
import type { ArchetypeKey } from './types';

const TEACHING_TAGS: Tag[] = ['專科藥師訓練', '進階制度', '全面藥事訓練', '外派進修機會'];
const CHILL_TAGS: Tag[] = ['工作單純', '免/少輪班', '無大夜'];

export const ARCHETYPE_PRIORITY: ReadonlyArray<{
  archetype: ArchetypeKey;
  test: (job: Job) => boolean;
}> = [
  { archetype: '學霸藥師', test: (job) => job.hospitalTier === '醫學中心' },
  { archetype: '教魂藥師', test: (job) => TEACHING_TAGS.some((t) => job.tags.includes(t)) },
  { archetype: '北漂藥師', test: (job) => job.tags.includes('提供宿舍') },
  { archetype: '鐵腕藥師', test: (job) => job.publicPrivate === '公立' },
  { archetype: '夜貓藥師', test: (job) => job.tags.includes('夜班津貼優渥') },
  { archetype: '佛系藥師', test: (job) => CHILL_TAGS.some((t) => job.tags.includes(t)) },
];

export const ARCHETYPE_FALLBACK: ArchetypeKey = '佛系藥師';

export function resolveArchetype(job: Job): ArchetypeKey {
  for (const rule of ARCHETYPE_PRIORITY) {
    if (rule.test(job)) return rule.archetype;
  }
  return ARCHETYPE_FALLBACK;
}
