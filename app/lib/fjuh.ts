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
export const FJUH_WIN_MULT = 4;
export const FJUH_ALT_RATE = 0.5;

const FJUH_KEYS = ['輔大附醫', '輔大附設'];

export function isFjuh(job: Job): boolean {
  return (
    FJUH_KEYS.some((k) => job.hospitalName.includes(k)) ||
    FJUH_KEYS.some((k) => job.hospitalBriefName?.includes(k))
  );
}
