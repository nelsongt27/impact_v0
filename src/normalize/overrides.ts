import type {
  CanonicalSurvey,
  OverridesFile,
  SurveyOverride,
} from "./types.ts";

// Apply manual overrides on top of the auto-classified survey, field by
// field. Returns a new survey object — does not mutate input.
export function applyOverride(
  survey: CanonicalSurvey,
  override: SurveyOverride | undefined,
): CanonicalSurvey {
  if (!override) return survey;
  return {
    ...survey,
    client: override.client !== undefined ? override.client : survey.client,
    program: override.program !== undefined ? override.program : survey.program,
    survey_family: override.survey_family ?? survey.survey_family,
    country: override.country !== undefined ? override.country : survey.country,
    language: override.language !== undefined ? override.language : survey.language,
    override_applied: true,
  };
}

export function applyAllOverrides(
  surveys: CanonicalSurvey[],
  overrides: OverridesFile | null,
): CanonicalSurvey[] {
  if (!overrides) return surveys;
  return surveys.map((s) => applyOverride(s, overrides.surveys[s.id]));
}
