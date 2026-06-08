export type SalaryTier = '突出' | '一般';
export type PublicPrivate = '公立' | '私立';
export type HospitalTier = '醫學中心' | '區域醫院' | '地區醫院' | '其他';
export type Region = '北北基' | '桃竹苗' | '中彰投' | '雲嘉南' | '高屏' | '宜花東' | '離島';
export type DataSource = 'manual-seed' | 'gov-bulk' | 'parser' | 'llm-fallback';

export const REGIONS: Region[] = [
  '北北基',
  '桃竹苗',
  '中彰投',
  '雲嘉南',
  '高屏',
  '宜花東',
  '離島',
];

export type Tag =
  | '工作單純'
  | '免/少輪班'
  | '無大夜'
  | '夜班津貼優渥'
  | '專科藥師訓練'
  | '進階制度'
  | '全面藥事訓練'
  | '臨床藥事服務'
  | '外派進修機會'
  | '簽約金'
  | '提供宿舍'
  | '福利完善';

export type Job = {
  id: string;
  hospitalName: string;
  hospitalBriefName: string | null;
  hospitalTier: HospitalTier | null;
  publicPrivate: PublicPrivate | null;
  region: Region | null;
  city: string | null;
  brandColor: string | null;
  secondaryColor: string | null;
  salaryDisplay: string | null;
  salaryTier: SalaryTier | null;
  shiftDescription: string | null;
  jobSummary: string | null;
  dormitory: string | null;
  updatedDate: string | null;
  sourceUrl104: string | null;
  source: DataSource | null;
  tags: Tag[];
  // Only hospitals with a current pharmacist opening are eligible for the spin
  // wheel and recommendations (Notion 招募中 checkbox). Unchecked = excluded.
  isHiring: boolean;
};

export function applyUrl(job: Job): string | null {
  return job.sourceUrl104 || null;
}

export function hasJobDetail(job: Job): boolean {
  return Boolean(
    job.salaryDisplay || job.shiftDescription || job.jobSummary || job.dormitory,
  );
}
