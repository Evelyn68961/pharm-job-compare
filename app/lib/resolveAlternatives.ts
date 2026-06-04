import type { Job } from './types';
import { buildWheelCandidates, scoreJob, type QuizAnswers } from './quiz';
import { FJUH_ALT_RATE, isFjuh } from './fjuh';

const MAX_ALTERNATIVES = 3;

// The 3 recommendation cards = the user's next-best matches: the same quiz
// scoring the winner came from, minus the winner, top 3 — then FJUH may be
// seeded in (controlled by FJUH_ALT_RATE).
export function resolveAlternatives(
  winner: Job,
  allJobs: Job[],
  answers: QuizAnswers,
  rand: number = Math.random(),
): Job[] {
  // Reuse the wheel's eligible + region-filtered pool, minus the winner.
  const pool = buildWheelCandidates(allJobs, answers)
    .map((s) => s.job)
    .filter((j) => j.id !== winner.id);

  // Rank by the PURE match score (scoreJob), not the FJUH-boosted wheel weight —
  // the win boost is for the winner draw only; FJUH's presence in the
  // recommendations is governed solely by FJUH_ALT_RATE below.
  const picks = [...pool]
    .sort((a, b) => scoreJob(b, answers) - scoreJob(a, answers))
    .slice(0, MAX_ALTERNATIVES);

  // Seed FJUH into the recommendations sometimes. `pool` is already region- and
  // eligibility-filtered, so if FJUH isn't in it (wrong region) this is a no-op.
  const fjuh = pool.find(isFjuh);
  if (fjuh && !picks.some((p) => p.id === fjuh.id) && rand < FJUH_ALT_RATE) {
    if (picks.length < MAX_ALTERNATIVES) {
      picks.push(fjuh);
    } else {
      // Drop one pick for FJUH, at a slot derived from the same roll so a
      // re-render doesn't reshuffle it.
      const slot = Math.floor((rand / FJUH_ALT_RATE) * picks.length) % picks.length;
      picks[slot] = fjuh;
    }
  }

  return picks;
}
