#!/usr/bin/env python3
"""
Parse the 衛福部 108-114 醫院評鑑名單 PDF (via pdftotext -raw) into
structured JSON ready for Notion bulk-import.

Strategy: -raw gives near-perfect reading order. We walk the lines,
detect each record start by `{seq} {code}` pattern (with code = 10 digits),
collect lines until the next record start, then parse fields by pattern
within the block.

Output: data/hospitals-gov-bulk.json
"""
import json
import re
import subprocess
from collections import Counter
from pathlib import Path

PDF_PATH = "/root/.claude/uploads/80226b67-6fcd-4e6e-8301-cd63abe78115/78faf329-108114___________________.pdf"
RAW_PATH = "/tmp/eval-raw.txt"
OUT_PATH = Path("data/hospitals-gov-bulk.json")

REGION_MAP = {
    "臺北市": "北北基", "新北市": "北北基", "基隆市": "北北基",
    "桃園市": "桃竹苗", "新竹市": "桃竹苗", "新竹縣": "桃竹苗", "苗栗縣": "桃竹苗",
    "臺中市": "中彰投", "彰化縣": "中彰投", "南投縣": "中彰投",
    "雲林縣": "雲嘉南", "嘉義市": "雲嘉南", "嘉義縣": "雲嘉南", "臺南市": "雲嘉南",
    "高雄市": "高屏", "屏東縣": "高屏",
    "宜蘭縣": "宜花東", "花蓮縣": "宜花東", "臺東縣": "宜花東",
    "澎湖縣": "離島", "金門縣": "離島", "連江縣": "離島",
}
CITIES = set(REGION_MAP.keys())
TIERS = {"醫學中心", "區域醫院", "地區醫院"}

RECORD_START_RE = re.compile(r"^(\d{1,3})\s+(\d{10})(?:\s+(.*))?$")
PHONE_RE = re.compile(r"\b(0\d{1,3}-\d{6,8})\b")
PERIOD_RE = re.compile(r"^\d{3}/\d{1,2}/\d{1,2}-?$")

def regenerate_raw():
    subprocess.run(["pdftotext", "-raw", PDF_PATH, RAW_PATH], check=True)

def split_into_records(lines):
    """Walk lines, start a new record at each `seq code [optional name tail]`."""
    records = []
    current = None
    for line in lines:
        line = line.rstrip()
        m = RECORD_START_RE.match(line)
        if m and m.group(1).isdigit():
            seq = int(m.group(1))
            if 1 <= seq <= 999:  # plausible
                if current:
                    records.append(current)
                current = {
                    "seq": seq,
                    "code": m.group(2),
                    "first_line_tail": (m.group(3) or "").strip(),
                    "extra_lines": [],
                }
                continue
        if current is not None:
            if line.strip():
                current["extra_lines"].append(line.strip())
    if current:
        records.append(current)
    return records

def parse_record(rec):
    """Parse fields from the record's lines.

    The structure varies — name can span 1-2 lines, eval can span 1-2 lines,
    teach can span 1-2 lines, address can span 1-2 lines. We identify each
    field by its distinctive pattern.
    """
    all_lines = []
    if rec["first_line_tail"]:
        all_lines.append(rec["first_line_tail"])
    all_lines.extend(rec["extra_lines"])

    # Concatenate all lines into one stream, but keep boundaries for context
    name_parts = []
    city = ""
    tier = ""
    eval_text_parts = []
    teach_text_parts = []
    years = []  # list of int
    periods = []  # list of date-range strings
    phone = ""
    address_parts = []

    state = "name"  # → city_tier_eval → teach → years → periods → phone_address
    for line in all_lines:
        # Phone line?
        ph = PHONE_RE.search(line)
        if ph and state in ("phone_address", "periods", "years"):
            phone = ph.group(1)
            # Rest of line after phone = address
            after = line[ph.end():].strip()
            if after:
                address_parts.append(after)
            state = "address_cont"
            continue
        if ph and state == "city_tier_eval":
            # Inline phone on the same line as eval — rare but possible
            pass

        # Period line (a date range, possibly split across "start-" and "end")
        if PERIOD_RE.match(line) or re.match(r"^\d{3}/\d{1,2}/\d{1,2}$", line):
            periods.append(line)
            state = "periods"
            continue

        # Single dash (means N/A for teaching)
        if line == "-":
            periods.append("-")
            continue

        # Year on its own line
        if re.match(r"^\d{3}( \d{3})?( -)?( -)?$", line):
            for tok in line.split():
                if tok.isdigit():
                    years.append(int(tok))
            state = "years"
            continue

        # City + tier + eval all on one line?
        toks = line.split()
        if any(t in CITIES for t in toks) and any(t in TIERS for t in toks):
            for t in toks:
                if t in CITIES:
                    city = t
                elif t in TIERS:
                    tier = t
            # Capture remaining tokens as eval start
            eval_text_parts.append(line)
            state = "city_tier_eval"
            continue

        # Just a teaching-status line
        if any(k in line for k in ["教學醫院評鑑合格", "非教學醫院", "教學醫院評鑑"]):
            teach_text_parts.append(line)
            state = "teach"
            continue

        # Eval result continuation
        if state == "city_tier_eval" and "院評鑑" in line:
            eval_text_parts.append(line)
            continue

        # Address (post-phone, or continuing)
        if state == "address_cont":
            address_parts.append(line)
            continue

        # Address starts with a 縣/市?
        if state in ("years", "periods", "phone_address") and re.match(
            r"^(?:臺北|新北|基隆|桃園|新竹|苗栗|臺中|彰化|南投|雲林|嘉義|臺南|高雄|屏東|宜蘭|花蓮|臺東|澎湖|金門|連江)", line
        ):
            address_parts.append(line)
            state = "address_cont"
            continue

        # Default: still in name state
        if state == "name":
            name_parts.append(line)

    name = "".join(name_parts).strip()
    if not name:
        # Fallback: pull from first line tail of original
        name = rec["first_line_tail"]

    # Clean: strip trailing " 縣市 醫學中心 ..." pollution that happens when
    # the whole record fits on one line and got captured during "name" state.
    name = re.sub(
        r"\s+(?:臺北市|新北市|基隆市|桃園市|新竹市|新竹縣|苗栗縣|臺中市|彰化縣|南投縣|雲林縣|嘉義市|嘉義縣|臺南市|高雄市|屏東縣|宜蘭縣|花蓮縣|臺東縣|澎湖縣|金門縣|連江縣)\s+(?:醫學中心|區域醫院|地區醫院).*$",
        "",
        name,
    ).strip()
    # Also strip whitespace within (PDF often inserts soft spaces in Chinese)
    name = re.sub(r"\s+", "", name)

    address = "".join(address_parts).strip()
    eval_text = " ".join(eval_text_parts)
    teach_text = " ".join(teach_text_parts)

    # Teaching: scan the WHOLE record text. Use "" join so wrapped keywords
    # like "教學醫" + "院評鑑合格" reunite into "教學醫院評鑑合格".
    joined_all = "".join(all_lines)
    is_teaching = "教學醫院評鑑合格" in joined_all and "非教學醫院" not in joined_all

    # Derive district
    district = ""
    if address:
        d = re.search(r"(?:市|縣)([一-龥]{1,4}(?:區|鄉|鎮|市))", address)
        if d:
            district = d.group(1)

    region = REGION_MAP.get(city, "")
    loc_city = city.replace("市", "").replace("縣", "") if city else ""
    loc_district = re.sub(r"(?:區|鄉|鎮|市)$", "", district)
    location = f"{loc_city}·{loc_district}" if loc_district else loc_city

    return {
        "seq": rec["seq"],
        "code": rec["code"],
        "name": name,
        "city": city,
        "district": district,
        "region": region,
        "tier": tier or "其他",
        "is_teaching": is_teaching,
        "phone": phone,
        "address": address,
        "location": location,
    }

def main():
    regenerate_raw()
    with open(RAW_PATH, encoding="utf-8") as f:
        lines = f.readlines()

    records = split_into_records(lines)
    hospitals = [parse_record(r) for r in records]

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("w", encoding="utf-8") as f:
        json.dump({
            "source": "衛福部 108-114 年醫院評鑑及教學醫院評鑑合格名單",
            "extracted_at": "2026-05-24",
            "hospital_count": len(hospitals),
            "hospitals": hospitals,
        }, f, ensure_ascii=False, indent=2)

    by_tier = Counter(h["tier"] for h in hospitals)
    by_region = Counter(h["region"] for h in hospitals)
    teaching = sum(1 for h in hospitals if h["is_teaching"])
    no_phone = sum(1 for h in hospitals if not h["phone"])
    no_name = sum(1 for h in hospitals if not h["name"])
    no_city = sum(1 for h in hospitals if not h["city"])
    no_address = sum(1 for h in hospitals if not h["address"])

    print(f"Parsed {len(hospitals)} hospitals")
    print(f"  By tier:   {dict(by_tier)}")
    print(f"  By region: {dict(by_region)}")
    print(f"  Teaching:  {teaching}")
    print(f"  Missing — name: {no_name}, city: {no_city}, phone: {no_phone}, address: {no_address}")

    print(f"\nAll 醫學中心:")
    for h in hospitals:
        if h["tier"] == "醫學中心":
            t = "✓" if h["is_teaching"] else " "
            print(f"  #{h['seq']:>3} [{t}] {h['name']:<30} | {h['location']:<10} | {h['phone']}")

    print(f"\nFirst 5 區域醫院:")
    cnt = 0
    for h in hospitals:
        if h["tier"] == "區域醫院":
            t = "✓" if h["is_teaching"] else " "
            print(f"  #{h['seq']:>3} [{t}] {h['name']:<30} | {h['location']:<10} | {h['phone']}")
            cnt += 1
            if cnt >= 5:
                break

if __name__ == "__main__":
    main()
