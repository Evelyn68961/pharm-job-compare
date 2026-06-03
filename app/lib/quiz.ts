import {
  REGIONS,
  type HospitalTier,
  type Job,
  type PublicPrivate,
  type Region,
  type SalaryTier,
  type Tag,
} from './types';
import type { ArchetypeKey } from '../components/spin/icons/types';

export type QuizChoice = 'A' | 'B';

// The user's full input from the spin quiz:
// - choices: one A/B answer per QUIZ question (these pick the hospital)
// - regions: 0+ regions the user is open to (multi-select)
// - idolRank: the 6 idol themes in the user's order; idolRank[0] = rendered idol
export type QuizAnswers = {
  choices: QuizChoice[];
  regions: Region[];
  idolRank: ArchetypeKey[];
};

type Effect = {
  tags?: Tag[];
  hospitalTier?: HospitalTier;
  salaryTier?: SalaryTier;
  publicPrivate?: PublicPrivate;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: {
    A: { label: string; hint: string; effect: Effect };
    B: { label: string; hint: string; effect: Effect };
  };
};

export const QUIZ: QuizQuestion[] = [
  {
    id: 'career',
    prompt: '你的職涯偏好是？',
    options: {
      A: {
        label: '想跟著進階制度成長',
        hint: 'PGY 訓練、藥事認證、進階獎金',
        effect: { tags: ['教學醫院', '重視教學', '全面藥事訓練'] },
      },
      B: {
        label: '想單純做事下班',
        hint: '不愛訓練負擔，希望工作別太雜',
        effect: { tags: ['工作單純'] },
      },
    },
  },
  {
    id: 'salary',
    prompt: '對薪資的期待？',
    options: {
      A: {
        label: '年薪百萬以上才考慮',
        hint: '看重簽約金、進階津貼疊加',
        effect: { salaryTier: '突出', tags: ['簽約金'] },
      },
      B: {
        label: '看整體 package',
        hint: '薪水合理就好，重視其他福利',
        effect: {},
      },
    },
  },
  {
    id: 'shift',
    prompt: '對輪班的態度？',
    options: {
      A: {
        label: '拒絕大夜！',
        hint: '希望免大夜或少輪班',
        effect: { tags: ['無大夜', '免/少輪班'] },
      },
      B: {
        label: '願意拼夜班費',
        hint: '輪班 OK，夜班津貼優渥更好',
        effect: { tags: ['夜班津貼優渥'] },
      },
    },
  },
  {
    id: 'tier',
    prompt: '想去哪種等級的醫院？',
    options: {
      A: {
        label: '醫學中心練功',
        hint: '學東西多，壓力可以接受',
        effect: { hospitalTier: '醫學中心' },
      },
      B: {
        label: '區域醫院步調穩',
        hint: '想要平衡 + 完整經驗',
        effect: { hospitalTier: '區域醫院' },
      },
    },
  },
  {
    id: 'sector',
    prompt: '公立 vs 私立？',
    options: {
      A: {
        label: '公立穩定',
        hint: '部立、市立、榮民、國軍',
        effect: { publicPrivate: '公立' },
      },
      B: {
        label: '私立彈性',
        hint: '長庚、慈濟、義大、各財團法人',
        effect: { publicPrivate: '私立' },
      },
    },
  },
  {
    id: 'growth',
    prompt: '進修發展的偏好？',
    options: {
      A: {
        label: '想發論文、出國研討',
        hint: '公假公費、研究獎勵',
        effect: { tags: ['外派進修機會', '重視教學'] },
      },
      B: {
        label: '工作生活平衡',
        hint: '下班好好過生活',
        effect: { tags: ['工作單純'] },
      },
    },
  },
  {
    id: 'dorm',
    prompt: '住宿需求？',
    options: {
      A: {
        label: '北漂南漂需要宿舍',
        hint: '優先看有提供宿舍的醫院',
        effect: { tags: ['提供宿舍'] },
      },
      B: {
        label: '住家附近就好',
        hint: '不需要宿舍',
        effect: {},
      },
    },
  },
];

// Region multi-select step. The user can pick any number of regions (or none).
// 離島 is excluded — the database has no offshore-island hospitals.
export const QUIZ_REGIONS: Region[] = REGIONS.filter((r) => r !== '離島');

// Final ranking step: the user orders these 6 priorities. The top-ranked one
// maps to the idol that renders on the result card. Worded as values, not as
// the character art — the idol stays a surprise until the result.
export type IdolPriority = { archetype: ArchetypeKey; label: string; hint: string };

export const IDOL_PRIORITIES: IdolPriority[] = [
  { archetype: '學霸藥師', label: '醫學中心練功', hint: '挑戰大院、學得多' },
  { archetype: '教魂藥師', label: '跟著制度成長', hint: '教學、進修、認證' },
  { archetype: '北漂藥師', label: '需要宿舍', hint: '離鄉工作、要住宿' },
  { archetype: '鐵腕藥師', label: '公立穩定', hint: '部立、市立、榮民、國軍' },
  { archetype: '夜貓藥師', label: '拼夜班津貼', hint: '輪班沒在怕、衝夜班費' },
  { archetype: '佛系藥師', label: '工作生活平衡', hint: '下班好好過生活' },
];

export type ScoredJob = { job: Job; weight: number };

const POINTS = {
  tag: 2,
  hospitalTier: 3,
  salaryTier: 3,
  publicPrivate: 2,
};

export function scoreJob(job: Job, answers: QuizAnswers): number {
  let score = 0;
  for (let i = 0; i < QUIZ.length; i++) {
    const choice = answers.choices[i];
    if (!choice) continue;
    const effect = QUIZ[i].options[choice].effect;
    if (effect.tags) {
      for (const tag of effect.tags) {
        if (job.tags.includes(tag)) score += POINTS.tag;
      }
    }
    if (effect.hospitalTier && job.hospitalTier === effect.hospitalTier) {
      score += POINTS.hospitalTier;
    }
    if (effect.salaryTier && job.salaryTier === effect.salaryTier) {
      score += POINTS.salaryTier;
    }
    if (effect.publicPrivate && job.publicPrivate === effect.publicPrivate) {
      score += POINTS.publicPrivate;
    }
  }
  return score;
}

// Hospitals always get baseline weight 1 so the wheel never has 0-weight slices.
// Higher score → bigger slice → more likely to be picked.
export function buildWheelCandidates(jobs: Job[], answers: QuizAnswers): ScoredJob[] {
  let eligible = jobs.filter((j) => j.hospitalTier === '醫學中心' || j.hospitalTier === '區域醫院');
  // Region is a STRICT filter: if the user picked regions, only hospitals in
  // those regions are eligible. (No regions picked = no region restriction.)
  if (answers.regions.length > 0) {
    eligible = eligible.filter((j) => j.region != null && answers.regions.includes(j.region));
  }
  const scored = eligible.map((job) => ({ job, weight: 1 + scoreJob(job, answers) }));
  // Sort by weight descending so the highest matches sit on the wheel's right side.
  scored.sort((a, b) => b.weight - a.weight);
  return scored;
}

export function pickWeightedIndex(candidates: ScoredJob[], rand = Math.random()): number {
  const total = candidates.reduce((s, c) => s + c.weight, 0);
  let r = rand * total;
  for (let i = 0; i < candidates.length; i++) {
    r -= candidates[i].weight;
    if (r <= 0) return i;
  }
  return candidates.length - 1;
}

// Pick `n` distinct entries from the highest-scoring `poolSize` candidates,
// weighted by score. Used to fill the 14-cell pillbox: MBTI does the
// heavy filtering (top-30), then a weighted draw picks the 14 finalists.
export function pickWeightedSample(
  all: ScoredJob[],
  poolSize: number,
  n: number,
): ScoredJob[] {
  const pool = all.slice(0, Math.min(poolSize, all.length));
  if (pool.length <= n) return pool;
  const remaining = [...pool];
  const picked: ScoredJob[] = [];
  while (picked.length < n && remaining.length > 0) {
    const idx = pickWeightedIndex(remaining);
    picked.push(remaining[idx]);
    remaining.splice(idx, 1);
  }
  return picked;
}
