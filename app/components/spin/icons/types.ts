import type { Job } from '../../../lib/types';

export type ArchetypeKey =
  | '北漂藥師'
  | '教魂藥師'
  | '夜貓藥師'
  | '佛系藥師'
  | '學霸藥師'
  | '鐵腕藥師';

export type ArchetypeComponentProps = {
  size: number;
};

export type HospitalIconProps = {
  job: Job;
  size?: number;
};
