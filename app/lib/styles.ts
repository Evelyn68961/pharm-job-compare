import type { HospitalTier, Region, SalaryTier, Tag } from './types';
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

export const REGION_PILL: Record<Region, { base: string; active: string }> = {
  北北基: {
    base: 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50',
    active: 'bg-blue-600 text-white border-blue-700',
  },
  桃竹苗: {
    base: 'bg-white text-green-700 border-green-300 hover:bg-green-50',
    active: 'bg-green-600 text-white border-green-700',
  },
  中彰投: {
    base: 'bg-white text-orange-700 border-orange-300 hover:bg-orange-50',
    active: 'bg-orange-600 text-white border-orange-700',
  },
  雲嘉南: {
    base: 'bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-50',
    active: 'bg-yellow-600 text-white border-yellow-700',
  },
  高屏: {
    base: 'bg-white text-red-700 border-red-300 hover:bg-red-50',
    active: 'bg-red-600 text-white border-red-700',
  },
  宜花東: {
    base: 'bg-white text-purple-700 border-purple-300 hover:bg-purple-50',
    active: 'bg-purple-600 text-white border-purple-700',
  },
  離島: {
    base: 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50',
    active: 'bg-slate-600 text-white border-slate-700',
  },
};

export const TAG_STYLE: Record<Tag, { base: string; active: string }> = {
  工作單純: {
    base: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
    active: 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700',
  },
  '免/少輪班': {
    base: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
    active: 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700',
  },
  無大夜: {
    base: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
    active: 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700',
  },
  夜班津貼優渥: {
    base: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
    active: 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700',
  },
  醫學中心級: {
    base: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
    active: 'bg-purple-600 text-white border-purple-700 hover:bg-purple-700',
  },
  教學醫院: {
    base: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
    active: 'bg-purple-600 text-white border-purple-700 hover:bg-purple-700',
  },
  重視教學: {
    base: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
    active: 'bg-purple-600 text-white border-purple-700 hover:bg-purple-700',
  },
  全面藥事訓練: {
    base: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
    active: 'bg-purple-600 text-white border-purple-700 hover:bg-purple-700',
  },
  外派進修機會: {
    base: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
    active: 'bg-purple-600 text-white border-purple-700 hover:bg-purple-700',
  },
  進階制度: {
    base: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
    active: 'bg-purple-600 text-white border-purple-700 hover:bg-purple-700',
  },
  專科藥師訓練: {
    base: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
    active: 'bg-purple-600 text-white border-purple-700 hover:bg-purple-700',
  },
  簽約金: {
    base: 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100',
    active: 'bg-green-600 text-white border-green-700 hover:bg-green-700',
  },
  提供宿舍: {
    base: 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100',
    active: 'bg-green-600 text-white border-green-700 hover:bg-green-700',
  },
};

export function breakOnParens(text: string | null): string | null {
  if (!text) return text;
  return text.replace(/\s*([(（])/g, (_match, paren: string, offset: number) =>
    offset === 0 ? paren : '\n' + paren,
  );
}

const TAIWAN_CITY_NORTH_TO_SOUTH: Record<string, number> = {
  基隆市: 1,
  臺北市: 2,
  台北市: 2,
  新北市: 3,
  桃園市: 4,
  新竹市: 5,
  新竹縣: 5,
  苗栗縣: 6,
  臺中市: 7,
  台中市: 7,
  彰化縣: 8,
  南投縣: 9,
  雲林縣: 10,
  嘉義市: 11,
  嘉義縣: 11,
  臺南市: 12,
  台南市: 12,
  高雄市: 13,
  屏東縣: 14,
  宜蘭縣: 15,
  花蓮縣: 16,
  臺東縣: 17,
  台東縣: 17,
  澎湖縣: 18,
  金門縣: 19,
  連江縣: 20,
};

export function rankCity(city: string | null): number {
  if (!city) return 999;
  return TAIWAN_CITY_NORTH_TO_SOUTH[city] ?? 998;
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export function safeBrandColor(hex: string | null): string | null {
  if (!hex) return null;
  return HEX_COLOR.test(hex) ? hex : null;
}
