# `legacy/` — archived earlier-scope tooling

These files are **not part of the running app** — nothing in `app/` imports them.
They're kept for historical reference only.

They come from an earlier, broader-scope plan (see
[plan/pharmacist-job-compare-plan-v4.md](../plan/pharmacist-job-compare-plan-v4.md) §11)
that would have **bulk-imported** hospitals from a government evaluation PDF and
**auto-parsed** 104 recruitment pages on a monthly cron.

That plan was dropped. The current project is deliberately ≤50 hand-curated
hospitals, **hand-entered into Notion** by a pharmacist — there is no scraping
and no auto-ingest. (See the data-sourcing rule in [CLAUDE.md](../CLAUDE.md).)

## What's here

| Path | Was |
|---|---|
| `scripts/parse-gov-eval-pdf.py` | 衛福部 評鑑名單 PDF → JSON for bulk import |
| `scripts/prepare-mc-import.py` | match 醫學中心 gov data → Notion import plan |
| `scripts/build-url-registry.py` | `hospital-career-urls.md` → JSON registry for the parser runner |
| `scripts/run-parsers.py` | monthly 104-page parser runner (skeleton) |
| `parsers/` | per-hospital CSS-selector configs + region mapping for the runner |
| `data/hospitals-gov-bulk.json` | bulk gov hospital data |
| `data/mc-import-plan.json` | output of `prepare-mc-import.py` |
| `data/hospital-career-urls.md` | URL registry source for the parser pipeline |

## What stayed put (still active — do NOT move here)

- `scripts/backfill-brief-names.py`, `scripts/shorten-hospital-names.py` —
  Notion 醫院簡稱 maintenance, driven by the live `app/lib/hospital-brief-names.json`
- `scripts/preview-idols.mjs` — dev helper that previews the archetype idol icons
- `data/hospitals-reference.md` — live read-only curation aid
- `data/tag-rules.md` — tag reference
