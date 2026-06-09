# 社群分享機制 — Instagram / Threads / Facebook / LINE

> 設計討論紀錄。決定如何讓使用者在抽到命運醫院後，把「結果」與「app 連結」分享到社群平台。

## 問題

抽完結果後（[ResultDeck](../app/components/spin/ResultDeck.tsx) 的每張卡片）需要一個分享機制，能同時：

1. 分享「我抽到的結果」（圖像化、好看、有梗）。
2. 帶上 app 連結，把流量導回遊戲。

目標平台：**Instagram、Threads、Facebook、LINE**。要求：**分享流程越順越好，單一按鈕。**

## 關鍵事實：兩條互不相同的分享通道

社群平台對「分享」有兩種完全不同的處理方式，這是整個設計的核心：

### 通道 A — 連結分享（link preview card）

分享一個 **URL**，平台抓取頁面的 OG tags，自動畫出一張預覽卡：

```
┌─────────────────────────────────┐
│  [ 1200×630 banner image ]      │  ← OG 自動產生的橫幅
├─────────────────────────────────┤
│  我抽到 學霸藥師：臺大醫院        │  ← OG title
│  你的命運醫院是哪間？            │  ← OG description
│  pharm-job-compare...           │  ← 整張卡可點
└─────────────────────────────────┘
```

- 由 [page.tsx](../app/page.tsx) 的 `generateMetadata` → OG tags → `/og?...`（**1200×630**）驅動。
- **Threads / Facebook / LINE / WhatsApp 走這條。** 現況已經可用。

### 通道 B — 檔案（圖片）分享

`navigator.share({ files: [...] })` 把實際的 PNG 交給接收端 app。

- **這是唯一能觸及 Instagram 的方式。** Instagram 沒有任何「連結預覽 / URL 分享」的 web API，IG 只有在分享的是**圖片／影片檔**時才會出現在系統分享選單。
- 接收端 app 自己決定怎麼呈現這張圖。Instagram Stories 是全螢幕直式（9:16）。

## 為什麼不能用「永遠分享檔案」的單一按鈕硬幹

當分享 payload 含 `files` 時，**Threads / FB / LINE 多半會把它當成圖片貼文，而忽略 link preview card**。同時傳 `url` + `files` 在規格上允許，但各 app 行為不一致、無法跨平台保證。

→ 如果按鈕「永遠只分享檔案」，就會在 Threads/FB/LINE 上失去那張漂亮的預覽卡。

## 採用方案：單一按鈕，同時帶 `files` + `url` + `text`

一次 `navigator.share({ files: [storyImage], url, text })`，一鍵打開系統分享選單，**所有目標 app 都出現**，每個 app 各取所需：

| App | 拿到圖片？ | 拿到連結？ |
|---|---|---|
| **Instagram Stories** | ✅ 全螢幕 | ❌（IG 一般帳號本來就不能在限動貼可點連結） |
| **Threads** | ✅ | ✅ 通常有 — `text` 裡的 URL 會在編輯器產生連結卡 |
| **LINE** | ✅ | ✅ URL 留在可點的說明文字 |
| **Facebook** | ✅ | ✅ URL 在貼文文字可點 |

### 到底「失去」什麼？

**只有一樣**：平台自動產生的 **link preview banner card**（那個灰框、自動抓 title/描述/縮圖的預覽框）。

**沒有失去的**：
- 圖片 — 反而變得更大、變成貼文主體（不是縮圖）。
- URL — 仍在、仍可點，只是變成說明文字而非卡片內。
- 導回網站的點擊。

也就是說：原本平台幫你把連結包成一張整齊的卡片；現在使用者的貼文是**你設計的完整圖片 + 底下的連結文字**。對這種好玩、會瘋傳的內容，圖片優先其實是更好的貼文，不是更差。

### 把這唯一的取捨也消除掉

把 **call-to-action / 短網址直接烤進圖片裡**（直式 story 圖底部放一行 `藥師命運轉盤 · <短網址>`）。這樣即使是最壞情況（純圖片貼文），連結也在視覺上跟著走，預覽卡有沒有就不再重要 —— 圖片本身就是廣告。

## 圖片格式：新增直式 Story 版本（1080×1920）

- 在 [/og route](../app/og/route.tsx) 新增 `?format=story` 分支，輸出 9:16 全幅圖（漸層底、大字「我抽到 X」、醫院 pill、底部 CTA + 短網址）。
- **純加法**：不動既有 1200×630 預設輸出，所以通道 A 的 link preview 完全不受影響。
- link preview（`generateMetadata`）繼續用 1200×630；檔案分享用 1080×1920。

## 單一按鈕的最終行為

一個 `onClick`，依序嘗試（graceful degradation）：

1. **fetch** `/og?...&format=story` 的 PNG → 組成 `File`。
2. **若 `navigator.canShare?.({ files: [file] })`** → `navigator.share({ files: [file], url, text })`。 ← 手機：一鍵、系統選單、全平台。
3. **否則若 `navigator.share`** → `navigator.share({ url, text })`。 ← 舊版手機瀏覽器無檔案支援：仍順、link preview 完整。
4. **否則** → 複製 `text + url` 到剪貼簿，顯示「已複製」。 ← 桌機。

`loading` 狀態覆蓋 `/og` 約 300–800ms 的 fetch，讓點擊感覺即時。`canShare` 一定要 feature-detect（桌機 Chrome 有 `navigator.share` 但 `canShare({files})` 為 false，順序很重要）。

## 受影響檔案

- [ShareButton.tsx](../app/components/spin/ShareButton.tsx) — 三層分享邏輯 + loading 狀態。
- [/og route.tsx](../app/og/route.tsx) — 新增 `format=story` 直式版面 + 動態 `width/height`，圖內烤入 CTA/短網址。
- [page.tsx](../app/page.tsx) `generateMetadata` — **不動**，link preview 維持 1200×630。

## 邊界情況

- **iOS Safari**：檔案分享需在 user-gesture handler 內（`onClick` 符合）；fetch 後仍保留 gesture（現代 iOS 可），需真機測試。
- **`navigator.share` 使用者取消會 reject** → 用 try/catch 吞掉。
- **同源 fetch `/og`**：無 CORS 問題；Edge 冷啟動（含 Google 字型 fetch）約 300–800ms，fetch 失敗則 fall through 到 URL 分享。
