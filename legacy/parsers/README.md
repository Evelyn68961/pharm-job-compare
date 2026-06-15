# `parsers/` — 醫院招募頁 deterministic parsers

> Per-hospital CSS-selector configs + supporting data files for the
> monthly cron (`scripts/run-parsers.py`).
> 規格出處：`plan/pharmacist-job-compare-plan-v4.md` §11 parser architecture.

---

## 一、§2 governing rule（讀一次就好）

撰寫任何 parser 前必須理解：

1. **只允許訪問醫院自有官方網域**。registry 內的 `career_page_url` 是
   唯一入口；衍生 URL（detail 頁、分頁）也必須在同一個官方網域底下。
2. **絕不訪問 104 / 1111 / yes123 / cake / indeed / linkedin** —
   即使醫院的招募頁裡有「立即應徵」按鈕導向 104，parser 也只能停在
   官方頁、不可跟連。runner 內建 deny-list assert，違反會 raise。
3. AI 角色僅限：
   - **Build-time**：寫 parser config、refine selectors、寫 tag rules
   - **LLM-fallback**：deterministic parser 抓空時的退路（高度 flagged）
   AI **不在 runtime 決定要 fetch 哪個 URL** — registry 是 pre-declared 的。

---

## 二、目錄

| 檔案 | 用途 |
|---|---|
| `region-mapping.json` | §3 縣市→地區 對照表（UI 與 parser 共用） |
| `{hospital_id}.json` | 單家醫院的 CSS-selector config（本資料夾大宗） |
| `tag-rules.json` (Phase 2) | `data/tag-rules.md` 的機器讀版本 |
| `llm_fallback.py` (Phase 3) | deterministic parse 失敗時的 LLM-fallback |

---

## 三、parser config schema（`{hospital_id}.json`）

範例見 `cgh-main.json`。最小 schema：

```jsonc
{
  "_schema_version": 1,
  "hospital_id": "cgh-main",               // 必須與檔名一致
  "fetcher": {
    "list_url": "https://...",             // 必須等於 registry.career_page_url
    "encoding": "utf-8",                   // big5 也支援
    "user_agent": "...",
    "request_delay_ms": 1500,              // 對醫院禮貌
    "timeout_seconds": 30,
    "max_retries": 2
  },
  "fixed_facts": {                         // 每次抓都一樣的事實
    "醫院名稱": "...",
    "公立/私立": "公立|私立",
    "醫院等級": "醫學中心|區域|地區",
    "縣市": "臺北市",                       // 用 region-mapping.json 正規化後的值
    "地點": "臺北·大安",                    // 「縣市·區」格式
    "地區": "北北基"                        // 從 region-mapping.json derive
  },
  "list_page": {
    "posting_item_selector": "...",        // 列表頁每條職缺的 CSS selector
    "fields_from_list": { ... },           // 如果列表頁就含資訊
    "pagination": { ... }
  },
  "detail_page": {
    "fields": {                            // §3 schema 的 [FACT] 欄位
      "薪資顯示字串": { "selector": "...", "regex_extract": "..." },
      "輪班說明": { "selector": "..." },
      // ...
    },
    "body_sections": {                     // §3 4-section 模板
      "工作概況": { "selector": "...", "max_chars": 400 },
      "薪酬結構": { ... },
      "訓練與福利": { ... },
      "法定福利": { ... }
    }
  },
  "filter_rules": {                        // 排除非藥師職缺
    "include_only_if_title_matches": "藥師|藥事|藥學",
    "exclude_if_title_matches": "助理|工讀|實習"
  },
  "tag_inference_overrides": {             // 該院專屬 tag 規則微調
    "force_apply": [],
    "force_block": []
  },
  "quirks": { ... }                        // 寫實際遇到的怪
}
```

### selector 撰寫慣例

- 用 CSS selector 而非 XPath（BeautifulSoup + lxml 支援度最好）
- 一個欄位用一條 selector；若需多層 fallback，新增 `selector_alts` 陣列
- 如果同一個欄位資訊散在多段，用 selector + `regex_extract` 抽
- 抓到的 text 都會 `strip()`；不要把 trim 寫在 selector 內

---

## 四、output contract（`scripts/run-parsers.py` 輸出）

每家醫院一份 JSON 寫到 `data/monthly-diffs/{YYYY-MM}/{hospital_id}.json`：

```jsonc
{
  "hospital_id": "cgh-main",
  "source_url": "https://www.cgh.org.tw/...",
  "parse_timestamp": "2026-06-01T00:00:00+00:00",
  "confidence": "high",                    // high | medium | low | error
  "facts": {
    "醫院名稱": "國泰綜合醫院",
    "地點": "臺北·大安",
    "地區": "北北基",
    // ... §3 schema [FACT] 欄位全部 14 個
    "醫院官網職缺連結": "https://..."        // mirror registry.career_page_url
  },
  "body_sections": {
    "工作概況": "...(paraphrased)",
    "薪酬結構": "...",
    "訓練與福利": "...",
    "法定福利": "..."
  },
  "tags_auto_applied": [
    {
      "tag": "醫學中心級",
      "level": "A",
      "evidence": "hospitals-reference.md §一 命中 '國泰綜合醫院'",
      "location": null
    }
  ],
  "tags_flagged_for_review": [             // Level C tags
    {
      "tag": "工作單純",
      "level": "C",
      "evidence": "命中『無 TPN』，但需 Evelyn 確認整體工作範圍",
      "location": "detail_page §工作概況"
    }
  ],
  "raw_html_snapshot_path": "data/parser-snapshots/cgh-main/2026-06-01.html",
  "errors": []
}
```

注意：
- **`facts` 不包含 `薪資等級`**。該欄位是 `[JUDGMENT, manual]`，
  parser 永遠不寫；diff applier 也永遠不覆蓋（§3 rule）。
- `confidence='error'` 的 row 由 LLM-fallback 接手（Phase 3+），
  fallback 結果一律 `confidence='low'` 並送 review。

---

## 五、加一家新醫院的流程

1. 確認 URL 已在 `data/hospital-career-urls.md` 註冊（並用
   `python scripts/build-url-registry.py` 重產 .json）
2. 開 `parsers/{hospital_id}.json`，先抄 `cgh-main.json` 當模板
3. 手動 view-source 看頁面結構，填 selectors（不要靠 AI 猜）
4. 跑 pilot：
   ```bash
   python scripts/run-parsers.py --hospital {hospital_id} --dry-run
   ```
5. 看 stdout 報告：confidence 應為 `high`；如 `medium`/`low`，
   到 `data/parser-snapshots/{hospital_id}/{today}.html` 查 HTML，
   修 selectors，再跑
6. confidence='high' 後 commit 設定檔與第一次 snapshot 當 baseline

---

## 六、與 plan v4 的對映

| v4 §        | 在這資料夾的對應                                   |
|-------------|----------------------------------------------------|
| §3 schema   | parser config `fixed_facts` + `detail_page.fields` |
| §3 地區     | `region-mapping.json`                              |
| §4 tags     | `tag-rules.json` (Phase 2)，搭配 `tag_inference_overrides` |
| §11 1 (registry) | `data/hospital-career-urls.{md,json}`         |
| §11 2 (configs)  | `parsers/{hospital_id}.json`                  |
| §11 3 (LLM-fallback) | `parsers/llm_fallback.py` (Phase 3)       |
| §11 4 (tag engine)   | `tag-rules.json` + `run-parsers.py:infer_tags` |
| §11 5 (runner)       | `scripts/run-parsers.py`                  |
| §11 6 (diff applier) | `scripts/apply-diff.py` (Phase 1 後)      |
| §11 7 (cron)         | `.github/workflows/monthly-parse.yml` (Phase 2) |

---

## 七、現況（2026-05-23）

| 元件 | 狀態 |
|---|---|
| URL registry (24 家醫學中心) | ✅ 完成 |
| `region-mapping.json` | ✅ 完成 |
| `scripts/build-url-registry.py` | ✅ 完成 |
| `scripts/run-parsers.py` skeleton | ✅ 完成 (Level A tag 已實作；Level B/C 待 tag-rules.json) |
| `cgh-main.json` pilot config | 🟡 schema 完成、selectors TODO（等用戶提供 HTML 或 Chrome 復連） |
| `tag-rules.json` (machine form of tag-rules.md) | ❌ 待 Phase 2 開始時轉檔 |
| `llm_fallback.py` | ❌ Phase 3+ |
| `scripts/apply-diff.py` | ❌ Phase 1 後 |
| `.github/workflows/monthly-parse.yml` | ❌ Phase 2 |
