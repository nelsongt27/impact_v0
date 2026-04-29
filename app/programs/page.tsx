import Link from "next/link";

import { SectionTitle } from "@/components/SectionTitle";
import { groupBy } from "@/lib/aggregations";
import { activeResponses, activeSurveys } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { slugify } from "@/lib/slug";

export default function ProgramsIndexPage() {
  const groups = groupBy(activeSurveys, activeResponses, (s) => s.program);

  // Lookup of program -> first matching client (for the card subtitle), built once.
  const clientByProgram = new Map<string, string>();
  for (const s of activeSurveys) {
    if (s.program && s.client && !clientByProgram.has(s.program)) {
      clientByProgram.set(s.program, s.client);
    }
  }

  return (
    <div>
      <SectionTitle
        title="Programs"
        subtitle={`${groups.length} distinct programs delivered across the dataset`}
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => {
          const client = clientByProgram.get(g.key) ?? null;
          return (
            <Link
              key={g.key}
              href={`/programs/${slugify(g.key)}`}
              className="group relative overflow-hidden rounded-xl border border-ink-100 bg-white p-5 shadow-sm transition hover:border-ink-300 hover:shadow"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-ink-900">
                    {g.key}
                  </div>
                  {client && (
                    <div className="mt-1 text-xs text-ink-400">{client}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-ink-900">
                    {formatNumber(g.responses)}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-ink-400">
                    responses
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-ink-400">
                {g.surveys} {g.surveys === 1 ? "survey" : "surveys"}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
