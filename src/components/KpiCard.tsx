interface KpiCardProps {
  label: string;
  value: string | number;
  hint?: string;
  delta?: number | null;
  deltaUnit?: "score" | "count" | "percent";
}

function formatDelta(delta: number, unit: "score" | "count" | "percent"): string {
  const sign = delta > 0 ? "↑" : delta < 0 ? "↓" : "→";
  const abs = Math.abs(delta);
  if (unit === "count") return `${sign} ${abs.toFixed(0)}`;
  if (unit === "percent") return `${sign} ${(abs * 100).toFixed(0)}%`;
  return `${sign} ${abs.toFixed(2)}`;
}

export function KpiCard({
  label,
  value,
  hint,
  delta,
  deltaUnit = "score",
}: KpiCardProps) {
  // Brand-aligned delta colors per design system: positive = amber-700,
  // negative = brick (#B23A3A). No emerald/red — keeps the editorial palette.
  const deltaColor =
    delta === null || delta === undefined
      ? ""
      : delta > 0
        ? "text-amber-700"
        : delta < 0
          ? "text-brick"
          : "text-ink-400";

  return (
    <div className="rounded-lg border border-ink-100 bg-white p-6">
      <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-400">
        {label}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-3xl tracking-tightest text-ink-900">
          {value}
        </span>
        {delta !== null && delta !== undefined && (
          <span className={`font-mono text-xs font-semibold ${deltaColor}`}>
            {formatDelta(delta, deltaUnit)}
          </span>
        )}
      </div>
      {hint && (
        <div className="mt-3 font-mono text-[11px] text-ink-400">{hint}</div>
      )}
    </div>
  );
}
