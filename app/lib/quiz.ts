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
import { FJUH_WIN_MULT, isFjuh } from './fjuh';

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
        effect: { tags: ['專科藥師訓練', '進階制度'] },
      },
      B: {
        label: '想專注把份內工作做好',
        hint: '工作單純穩定，準時下班',
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
        effect: { tags: ['福利完善'] },
      },
    },
  },
  {
    id: 'shift',
    prompt: '對輪班的態度？',
    options: {
      A: {
        label: '願意拼夜班費',
        hint: '輪班 OK，夜班津貼優渥更好',
        effect: { tags: ['夜班津貼優渥'] },
      },
      B: {
        label: '拒絕大夜！',
        hint: '希望免大夜或少輪班',
        effect: { tags: ['無大夜', '免/少輪班'] },
      },
    },
  },
  {
    id: 'tier',
    prompt: '醫學中心 vs 區域醫院？',
    options: {
      A: {
        label: '醫學中心衝一波',
        hint: '資源光環拉滿，但節奏快、壓力大',
        effect: { hospitalTier: '醫學中心' },
      },
      B: {
        label: '區域教學醫院更對味',
        hint: '一樣有專科訓練，還能親自上手、生活有餘裕',
        effect: { hospitalTier: '區域醫院' },
      },
    },
  },
  {
    id: 'sector',
    prompt: '公立 vs 私立？',
    options: {
      A: {
        label: '私立彈性',
        hint: '薪資、升遷空間較有彈性',
        effect: { publicPrivate: '私立' },
      },
      B: {
        label: '公立穩定',
        hint: '保障足、年資制度完整',
        effect: { publicPrivate: '公立' },
      },
    },
  },
  {
    id: 'growth',
    prompt: '進修發展的偏好？',
    options: {
      A: {
        label: '想往學術、進修發展',
        hint: '發論文、出國研討、公假公費',
        effect: { tags: ['外派進修機會'] },
      },
      B: {
        label: '把臨床功夫練扎實',
        hint: '重視實務經驗、貼近病人',
        effect: { tags: ['全面藥事訓練', '臨床藥事服務'] },
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

// Final step: the user ranks the answers they actually picked. The idol is
// decided by the QUESTION (the topic), not by which option (A/B) was chosen.
// Each of the 7 questions maps to one idol. rank[0]'s idol (the top-ranked
// pick) is the character rendered on the result card.
const QUESTION_IDOL: Record<string, ArchetypeKey> = {
  career: '佛系藥師', // 職涯
  shift: '夜貓藥師', // 輪班
  tier: '學霸藥師', // 等級
  sector: '鐵腕藥師', // 公私
  growth: '教魂藥師', // 進修
  dorm: '北漂藥師', // 住宿
  salary: '金牛藥師', // 薪資
};

export type RankItem = { id: string; label: string; hint: string; archetype?: ArchetypeKey };

export function chosenRankItems(choices: QuizChoice[]): RankItem[] {
  return QUIZ.map((q, i) => {
    const choice = choices[i] ?? 'A';
    const opt = q.options[choice];
    return { id: q.id, label: opt.label, hint: opt.hint, archetype: QUESTION_IDOL[q.id] };
  });
}

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
  // FJUH gets an organic weight multiplier so it wins more often. This is
  // region-gated for free: `eligible` is already region-filtered, so a
  // non-eligible FJUH never reaches this map and never gets boosted.
  const scored = eligible.map((job) => {
    const base = 1 + scoreJob(job, answers);
    return { job, weight: isFjuh(job) ? base * FJUH_WIN_MULT : base };
  });
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
