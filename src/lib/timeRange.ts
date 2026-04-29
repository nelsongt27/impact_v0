import type { CanonicalResponse } from "@/normalize/types.ts";

export type RangeKey = "30d" | "90d" | "1y" | "all";

export const RANGE_LABELS: Record<RangeKey, string> = {
  "30d": "30 days",
  "90d": "90 days",
  "1y": "1 year",
  all: "All time",
};

export function parseRange(input: string | undefined | null): RangeKey {
  if (input === "30d" || input === "90d" || input === "1y" || input === "all") {
    return input;
  }
  return "all";
}

export interface RangeWindow {
  key: RangeKey;
  // null/null when "all"
  from: Date | null;
  to: Date | null;
  prevFrom: Date | null;
  prevTo: Date | null;
}

const NOW = () => new Date();
const DAY_MS = 24 * 60 * 60 * 1000;

function daysAgo(days: number, base = NOW()): Date {
  return new Date(base.getTime() - days * DAY_MS);
}

export function rangeWindow(key: RangeKey, now: Date = NOW()): RangeWindow {
  if (key === "all") {
    return { key, from: null, to: null, prevFrom: null, prevTo: null };
  }
  const days = key === "30d" ? 30 : key === "90d" ? 90 : 365;
  const to = now;
  const from = daysAgo(days, now);
  const prevTo = from;
  const prevFrom = daysAgo(days, from);
  return { key, from, to, prevFrom, prevTo };
}

export function inWindow(
  responseSubmittedAt: string | null,
  window: RangeWindow,
): boolean {
  if (!responseSubmittedAt) return window.key === "all";
  if (window.key === "all") return true;
  const t = new Date(responseSubmittedAt).getTime();
  if (Number.isNaN(t)) return false;
  return t >= (window.from?.getTime() ?? 0) && t <= (window.to?.getTime() ?? Infinity);
}

export function inPrevWindow(
  responseSubmittedAt: string | null,
  window: RangeWindow,
): boolean {
  if (window.key === "all") return false;
  if (!responseSubmittedAt) return false;
  const t = new Date(responseSubmittedAt).getTime();
  if (Number.isNaN(t)) return false;
  return (
    t >= (window.prevFrom?.getTime() ?? 0) &&
    t < (window.prevTo?.getTime() ?? Infinity)
  );
}

export function filterByRange(
  responses: CanonicalResponse[],
  window: RangeWindow,
): { current: CanonicalResponse[]; previous: CanonicalResponse[] } {
  if (window.key === "all") {
    return { current: responses, previous: [] };
  }
  const current: CanonicalResponse[] = [];
  const previous: CanonicalResponse[] = [];
  for (const r of responses) {
    if (inWindow(r.submitted_at, window)) current.push(r);
    else if (inPrevWindow(r.submitted_at, window)) previous.push(r);
  }
  return { current, previous };
}

export function formatWindowSubtitle(window: RangeWindow): string {
  if (window.key === "all") return "All time";
  const fmt = (d: Date | null) =>
    d
      ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "—";
  return `${fmt(window.from)} → ${fmt(window.to)} · vs prior ${RANGE_LABELS[window.key]}`;
}
