import { fetchJobs, sortJobs } from './lib/notion';
import { JobsView } from './components/JobsView';

export default async function HomePage() {
  const result = await fetchJobs();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">藥師職缺比較</h1>
        <p className="mt-2 text-gray-600">
          醫院藥師職缺，依薪資等級排序。點擊特色標籤即可篩選；點擊「查看 104 原始職缺」前往原始頁面。
        </p>
      </header>

      {result.ok ? (
        result.jobs.length === 0 ? (
          <EmptyState />
        ) : (
          <JobsView jobs={sortJobs(result.jobs)} />
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
