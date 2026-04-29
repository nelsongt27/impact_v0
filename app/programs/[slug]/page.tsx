import Link from "next/link";
import { notFound } from "next/navigation";

import { ChartCard } from "@/components/ChartCard";
import { KpiCard } from "@/components/KpiCard";
import { SectionTitle } from "@/components/SectionTitle";
import { DimensionTrendChart } from "@/components/charts/DimensionTrendChart";
import {
  PR_DIMENSIONS,
  avgDimension,
  monthlyDimensionTrend,
  sortSurveysByRecency,
} from "@/lib/aggregations";
import { activeResponses, activeSurveys } from "@/lib/data";
import { formatDate, formatNumber, formatScore } from "@/lib/format";
import { slugify } from "@/lib/slug";

export function generateStaticParams() {
  const programs = new Set<string>();
  for (const s of activeSurveys) {
    if (s.program) programs.add(s.program);
  }
  return [...programs].map((program) => ({ slug: slugify(program) }));
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const candidate = activeSurveys.find(
    (s) => s.program && slugify(s.program) === slug,
  );
  if (!candidate?.program) return notFound();
  const program = candidate.program;
  const client = candidate.client ?? null;

  const programSurveys = activeSurveys.filter((s) => s.program === program);
  const programSurveyIds = new Set(programSurveys.map((s) => s.id));
  const programResponses = activeResponses.filter((r) =>
    programSurveyIds.has(r.survey_id),
  );

  const avgApp = avgDimension(programResponses, "applicability");
  const avgFac = avgDimension(programResponses, "facilitator_effectiveness");
  const avgRel = avgDimension(programResponses, "relevance");
  const avgEng = avgDimension(programResponses, "engagement");
  const avgCulture = avgDimension(programResponses, "culture_fit");

  const trend = monthlyDimensionTrend(programResponses, [...PR_DIMENSIONS]);
  const trendData = trend.map((p) => ({ month: p.month, ...p.values }));

  const surveysSorted = sortSurveysByRecency(programSurveys);

  return (
    <div>
      <div className="mb-2">
        <Link
          href="/programs"
          className="text-xs text-ink-400 hover:text-ink-900"
        >
          ← All programs
        </Link>
      </div>
      <SectionTitle
        title={program}
        subtitle={
          client
            ? `${client} · ${programSurveys.length} surveys · ${formatNumber(programResponses.length)} responses`
            : `${programSurveys.length} surveys · ${formatNumber(programResponses.length)} responses`
        }
        right={
          client && (
            <Link
              href={`/clients/${slugify(client)}`}
              className="rounded-md border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-900 hover:bg-ink-50"
            >
              View client →
            </Link>
          )
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <KpiCard
          label="Avg Applicability"
          value={formatScore(avgApp.value)}
          hint={`${formatNumber(avgApp.count)} ratings`}

        />
        <KpiCard
          label="Avg Facilitator"
          value={formatScore(avgFac.value)}
          hint={`${formatNumber(avgFac.count)} ratings`}
        />
        <KpiCard
          label="Avg Relevance"
          value={formatScore(avgRel.value)}
          hint={`${formatNumber(avgRel.count)} ratings`}
        />
        <KpiCard
          label="Avg Engagement"
          value={formatScore(avgEng.value)}
          hint={`${formatNumber(avgEng.count)} ratings`}
        />
        <KpiCard
          label="Avg Culture Fit"
          value={formatScore(avgCulture.value)}
          hint={`${formatNumber(avgCulture.count)} ratings`}
        />
      </div>

      {trendData.length > 1 && (
        <div className="mt-6">
          <ChartCard
            title="Wave-by-wave trend"
            subtitle="Monthly averages across the program's lifetime"
          >
            <DimensionTrendChart data={trendData} dimensions={[...PR_DIMENSIONS]} />
          </ChartCard>
        </div>
      )}

      <div className="mt-6">
        <ChartCard
          title="Surveys in this program"
          subtitle="Each survey instance, ordered by most recent first"
        >
          <div className="overflow-hidden rounded-md border border-ink-100">
            <table className="min-w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Survey</th>
                  <th className="px-3 py-2 font-semibold">Family</th>
                  <th className="px-3 py-2 font-semibold">Country</th>
                  <th className="px-3 py-2 font-semibold">Lang</th>
                  <th className="px-3 py-2 font-semibold">Updated</th>
                  <th className="px-3 py-2 text-right font-semibold">Resp.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {surveysSorted.map((s) => (
                  <tr key={s.id} className="hover:bg-paper-2">
                    <td className="px-3 py-2 text-ink-900">{s.title}</td>
                    <td className="px-3 py-2 text-ink-500">
                      {s.survey_family.replace(/_/g, " ")}
                    </td>
                    <td className="px-3 py-2 text-ink-500">{s.country ?? "—"}</td>
                    <td className="px-3 py-2 text-ink-500">{s.language ?? "—"}</td>
                    <td className="px-3 py-2 text-ink-500">
                      {formatDate(s.updated_at)}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-ink-900">
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
