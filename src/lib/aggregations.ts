import type {
  CanonicalDimensions,
  CanonicalResponse,
  CanonicalSurvey,
} from "@/normalize/types.ts";

export type DimensionKey = keyof CanonicalDimensions;

export const PR_DIMENSIONS: DimensionKey[] = [
  "relevance",
  "engagement",
  "facilitator_effectiveness",
  "applicability",
  "culture_fit",
];

export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  relevance: "Relevance",
  engagement: "Engagement",
  facilitator_effectiveness: "Facilitator Effectiveness",
  applicability: "Applicability",
  culture_fit: "Culture Fit",
  goal_achievement: "Goal Achievement",
  connection: "Connection",
  participant_commitment: "Participant Commitment",
  self_effectiveness: "Self Effectiveness",
  logistics: "Logistics",
  progress_on_goals: "Progress on Goals",
  coach_effectiveness: "Coach Effectiveness",
  communication_openness: "Communication Openness",
  safety: "Safety",
  nps: "NPS",
};

export interface AvgResult {
  count: number;
  value: number | null;
}

export function avgDimension(
  responses: CanonicalResponse[],
  key: DimensionKey,
): AvgResult {
  let sum = 0;
  let n = 0;
  for (const r of responses) {
    const v = r.dimensions[key];
    if (typeof v === "number") {
      sum += v;
      n++;
    }
  }
  return { count: n, value: n === 0 ? null : sum / n };
}

export function avgAllDimensions(
  responses: CanonicalResponse[],
): Partial<Record<DimensionKey, AvgResult>> {
  const out: Partial<Record<DimensionKey, AvgResult>> = {};
  for (const key of [
    ...PR_DIMENSIONS,
    "goal_achievement",
    "connection",
    "participant_commitment",
    "self_effectiveness",
    "logistics",
    "progress_on_goals",
    "coach_effectiveness",
    "communication_openness",
    "safety",
    "nps",
  ] as DimensionKey[]) {
    out[key] = avgDimension(responses, key);
  }
  return out;
}

export interface GroupCount {
  key: string;
  surveys: number;
  responses: number;
}

export function groupBy(
  surveys: CanonicalSurvey[],
  responses: CanonicalResponse[],
  selector: (s: CanonicalSurvey) => string | null,
): GroupCount[] {
  const responsesBySurvey = new Map<string, number>();
  for (const r of responses) {
    responsesBySurvey.set(r.survey_id, (responsesBySurvey.get(r.survey_id) ?? 0) + 1);
  }
  const m = new Map<string, GroupCount>();
  for (const s of surveys) {
    const key = selector(s);
    if (!key) continue;
    let g = m.get(key);
    if (!g) {
      g = { key, surveys: 0, responses: 0 };
      m.set(key, g);
    }
    g.surveys++;
    g.responses += responsesBySurvey.get(s.id) ?? 0;
  }
  return [...m.values()].sort((a, b) => b.responses - a.responses);
}

export function sortSurveysByRecency<T extends CanonicalSurvey>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aDate = a.updated_at ?? a.created_at ?? "";
    const bDate = b.updated_at ?? b.created_at ?? "";
    return bDate.localeCompare(aDate);
  });
}

// Collect open-ended responses across surveys, indexed by question slug.
// Used by the Voice of Customer view.
export function collectOpenEndedByQuestion(
  responses: CanonicalResponse[],
): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const r of responses) {
    for (const [slug, value] of Object.entries(r.open_ended)) {
      if (!value || typeof value !== "string" || value.length < 5) continue;
      const arr = out.get(slug);
      if (arr) arr.push(value);
      else out.set(slug, [value]);
    }
  }
  return out;
}

// Slugs that map to canonical "themes" used by the Voice of Customer view.
// Each canonical theme aggregates several question variants (TF/SM, ES/EN/PT).
export const VOC_THEMES: Array<{
  key: "biggest_impact" | "improve" | "valuable_insight" | "business_outcomes";
  label: string;
  matchers: RegExp[];
}> = [
  {
    key: "biggest_impact",
    label: "Biggest impact",
    matchers: [
      /temas?\s*(?:o|y)?\s*herramientas?.*impacto/i,
      /which\s*topics?\s*or\s*tools?.*biggest\s*impact/i,
      /tools?.*biggest\s*impact.*thinking/i,
      /temas?\s*(?:o|y)?\s*ferramentas?.*impacto/i,
    ],
  },
  {
    key: "improve",
    label: "What would improve",
    matchers: [
      /qué\s*mejorar[íi]a/i,
      /what\s*would\s*improve/i,
      /qué\s*cambiar[íi]as?\s*o\s*agregar[íi]as?/i,
      /o\s*que\s*melhoraria/i,
      /how\s*could.*improve/i,
    ],
  },
  {
    key: "valuable_insight",
    label: "Most valuable insight",
    matchers: [
      /m[áa]s\s*valios[ao]/i,
      /most\s*valuable\s*insight/i,
      /qué\s*valoraste/i,
      /takeaway/i,
      /m[áa]s\s*importante.*aprend/i,
      /mais\s*valios/i,
    ],
  },
  {
    key: "business_outcomes",
    label: "Business outcomes",
    matchers: [
      /business\s*outcomes/i,
      /resultados?\s*de\s*negocio/i,
      /tangible\s*impact/i,
      /impacto\s*tangible/i,
    ],
  },
];

export function classifyQuestionSlug(
  slug: string,
): typeof VOC_THEMES[number]["key"] | null {
  // Slugs are underscore-joined; matchers are written as prose, so convert.
  const prose = slug.replace(/_/g, " ");
  for (const theme of VOC_THEMES) {
    for (const m of theme.matchers) {
      if (m.test(prose)) return theme.key;
    }
  }
  return null;
}

// Extract tools/concepts from response open_ended fields.
// Two POVs: coach (from coaching_process surveys) and participant (from
// participant_reflection surveys answering "biggest impact" topics).
export function extractToolTexts(
  surveys: CanonicalSurvey[],
  responses: CanonicalResponse[],
  pov: "coach" | "participant",
): string[] {
  const surveysById = new Map(surveys.map((s) => [s.id, s]));
  const targetFamily =
    pov === "coach" ? "coaching_process" : "participant_reflection";

  const slugMatcher =
    pov === "coach"
      ? /herramientas?\s*y\s*conceptos|main\s*tools.*concepts\s*applied|principales\s*herramientas|ferramentas?\s*e?\s*conceitos/i
      : /temas?\s*(?:o|y)?\s*herramientas?.*impacto|topics?\s*or\s*tools?.*biggest\s*impact|tools?.*biggest\s*impact.*thinking/i;

  const out: string[] = [];
  for (const r of responses) {
    const survey = surveysById.get(r.survey_id);
    if (!survey || survey.survey_family !== targetFamily) continue;
    for (const [slug, value] of Object.entries(r.open_ended)) {
      if (!value || typeof value !== "string") continue;
      // Slugs use underscores; convert to spaces so the prose-style regex matches.
      if (slugMatcher.test(slug.replace(/_/g, " "))) {
        out.push(value);
      }
    }
  }
  return out;
}

export interface CoachStats {
  name: string;
  sessions: number;
  responses: number;
  selfRatedConnection: { sum: number; count: number };
  selfRatedEngagement: { sum: number; count: number };
}

export function buildCoachStats(
  surveys: CanonicalSurvey[],
  responses: CanonicalResponse[],
): CoachStats[] {
  const byCoach = new Map<string, CoachStats>();
  const surveysById = new Map(surveys.map((s) => [s.id, s]));

  for (const s of surveys) {
    if (!s.coach || s.survey_family !== "coaching_process") continue;
    let row = byCoach.get(s.coach);
    if (!row) {
      row = {
        name: s.coach,
        sessions: 0,
        responses: 0,
        selfRatedConnection: { sum: 0, count: 0 },
        selfRatedEngagement: { sum: 0, count: 0 },
      };
      byCoach.set(s.coach, row);
    }
    row.sessions++;
  }

  for (const r of responses) {
    const survey = surveysById.get(r.survey_id);
    if (!survey?.coach || survey.survey_family !== "coaching_process") continue;
    const row = byCoach.get(survey.coach);
    if (!row) continue;
    row.responses++;
    const conn = r.dimensions.connection;
    if (typeof conn === "number") {
      row.selfRatedConnection.sum += conn;
      row.selfRatedConnection.count++;
    }
    const eng = r.dimensions.participant_commitment;
    if (typeof eng === "number") {
      row.selfRatedEngagement.sum += eng;
      row.selfRatedEngagement.count++;
    }
  }

  return [...byCoach.values()].sort((a, b) => b.sessions - a.sessions);
}

export interface CoacheeStats {
  name: string;
  client: string | null;
  surveys: number;
  responses: number;
  progressOnGoals: { sum: number; count: number };
  coachEffectiveness: { sum: number; count: number };
  safety: { sum: number; count: number };
}

export interface CoachingByClientRow {
  client: string;
  surveys: number;
  responses: number;
  coachEffectiveness: { sum: number; count: number };
  progressOnGoals: { sum: number; count: number };
  safety: { sum: number; count: number };
  connection: { sum: number; count: number };
}

export function buildCoachingByClient(
  surveys: CanonicalSurvey[],
  responses: CanonicalResponse[],
): CoachingByClientRow[] {
  const surveysById = new Map(surveys.map((s) => [s.id, s]));
  const out = new Map<string, CoachingByClientRow>();

  const isCoachingFamily = (s: CanonicalSurvey): boolean =>
    s.survey_family === "coaching_reflection" ||
    s.survey_family === "coaching_process" ||
    s.survey_family === "coach_selection";

  for (const s of surveys) {
    if (!s.client || !isCoachingFamily(s)) continue;
    let row = out.get(s.client);
    if (!row) {
      row = {
        client: s.client,
        surveys: 0,
        responses: 0,
        coachEffectiveness: { sum: 0, count: 0 },
        progressOnGoals: { sum: 0, count: 0 },
        safety: { sum: 0, count: 0 },
        connection: { sum: 0, count: 0 },
      };
      out.set(s.client, row);
    }
    row.surveys++;
  }

  for (const r of responses) {
    const s = surveysById.get(r.survey_id);
    if (!s?.client || !isCoachingFamily(s)) continue;
    const row = out.get(s.client);
    if (!row) continue;
    row.responses++;
    const ce = r.dimensions.coach_effectiveness;
    if (typeof ce === "number") {
      row.coachEffectiveness.sum += ce;
      row.coachEffectiveness.count++;
    }
    const p = r.dimensions.progress_on_goals;
    if (typeof p === "number") {
      row.progressOnGoals.sum += p;
      row.progressOnGoals.count++;
    }
    const sf = r.dimensions.safety;
    if (typeof sf === "number") {
      row.safety.sum += sf;
      row.safety.count++;
    }
    const conn = r.dimensions.connection;
    if (typeof conn === "number") {
      row.connection.sum += conn;
      row.connection.count++;
    }
  }

  return [...out.values()].sort((a, b) => b.responses - a.responses);
}

export function buildCoacheeStats(
  surveys: CanonicalSurvey[],
  responses: CanonicalResponse[],
): CoacheeStats[] {
  const byCoachee = new Map<string, CoacheeStats>();
  const surveysById = new Map(surveys.map((s) => [s.id, s]));

  for (const s of surveys) {
    if (!s.coachee) continue;
    let row = byCoachee.get(s.coachee);
    if (!row) {
      row = {
        name: s.coachee,
        client: s.client,
        surveys: 0,
        responses: 0,
        progressOnGoals: { sum: 0, count: 0 },
        coachEffectiveness: { sum: 0, count: 0 },
        safety: { sum: 0, count: 0 },
      };
      byCoachee.set(s.coachee, row);
    }
    row.surveys++;
  }

  for (const r of responses) {
    const survey = surveysById.get(r.survey_id);
    if (!survey?.coachee) continue;
    const row = byCoachee.get(survey.coachee);
    if (!row) continue;
    row.responses++;
    const p = r.dimensions.progress_on_goals;
    if (typeof p === "number") {
      row.progressOnGoals.sum += p;
      row.progressOnGoals.count++;
    }
    const ce = r.dimensions.coach_effectiveness;
    if (typeof ce === "number") {
      row.coachEffectiveness.sum += ce;
      row.coachEffectiveness.count++;
    }
    const sf = r.dimensions.safety;
    if (typeof sf === "number") {
      row.safety.sum += sf;
      row.safety.count++;
    }
  }

  return [...byCoachee.values()].sort((a, b) => b.responses - a.responses);
}

export interface MonthlyPoint {
  month: string;
  values: Partial<Record<DimensionKey, number>>;
  count: number;
}

export function monthlyDimensionTrend(
  responses: CanonicalResponse[],
  keys: DimensionKey[] = PR_DIMENSIONS,
): MonthlyPoint[] {
  type Bucket = {
    sums: Map<DimensionKey, number>;
    counts: Map<DimensionKey, number>;
    total: number;
  };
  const months = new Map<string, Bucket>();
  for (const r of responses) {
    if (!r.submitted_at) continue;
    const month = r.submitted_at.slice(0, 7);
    let b = months.get(month);
    if (!b) {
      b = { sums: new Map(), counts: new Map(), total: 0 };
      months.set(month, b);
    }
    b.total++;
    for (const k of keys) {
      const v = r.dimensions[k];
      if (typeof v === "number") {
        b.sums.set(k, (b.sums.get(k) ?? 0) + v);
        b.counts.set(k, (b.counts.get(k) ?? 0) + 1);
      }
    }
  }
  const points: MonthlyPoint[] = [];
  for (const [month, b] of months) {
    const values: Partial<Record<DimensionKey, number>> = {};
    for (const k of keys) {
      const c = b.counts.get(k) ?? 0;
      const s = b.sums.get(k) ?? 0;
      if (c > 0) values[k] = s / c;
    }
    points.push({ month, values, count: b.total });
  }
  points.sort((a, b) => a.month.localeCompare(b.month));
  return points;
}

export function topOpenEnded(
  responses: CanonicalResponse[],
  limit = 8,
): Array<{ slug: string; sample: string; count: number }> {
  const buckets = new Map<string, { samples: string[]; count: number }>();
  for (const r of responses) {
    for (const [slug, value] of Object.entries(r.open_ended)) {
      if (!value || value.length < 8) continue;
      let b = buckets.get(slug);
      if (!b) {
        b = { samples: [], count: 0 };
        buckets.set(slug, b);
      }
      b.count++;
      if (b.samples.length < 3) b.samples.push(value);
    }
  }
  return [...buckets.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([slug, b]) => ({ slug, count: b.count, sample: b.samples[0] ?? "" }));
}
