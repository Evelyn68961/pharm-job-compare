'use client';

import { useEffect, useRef, useState } from 'react';
import type { Job } from '../../lib/types';

// Lightweight contact form shown ONLY on 輔大附醫 (FJUH) cards in the result
// deck (see DeckCard's isFjuh gate). Submissions go straight to the maintainer's
// inbox via Web3Forms — its access key is a public, email-bound key meant to be
// embedded client-side, so there's no server route to maintain.
//
// The access key is a PUBLIC, email-bound key (it only ever delivers to the
// inbox it was registered with, and is already shipped in the client bundle), so
// it's hardcoded here as a default — that way the form works with zero env/Vercel
// config. NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY overrides it if you ever rotate keys.
const ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '2ed2ed94-6dab-4f2e-90e8-c3b1b6dbc38c';

const TIME_OPTIONS = ['平日上午 (9-12點)', '平日下午 (13-17點)'];

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function FjuhContactForm({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');

  // Which shared link this visitor arrived through: the `?ref=` tag (e.g.
  // ?ref=evelyn vs ?ref=official) lets us tell whose link a submission came from.
  // Captured once on mount — the spin flow never navigates, so the tag persists,
  // but reading it here is robust even if the address bar later changes. No tag
  // → "direct" (typed the URL, organic share, etc.).
  const source = useRef('direct');
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get('ref');
    if (r) source.current = r.trim().slice(0, 40);
  }, []);

  // No key configured → render nothing (keeps the card clean in dev).
  if (!ACCESS_KEY) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    // Submit as JSON, not multipart/form-data: Web3Forms reads multipart field
    // NAMES from part headers (Latin-1), which mangles Chinese labels like 姓名
    // into mojibake. JSON keeps the keys in the UTF-8 body, so they stay intact.
    const data = Object.fromEntries(new FormData(form)) as Record<string, FormDataEntryValue>;
    // Stamp the link source onto the lead + surface it in the subject so it's
    // visible in the inbox list without opening the mail.
    data['連結來源'] = source.current;
    data['subject'] = `藥師命運轉盤｜${job.hospitalName} 職缺聯絡（來源：${source.current}）`;
    setStatus('sending');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setStatus('sent');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-center text-sm text-green-700">
        ✅ 已收到！現職藥師會盡快回覆
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 block w-full rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-center text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
      >
        📩 問現職藥師：薪資、輪班、考核
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3 rounded-lg border border-blue-100 bg-blue-50/60 p-4">
      <p className="text-sm font-medium text-gray-700">留下聯絡方式，現職藥師親自回覆</p>

      {/* Context for the inbox — hospital here; subject + 連結來源 are added in
          handleSubmit so the link source is included. */}
      <input type="hidden" name="access_key" value={ACCESS_KEY} />
      <input type="hidden" name="from_name" value="藥師命運轉盤" />
      <input type="hidden" name="來源醫院" value={job.hospitalName} />
      {/* Honeypot: bots fill this, humans never see it. */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      <label className="block">
        <span className="text-xs text-gray-600">姓名</span>
        <input
          name="姓名"
          required
          autoComplete="name"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="王小明"
        />
      </label>

      <label className="block">
        <span className="text-xs text-gray-600">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="you@example.com"
        />
      </label>

      <label className="block">
        <span className="text-xs text-gray-600">方便聯絡時間</span>
        <select
          name="方便聯絡時間"
          defaultValue={TIME_OPTIONS[0]}
          className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {TIME_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      {/* 個資法第 8 條告知義務：誰蒐集、目的、項目、利用範圍與當事人權利，
          搭配一個必填的同意勾選（未勾選無法送出，且同意紀錄會一併送出）。 */}
      <p className="rounded-md border border-gray-200 bg-white/70 p-3 text-[11px] leading-relaxed text-gray-500">
        本表單由<strong className="text-gray-700">輔大附醫藥劑部</strong>蒐集你的姓名、Email
        與方便聯絡時間（及連結來源標記），僅用於本次職缺聯繫，不作其他用途；你可隨時來信要求查詢或刪除你的個人資料。
      </p>

      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input
          type="checkbox"
          name="個資同意"
          value="同意"
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span>
          我同意輔大附醫藥劑部蒐集我的姓名與聯絡方式，僅用於本次職缺聯繫，並了解可隨時來信要求刪除。
        </span>
      </label>

      {status === 'error' && (
        <p className="text-xs text-red-600">送出失敗，請稍後再試一次。</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
      >
        {status === 'sending' ? '送出中…' : '送出'}
      </button>
    </form>
  );
}
