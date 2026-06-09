import type { Metadata } from 'next';
import { fetchJobs, sortJobs } from './lib/notion';
import { hospitalDisplayName, safeBrandColor } from './lib/styles';
import { SLUG_ARCHETYPE } from './lib/archetypeSlug';
import { jobCode } from './lib/shareCode';
import { resolveArchetype } from './components/spin/icons/resolveArchetype';
import { SpinApp } from './components/spin/SpinApp';

// Shared links carry only short ASCII params (`?j=<job id>&a=<archetype slug>`)
// to keep the URL tidy in chat apps. We resolve the id back to the hospital here
// to build the personalized OG card; the /og route still takes the real names.
type SearchParams = Promise<{ j?: string; a?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { j, a } = await searchParams;
  if (!j) return {};

  const result = await fetchJobs();
  if (!result.ok) return {};
  // `j` is the hashed job code (see ShareButton / shareCode).
  const job = result.jobs.find((x) => jobCode(x.id) === j);
  if (!job) return {};

  const archetype = (a && SLUG_ARCHETYPE[a]) || resolveArchetype(job);
  const hospital = hospitalDisplayName(job.hospitalName, job.hospitalBriefName).header;
  const colorHex = safeBrandColor(job.brandColor)?.slice(1);

  const og = new URLSearchParams({ archetype, hospital });
  if (colorHex) og.set('color', colorHex);
  const ogUrl = `/og?${og.toString()}`;

  const headline = `我有機會成為${archetype}，命運醫院是${hospital}`;

  return {
    title: `${headline} · 藥師命運轉盤`,
    openGraph: {
      title: headline,
      description: '你的命運醫院是哪間？',
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: headline,
      description: '你的命運醫院是哪間？',
      images: [ogUrl],
    },
  };
}

export default async function HomePage() {
  const result = await fetchJobs();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {result.ok ? (
        result.jobs.length === 0 ? (
          <EmptyState />
        ) : (
          <SpinApp jobs={sortJobs(result.jobs)} />
        )
      ) : (
        <ErrorState reason={result.reason} detail={result.detail} />
      )}
    </main>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-700">
      <p className="font-semibold">資料庫尚無職缺資料</p>
      <p className="mt-2 text-sm">
        前往 Notion 的 <strong>藥師職缺資料庫</strong> 新增第一筆資料。
      </p>
    </div>
  );
}

function ErrorState({ reason, detail }: { reason: 'missing-env' | 'fetch-failed'; detail?: string }) {
  if (reason === 'missing-env') {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-semibold">尚未設定 Notion 連線</p>
        <p className="mt-2 text-sm">
          複製 <code className="rounded bg-amber-100 px-1">.env.local.example</code> 為{' '}
          <code className="rounded bg-amber-100 px-1">.env.local</code>，依其中註解建立 Notion
          integration 並貼上 token。
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-900">
      <p className="font-semibold">Notion API 取得失敗</p>
      <p className="mt-2 break-all text-sm">{detail ?? '未知錯誤'}</p>
      <p className="mt-2 text-sm">
        常見原因：integration 沒有被加入資料庫的 Connections，或 token 無效。
      </p>
    </div>
  );
}
