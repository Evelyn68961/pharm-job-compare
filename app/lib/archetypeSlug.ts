// Short ASCII slugs for the share URL, so a shared link reads
// `/?j=<id>&a=ace` instead of `/?archetype=%E5%AD%B8%E9%9C%B8...` (encoded
// Chinese turns into messy %XX noise in chat apps). The OG image route still
// receives the real Chinese names — those are built server-side in
// generateMetadata and never shown to the user.
import type { ArchetypeKey } from '../components/spin/icons/types';

export const ARCHETYPE_SLUG: Record<ArchetypeKey, string> = {
  學霸藥師: 'ace',
  北漂藥師: 'beipiao',
  教魂藥師: 'teach',
  夜貓藥師: 'owl',
  佛系藥師: 'zen',
  鐵腕藥師: 'iron',
  金牛藥師: 'gold',
};

export const SLUG_ARCHETYPE = Object.fromEntries(
  Object.entries(ARCHETYPE_SLUG).map(([name, slug]) => [slug, name]),
) as Record<string, ArchetypeKey>;
