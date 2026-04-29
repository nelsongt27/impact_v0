// Axialent four-pointed sparkle, reproduces the rounded-diamond shape from the
// brand logomark. Use sparingly — in the header, as a hero accent, never as
// repeating bullets in lists.

interface SparkleProps {
  size?: number;
  className?: string;
  color?: string;
}

export function Sparkle({
  size = 12,
  className = "",
  color = "currentColor",
}: SparkleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M50 0 C50 28, 72 50, 100 50 C72 50, 50 72, 50 100 C50 72, 28 50, 0 50 C28 50, 50 28, 50 0 Z"
        fill={color}
      />
    </svg>
  );
}

export function SparkleTrio({
  size = 40,
  className = "",
  color = "var(--ax-amber-400)",
}: SparkleProps) {
  return (
    <svg
      width={size}
      height={size * 1.05}
      viewBox="0 0 200 210"
      aria-hidden="true"
      className={className}
    >
      <g fill={color}>
        <path d="M40 0 C40 22, 58 40, 80 40 C58 40, 40 58, 40 80 C40 58, 22 40, 0 40 C22 40, 40 22, 40 0 Z" />
        <path d="M155 65 C155 81, 169 95, 185 95 C169 95, 155 109, 155 125 C155 109, 141 95, 125 95 C141 95, 155 81, 155 65 Z" />
        <path d="M55 130 C55 146, 69 160, 85 160 C69 160, 55 174, 55 190 C55 174, 41 160, 25 160 C41 160, 55 146, 55 130 Z" />
      </g>
    </svg>
  );
}
