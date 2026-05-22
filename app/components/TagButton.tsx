import type { Tag } from '../lib/types';
import { TAG_STYLE } from '../lib/styles';

const FALLBACK_STYLE = {
  base: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
  active: 'bg-gray-600 text-white border-gray-700 hover:bg-gray-700',
};

export function TagButton({
  tag,
  active,
  onClick,
}: {
  tag: Tag;
  active: boolean;
  onClick: (tag: Tag) => void;
}) {
  const style = TAG_STYLE[tag] ?? FALLBACK_STYLE;
  return (
    <button
      type="button"
      onClick={() => onClick(tag)}
      className={`cursor-pointer rounded-full border px-2 py-0.5 text-xs font-medium transition-colors ${
        active ? style.active : style.base
      }`}
      aria-pressed={active}
    >
      {tag}
    </button>
  );
}
