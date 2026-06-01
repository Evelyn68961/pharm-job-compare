// Dev-only preview for the 6 archetype icons. Not linked from the live site.
// Shows each character (a) raw at large size to inspect the SVG, and
// (b) composed via <HospitalIcon> with a mock Job to see the final result.
// Delete this folder when no longer useful.
import { HospitalIcon } from '../../components/spin/icons/HospitalIcon';
import { AcademicAcePharmacist } from '../../components/spin/icons/archetypes/AcademicAcePharmacist';
import { BeipiaoPharmacist } from '../../components/spin/icons/archetypes/BeipiaoPharmacist';
import { IronArmPharmacist } from '../../components/spin/icons/archetypes/IronArmPharmacist';
import { NightOwlPharmacist } from '../../components/spin/icons/archetypes/NightOwlPharmacist';
import { TeachingSoulPharmacist } from '../../components/spin/icons/archetypes/TeachingSoulPharmacist';
import { ZenPharmacist } from '../../components/spin/icons/archetypes/ZenPharmacist';
import type { ArchetypeKey } from '../../components/spin/icons/types';
import type { Job, Tag } from '../../lib/types';

type Row = {
  key: ArchetypeKey;
  Character: React.ComponentType<{ size: number }>;
  job: Job;
};

function mockJob(overrides: Partial<Job> & Pick<Job, 'id' | 'hospitalName'>): Job {
  return {
    hospitalBriefName: null,
    hospitalTier: null,
    publicPrivate: null,
    region: null,
    city: null,
    location: null,
    phone: null,
    brandColor: '#2563eb',
    salaryDisplay: null,
    salaryTier: null,
    shiftDescription: null,
    jobSummary: null,
    dormitory: null,
    updatedDate: null,
    sourceUrl104: null,
    source: null,
    tags: [] as Tag[],
    ...overrides,
  };
}

const ROWS: Row[] = [
  {
    key: '北漂藥師',
    Character: BeipiaoPharmacist,
    job: mockJob({
      id: 'mock-beipiao',
      hospitalName: '臺北榮民總醫院',
      hospitalBriefName: '北榮',
      brandColor: '#0ea5e9',
      tags: ['提供宿舍'],
      salaryTier: '突出',
    }),
  },
  {
    key: '教魂藥師',
    Character: TeachingSoulPharmacist,
    job: mockJob({
      id: 'mock-teaching',
      hospitalName: '林口長庚紀念醫院',
      hospitalBriefName: '林口長庚',
      brandColor: '#16a34a',
      tags: ['教學醫院', '重視教學'],
    }),
  },
  {
    key: '夜貓藥師',
    Character: NightOwlPharmacist,
    job: mockJob({
      id: 'mock-nightowl',
      hospitalName: '中國醫藥大學附設醫院',
      hospitalBriefName: '中國附醫',
      brandColor: '#7c3aed',
      tags: ['夜班津貼優渥'],
    }),
  },
  {
    key: '佛系藥師',
    Character: ZenPharmacist,
    job: mockJob({
      id: 'mock-zen',
      hospitalName: '輔大附醫',
      hospitalBriefName: '輔大附醫',
      brandColor: '#f59e0b',
      tags: ['工作單純', '無大夜'],
    }),
  },
  {
    key: '學霸藥師',
    Character: AcademicAcePharmacist,
    job: mockJob({
      id: 'mock-academic',
      hospitalName: '國立臺灣大學醫學院附設醫院',
      hospitalBriefName: '臺大',
      brandColor: '#0f766e',
      hospitalTier: '醫學中心',
      salaryTier: '突出',
    }),
  },
  {
    key: '鐵腕藥師',
    Character: IronArmPharmacist,
    job: mockJob({
      id: 'mock-iron',
      hospitalName: '衛生福利部桃園醫院',
      hospitalBriefName: '部桃',
      brandColor: '#dc2626',
      publicPrivate: '公立',
    }),
  },
];

export default function IconPreviewPage() {
  return (
    <main className="mx-auto max-w-5xl p-8 space-y-10">
      <header>
        <h1 className="text-2xl font-bold">藥師圖示預覽</h1>
        <p className="text-sm text-slate-600 mt-1">
          僅供開發測試 · 左欄為純角色 SVG，右欄為實際 HospitalIcon 合成（含光暈、醫院徽章、薪資火花）。
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">三種尺寸</h2>
        <div className="grid grid-cols-[200px_1fr_1fr_1fr] gap-4 items-center">
          <div className="text-sm text-slate-500">原型</div>
          <div className="text-xs text-slate-500 text-center">純角色 192px</div>
          <div className="text-xs text-slate-500 text-center">HospitalIcon 128px</div>
          <div className="text-xs text-slate-500 text-center">HospitalIcon 64px</div>

          {ROWS.map(({ key, Character, job }) => (
            <div key={key} className="contents">
              <div>
                <div className="font-semibold">{key}</div>
                <div className="text-xs text-slate-500">{job.hospitalBriefName ?? job.hospitalName}</div>
                <div className="text-xs text-slate-400 mt-1">brand {job.brandColor}</div>
              </div>
              <div className="flex justify-center bg-slate-50 rounded-lg p-3">
                <Character size={192} />
              </div>
              <div className="flex justify-center bg-slate-50 rounded-lg p-3">
                <HospitalIcon job={job} size={128} />
              </div>
              <div className="flex justify-center bg-slate-50 rounded-lg p-3">
                <HospitalIcon job={job} size={64} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
