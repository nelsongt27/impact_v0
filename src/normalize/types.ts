export type Source = "typeform" | "surveymonkey";

export type SurveyFamily =
  | "participant_reflection"
  | "facilitator_debrief"
  | "coaching_reflection"
  | "coaching_process"
  | "coach_selection"
  | "team_diagnostic"
  | "pulse_check"
  | "impact_roi"
  | "client_needs"
  | "prework"
  | "internal_clients_perception"
  | "remesh_feedback"
  | "afns_gym"
  | "unknown";

export interface CanonicalSurvey {
  id: string;
  source: Source;
  source_id: string;
  title: string;
  survey_family: SurveyFamily;
  client: string | null;
  program: string | null;
  facilitator: string | null;
  coach: string | null;
  coachee: string | null;
  country: string | null;
  language: "es" | "en" | "pt" | null;
  is_template: boolean;
  is_test: boolean;
  excluded: boolean;
  excluded_reason: string | null;
  created_at: string | null;
  updated_at: string | null;
  response_count: number;
  question_count: number;
  override_applied: boolean;
}

export interface SurveyOverride {
  client?: string | null;
  program?: string | null;
  survey_family?: SurveyFamily;
  country?: string | null;
  language?: "es" | "en" | "pt" | null;
}

export interface OverridesFile {
  version: number;
  updated_at: string;
  surveys: Record<string, SurveyOverride>;
}

export interface ChangelogEntry {
  id: string;
  title: string;
  source: Source;
}

export interface ChangelogUpdated extends ChangelogEntry {
  previous_response_count: number;
  current_response_count: number;
  delta: number;
}

export interface ChangelogUnmapped extends ChangelogEntry {
  missing: Array<"client" | "program" | "survey_family">;
}

export interface Changelog {
  generated_at: string;
  previous_run_at: string | null;
  new_forms: ChangelogEntry[];
  updated_forms: ChangelogUpdated[];
  unmapped_forms: ChangelogUnmapped[];
}

export interface CanonicalDimensions {
  // Participant Reflection (5 dimensions)
  relevance?: number;
  engagement?: number;
  facilitator_effectiveness?: number;
  applicability?: number;
  culture_fit?: number;
  // Facilitator Debrief
  goal_achievement?: number;
  connection?: number;
  participant_commitment?: number;
  self_effectiveness?: number;
  logistics?: number;
  // Coaching Reflection (participant POV)
  progress_on_goals?: number;
  coach_effectiveness?: number;
  communication_openness?: number;
  safety?: number;
  // NPS-style
  nps?: number;
}

export interface CanonicalResponse {
  id: string;
  survey_id: string;
  source: Source;
  source_response_id: string;
  submitted_at: string | null;
  total_time_seconds: number | null;
  language: string | null;
  dimensions: CanonicalDimensions;
  open_ended: Record<string, string>;
}

export interface NormalizationStats {
  generated_at: string;
  total_surveys: number;
  total_responses: number;
  by_source: Record<Source, { surveys: number; responses: number }>;
  by_family: Record<string, { surveys: number; responses: number }>;
  by_client: Record<string, { surveys: number; responses: number }>;
  by_program: Record<string, { surveys: number; responses: number }>;
  flagged: {
    templates: number;
    tests: number;
    excluded: number;
    no_responses: number;
    unmatched_client: number;
    unmatched_program: number;
    unmatched_family: number;
  };
}

export interface UnmatchedReport {
  unmatched_client: Array<{ survey_id: string; title: string }>;
  unmatched_program: Array<{ survey_id: string; title: string; client: string | null }>;
  unmatched_family: Array<{ survey_id: string; title: string }>;
}
