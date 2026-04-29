import Link from "next/link";

import { ChartCard } from "@/components/ChartCard";
import { SectionTitle } from "@/components/SectionTitle";
import {
  VOC_THEMES,
  classifyQuestionSlug,
} from "@/lib/aggregations";
import { activeResponses, activeSurveys, surveysById } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { sampleQuotes, topPhrases } from "@/lib/text";

interface SearchParams {
  client?: string;
}

export default async function VoicePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { client: clientFilter } = await searchParams;

  const filteredResponses = clientFilter
    ? activeResponses.filter((r) => {
        const s = surveysById.get(r.survey_id);
        return s?.client === clientFilter;
      })
    : activeResponses;

  const themeBuckets: Record<string, string[]> = {};
  for (const theme of VOC_THEMES) themeBuckets[theme.key] = [];

  for (const r of filteredResponses) {
    for (const [slug, value] of Object.entries(r.open_ended)) {
      if (!value || typeof value !== "string" || value.length < 10) continue;
      const theme = classifyQuestionSlug(slug);
      if (theme && themeBuckets[theme]) themeBuckets[theme].push(value);
    }
  }

  const allClients = [
    ...new Set(activeSurveys.map((s) => s.client).filter(Boolean)),
  ].sort() as string[];

  return (
    <div>
      <SectionTitle
        title="Voice of Customer"
        subtitle="Themes from open-ended responses across the historic dataset"
      />

      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-ink-400">Filter by client:</span>
        <Link
          href="/voice"
          className={
            !clientFilter
              ? "rounded-md bg-ink-800 px-2.5 py-1 text-xs font-medium text-white"
              : "rounded-md border border-ink-200 px-2.5 py-1 text-xs font-medium text-ink-900 hover:bg-ink-50"
          }
        >
          All
        </Link>
        {allClients.map((c) => (
          <Link
            key={c}
            href={`/voice?client=${encodeURIComponent(c)}`}
            className={
              clientFilter === c
                ? "rounded-md bg-ink-800 px-2.5 py-1 text-xs font-medium text-white"
                : "rounded-md border border-ink-200 px-2.5 py-1 text-xs font-medium text-ink-900 hover:bg-ink-50"
            }
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {VOC_THEMES.map((theme) => {
          const texts = themeBuckets[theme.key] ?? [];
          const phrases = topPhrases(texts, { ngrams: 2, limit: 12 });
          const samples = sampleQuotes(texts, 4);

          return (
            <ChartCard
              key={theme.key}
              title={theme.label}
              subtitle={`${formatNumber(texts.length)} responses`}
            >
              {texts.length === 0 ? (
                <p className="text-sm text-ink-400">No responses for this theme yet.</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 text-[11px] uppercase tracking-wider text-ink-400">
                      Top phrases
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {phrases.map((p) => (
                        <span
                          key={p.phrase}
                          className="rounded-full bg-ink-50 px-3 py-1 text-xs font-medium text-ink-900"
                        >
                          {p.phrase}{" "}
                          <span className="text-ink-400">· {p.count}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 text-[11px] uppercase tracking-wider text-ink-400">
                      Sample quotes
                    </div>
                    <ul className="space-y-2">
                      {samples.map((q, i) => (
                        <li
                          key={i}
                          className="rounded-md bg-paper-2 p-3 text-sm italic text-ink-700"
                        >
                          “{q}”
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </ChartCard>
          );
        })}
      </div>
    </div>
  );
}
