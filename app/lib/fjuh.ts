import type { Job, Region } from './types';

// ── FJUH visibility knobs ───────────────────────────────────────────────────
// 輔大附醫 (FJUH) is the site owner and wants more exposure. Both boosts are
// REGION-GATED by their callers: they only ever fire when FJUH is already in
// the eligible/region-filtered set, so FJUH never appears when the user
// excluded its region — that would read as an obvious bug. Tune here.
//
//   FJUH_WIN_MULT  — multiplies FJUH's wheel weight in buildWheelCandidates, so
//                    it wins (= the 命運醫院 card) more often. Organic.
//   FJUH_ALT_RATE  — probability of seeding FJUH into the recommendation cards
//                    (resolveAlternatives), at a random slot, when eligible and
//                    not already the winner.
//
// OWN-NAME / THREADS BUILD: NEXT_PUBLIC_NEUTRAL=1 selects the toned-down build
// deployed under the maintainer's own name (pharm-fortune). It applies a GENTLE
// boost (2× / 0.2) instead of the promo build's heavy 4× / 0.5 — subtle enough
// that FJUH's tilt isn't visible to a reader, yet it still surfaces the FJUH
// contact form often enough (~1-in-3 open, ~1-in-2 for 北北基 players) to make
// the Threads-conversion test meaningful. The full promo build leaves the env
// var unset. Same code, one flag — two Vercel projects off one repo.
// (Flag kept named NEUTRAL for deploy continuity; it now means "gentle own-name
// build", not literally zero-boost. Simulated rates live in the plan history.)
const NEUTRAL = process.env.NEXT_PUBLIC_NEUTRAL === '1';

export const FJUH_WIN_MULT = NEUTRAL ? 2 : 4;
export const FJUH_ALT_RATE = NEUTRAL ? 0.2 : 0.5;

const FJUH_KEYS = ['輔大附醫', '輔大附設'];

export function isFjuh(job: Job): boolean {
  return (
    FJUH_KEYS.some((k) => job.hospitalName.includes(k)) ||
    FJUH_KEYS.some((k) => job.hospitalBriefName?.includes(k))
  );
}

// The always-on 輔大附醫 comparison column + trailing benchmark card in
// ResultDeck are pulled from the FULL job list, so they can surface even when
// the user excluded FJUH's region. In the PROMO build that's intentional
// exposure. In the own-name build (NEUTRAL) it reads as bias-from-nowhere — an
// FJUH column/card appearing right after the user said "not 北北基" — so we gate
// it to region eligibility: only surface the benchmark when FJUH is actually
// eligible for this user (no region picked, or its region among the picks).
// Returns the FJUH job to benchmark, or null to show none. The winner/
// alternatives are already region-filtered upstream, so this is the only
// non-region-gated FJUH surface.
export function fjuhBenchmark(jobs: Job[], regions: Region[]): Job | null {
  const f = jobs.find(isFjuh) ?? null;
  if (!f) return null;
  if (NEUTRAL && regions.length > 0 && f.region != null && !regions.includes(f.region)) {
    return null;
  }
  return f;
}
