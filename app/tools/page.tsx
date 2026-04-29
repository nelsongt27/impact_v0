import { ChartCard } from "@/components/ChartCard";
import { KpiCard } from "@/components/KpiCard";
import { SectionTitle } from "@/components/SectionTitle";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { extractToolTexts } from "@/lib/aggregations";
import { activeResponses, activeSurveys } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { topToolEntries } from "@/lib/text";

export default function ToolsPage() {
  const coachToolTexts = extractToolTexts(activeSurveys, activeResponses, "coach");
  const participantToolTexts = extractToolTexts(
    activeSurveys,
    activeResponses,
    "participant",
  );

  const coachTop = topToolEntries(coachToolTexts, 20);
  const participantTop = topToolEntries(participantToolTexts, 20);

  const coachChartData = coachTop.map((t) => ({
    name: t.entry.length > 60 ? t.entry.slice(0, 57) + "…" : t.entry,
    value: t.count,
  }));
  const participantChartData = participantTop.map((t) => ({
    name: t.entry.length > 60 ? t.entry.slice(0, 57) + "…" : t.entry,
    value: t.count,
  }));

  return (
    <div>
      <SectionTitle
        title="Tools & Concepts Impact"
        subtitle="Which Axialent tools and concepts coaches apply, and which ones participants say had the biggest impact"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard
          label="Coach Mentions"
          value={formatNumber(coachToolTexts.length)}
          hint="tools applied — coach POV"
        />
        <KpiCard
          label="Participant Mentions"
          value={formatNumber(participantToolTexts.length)}
          hint="biggest-impact topics — participant POV"

        />
        <KpiCard
          label="Distinct Tool Entries"
          value={formatNumber(coachTop.length + participantTop.length)}
          hint="top entries shown below"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Coach POV — Tools Applied"
          subtitle="From Coaching Process Tracking forms"
        >
          {coachChartData.length === 0 ? (
            <p className="text-sm text-ink-400">
              No coach-side tool data captured yet.
            </p>
          ) : (
            <HorizontalBarChart
              data={coachChartData}
              valueLabel="mentions"
              color="#1D2F5E"
              height={Math.max(240, coachChartData.length * 26)}
            />
          )}
        </ChartCard>

        <ChartCard
          title="Participant POV — Biggest Impact"
          subtitle="From Participant Reflection forms"
        >
          {participantChartData.length === 0 ? (
            <p className="text-sm text-ink-400">
              No participant-side tool data captured yet.
            </p>
          ) : (
            <HorizontalBarChart
              data={participantChartData}
              valueLabel="mentions"
              color="#F3B230"
              height={Math.max(240, participantChartData.length * 26)}
            />
          )}
        </ChartCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Coach POV — Sample mentions" subtitle="Top entries with sample quotes">
          {coachTop.length === 0 ? (
            <p className="text-sm text-ink-400">No samples available.</p>
          ) : (
            <ul className="space-y-3">
              {coachTop.slice(0, 10).map((t) => (
                <li key={t.entry} className="rounded-md bg-paper-2 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-ink-900">
                      {t.entry}
                    </span>
                    <span className="text-xs text-ink-400">{t.count}×</span>
                  </div>
                  {t.samples.length > 1 && (
                    <div className="mt-1 text-xs italic text-ink-500">
                      Variants: {t.samples.slice(1, 3).join(" · ")}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </ChartCard>

        <ChartCard
          title="Participant POV — Sample mentions"
          subtitle="Top entries with sample quotes"
        >
          {participantTop.length === 0 ? (
            <p className="text-sm text-ink-400">No samples available.</p>
          ) : (
            <ul className="space-y-3">
              {participantTop.slice(0, 10).map((t) => (
                <li key={t.entry} className="rounded-md bg-paper-2 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-ink-900">
                      {t.entry}
                    </span>
                    <span className="text-xs text-ink-400">{t.count}×</span>
                  </div>
                  {t.samples.length > 1 && (
                    <div className="mt-1 text-xs italic text-ink-500">
                      Variants: {t.samples.slice(1, 3).join(" · ")}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </ChartCard>
      </div>

      <div className="mt-6">
        <ChartCard
          title="How this works"
          subtitle="Frequency-based extraction — no LLM clustering yet"
        >
          <p className="text-sm text-ink-700">
            Tools answers in the historic data are free-text. We split each
            answer on common separators (commas, dashes, pipes, conjunctions)
            and count how often each entry appears. Two perspectives are kept
            separate: what coaches <em>apply</em> in sessions vs. what
            participants say had the <em>biggest impact</em>. Future iterations
            can layer LLM clustering on top of this base.
          </p>
        </ChartCard>
      </div>
    </div>
  );
}
