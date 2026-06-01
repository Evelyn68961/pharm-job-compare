import type { Job } from './types';
import { resolveArchetype } from '../components/spin/icons/resolveArchetype';

const MAX_ALTERNATIVES = 3;

export function resolveAlternatives(winner: Job, allJobs: Job[]): Job[] {
  const winnerArchetype = resolveArchetype(winner);
  const others = allJobs.filter((j) => j.id !== winner.id);

  const sortBySalary = (a: Job, b: Job) =>
    (b.salaryTier === '突出' ? 1 : 0) - (a.salaryTier === '突出' ? 1 : 0);

  const sameArchetype = others
    .filter((j) => resolveArchetype(j) === winnerArchetype)
    .sort(sortBySalary);
  const differentArchetype = others
    .filter((j) => resolveArchetype(j) !== winnerArchetype)
    .sort(sortBySalary);

  return [...sameArchetype, ...differentArchetype].slice(0, MAX_ALTERNATIVES);
}

const FJUH_KEYS = ['輔大附醫', '輔大附設'];

export function findFjuhJob(allJobs: Job[]): Job | null {
  return (
    allJobs.find(
      (j) =>
        FJUH_KEYS.some((k) => j.hospitalName.includes(k)) ||
        FJUH_KEYS.some((k) => j.hospitalBriefName?.includes(k)),
    ) ?? null
  );
}
