import Link from 'next/link';
import { fetchJobs, sortJobs } from '../lib/notion';
import { JobsView } from '../components/JobsView';

export default async function AllJobsPage() {
  const result = await fetchJobs();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6 flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold">瀏覽所有醫院</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← 回到轉盤
        </Link>
      </header>

      {result.ok ? (
        result.jobs.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-700">
            <p className="font-semibold">資料庫尚無職缺資料</p>
          </div>
        ) : (
          <JobsView jobs={sortJobs(result.jobs)} />
        )
      ) : (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-900">
          <p className="font-semibold">Notion API 取得失敗</p>
          <p className="mt-2 break-all text-sm">{result.detail ?? '未知錯誤'}</p>
        </div>
      )}
    </main>
  );
}
