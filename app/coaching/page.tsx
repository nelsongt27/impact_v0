import Link from "next/link";

import { ChartCard } from "@/components/ChartCard";
import { KpiCard } from "@/components/KpiCard";
import { SectionTitle } from "@/components/SectionTitle";
import {
  avgDimension,
  buildCoachStats,
  buildCoacheeStats,
  buildCoachingByClient,
} from "@/lib/aggregations";
import { activeResponses, activeSurveys, surveysById } from "@/lib/data";
import { formatNumber, formatScore } from "@/lib/format";
import { slugify } from "@/lib/slug";

function avg({ sum, count }: { sum: number; count: number }): number | null {
  return count === 0 ? null : sum / count;
}

export default function CoachingPage() {
  const coachingResponses = activeResponses.filter((r) => {
    const s = surveysById.get(r.survey_id);
    return (
      s?.survey_family === "coaching_reflection" ||
      s?.survey_family === "coaching_process" ||
      s?.survey_family === "coach_selection"
    );
  });

  const byClient = buildCoachingByClient(activeSurveys, activeResponses);
  const coachees = buildCoacheeStats(activeSurveys, activeResponses);
  const coaches = buildCoachStats(activeSurveys, activeResponses);

  const avgCoachEff = avgDimension(coachingResponses, "coach_effectiveness");
  const avgProgress = avgDimension(coachingResponses, "progress_on_goals");
  const avgSafety = avgDimension(coachingResponses, "safety");

  return (
    <div>
      <SectionTitle
        title="Coaching Engagement"
        subtitle="Coaching delivered across the historic dataset, organised by client"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard
          label="Clients with Coaching"
          value={byClient.length}
          hint="distinct client engagements"
        />
        <KpiCard
          label="Coaching Responses"
          value={formatNumber(coachingResponses.length)}
          hint="reflection + process tracking"
        />
        <KpiCard
          label="Avg Coach Effectiveness"
          value={formatScore(avgCoachEff.value)}
          hint={`${formatNumber(avgCoachEff.count)} coachee ratings · 1–5`}

        />
        <KpiCard
          label="Avg Progress on Goals"
          value={formatScore(avgProgress.value)}
          hint={`${formatNumber(avgProgress.count)} coachee ratings · 1–5`}
        />
      </div>

      {avgSafety.value !== null && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <KpiCard
            label="Avg Safety (coachee POV)"
            value={formatScore(avgSafety.value)}
            hint={`${formatNumber(avgSafety.count)} ratings`}
          />
        </div>
      )}

      <div className="mt-6">
        <ChartCard
          title="Coaching by Client"
          subtitle="All coaching engagements grouped by the client that received them"
        >
          {byClient.length === 0 ? (
            <p className="text-sm text-ink-400">
              No coaching engagements identified yet.
            </p>
          ) : (
            <div className="overflow-hidden rounded-md border border-ink-100">
              <table className="min-w-full text-sm">
                <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Client</th>
                    <th className="px-3 py-2 text-right font-semibold">Surveys</th>
                    <th className="px-3 py-2 text-right font-semibold">Resp.</th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Coach Eff.
                    </th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Progress
                    </th>
                    <th className="px-3 py-2 text-right font-semibold">Safety</th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Connection
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {byClient.map((row) => (
                    <tr key={row.client} className="hover:bg-paper-2">
                      <td className="px-3 py-2 font-medium text-ink-900">
                        <Link
                          href={`/clients/${slugify(row.client)}`}
                          className="hover:underline"
                        >
                          {row.client}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-right text-ink-700">
                        {row.surveys}
                      </td>
                      <td className="px-3 py-2 text-right text-ink-700">
                        {row.responses}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-ink-900">
                        {formatScore(avg(row.coachEffectiveness))}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-ink-900">
                        {formatScore(avg(row.progressOnGoals))}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-ink-900">
                        {formatScore(avg(row.safety))}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-ink-900">
                        {formatScore(avg(row.connection))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ChartCard>
      </div>

      <div className="mt-6">
        <details className="group rounded-xl border border-ink-100 bg-white p-5 shadow-sm">
          <summary className="cursor-pointer list-none">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-ink-900">
                  Per-coach detail
                </h3>
                <p className="mt-0.5 text-xs text-ink-400">
                  {coaches.length} {coaches.length === 1 ? "coach" : "coaches"} ·{" "}
                  {coachees.length} {coachees.length === 1 ? "coachee" : "coachees"}{" "}
                  identified by name in survey titles · most coaching surveys do
                  not name the coach, so use the client view above for
                  completeness
                </p>
              </div>
              <span className="text-xs text-ink-400 group-open:hidden">
                Show ↓
              </span>
              <span className="hidden text-xs text-ink-400 group-open:inline">
                Hide ↑
              </span>
            </div>
          </summary>

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-wider text-ink-400">
                Coachees
              </div>
              {coachees.length === 0 ? (
                <p className="text-sm text-ink-400">No coachees named in titles.</p>
              ) : (
                <ul className="divide-y divide-ink-100 rounded-md border border-ink-100">
                  {coachees.map((c) => (
                    <li
                      key={c.name}
                      className="flex items-center justify-between px-3 py-2 text-sm"
                    >
                      <span className="text-ink-900">{c.name}</span>
                      <span className="text-ink-500">
                        {c.client ?? "—"} ·{" "}
                        <span className="font-semibold text-ink-900">
                          {c.responses}
                        </span>{" "}
                        resp
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-wider text-ink-400">
                Coaches
              </div>
              {coaches.length === 0 ? (
                <p className="text-sm text-ink-400">
                  No coaches named in titles.
                </p>
              ) : (
                <ul className="divide-y divide-ink-100 rounded-md border border-ink-100">
                  {coaches.map((c) => (
                    <li
                      key={c.name}
                      className="flex items-center justify-between px-3 py-2 text-sm"
                    >
                      <span className="text-ink-900">{c.name}</span>
                      <span className="text-ink-500">
                        {c.sessions} sess · {c.responses} resp
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
