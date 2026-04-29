interface SectionTitleProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  right?: React.ReactNode;
}

export function SectionTitle({
  title,
  subtitle,
  eyebrow,
  right,
}: SectionTitleProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-2 font-mono text-[11px] uppercase tracking-eyebrow text-ink-400">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-4xl tracking-tightest text-ink-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 font-mono text-xs text-ink-500">{subtitle}</p>
        )}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}
