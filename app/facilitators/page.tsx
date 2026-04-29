import { ChartCard } from "@/components/ChartCard";
import { KpiCard } from "@/components/KpiCard";
import { SectionTitle } from "@/components/SectionTitle";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { activeResponses, activeSurveys, surveysById } from "@/lib/data";
import { formatNumber, formatScore } from "@/lib/format";

interface FacilitatorRow {
  name: string;
  sessions: number;
  participantResponses: number;
  facEffectivenessSum: number;
  facEffectivenessCount: number;
  participantEngagementSum: number;
  participantEngagementCount: number;
  clients: Set<string>;
}

function buildFacilitatorRows(): FacilitatorRow[] {
  const surveysByFacilitator = new Map<string, FacilitatorRow>();

  for (const s of activeSurveys) {
    if (!s.facilitator) continue;
    let row = surveysByFacilitator.get(s.facilitator);
    if (!row) {
      row = {
        name: s.facilitator,
        sessions: 0,
        participantResponses: 0,
        facEffectivenessSum: 0,
        facEffectivenessCount: 0,
        participantEngagementSum: 0,
        participantEngagementCount: 0,
        clients: new Set(),
      };
      surveysByFacilitator.set(s.facilitator, row);
    }
    row.sessions++;
    if (s.client) row.clients.add(s.client);
  }

  for (const r of activeResponses) {
    const survey = surveysById.get(r.survey_id);
    if (!survey?.facilitator) continue;
    const row = surveysByFacilitator.get(survey.facilitator);
    if (!row) continue;
    row.participantResponses++;
    const fe = r.dimensions.facilitator_effectiveness;
    if (typeof fe === "number") {
      row.facEffectivenessSum += fe;
      row.facEffectivenessCount++;
    }
    const eg = r.dimensions.engagement;
    if (typeof eg === "number") {
      row.participantEngagementSum += eg;
      row.participantEngagementCount++;
    }
  }

  return [...surveysByFacilitator.values()].sort(
    (a, b) => b.facEffectivenessCount - a.facEffectivenessCount,
  );
}

export default function FacilitatorsPage() {
  const rows = buildFacilitatorRows();

  const ranked = rows
    .filter((r) => r.facEffectivenessCount > 0)
    .map((r) => ({
      name: r.name,
      value: r.facEffectivenessSum / r.facEffectivenessCount,
      count: r.facEffectivenessCount,
    }))
    .sort((a, b) => b.value - a.value);

  const sessionsRanked = rows
    .map((r) => ({ name: r.name, value: r.sessions }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 12);

  const totalFacilitators = rows.length;
  const totalSessions = rows.reduce((acc, r) => acc + r.sessions, 0);
  const avgEffectiveness =
    ranked.length > 0
      ? ranked.reduce((s, r) => s + r.value, 0) / ranked.length
      : null;

  return (
    <div>
      <SectionTitle
        title="Facilitator Performance"
        subtitle="Cross-client view of facilitator delivery and impact"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <KpiCard
          label="Facilitators Tracked"
          value={totalFacilitators}
          hint="extracted from survey titles"
        />
        <KpiCard
          label="Total Sessions"
          value={formatNumber(totalSessions)}
          hint="surveys with a named facilitator"
        />
        <KpiCard
          label="Avg Facilitator Score"
          value={formatScore(avgEffectiveness)}
          hint={`${ranked.length} facilitators with ratings · 1–5`}

        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Facilitators ranked by effectiveness"
          subtitle="Avg participant rating of facilitator effectiveness"
        >
          {ranked.length === 0 ? (
            <p className="text-sm text-ink-400">
              No facilitator-effectiveness ratings detected yet.
            </p>
          ) : (
            <HorizontalBarChart
              data={ranked.map((r) => ({ name: r.name, value: Number(r.value.toFixed(2)) }))}
              valueLabel="avg score"
              color="#1D2F5E"
              height={Math.max(200, ranked.length * 28)}
            />
          )}
        </ChartCard>

        <ChartCard
          title="Sessions delivered (top 12)"
          subtitle="Number of surveys where this facilitator is named"
        >
          <HorizontalBarChart
            data={sessionsRanked}
            valueLabel="sessions"
            color="#F3B230"
            height={Math.max(200, sessionsRanked.length * 28)}
          />
        </ChartCard>
      </div>

      <div className="mt-6">
        <ChartCard
          title="Facilitator detail"
          subtitle="Sample size, clients reached, and engagement-to-effectiveness alignment"
        >
          <div className="overflow-hidden rounded-md border border-ink-100">
            <table className="min-w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Facilitator</th>
                  <th className="px-3 py-2 text-right font-semibold">Sessions</th>
                  <th className="px-3 py-2 text-right font-semibold">Resp.</th>
                  <th className="px-3 py-2 font-semibold">Clients</th>
                  <th className="px-3 py-2 text-right font-semibold">
                    Effectiveness
                  </th>
                  <th className="px-3 py-2 text-right font-semibold">Engagement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {rows.map((r) => {
                  const eff =
                    r.facEffectivenessCount > 0
                      ? r.facEffectivenessSum / r.facEffectivenessCount
                      : null;
                  const eng =
                    r.participantEngagementCount > 0
                      ? r.participantEngagementSum / r.participantEngagementCount
                      : null;
                  return (
                    <tr key={r.name} className="hover:bg-paper-2">
                      <td className="px-3 py-2 font-medium text-ink-900">{r.name}</td>
                      <td className="px-3 py-2 text-right text-ink-700">
                        {r.sessions}
                      </td>
                      <td className="px-3 py-2 text-right text-ink-700">
                        {r.participantResponses}
                      </td>
                      <td className="px-3 py-2 text-ink-500">
                        {[...r.clients].join(", ") || "—"}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-ink-900">
                        {formatScore(eff)}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-ink-900">
                        {formatScore(eng)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
