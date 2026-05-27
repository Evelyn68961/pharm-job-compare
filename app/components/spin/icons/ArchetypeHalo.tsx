export function ArchetypeHalo({
  brandColor,
  size,
  gradientId,
}: {
  brandColor: string;
  size: number;
  gradientId: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="absolute inset-0"
      aria-hidden
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={brandColor} stopOpacity="0.5" />
          <stop offset="60%" stopColor={brandColor} stopOpacity="0.18" />
          <stop offset="100%" stopColor={brandColor} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill={`url(#${gradientId})`} />
    </svg>
  );
}
