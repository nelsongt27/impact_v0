import Link from "next/link";

import { RANGE_LABELS, type RangeKey } from "@/lib/timeRange";

const ORDER: RangeKey[] = ["30d", "90d", "1y", "all"];

interface Props {
  current: RangeKey;
  basePath: string;
  searchParamName?: string;
}

export function RangeSelector({
  current,
  basePath,
  searchParamName = "range",
}: Props) {
  return (
    <div className="flex items-center gap-1">
      {ORDER.map((key) => {
        const href =
          key === "all"
            ? basePath
            : `${basePath}?${searchParamName}=${key}`;
        const active = current === key;
        return (
          <Link
            key={key}
            href={href}
            className={
              active
                ? "rounded-full bg-ink-800 px-4 py-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-paper"
                : "rounded-full bg-paper-2 px-4 py-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-800"
            }
          >
            {RANGE_LABELS[key]}
          </Link>
        );
      })}
    </div>
  );
}
