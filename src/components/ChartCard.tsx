import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  eyebrow,
  children,
  className = "",
}: ChartCardProps) {
  return (
    <div className={`rounded-lg border border-ink-100 bg-white p-6 ${className}`}>
      <div className="mb-5">
        {eyebrow && (
          <div className="mb-2 font-mono text-[10px] uppercase tracking-eyebrow text-ink-400">
            {eyebrow}
          </div>
        )}
        <h3 className="font-display text-xl tracking-tightest text-ink-900">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 font-mono text-[11px] text-ink-400">{subtitle}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
