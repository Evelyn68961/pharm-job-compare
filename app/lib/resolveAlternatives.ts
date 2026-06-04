import type { Job, Region } from './types';
import { resolveArchetype } from '../components/spin/icons/resolveArchetype';

const MAX_ALTERNATIVES = 3;

// ── FJUH visibility knobs ───────────────────────────────────────────────────
// 輔大附醫 (FJUH) is the site owner and wants more exposure. Both boosts are
// REGION-GATED: they only ever fire when FJUH is already in the eligible set
// (user picked 北北基 or no region), so FJUH never appears when the user
// excluded its region — that would read as an obvious bug. Tune here.
//
//   FJUH_WIN_MULT  — multiplies FJUH's wheel weight, so it wins (= the 命運醫院
//                    card) more often. Organic: the rate emerges from the draw
//                    and self-limits when the user has many strong matches.
//   FJUH_ALT_RATE  — probability of seeding FJUH into the 3 recommendation
//                    cards (random slot) when it's eligible and not the winner.
export const FJUH_WIN_MULT = 4;
export const FJUH_ALT_RATE = 0.5;

const FJUH_KEYS = ['輔大附醫', '輔大附設'];

export function isFjuh(job: Job): boolean {
  return (
    FJUH_KEYS.some((k) => job.hospitalName.includes(k)) ||
    FJUH_KEYS.some((k) => job.hospitalBriefName?.includes(k))
  );
}

export function resolveAlternatives(
  winner: Job,
  allJobs: Job[],
  regions: Region[] = [],
  rand: number = Math.random(),
): Job[] {
  const winnerArchetype = resolveArchetype(winner);
  let others = allJobs.filter((j) => j.id !== winner.id);
  // Region is a strict filter: if the user picked regions, alternatives stay
  // within them (matches the wheel). Fewer than 3 in-region = show fewer.
  if (regions.length > 0) {
    others = others.filter((j) => j.region != null && regions.includes(j.region));
  }

  const sortBySalary = (a: Job, b: Job) =>
    (b.salaryTier === '突出' ? 1 : 0) - (a.salaryTier === '突出' ? 1 : 0);

  const sameArchetype = others
    .filter((j) => resolveArchetype(j) === winnerArchetype)
    .sort(sortBySalary);
  const differentArchetype = others
    .filter((j) => resolveArchetype(j) !== winnerArchetype)
    .sort(sortBySalary);

  const picks = [...sameArchetype, ...differentArchetype].slice(0, MAX_ALTERNATIVES);

  // Seed FJUH into the recommendations sometimes. `others` is already
  // region-filtered and excludes the winner, so finding FJUH here is the gate:
  // if it's not eligible (wrong region) or it IS the winner, this is a no-op.
  const fjuh = others.find(isFjuh);
  if (fjuh && !picks.some((p) => p.id === fjuh.id) && rand < FJUH_ALT_RATE) {
    if (picks.length < MAX_ALTERNATIVES) {
      picks.push(fjuh);
    } else {
      // Drop one real pick for FJUH, at a slot derived from the same roll so a
      // re-render doesn't reshuffle it.
      const slot = Math.floor((rand / FJUH_ALT_RATE) * picks.length) % picks.length;
      picks[slot] = fjuh;
    }
  }

  return picks;
}
