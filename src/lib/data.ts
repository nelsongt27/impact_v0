import surveysData from "@data/normalized/surveys.json";
import responsesData from "@data/normalized/responses.json";
import statsData from "@data/normalized/stats.json";

import type {
  CanonicalResponse,
  CanonicalSurvey,
  NormalizationStats,
} from "@/normalize/types.ts";

export const surveys: CanonicalSurvey[] = surveysData as CanonicalSurvey[];
export const responses: CanonicalResponse[] = responsesData as CanonicalResponse[];
export const stats: NormalizationStats = statsData as NormalizationStats;

// Quick indexes for fast lookups in views.
export const surveysById = new Map(surveys.map((s) => [s.id, s]));

export const responsesBySurveyId = ((): Map<string, CanonicalResponse[]> => {
  const m = new Map<string, CanonicalResponse[]>();
  for (const r of responses) {
    const arr = m.get(r.survey_id);
    if (arr) arr.push(r);
    else m.set(r.survey_id, [r]);
  }
  return m;
})();

// All surveys eligible for analytics (excluded surveys / templates removed).
export const activeSurveys: CanonicalSurvey[] = surveys.filter(
  (s) => !s.excluded && !s.is_template && !s.is_test,
);

export const activeSurveyIds = new Set(activeSurveys.map((s) => s.id));

export const activeResponses: CanonicalResponse[] = responses.filter((r) =>
  activeSurveyIds.has(r.survey_id),
);
