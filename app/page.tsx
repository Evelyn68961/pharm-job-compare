import type { Metadata } from 'next';
import { fetchJobs, sortJobs } from './lib/notion';
import { SpinApp } from './components/spin/SpinApp';

// Shares send a link carrying ?archetype&hospital&color. We read those here and
// point the OG tags at the matching /og image so chat apps (LINE/WhatsApp/IG)
// render a PERSONALIZED, tappable preview card that opens the site. Without this
// the link would fall back to the generic site card in layout.tsx.
type SearchParams = Promise<{ archetype?: string; hospital?: string; color?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const archetype = params.archetype?.slice(0, 20);
  const hospital = params.hospital?.slice(0, 30);
  const color = params.color;
  // No personalization params → keep the default site metadata from layout.tsx.
  if (!archetype && !hospital) return {};

  const og = new URLSearchParams();
  if (archetype) og.set('archetype', archetype);
  if (hospital) og.set('hospital', hospital);
  if (color) og.set('color', color);
  // Landscape (1200×630) — link-preview cards crop/letterbox portrait images.
  const ogUrl = `/og?${og.toString()}`;

  const headline =
    archetype && hospital
      ? `我有機會成為${archetype}，命運醫院是${hospital}`
      : archetype
        ? `我有機會成為${archetype}`
        : `我的命運醫院是${hospital}`;

  return {
    title: `${headline} · 藥師命運轉盤`,
    openGraph: {
      title: headline,
      description: '你的命運醫院是哪間？快來測測看！',
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: headline,
      description: '你的命運醫院是哪間？快來測測看！',
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
