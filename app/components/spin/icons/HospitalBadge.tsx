// Bottom-right floating badge with hospital initials in brand color.
// Positioned in the SVG corner rather than on the character chest so it
// stays aligned regardless of which archetype art is below it.
export function HospitalBadge({
  brandColor,
  initials,
  size,
}: {
  brandColor: string;
  initials: string;
  size: number;
}) {
  if (!initials) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0"
      aria-hidden
    >
      <circle cx="78" cy="82" r="16" fill={brandColor} stroke="white" strokeWidth="2.5" />
      <text
        x="78"
        y="83"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize={initials.length > 1 ? 11 : 15}
        fontWeight={700}
        style={{ fontFamily: 'system-ui, -apple-system, "Noto Sans TC", sans-serif' }}
      >
        {initials}
      </text>
    </svg>
  );
}
