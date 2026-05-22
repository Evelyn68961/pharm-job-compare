import type { SalaryTier, Tag } from './types';

export const TIER_BADGE: Record<SalaryTier, string> = {
  突出: 'bg-orange-100 text-orange-900 border-orange-300',
  一般: 'bg-gray-100 text-gray-700 border-gray-300',
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
  簽約金: {
    base: 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100',
    active: 'bg-green-600 text-white border-green-700 hover:bg-green-700',
  },
  提供宿舍: {
    base: 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100',
    active: 'bg-green-600 text-white border-green-700 hover:bg-green-700',
  },
};

export function extractCity(location: string | null): string | null {
  if (!location) return null;
  const match = location.search(/[·•・]/);
  if (match === -1) return location.trim() || null;
  const city = location.substring(0, match).trim();
  return city || null;
}

export function breakOnParens(text: string | null): string | null {
  if (!text) return text;
  return text.replace(/\s*([(（])/g, (_match, paren: string, offset: number) =>
    offset === 0 ? paren : '\n' + paren,
  );
}

const TAIWAN_CITY_NORTH_TO_SOUTH: Record<string, number> = {
  基隆: 1,
  台北: 2,
  新北: 3,
  桃園: 4,
  新竹: 5,
  苗栗: 6,
  台中: 7,
  彰化: 8,
  南投: 9,
  雲林: 10,
  嘉義: 11,
  台南: 12,
  高雄: 13,
  屏東: 14,
  宜蘭: 15,
  花蓮: 16,
  台東: 17,
  澎湖: 18,
  金門: 19,
  連江: 20,
  馬祖: 20,
};

export function rankCity(location: string | null): number {
  const city = extractCity(location);
  if (!city) return 999;
  return TAIWAN_CITY_NORTH_TO_SOUTH[city] ?? 998;
}
