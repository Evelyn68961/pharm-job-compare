#!/usr/bin/env python3
"""
run-parsers.py — 月度 parser runner (skeleton)

依 plan v4 §11 component 5：
- 讀 data/hospital-career-urls.json (registry)
- 對每家 hospital 載入 parsers/{hospital_id}.json (config)
- HTTP GET → CSS-selector parse (deterministic)
- 若 deterministic 抓不到 → LLM-fallback (尚未實作；目前 emit `parse-error`)
- 跑 tag inference (Level A 對照清單；Level B regex/關鍵字；Level C flag-for-review)
- 寫 §11 output contract JSON：data/monthly-diffs/{YYYY-MM}/{hospital_id}.json
- 存原始 HTML snapshot：data/parser-snapshots/{hospital_id}/{YYYY-MM-DD}.html
- 存 audit log：data/parser-audit/{hospital_id}-{YYYY-MM-DD}.json

用法:
    python scripts/run-parsers.py                    # 跑全部
    python scripts/run-parsers.py --hospital cgh-main  # pilot mode (單一家)
    python scripts/run-parsers.py --dry-run          # 不寫檔，只印結果

§2 governing rule 規範:
- fetcher 只訪問 config.fetcher.list_url + 從該頁衍生的 detail URL
- runner assert URL hostname 不在 deny-list (104/1111/yes123 等)
- LLM-fallback (尚未實作) 也只能對醫院官方頁產生的 HTML 操作，不可主動瀏覽 104

來源: plan/pharmacist-job-compare-plan-v4.md §11
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError as e:
    print(
        f"❌ 缺少依賴：{e.name}\n"
        f"   pip install requests beautifulsoup4 lxml",
        file=sys.stderr,
    )
    sys.exit(2)

REPO_ROOT = Path(__file__).resolve().parent.parent
REGISTRY_JSON = REPO_ROOT / "data" / "hospital-career-urls.json"
PARSERS_DIR = REPO_ROOT / "parsers"
REGION_MAPPING = PARSERS_DIR / "region-mapping.json"
HOSPITALS_REFERENCE = REPO_ROOT / "data" / "hospitals-reference.md"
SNAPSHOTS_DIR = REPO_ROOT / "data" / "parser-snapshots"
AUDIT_DIR = REPO_ROOT / "data" / "parser-audit"
DIFFS_DIR = REPO_ROOT / "data" / "monthly-diffs"

# §2 Rule B firewall
FORBIDDEN_HOSTS = {
    "104.com.tw", "www.104.com.tw",
    "1111.com.tw", "www.1111.com.tw",
    "yes123.com.tw", "www.yes123.com.tw",
    "cake.me", "www.cake.me",
    "indeed.com", "www.indeed.com", "tw.indeed.com",
    "linkedin.com", "www.linkedin.com",
}

# §3 schema 的 16 [FACT] 欄位（薪資等級為 [JUDGMENT,manual] 例外）
FACT_FIELDS = [
    "醫院名稱", "地點", "地區", "公立/私立", "醫院等級",
    "薪資顯示字串", "輪班說明", "職務內容摘要", "學歷要求", "證照",
    "宿舍", "需求人數", "更新日期", "醫院官網職缺連結",
]


# ─────────────────────────────────────────────────────────────────
# Output contract dataclasses (§11)
# ─────────────────────────────────────────────────────────────────

@dataclass
class TagEvidence:
    tag: str
    level: str            # "A" | "B" | "C"
    auto_applied: bool
    evidence: str         # 觸發字串 / regex match / "在衛福部清單"
    location: str | None = None  # 在頁面哪一段抓到的


@dataclass
class ParserOutput:
    """§11 parser output contract — 一家醫院一次跑的結果。"""
    hospital_id: str
    source_url: str
    parse_timestamp: str
    confidence: str       # "high" | "medium" | "low" | "error"
    facts: dict[str, Any] = field(default_factory=dict)
    body_sections: dict[str, str] = field(default_factory=dict)
    tags: list[TagEvidence] = field(default_factory=list)
    flagged_for_review: list[TagEvidence] = field(default_factory=list)
    raw_html_snapshot_path: str | None = None
    errors: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "hospital_id": self.hospital_id,
            "source_url": self.source_url,
            "parse_timestamp": self.parse_timestamp,
            "confidence": self.confidence,
            "facts": self.facts,
            "body_sections": self.body_sections,
            "tags_auto_applied": [
                {"tag": t.tag, "level": t.level, "evidence": t.evidence, "location": t.location}
                for t in self.tags if t.auto_applied
            ],
            "tags_flagged_for_review": [
                {"tag": t.tag, "level": t.level, "evidence": t.evidence, "location": t.location}
                for t in self.flagged_for_review
            ],
            "raw_html_snapshot_path": self.raw_html_snapshot_path,
            "errors": self.errors,
        }


# ─────────────────────────────────────────────────────────────────
# Loaders
# ─────────────────────────────────────────────────────────────────

def load_registry() -> list[dict]:
    if not REGISTRY_JSON.exists():
        raise SystemExit(
            f"❌ 找不到 {REGISTRY_JSON.name}。先跑 `python scripts/build-url-registry.py`"
        )
    data = json.loads(REGISTRY_JSON.read_text(encoding="utf-8"))
    return data["hospitals"]


def load_parser_config(hospital_id: str) -> dict | None:
    path = PARSERS_DIR / f"{hospital_id}.json"
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def load_region_mapping() -> dict:
    return json.loads(REGION_MAPPING.read_text(encoding="utf-8"))


def load_medical_center_set() -> set[str]:
    """從 hospitals-reference.md §一 抽出 23 家醫學中心名稱（簡易實作）。

    用途：Level A 「醫學中心級」tag 的 cross-check 來源。
    Phase 2 應改為由 build-hospitals-list.py 產生 hospitals-reference.json。
    """
    if not HOSPITALS_REFERENCE.exists():
        return set()
    names: set[str] = set()
    in_medical_centers = False
    for line in HOSPITALS_REFERENCE.read_text(encoding="utf-8").splitlines():
        if line.startswith("## 一、醫學中心"):
            in_medical_centers = True
            continue
        if in_medical_centers and line.startswith("## "):
            break
        if in_medical_centers and line.startswith("- "):
            # 「- 臺大醫院（臺北市）」→ 「臺大醫院」
            name = line[2:].split("（")[0].rstrip("★ ").strip()
            if name:
                names.add(name)
    return names


# ─────────────────────────────────────────────────────────────────
# Fetch (§2-aware)
# ─────────────────────────────────────────────────────────────────

def assert_url_allowed(url: str) -> None:
    host = urlparse(url).hostname or ""
    if host in FORBIDDEN_HOSTS:
        raise RuntimeError(
            f"§2 Rule B 違反：嘗試 fetch '{host}'（在 deny-list 上）"
        )


def fetch_page(url: str, *, encoding: str, user_agent: str,
               timeout: int, max_retries: int, delay_ms: int) -> str:
    assert_url_allowed(url)
    headers = {"User-Agent": user_agent}
    last_err: Exception | None = None
    for attempt in range(max_retries + 1):
        if attempt > 0:
            time.sleep(delay_ms / 1000)
        try:
            r = requests.get(url, headers=headers, timeout=timeout)
            r.encoding = encoding
            r.raise_for_status()
            return r.text
        except requests.RequestException as e:
            last_err = e
            continue
    raise RuntimeError(f"Fetch 失敗（重試 {max_retries} 次）：{url}：{last_err}")


# ─────────────────────────────────────────────────────────────────
# Parse (deterministic) — Phase 1 為 skeleton；selectors 由 config 提供
# ─────────────────────────────────────────────────────────────────

def parse_with_config(html: str, config: dict, registry_entry: dict) -> ParserOutput:
    """依 config CSS selectors 抓 §3 schema 欄位。

    selectors 為 'TODO' 的欄位會留空並標 confidence='low' / 進 errors。
    全部欄位 TODO → confidence='error' (送 LLM-fallback 處理；目前為佔位)。
    """
    out = ParserOutput(
        hospital_id=config["hospital_id"],
        source_url=config["fetcher"]["list_url"],
        parse_timestamp=datetime.now(timezone.utc).isoformat(),
        confidence="error",
    )

    # Fixed facts 直接寫入（每次都一樣）
    fixed = config.get("fixed_facts", {})
    for k, v in fixed.items():
        out.facts[k] = v

    # registry 提供的官方招募連結（§3「醫院官網職缺連結」）
    out.facts["醫院官網職缺連結"] = registry_entry["career_page_url"]

    # ── 跑 CSS selectors ─────────────────────────────────────────
    soup = BeautifulSoup(html, "lxml")
    todo_count = 0
    extracted_count = 0

    detail_fields = config.get("detail_page", {}).get("fields", {})
    for field_name, rule in detail_fields.items():
        selector = rule.get("selector") if isinstance(rule, dict) else None
        if not selector or "TODO" in str(selector):
            todo_count += 1
            continue
        elements = soup.select(selector)
        if not elements:
            out.errors.append(f"selector miss: {field_name} ← '{selector}'")
            continue
        text = elements[0].get_text(separator=" ", strip=True)
        if isinstance(rule, dict) and rule.get("regex_extract"):
            import re
            m = re.search(rule["regex_extract"], text)
            text = m.group(0) if m else text
        out.facts[field_name] = text
        extracted_count += 1

    # ── 信心度判定 ──────────────────────────────────────────────
    total_fields = len(detail_fields)
    if total_fields == 0:
        out.confidence = "error"
        out.errors.append("detail_page.fields 為空")
    elif todo_count == total_fields:
        out.confidence = "error"
        out.errors.append(
            f"所有 {total_fields} 個 selector 為 TODO — config 尚未填寫"
        )
    elif extracted_count == total_fields:
        out.confidence = "high"
    elif extracted_count > 0:
        out.confidence = "medium"
        out.errors.append(
            f"部分欄位抓不到：{extracted_count}/{total_fields} 成功"
        )
    else:
        out.confidence = "low"

    return out


# ─────────────────────────────────────────────────────────────────
# Tag inference (§4 + data/tag-rules.md)
# ─────────────────────────────────────────────────────────────────

def infer_tags(out: ParserOutput, html: str, config: dict,
               medical_centers: set[str]) -> None:
    """跑 Level A/B/C tag 推斷。Level A/B auto-apply，Level C flag-for-review。

    Phase 1 skeleton：只實作 Level A（醫學中心級 / 教學醫院）；
    Level B 等 tag-rules.json (machine form) 生出來後再展開。
    """
    name = out.facts.get("醫院名稱", "")

    # Level A: 醫學中心級
    if name in medical_centers:
        out.tags.append(TagEvidence(
            tag="醫學中心級",
            level="A",
            auto_applied=True,
            evidence=f"hospitals-reference.md §一 命中 '{name}'",
        ))
        # 醫學中心 → 自動含教學醫院（評鑑包含）
        out.tags.append(TagEvidence(
            tag="教學醫院",
            level="A",
            auto_applied=True,
            evidence="醫學中心評鑑包含教學醫院認證 (per tag-rules.md §2.2)",
        ))

    # TODO: Level B 等 parsers/tag-rules.json 生出後展開
    out.errors.append(
        "tag inference: Level B/C 尚未實作（需先把 data/tag-rules.md 轉成 parsers/tag-rules.json）"
    )


# ─────────────────────────────────────────────────────────────────
# Persistence
# ─────────────────────────────────────────────────────────────────

def save_snapshot(html: str, hospital_id: str, today: str) -> Path:
    folder = SNAPSHOTS_DIR / hospital_id
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / f"{today}.html"
    path.write_text(html, encoding="utf-8")
    return path


def save_output(out: ParserOutput, today: str) -> Path:
    ym = today[:7]  # YYYY-MM
    folder = DIFFS_DIR / ym
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / f"{out.hospital_id}.json"
    path.write_text(
        json.dumps(out.to_dict(), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return path


# ─────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────

def run_one(entry: dict, *, dry_run: bool, medical_centers: set[str]) -> ParserOutput:
    hid = entry["hospital_id"]
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    config = load_parser_config(hid)
    if config is None:
        return ParserOutput(
            hospital_id=hid,
            source_url=entry["career_page_url"],
            parse_timestamp=datetime.now(timezone.utc).isoformat(),
            confidence="error",
            errors=[f"parsers/{hid}.json 不存在 — 跳過"],
        )

    # 防呆：config 的 list_url 必須等於 registry 的 career_page_url
    if config["fetcher"]["list_url"] != entry["career_page_url"]:
        return ParserOutput(
            hospital_id=hid,
            source_url=entry["career_page_url"],
            parse_timestamp=datetime.now(timezone.utc).isoformat(),
            confidence="error",
            errors=[
                "config.fetcher.list_url 與 registry.career_page_url 不一致；"
                "請同步更新兩處"
            ],
        )

    f = config["fetcher"]
    try:
        html = fetch_page(
            f["list_url"],
            encoding=f.get("encoding", "utf-8"),
            user_agent=f.get("user_agent", "pharm-job-compare-parser"),
            timeout=f.get("timeout_seconds", 30),
            max_retries=f.get("max_retries", 2),
            delay_ms=f.get("request_delay_ms", 1500),
        )
    except RuntimeError as e:
        return ParserOutput(
            hospital_id=hid,
            source_url=entry["career_page_url"],
            parse_timestamp=datetime.now(timezone.utc).isoformat(),
            confidence="error",
            errors=[str(e)],
        )

    if not dry_run:
        snapshot = save_snapshot(html, hid, today)
    else:
        snapshot = None

    out = parse_with_config(html, config, entry)
    out.raw_html_snapshot_path = str(snapshot.relative_to(REPO_ROOT)) if snapshot else None

    infer_tags(out, html, config, medical_centers)

    if not dry_run:
        save_output(out, today)

    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--hospital", help="只跑指定 hospital_id（pilot mode）")
    ap.add_argument("--dry-run", action="store_true", help="不寫檔，只印結果")
    args = ap.parse_args()

    registry = load_registry()
    medical_centers = load_medical_center_set()

    targets = registry
    if args.hospital:
        targets = [e for e in registry if e["hospital_id"] == args.hospital]
        if not targets:
            print(f"❌ registry 內找不到 hospital_id='{args.hospital}'", file=sys.stderr)
            return 1

    print(f"▶ 將跑 {len(targets)} 家醫院 (dry_run={args.dry_run})")

    summary = {"high": 0, "medium": 0, "low": 0, "error": 0}
    for entry in targets:
        print(f"\n── {entry['hospital_id']} ({entry['name']}) ──")
        out = run_one(entry, dry_run=args.dry_run, medical_centers=medical_centers)
        summary[out.confidence] = summary.get(out.confidence, 0) + 1
        print(f"  confidence: {out.confidence}")
        print(f"  facts: {len(out.facts)} 個欄位")
        print(f"  tags auto-applied: {sum(1 for t in out.tags if t.auto_applied)}")
        print(f"  tags flagged for review: {len(out.flagged_for_review)}")
        if out.errors:
            print(f"  errors:")
            for err in out.errors:
                print(f"    - {err}")

    print(f"\n=== Summary ===")
    for level, count in summary.items():
        print(f"  {level}: {count}")
    return 0 if summary["error"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
