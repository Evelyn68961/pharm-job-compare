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
import { JinniuPharmacist } from './archetypes/JinniuPharmacist';
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
  金牛藥師: JinniuPharmacist,
};

const FALLBACK_BRAND = '#94a3b8';

// Standalone chibi (character + halo, no hospital badge/sparkle). Used by the
// landing-page hero cast, where there's no Job to resolve — just an archetype
// and colours to paint it with.
export function ArchetypeAvatar({
  archetype,
  color,
  secondaryColor,
  size = 72,
}: {
  archetype: ArchetypeKey;
  color: string;
  secondaryColor?: string;
  size?: number;
}) {
  const Character = ARCHETYPE_COMPONENTS[archetype];
  return (
    <div className="relative flex-shrink-0 drop-shadow-md" style={{ width: size, height: size }}>
      <ArchetypeHalo brandColor={color} size={size} gradientId={`halo-cast-${archetype}`} />
      <div className="absolute inset-0 flex items-center justify-center">
        <Character size={Math.round(size * 0.86)} accentColor={color} secondaryColor={secondaryColor ?? color} />
      </div>
    </div>
  );
}

export function HospitalIcon({ job, size = 96, archetype: forced }: HospitalIconProps) {
  const archetype = forced ?? resolveArchetype(job);
  const Character = ARCHETYPE_COMPONENTS[archetype];
  const brandColor = safeBrandColor(job.brandColor) ?? FALLBACK_BRAND;
  // 識別色 = primary (halo + badge + neckerchief); 輔助色 = secondary (accessory/prop).
  // Falls back to the primary so single-color hospitals render unchanged.
  const secondaryColor = safeBrandColor(job.secondaryColor) ?? brandColor;
  const showSparkle = job.tags.includes('簽約金');
  const haloGradientId = `halo-${job.id}`;

  return (
    <div
      className="relative flex-shrink-0 drop-shadow-md"
      style={{ width: size, height: size }}
      title={`${archetype} · ${job.hospitalName}`}
    >
      <ArchetypeHalo brandColor={brandColor} size={size} gradientId={haloGradientId} />
      <div className="absolute inset-0 flex items-center justify-center">
        <Character size={Math.round(size * 0.86)} accentColor={brandColor} secondaryColor={secondaryColor} />
      </div>
      <HospitalBadge brandColor={brandColor} archetype={archetype} size={size} />
      {showSparkle && <SalarySparkle size={size} />}
    </div>
  );
}
