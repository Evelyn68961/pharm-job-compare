import type { Job } from './types';

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
// NEUTRAL BUILD: setting NEXT_PUBLIC_NEUTRAL=1 zeroes out both boosts so FJUH
// is ranked exactly like every other hospital (multiplier 1, never seeded). Use
// this for the own-name/Threads deployment that must carry no FJUH bias. The
// FJUH-boosted promo build simply leaves the env var unset. Same code, one flag
// — deployed as two Vercel projects off the same repo.
const NEUTRAL = process.env.NEXT_PUBLIC_NEUTRAL === '1';

export const FJUH_WIN_MULT = NEUTRAL ? 1 : 4;
export const FJUH_ALT_RATE = NEUTRAL ? 0 : 0.5;

const FJUH_KEYS = ['輔大附醫', '輔大附設'];

export function isFjuh(job: Job): boolean {
  return (
    FJUH_KEYS.some((k) => job.hospitalName.includes(k)) ||
    FJUH_KEYS.some((k) => job.hospitalBriefName?.includes(k))
  );
}
