import { ChartCard } from "@/components/ChartCard";
import { KpiCard } from "@/components/KpiCard";
import { RangeSelector } from "@/components/RangeSelector";
import { SectionTitle } from "@/components/SectionTitle";
import { DimensionTrendChart } from "@/components/charts/DimensionTrendChart";
import { FamilyDonut } from "@/components/charts/FamilyDonut";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import {
  PR_DIMENSIONS,
  avgDimension,
  groupBy,
  monthlyDimensionTrend,
} from "@/lib/aggregations";
import { activeResponses, activeSurveys } from "@/lib/data";
import { formatNumber, formatScore } from "@/lib/format";
import {
  filterByRange,
  formatWindowSubtitle,
  parseRange,
  rangeWindow,
} from "@/lib/timeRange";

const FAMILY_DISPLAY: Record<string, string> = {
  participant_reflection: "Participant Reflection",
  facilitator_debrief: "Facilitator Debrief",
  coaching_reflection: "Coaching Reflection",
  coaching_process: "Coaching Process",
  coach_selection: "Coach Selection",
  team_diagnostic: "Team Diagnostic",
  pulse_check: "Pulse Check",
  impact_roi: "Impact & ROI",
  client_needs: "Client Needs Analysis",
  prework: "Prework",
  internal_clients_perception: "Internal Clients",
  remesh_feedback: "Remesh",
  unknown: "Other",
};

export default async function ImpactOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const sp = await searchParams;
  const rangeKey = parseRange(sp.range);
  const window = rangeWindow(rangeKey);
  const { current, previous } = filterByRange(activeResponses, window);

  // For survey/program counts in the current window we count surveys whose
  // responses (if any) fall in the window. For an "all" window we use the
  // whole active set so the headline numbers don't drop to zero on small windows.
  const currentSurveyIds = new Set(current.map((r) => r.survey_id));
  const surveysInWindow =
    rangeKey === "all"
      ? activeSurveys
      : activeSurveys.filter((s) => currentSurveyIds.has(s.id));
  const programs = new Set(surveysInWindow.map((s) => s.program).filter(Boolean));

  const avgApp = avgDimension(current, "applicability");
  const prevAvgApp = avgDimension(previous, "applicability");

  const avgFac = avgDimension(current, "facilitator_effectiveness");
  const prevAvgFac = avgDimension(previous, "facilitator_effectiveness");

  const avgEng = avgDimension(current, "engagement");
  const prevAvgEng = avgDimension(previous, "engagement");

  const avgNps = avgDimension(current, "nps");
  const prevAvgNps = avgDimension(previous, "nps");

  const showDeltas = rangeKey !== "all";
  const delta = (cur: number | null, prev: number | null): number | null => {
    if (!showDeltas || cur === null || prev === null) return null;
    return cur - prev;
  };

  const byClient = groupBy(surveysInWindow, current, (s) => s.client).slice(0, 10);
  const byFamily = groupBy(surveysInWindow, current, (s) => s.survey_family);

  const trend = monthlyDimensionTrend(current, [...PR_DIMENSIONS]);
  const trendData = trend.map((p) => ({ month: p.month, ...p.values }));

  const clientChartData = byClient.map((g) => ({
    name: g.key,
    value: g.responses,
  }));
  const familyChartData = byFamily
    .filter((g) => g.responses > 0)
    .map((g) => ({
      name: FAMILY_DISPLAY[g.key] ?? g.key,
      value: g.responses,
    }));

  return (
    <div>
      <SectionTitle
        eyebrow="Axialent · Impact Record · 2010 – 2026"
        title="Impact Overview"
        subtitle={formatWindowSubtitle(window)}
        right={<RangeSelector current={rangeKey} basePath="/" />}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        <KpiCard
          label="Total Responses"
          value={formatNumber(current.length)}
          hint={`${formatNumber(surveysInWindow.length)} surveys`}
          delta={
            showDeltas ? current.length - previous.length : null
          }
          deltaUnit="count"
        />
        <KpiCard
          label="Programs"
          value={programs.size}
          hint="distinct programs"
        />
        <KpiCard
          label="Avg Applicability"
          value={formatScore(avgApp.value)}
          hint={`${formatNumber(avgApp.count)} ratings · 1–5`}

          delta={delta(avgApp.value, prevAvgApp.value)}
          deltaUnit="score"
        />
        <KpiCard
          label="Avg Facilitator"
          value={formatScore(avgFac.value)}
          hint={`${formatNumber(avgFac.count)} ratings · 1–5`}
          delta={delta(avgFac.value, prevAvgFac.value)}
          deltaUnit="score"
        />
        <KpiCard
          label="Avg Engagement"
          value={formatScore(avgEng.value)}
          hint={`${formatNumber(avgEng.count)} ratings · 1–5`}
          delta={delta(avgEng.value, prevAvgEng.value)}
          deltaUnit="score"
        />
      </div>

      {avgNps.value !== null && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <KpiCard
            label="Avg NPS"
            value={formatScore(avgNps.value, 1)}
            hint={`${formatNumber(avgNps.count)} responses · 0–10`}

            delta={delta(avgNps.value, prevAvgNps.value)}
            deltaUnit="score"
          />
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard
          eyebrow="Section 01"
          title="Quality over time"
          subtitle="Monthly average of the five participant reflection dimensions"
          className="lg:col-span-2"
        >
          <DimensionTrendChart data={trendData} dimensions={[...PR_DIMENSIONS]} />
        </ChartCard>

        <ChartCard
          eyebrow="Section 02"
          title="Survey types"
          subtitle="Response volume per family"
        >
          <FamilyDonut data={familyChartData} />
        </ChartCard>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6">
        <ChartCard
          eyebrow="Section 03"
          title="Top clients"
          subtitle="By response volume in the current window — rank one in amber"
        >
          <HorizontalBarChart data={clientChartData} valueLabel="responses" />
        </ChartCard>
      </div>
    </div>
  );
}
