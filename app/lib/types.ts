export type SalaryTier = '突出' | '一般';
export type PublicPrivate = '公立' | '私立';

export type Tag =
  | '工作單純'
  | '免/少輪班'
  | '無大夜'
  | '夜班津貼優渥'
  | '醫學中心級'
  | '教學醫院'
  | '重視教學'
  | '全面藥事訓練'
  | '外派進修機會'
  | '簽約金'
  | '提供宿舍';

export type Job = {
  id: string;
  hospitalName: string;
  location: string | null;
  publicPrivate: PublicPrivate | null;
  salaryDisplay: string | null;
  salaryTier: SalaryTier | null;
  shiftDescription: string | null;
  jobSummary: string | null;
  educationRequirement: string | null;
  certification: string | null;
  dormitory: string | null;
  headcount: string | null;
  updatedDate: string | null;
  sourceUrl: string;
  tags: Tag[];
  idolImageUrl: string | null;
};
