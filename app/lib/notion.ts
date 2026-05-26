import type {
  DataSource,
  HospitalTier,
  Job,
  PublicPrivate,
  Region,
  SalaryTier,
  Tag,
} from './types';

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2025-09-03';
const REVALIDATE_SECONDS = 600;
const PAGE_SIZE = 100;

type NotionProperty = Record<string, unknown>;
type NotionPage = { id: string; properties: Record<string, NotionProperty> };
type NotionQueryResponse = { results: NotionPage[]; has_more: boolean; next_cursor: string | null };

export type FetchResult =
  | { ok: true; jobs: Job[] }
  | { ok: false; reason: 'missing-env' | 'fetch-failed'; detail?: string };

export async function fetchJobs(): Promise<FetchResult> {
  const token = process.env.NOTION_TOKEN;
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;

  if (!token || !dataSourceId) {
    return { ok: false, reason: 'missing-env' };
  }

  const all: NotionPage[] = [];
  let cursor: string | null = null;

  do {
    const body: { page_size: number; start_cursor?: string } = { page_size: PAGE_SIZE };
    if (cursor) body.start_cursor = cursor;

    const res = await fetch(`${NOTION_API}/data_sources/${dataSourceId}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      return { ok: false, reason: 'fetch-failed', detail: `${res.status} ${await res.text()}` };
    }

    const data = (await res.json()) as NotionQueryResponse;
    all.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);

  return { ok: true, jobs: all.map(parseJob) };
}

const HOSPITAL_NAME_ORDER = new Intl.Collator('zh-Hant', { sensitivity: 'base' });

export function sortJobs(jobs: Job[]): Job[] {
  return [...jobs].sort((a, b) => HOSPITAL_NAME_ORDER.compare(a.hospitalName, b.hospitalName));
}

function parseJob(page: NotionPage): Job {
  const p = page.properties;
  return {
    id: page.id,
    hospitalName: getTitle(p['醫院名稱']),
    hospitalBriefName: getText(p['醫院簡稱']),
    hospitalTier: getSelect(p['醫院等級']) as HospitalTier | null,
    publicPrivate: getSelect(p['公立/私立']) as PublicPrivate | null,
    region: getSelect(p['地區']) as Region | null,
    city: getText(p['縣市']),
    district: getText(p['區']),
    location: getText(p['地點']),
    phone: getPhone(p['電話']),
    brandColor: getText(p['識別色']),
    salaryDisplay: getText(p['薪資顯示字串']),
    salaryTier: getSelect(p['薪資等級']) as SalaryTier | null,
    shiftDescription: getText(p['輪班說明']),
    jobSummary: getText(p['職務內容摘要']),
    educationRequirement: getText(p['學歷要求']),
    certification: getText(p['證照']),
    dormitory: getText(p['宿舍']),
    headcount: getText(p['需求人數']),
    updatedDate: getDate(p['更新日期']),
    officialUrl: getUrl(p['醫院官網職缺連結']),
    sourceUrl104: getUrl(p['104 原始連結']),
    source: getSelect(p['資料來源']) as DataSource | null,
    tags: getMultiSelect(p['特色標籤']) as Tag[],
  };
}

type RichTextItem = { plain_text?: string };
type SelectValue = { name?: string };
type DateValue = { start?: string };

function getTitle(prop: NotionProperty | undefined): string {
  const title = (prop as { title?: RichTextItem[] } | undefined)?.title;
  return title?.[0]?.plain_text ?? '';
}

function getText(prop: NotionProperty | undefined): string | null {
  const rich = (prop as { rich_text?: RichTextItem[] } | undefined)?.rich_text;
  const text = rich?.map((r) => r.plain_text ?? '').join('').trim();
  return text ? text : null;
}

function getSelect(prop: NotionProperty | undefined): string | null {
  const sel = (prop as { select?: SelectValue | null } | undefined)?.select;
  return sel?.name ?? null;
}

function getMultiSelect(prop: NotionProperty | undefined): string[] {
  const ms = (prop as { multi_select?: SelectValue[] } | undefined)?.multi_select;
  return ms?.map((m) => m.name ?? '').filter(Boolean) ?? [];
}

function getDate(prop: NotionProperty | undefined): string | null {
  const d = (prop as { date?: DateValue | null } | undefined)?.date;
  return d?.start ?? null;
}

function getUrl(prop: NotionProperty | undefined): string | null {
  const url = (prop as { url?: string | null } | undefined)?.url;
  return url ? url : null;
}

function getPhone(prop: NotionProperty | undefined): string | null {
  const phone = (prop as { phone_number?: string | null } | undefined)?.phone_number;
  return phone ? phone : null;
}
