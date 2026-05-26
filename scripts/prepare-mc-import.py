#!/usr/bin/env python3
"""
For the 24 醫學中心 in the gov data:
  - Match to URL registry to get career_page_url
  - Detect overlap with existing 12 Notion manual-seed rows (by fuzzy name)
  - Output a JSON plan: CREATE new rows for non-overlaps, UPDATE for overlaps
Output: data/mc-import-plan.json
"""
import json
import re
from pathlib import Path

GOV_BULK = Path("data/hospitals-gov-bulk.json")
URL_REGISTRY_MD = Path("data/hospital-career-urls.md")
OUT = Path("data/mc-import-plan.json")

# Manual map: registry hospital_id -> substring that must appear in gov hospital name
REGISTRY_TO_GOV_MATCH = {
    "ntuh-main": "國立台灣大學醫學院附設醫院",       # NTU main (gov uses 台 not 臺)
    "vghtpe-main": "臺北榮民總醫院",
    "tsgh-main": "三軍總醫院",
    "mmh-taipei": None,                                # adult 馬偕 not in MC list separately (兒童 is)
    "cgh-main": None,                                  # 國泰 not in gov MC list (likely 區域 now)
    "skh-main": "新光吳火獅紀念醫院",
    "wanfang-main": "萬芳醫院",
    "cgmh-linkou": None,                               # 林口長庚 not in gov MC list as such
    "femh-main": "亞東紀念醫院",
    "tzuchi-taipei": "台北慈濟醫院",
    "shh-main": "雙和醫院",
    "vghtc-main": "臺中榮民總醫院",
    "cmuh-main": "中國醫藥大學附設醫院",
    "csh-main": "中山醫學大學附設醫院",
    "cch-main": "彰化基督教醫院",
    "ncku-main": "成功大學醫學院附設醫院",
    "chimei-yongkang": "奇美醫院",
    "kmuh-main": "高雄醫學大學附設中和紀念醫院",
    "vghks-main": "高雄榮民總醫院",
    "cgmh-kaohsiung": "高雄長庚紀念醫院",
    "edah-main": "義大醫院",
    "tzuchi-hualien": "花蓮慈濟醫院",
    "mmch-taipei": "馬偕兒童醫院",
    "cmuch-main": "中國醫藥大學兒童醫院",
}

# Existing 12 Notion manual-seed rows (id -> short_name)
EXISTING_NOTION = {
    "368c496d-fff1-8189-943a-f134cd3905d4": "北榮桃園分院",
    "368c496d-fff1-8129-9132-d582cda5ab13": "萬芳醫院",
    "368c496d-fff1-81b3-909a-d554b6cd92c8": "秉坤婦幼醫院（平鎮院區）",
    "368c496d-fff1-8185-b923-c32b4d4b5bb6": "大里仁愛醫院",
    "368c496d-fff1-8170-b82c-f2efc5d56ea5": "永和耕莘醫院",
    "368c496d-fff1-8136-9278-fc1c8a274625": "中山醫大附醫",
    "368c496d-fff1-81ee-8349-ced53b3bb6bf": "三總北投分院",
    "368c496d-fff1-818e-9cb4-e3603aa06c64": "輔大附醫",
    "368c496d-fff1-81d4-ae5b-fabbceb6f682": "國泰綜合醫院",
    "368c496d-fff1-81fb-896d-f457465414cd": "中醫大臺北分院",
    "368c496d-fff1-8138-abf6-ea89ed012099": "安南醫院",
    "368c496d-fff1-813f-8c1c-ff596f9cd61a": "新國民醫院",
}

# Map existing notion rows to gov-data name fragments where they overlap
NOTION_TO_GOV_MATCH = {
    "萬芳醫院": "萬芳醫院",
    "中山醫大附醫": "中山醫學大學附設醫院",
}

# Public/private heuristics
def detect_public_private(name):
    PUBLIC = ["部立", "市立", "縣立", "國立", "陽明", "成功大學", "臺大", "衛生福利部",
              "榮民總醫院", "三軍總醫院", "國防", "教育部"]
    if any(k in name for k in PUBLIC):
        return "公立"
    return "私立"

def load_registry():
    """Parse the inline JSON block from hospital-career-urls.md."""
    text = URL_REGISTRY_MD.read_text(encoding="utf-8")
    m = re.search(r"```json\n(.*?\n)```", text, re.DOTALL)
    if not m:
        raise RuntimeError("could not find json block in registry md")
    data = json.loads(m.group(1))
    return {h["hospital_id"]: h for h in data["hospitals"]}

def main():
    gov_data = json.loads(GOV_BULK.read_text(encoding="utf-8"))
    medical_centers = [h for h in gov_data["hospitals"] if h["tier"] == "醫學中心"]
    print(f"Found {len(medical_centers)} 醫學中心 in gov data")

    registry = load_registry()
    print(f"Loaded {len(registry)} hospitals from URL registry")

    plan = {"create": [], "update": [], "skip": []}

    for gov in medical_centers:
        gov_name = gov["name"]

        # Find URL from registry
        career_url = None
        registry_id = None
        for reg_id, frag in REGISTRY_TO_GOV_MATCH.items():
            if frag and frag in gov_name:
                career_url = registry[reg_id]["career_page_url"]
                registry_id = reg_id
                break

        # Check overlap with existing Notion rows
        existing_notion_id = None
        for notion_id, short_name in EXISTING_NOTION.items():
            gov_frag = NOTION_TO_GOV_MATCH.get(short_name)
            if gov_frag and gov_frag in gov_name:
                existing_notion_id = notion_id
                break

        public_private = detect_public_private(gov_name)
        tags = ["醫學中心級"]
        if gov.get("is_teaching"):
            tags.append("教學醫院")

        row_data = {
            "醫院名稱": gov_name,
            "醫院等級": "醫學中心",
            "地區": gov["region"],
            "縣市": gov["city"],
            "區": gov["district"],
            "地點": gov["location"],
            "電話": gov["phone"],
            "公立/私立": public_private,
            "特色標籤": tags,
            "資料來源": "gov-bulk",
        }
        if career_url:
            row_data["醫院官網職缺連結"] = career_url

        item = {
            "gov_seq": gov["seq"],
            "gov_name": gov_name,
            "registry_id": registry_id,
            "career_url": career_url,
            "row_data": row_data,
        }

        if existing_notion_id:
            item["notion_id"] = existing_notion_id
            item["existing_short_name"] = EXISTING_NOTION[existing_notion_id]
            plan["update"].append(item)
        else:
            plan["create"].append(item)

    OUT.write_text(json.dumps(plan, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"\nPlan:")
    print(f"  CREATE: {len(plan['create'])} new rows")
    print(f"  UPDATE: {len(plan['update'])} existing manual-seed rows (will gain new fields)")
    print(f"\nCREATE (no existing row in Notion):")
    for item in plan["create"]:
        url_mark = "✓" if item["career_url"] else "✗"
        print(f"  [URL {url_mark}] #{item['gov_seq']:>3} {item['gov_name']}")
    print(f"\nUPDATE (matches existing Notion row):")
    for item in plan["update"]:
        url_mark = "✓" if item["career_url"] else "✗"
        print(f"  [URL {url_mark}] {item['existing_short_name']} ← {item['gov_name']}")
    print(f"\nRegistry hospitals NOT found in gov MC list (manual decision needed):")
    matched_reg_ids = {p["registry_id"] for p in plan["create"] + plan["update"] if p["registry_id"]}
    for reg_id, hosp in registry.items():
        if reg_id not in matched_reg_ids:
            print(f"  - {reg_id}: {hosp['name']}")

if __name__ == "__main__":
    main()
