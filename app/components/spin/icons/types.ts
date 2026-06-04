import type { Job } from '../../../lib/types';

export type ArchetypeKey =
  | '北漂藥師'
  | '教魂藥師'
  | '夜貓藥師'
  | '佛系藥師'
  | '學霸藥師'
  | '鐵腕藥師'
  | '金牛藥師';

export type ArchetypeComponentProps = {
  size: number;
  accentColor?: string;
  secondaryColor?: string;
};

export type HospitalIconProps = {
  job: Job;
  size?: number;
  // Override the resolved archetype (e.g. the spin result renders the idol the
  // user ranked #1, not the hospital's own trait). Falls back to resolveArchetype.
  archetype?: ArchetypeKey;
};
