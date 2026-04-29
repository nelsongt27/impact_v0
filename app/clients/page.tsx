import Link from "next/link";

import { SectionTitle } from "@/components/SectionTitle";
import { groupBy } from "@/lib/aggregations";
import { activeResponses, activeSurveys } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { slugify } from "@/lib/slug";

export default function ClientsIndexPage() {
  const groups = groupBy(activeSurveys, activeResponses, (s) => s.client);

  return (
    <div>
      <SectionTitle
        title="Clients"
        subtitle={`${groups.length} clients across the historic survey dataset`}
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <Link
            key={g.key}
            href={`/clients/${slugify(g.key)}`}
            className="group relative overflow-hidden rounded-xl border border-ink-100 bg-white p-5 shadow-sm transition hover:border-ink-300 hover:shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-semibold text-ink-900">{g.key}</div>
                <div className="mt-1 text-xs text-ink-400">
                  {g.surveys} {g.surveys === 1 ? "survey" : "surveys"}
                </div>
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
          </Link>
        ))}
      </div>
    </div>
  );
}
