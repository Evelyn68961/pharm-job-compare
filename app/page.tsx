import Link from 'next/link';
import { fetchJobs, sortJobs } from './lib/notion';
import { SpinApp } from './components/spin/SpinApp';

export default async function HomePage() {
  const result = await fetchJobs();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8 flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold">
          <span className="text-gray-900">藥師</span>
          <span className="ml-1 text-blue-600">命運轉盤</span>
        </h1>
        <Link href="/all" className="text-sm text-blue-600 hover:underline">
          進階：瀏覽所有醫院 →
        </Link>
      </header>

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
