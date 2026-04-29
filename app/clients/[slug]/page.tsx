import Link from "next/link";
import { notFound } from "next/navigation";

import { ChartCard } from "@/components/ChartCard";
import { KpiCard } from "@/components/KpiCard";
import { RangeSelector } from "@/components/RangeSelector";
import { SectionTitle } from "@/components/SectionTitle";
import { DimensionTrendChart } from "@/components/charts/DimensionTrendChart";
import {
  PR_DIMENSIONS,
  avgDimension,
  groupBy,
  monthlyDimensionTrend,
  sortSurveysByRecency,
  topOpenEnded,
} from "@/lib/aggregations";
import { activeResponses, activeSurveys } from "@/lib/data";
import { formatDate, formatNumber, formatScore } from "@/lib/format";
import { slugify } from "@/lib/slug";
import {
  filterByRange,
  formatWindowSubtitle,
  parseRange,
  rangeWindow,
} from "@/lib/timeRange";

export function generateStaticParams() {
  const clients = new Set<string>();
  for (const s of activeSurveys) {
    if (s.client) clients.add(s.client);
  }
  return [...clients].map((client) => ({ slug: slugify(client) }));
}

export default async function ClientDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const rangeKey = parseRange(sp.range);
  const window = rangeWindow(rangeKey);

  const candidate = activeSurveys.find(
    (s) => s.client && slugify(s.client) === slug,
  );
  if (!candidate?.client) return notFound();
  const client = candidate.client;

  const clientSurveys = activeSurveys.filter((s) => s.client === client);
  const clientSurveyIds = new Set(clientSurveys.map((s) => s.id));
  const allClientResponses = activeResponses.filter((r) =>
    clientSurveyIds.has(r.survey_id),
  );
  const { current: clientResponses, previous } = filterByRange(
    allClientResponses,
    window,
  );

  const avgApp = avgDimension(clientResponses, "applicability");
  const prevApp = avgDimension(previous, "applicability");
  const avgFac = avgDimension(clientResponses, "facilitator_effectiveness");
  const prevFac = avgDimension(previous, "facilitator_effectiveness");
  const avgRel = avgDimension(clientResponses, "relevance");
  const prevRel = avgDimension(previous, "relevance");
  const avgEng = avgDimension(clientResponses, "engagement");
  const prevEng = avgDimension(previous, "engagement");

  const showDeltas = rangeKey !== "all";
  const delta = (cur: number | null, prev: number | null): number | null => {
    if (!showDeltas || cur === null || prev === null) return null;
    return cur - prev;
  };

  const programs = groupBy(clientSurveys, clientResponses, (s) => s.program);
  const trend = monthlyDimensionTrend(clientResponses, [...PR_DIMENSIONS]);
  const trendData = trend.map((p) => ({ month: p.month, ...p.values }));
  const voc = topOpenEnded(clientResponses, 6);

  const surveysSorted = sortSurveysByRecency(clientSurveys);

  return (
    <div>
      <div className="mb-2">
        <Link
          href="/clients"
          className="text-xs text-ink-400 hover:text-ink-900"
        >
          ← All clients
        </Link>
      </div>
      <SectionTitle
        title={client}
        subtitle={`${clientSurveys.length} surveys · ${formatNumber(clientResponses.length)} responses · ${formatWindowSubtitle(window)}`}
        right={
          <RangeSelector
            current={rangeKey}
            basePath={`/clients/${slug}`}
          />
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard
          label="Avg Applicability"
          value={formatScore(avgApp.value)}
          hint={`${formatNumber(avgApp.count)} ratings`}

          delta={delta(avgApp.value, prevApp.value)}
        />
        <KpiCard
          label="Avg Facilitator"
          value={formatScore(avgFac.value)}
          hint={`${formatNumber(avgFac.count)} ratings`}
          delta={delta(avgFac.value, prevFac.value)}
        />
        <KpiCard
          label="Avg Relevance"
          value={formatScore(avgRel.value)}
          hint={`${formatNumber(avgRel.count)} ratings`}
          delta={delta(avgRel.value, prevRel.value)}
        />
        <KpiCard
          label="Avg Engagement"
          value={formatScore(avgEng.value)}
          hint={`${formatNumber(avgEng.count)} ratings`}
          delta={delta(avgEng.value, prevEng.value)}
        />
      </div>

      {trendData.length > 1 && (
        <div className="mt-6">
          <ChartCard
            title="Dimensions over time"
            subtitle="Monthly averages for participant reflection dimensions"
          >
            <DimensionTrendChart data={trendData} dimensions={[...PR_DIMENSIONS]} />
          </ChartCard>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Programs delivered"
          subtitle="Breakdown by program for this client"
        >
          {programs.length === 0 ? (
            <p className="text-sm text-ink-400">
              No programs identified for this client yet.
            </p>
          ) : (
            <ul className="divide-y divide-ink-100">
              {programs.map((p) => (
                <li
                  key={p.key}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <Link
                    href={`/programs/${slugify(p.key)}`}
                    className="text-ink-900 hover:underline"
                  >
                    {p.key}
                  </Link>
                  <div className="text-ink-500">
                    {p.surveys} surveys ·{" "}
                    <span className="font-semibold text-ink-900">
                      {formatNumber(p.responses)}
                    </span>{" "}
                    responses
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>

        <ChartCard
          title="Voice of Customer"
          subtitle="Most-answered open-ended questions (sample answer shown)"
        >
          {voc.length === 0 ? (
            <p className="text-sm text-ink-400">No open-ended responses yet.</p>
          ) : (
            <ul className="space-y-3">
              {voc.map((v) => (
                <li key={v.slug} className="rounded-md bg-paper-2 p-3">
                  <div className="text-[11px] uppercase tracking-wider text-ink-400">
                    {v.count} responses
                  </div>
                  <div className="mt-1 line-clamp-3 text-sm italic text-ink-700">
                    “{v.sample}”
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>
      </div>

      <div className="mt-6">
        <ChartCard
          title="Surveys"
          subtitle="All surveys captured for this client"
        >
          <div className="overflow-hidden rounded-md border border-ink-100">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100">
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-eyebrow text-ink-400">
                    Survey
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-eyebrow text-ink-400">
                    Family
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-eyebrow text-ink-400">
                    Country
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-eyebrow text-ink-400">
                    Updated
                  </th>
                  <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-eyebrow text-ink-400">
                    Resp.
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {surveysSorted.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-paper-2">
                    <td className="px-4 py-3 text-ink-900">{s.title}</td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-500">
                      {s.survey_family.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-500">
                      {s.country ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-500">
                      {formatDate(s.updated_at)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-ink-900">
                      {s.response_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
