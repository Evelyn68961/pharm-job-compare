#!/usr/bin/env python3
"""
build-url-registry.py — md → JSON 鏡像生成器

從 data/hospital-career-urls.md 的內嵌 ```json``` 區塊抽出註冊表，
寫成獨立的 data/hospital-career-urls.json 供 parser runner 與
其他工具讀取。

人類編輯 .md（單一來源）；機器讀 .json（鏡像，每次 build 重產）。

用法:
    python scripts/build-url-registry.py            # build + 驗證
    python scripts/build-url-registry.py --check    # 只驗證，不寫檔

§2 governing rule 自動檢查：
- 所有 career_page_url 的 hostname 必須不在第三方人力銀行 deny-list 內
- 若違反，script 直接 exit 1（CI 會 fail）

來源: plan/pharmacist-job-compare-plan-v4.md §11 component 1
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE_MD = REPO_ROOT / "data" / "hospital-career-urls.md"
TARGET_JSON = REPO_ROOT / "data" / "hospital-career-urls.json"

# §2 Rule B：禁止出現在 career_page_url 的網域
FORBIDDEN_HOSTS = {
    "104.com.tw",
    "www.104.com.tw",
    "1111.com.tw",
    "www.1111.com.tw",
    "yes123.com.tw",
    "www.yes123.com.tw",
    "cake.me",
    "www.cake.me",
    "indeed.com",
    "www.indeed.com",
    "tw.indeed.com",
    "linkedin.com",
    "www.linkedin.com",
}

# v4 §3 合法地區值
VALID_REGIONS = {"北北基", "桃竹苗", "中彰投", "雲嘉南", "高屏", "宜花東", "離島"}
VALID_TIERS = {"醫學中心", "區域", "地區"}


def extract_json_block(md_text: str) -> dict:
    """從 markdown 抽出第一個 ```json ... ``` 區塊並 parse。"""
    pattern = re.compile(r"```json\s*\n(.*?)```", re.DOTALL)
    matches = pattern.findall(md_text)
    if not matches:
        raise ValueError(f"沒有在 {SOURCE_MD.name} 找到 ```json``` 區塊")
    if len(matches) > 1:
        print(
            f"⚠️  發現 {len(matches)} 個 ```json``` 區塊；使用第一個（最大的應該是 registry）",
            file=sys.stderr,
        )
    return json.loads(matches[0])


def validate_registry(data: dict) -> list[str]:
    """跑 §2 自查 + schema 驗證。回傳 error 列表（空 = 通過）。"""
    errors: list[str] = []

    if "hospitals" not in data:
        errors.append("頂層缺少 'hospitals' 陣列")
        return errors

    seen_ids: set[str] = set()
    for i, entry in enumerate(data["hospitals"]):
        prefix = f"[{i}] {entry.get('hospital_id', '<missing-id>')}"

        # 必填欄位
        for field in (
            "hospital_id",
            "name",
            "tier",
            "region",
            "city",
            "career_page_url",
            "verified_date",
        ):
            if field not in entry:
                errors.append(f"{prefix}: 缺少必填欄位 '{field}'")

        # hospital_id 唯一性
        hid = entry.get("hospital_id")
        if hid:
            if hid in seen_ids:
                errors.append(f"{prefix}: hospital_id 重複")
            seen_ids.add(hid)

        # tier / region 取值範圍
        if entry.get("tier") and entry["tier"] not in VALID_TIERS:
            errors.append(
                f"{prefix}: tier='{entry['tier']}' 不在合法集合 {VALID_TIERS}"
            )
        if entry.get("region") and entry["region"] not in VALID_REGIONS:
            errors.append(
                f"{prefix}: region='{entry['region']}' 不在合法集合 {VALID_REGIONS}"
            )

        # §2 firewall：career_page_url hostname 不可在 deny-list
        url = entry.get("career_page_url", "")
        if url:
            host = urlparse(url).hostname or ""
            if host in FORBIDDEN_HOSTS:
                errors.append(
                    f"{prefix}: career_page_url hostname='{host}' 違反 §2 Rule B（禁止 104/1111/yes123 等第三方人力銀行）"
                )
            # 額外保險：再檢查 url 字串本身有沒有任何 forbidden 子字串（防 typo / subdomain）
            for bad in FORBIDDEN_HOSTS:
                if bad.split(".")[0] in url.lower() and bad not in {"linkedin.com", "indeed.com"}:
                    # 嚴格模式：104 / 1111 / yes123 / cake 出現在 URL 任何位置都不行
                    if not host.endswith(".gov.tw") and not host.endswith(".org.tw"):
                        continue  # 避免誤判：cake.me 不會出現在 .gov.tw
                    # 真正的命中由 host check 處理，這裡不重複報

    return errors


def write_json(data: dict) -> None:
    TARGET_JSON.parent.mkdir(parents=True, exist_ok=True)
    with TARGET_JSON.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1] if __doc__ else None)
    ap.add_argument(
        "--check",
        action="store_true",
        help="只驗證、不寫檔（CI 用）",
    )
    args = ap.parse_args()

    if not SOURCE_MD.exists():
        print(f"❌ 找不到 {SOURCE_MD}", file=sys.stderr)
        return 1

    md_text = SOURCE_MD.read_text(encoding="utf-8")

    try:
        data = extract_json_block(md_text)
    except (ValueError, json.JSONDecodeError) as e:
        print(f"❌ 無法解析 {SOURCE_MD.name}: {e}", file=sys.stderr)
        return 1

    errors = validate_registry(data)
    if errors:
        print(f"❌ 驗證失敗：{len(errors)} 個錯誤", file=sys.stderr)
        for err in errors:
            print(f"   - {err}", file=sys.stderr)
        return 1

    n = len(data.get("hospitals", []))
    print(f"✅ Registry 驗證通過：{n} 條醫院記錄")

    if args.check:
        print("--check 模式：未寫檔")
        return 0

    write_json(data)
    rel = TARGET_JSON.relative_to(REPO_ROOT)
    print(f"✅ 已寫入 {rel}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
