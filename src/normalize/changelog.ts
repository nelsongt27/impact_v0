import type {
  CanonicalSurvey,
  Changelog,
  ChangelogEntry,
  ChangelogUnmapped,
  ChangelogUpdated,
} from "./types.ts";

interface PreviousSnapshot {
  surveys: CanonicalSurvey[];
  generated_at: string | null;
}

export function buildChangelog(
  prev: PreviousSnapshot,
  current: CanonicalSurvey[],
): Changelog {
  const prevById = new Map(prev.surveys.map((s) => [s.id, s]));

  const new_forms: ChangelogEntry[] = [];
  const updated_forms: ChangelogUpdated[] = [];
  const unmapped_forms: ChangelogUnmapped[] = [];

  for (const s of current) {
    if (s.is_template || s.is_test || s.excluded) continue;

    const previous = prevById.get(s.id);
    if (!previous) {
      new_forms.push({ id: s.id, title: s.title, source: s.source });
    } else if (s.response_count > previous.response_count) {
      updated_forms.push({
        id: s.id,
        title: s.title,
        source: s.source,
        previous_response_count: previous.response_count,
        current_response_count: s.response_count,
        delta: s.response_count - previous.response_count,
      });
    }

    const missing: ChangelogUnmapped["missing"] = [];
    if (!s.client) missing.push("client");
    if (!s.program) missing.push("program");
    if (s.survey_family === "unknown") missing.push("survey_family");
    if (missing.length > 0) {
      unmapped_forms.push({
        id: s.id,
        title: s.title,
        source: s.source,
        missing,
      });
    }
  }

  // Order: highest delta first for updates, alphabetical for unmapped.
  updated_forms.sort((a, b) => b.delta - a.delta);
  unmapped_forms.sort((a, b) => a.title.localeCompare(b.title));

  return {
    generated_at: new Date().toISOString(),
    previous_run_at: prev.generated_at,
    new_forms,
    updated_forms,
    unmapped_forms,
  };
}
