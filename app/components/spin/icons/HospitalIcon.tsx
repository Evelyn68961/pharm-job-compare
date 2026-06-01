import type { ComponentType } from 'react';
import { safeBrandColor } from '../../../lib/styles';
import { ArchetypeHalo } from './ArchetypeHalo';
import { HospitalBadge } from './HospitalBadge';
import { SalarySparkle } from './SalarySparkle';
import { resolveArchetype } from './resolveArchetype';
import type { ArchetypeComponentProps, ArchetypeKey, HospitalIconProps } from './types';
import { AcademicAcePharmacist } from './archetypes/AcademicAcePharmacist';
import { BeipiaoPharmacist } from './archetypes/BeipiaoPharmacist';
import { IronArmPharmacist } from './archetypes/IronArmPharmacist';
import { NightOwlPharmacist } from './archetypes/NightOwlPharmacist';
import { TeachingSoulPharmacist } from './archetypes/TeachingSoulPharmacist';
import { ZenPharmacist } from './archetypes/ZenPharmacist';

const ARCHETYPE_COMPONENTS: Record<ArchetypeKey, ComponentType<ArchetypeComponentProps>> = {
  北漂藥師: BeipiaoPharmacist,
  教魂藥師: TeachingSoulPharmacist,
  夜貓藥師: NightOwlPharmacist,
  佛系藥師: ZenPharmacist,
  學霸藥師: AcademicAcePharmacist,
  鐵腕藥師: IronArmPharmacist,
};

const FALLBACK_BRAND = '#94a3b8';

export function HospitalIcon({ job, size = 96 }: HospitalIconProps) {
  const archetype = resolveArchetype(job);
  const Character = ARCHETYPE_COMPONENTS[archetype];
  const brandColor = safeBrandColor(job.brandColor) ?? FALLBACK_BRAND;
  const showSparkle = job.salaryTier === '突出';
  const haloGradientId = `halo-${job.id}`;

  return (
    <div
      className="relative flex-shrink-0 drop-shadow-md"
      style={{ width: size, height: size }}
      title={`${archetype} · ${job.hospitalName}`}
    >
      <ArchetypeHalo brandColor={brandColor} size={size} gradientId={haloGradientId} />
      <div className="absolute inset-0 flex items-center justify-center">
        <Character size={Math.round(size * 0.86)} />
      </div>
      <HospitalBadge brandColor={brandColor} archetype={archetype} size={size} />
      {showSparkle && <SalarySparkle size={size} />}
    </div>
  );
}
