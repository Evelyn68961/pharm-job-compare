#!/usr/bin/env python3
"""
Backfill the 醫院簡稱 column in Notion with auto-shortened names.

For each row in the 藥師職缺資料庫:
  - Compute the brief from app/lib/hospital-brief-names.json
  - If brief differs from 醫院名稱 (the title) AND 醫院簡稱 is currently empty,
    write the brief into 醫院簡稱.
  - Skip rows where 醫院簡稱 is already set (don't overwrite user edits).
  - Skip rows where the title is already short enough (brief == title).

Usage:
    NOTION_TOKEN=secret_xxx \\
    NOTION_DATA_SOURCE_ID=2036b934-0fd8-4b51-bd81-39ceea812897 \\
    python scripts/backfill-brief-names.py

Optional flags:
    --dry-run   Print what would change, but don't write.
    --force     Overwrite existing 醫院簡稱 values too.
"""
import argparse
import json
import os
import sys
import time
from pathlib import Path
from typing import Optional

import urllib.request
import urllib.error

NOTION_API = "https://api.notion.com/v1"
NOTION_VERSION = "2025-09-03"
BRIEF_MAP_PATH = Path(__file__).resolve().parent.parent / "app/lib/hospital-brief-names.json"


def http(method: str, url: str, token: str, body: Optional[dict] = None) -> dict:
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Notion-Version": NOTION_VERSION,
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        msg = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {e.code} {method} {url}\n{msg}") from e


def query_all_pages(token: str, data_source_id: str) -> list:
    pages: list = []
    cursor: Optional[str] = None
    while True:
        body: dict = {"page_size": 100}
        if cursor:
            body["start_cursor"] = cursor
        resp = http("POST", f"{NOTION_API}/data_sources/{data_source_id}/query", token, body)
        pages.extend(resp["results"])
        if not resp.get("has_more"):
            break
        cursor = resp.get("next_cursor")
    return pages


def title_of(props: dict) -> str:
    title_prop = props.get("醫院名稱", {})
    items = title_prop.get("title", [])
    return "".join(item.get("plain_text", "") for item in items).strip()


def brief_of(props: dict) -> str:
    brief_prop = props.get("醫院簡稱", {})
    items = brief_prop.get("rich_text", [])
    return "".join(item.get("plain_text", "") for item in items).strip()


def patch_brief(token: str, page_id: str, brief: str) -> None:
    body = {
        "properties": {
            "醫院簡稱": {
                "rich_text": [{"type": "text", "text": {"content": brief}}],
            }
        }
    }
    http("PATCH", f"{NOTION_API}/pages/{page_id}", token, body)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--force", action="store_true", help="Overwrite existing 醫院簡稱")
    args = parser.parse_args()

    token = os.environ.get("NOTION_TOKEN")
    ds_id = os.environ.get("NOTION_DATA_SOURCE_ID")
    if not token or not ds_id:
        sys.exit("NOTION_TOKEN and NOTION_DATA_SOURCE_ID must be set in env")

    brief_map: dict = json.loads(BRIEF_MAP_PATH.read_text(encoding="utf-8"))
    print(f"Loaded {len(brief_map)} entries from hospital-brief-names.json")

    pages = query_all_pages(token, ds_id)
    print(f"Fetched {len(pages)} pages from Notion")

    to_update = []
    skipped_already = 0
    skipped_same = 0
    skipped_no_brief = 0

    for page in pages:
        props = page["properties"]
        title = title_of(props)
        if not title:
            continue
        current_brief = brief_of(props)
        if current_brief and not args.force:
            skipped_already += 1
            continue
        target_brief = brief_map.get(title)
        if not target_brief:
            skipped_no_brief += 1
            continue
        if target_brief == title:
            skipped_same += 1
            continue
        to_update.append((page["id"], title, target_brief))

    print(f"\nPlan:")
    print(f"  Will update:           {len(to_update)}")
    print(f"  Already has 簡稱:      {skipped_already} (skipped; use --force to overwrite)")
    print(f"  Brief equals title:    {skipped_same}")
    print(f"  No brief mapping:      {skipped_no_brief}")

    if args.dry_run:
        print(f"\n[dry-run] First 20 updates that would be made:")
        for pid, title, brief in to_update[:20]:
            print(f"  {pid[:8]}  {title:<35} -> {brief}")
        return 0

    if not to_update:
        print("\nNothing to update.")
        return 0

    print(f"\nUpdating {len(to_update)} pages...")
    for i, (pid, title, brief) in enumerate(to_update, 1):
        patch_brief(token, pid, brief)
        if i % 25 == 0 or i == len(to_update):
            print(f"  {i}/{len(to_update)}  last: {title} -> {brief}")
        time.sleep(0.05)  # gentle rate-limit cushion (Notion allows ~3 req/s)

    print(f"\nDone. {len(to_update)} pages updated.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
