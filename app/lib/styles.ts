import type { HospitalTier, SalaryTier } from './types';
import briefNames from './hospital-brief-names.json';

const BRIEF: Record<string, string> = briefNames as Record<string, string>;

export function hospitalDisplayName(
  fullName: string,
  manualBrief?: string | null,
): {
  header: string;
  subtitle: string | null;
} {
  // Priority: Notion 醫院簡稱 column > auto-shortened JSON map > full name
  const override = manualBrief?.trim();
  if (override && override !== fullName) {
    return { header: override, subtitle: fullName };
  }
  const brief = BRIEF[fullName];
  if (brief && brief !== fullName) {
    return { header: brief, subtitle: fullName };
  }
  return { header: fullName, subtitle: null };
}

export const TIER_BADGE: Record<SalaryTier, string> = {
  突出: 'bg-orange-100 text-orange-900 border-orange-300',
  一般: 'bg-gray-100 text-gray-700 border-gray-300',
};

export const HOSPITAL_TIER_BADGE: Record<HospitalTier, string> = {
  醫學中心: 'bg-red-100 text-red-900 border-red-300',
  區域醫院: 'bg-orange-100 text-orange-900 border-orange-300',
  地區醫院: 'bg-yellow-100 text-yellow-900 border-yellow-300',
  其他: 'bg-gray-100 text-gray-700 border-gray-300',
};

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export function safeBrandColor(hex: string | null): string | null {
  if (!hex) return null;
  return HEX_COLOR.test(hex) ? hex : null;
}
