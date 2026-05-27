export function SalarySparkle({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0"
      aria-hidden
    >
      <g transform="translate(78 18)">
        <path
          d="M 0 -10 L 2.5 -2.5 L 10 0 L 2.5 2.5 L 0 10 L -2.5 2.5 L -10 0 L -2.5 -2.5 Z"
          fill="#fbbf24"
          stroke="#b45309"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        <circle cx="0" cy="0" r="2.2" fill="#fffbeb" />
      </g>
    </svg>
  );
}
