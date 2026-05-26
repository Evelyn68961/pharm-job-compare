import type {
  HospitalTier,
  Job,
  PublicPrivate,
  Region,
  SalaryTier,
  Tag,
} from './types';

export type QuizChoice = 'A' | 'B';
export type QuizAnswers = QuizChoice[];

type Effect = {
  tags?: Tag[];
  hospitalTier?: HospitalTier;
  salaryTier?: SalaryTier;
  publicPrivate?: PublicPrivate;
  regions?: Region[];
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
  {
    id: 'region',
    prompt: '想去哪個區域？',
    options: {
      A: {
        label: '西部都會圈',
        hint: '北北基、桃竹苗、中彰投',
        effect: { regions: ['北北基', '桃竹苗', '中彰投'] },
      },
      B: {
        label: '中南東部',
        hint: '雲嘉南、高屏、宜花東',
        effect: { regions: ['雲嘉南', '高屏', '宜花東'] },
      },
    },
  },
];

export type ScoredJob = { job: Job; weight: number };

const POINTS = {
  tag: 2,
  hospitalTier: 3,
  salaryTier: 3,
  publicPrivate: 2,
  region: 2,
};

export function scoreJob(job: Job, answers: QuizAnswers): number {
  let score = 0;
  for (let i = 0; i < QUIZ.length; i++) {
    const choice = answers[i];
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
    if (effect.regions && job.region && effect.regions.includes(job.region)) {
      score += POINTS.region;
    }
  }
  return score;
}

// Hospitals always get baseline weight 1 so the wheel never has 0-weight slices.
// Higher score → bigger slice → more likely to be picked.
export function buildWheelCandidates(jobs: Job[], answers: QuizAnswers): ScoredJob[] {
  const eligible = jobs.filter((j) => j.hospitalTier === '醫學中心' || j.hospitalTier === '區域醫院');
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
