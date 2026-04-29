import { likertLabelToScore, makeSlug } from "./mappings.ts";
import { extractDimensions, type QuestionContext } from "./dimensions.ts";
import { classifyTitle } from "./classify.ts";
import { extractTitleRoles } from "./extractors.ts";
import type {
  CanonicalResponse,
  CanonicalSurvey,
} from "./types.ts";

interface TFField {
  id: string;
  ref: string;
  type: string;
  title: string;
  properties?: { fields?: TFField[]; choices?: { label: string }[] };
}

export interface TFFormDef {
  id: string;
  title: string;
  fields: TFField[];
  settings?: { language?: string };
}

interface TFAnswer {
  type: string;
  field: { id: string; type: string; ref: string };
  choice?: { label?: string; ref?: string };
  choices?: { labels?: string[] };
  number?: number;
  text?: string;
  email?: string;
  boolean?: boolean;
  date?: string;
}

export interface TFResponse {
  response_id?: string;
  token: string;
  landed_at?: string;
  submitted_at?: string;
  answers?: TFAnswer[];
}

export interface TFFormIndexEntry {
  id: string;
  title: string;
  type: string;
  created_at: string;
  last_updated_at: string;
}

// Flatten group-nested fields into a single map field_id → field.
function flattenFields(fields: TFField[]): Map<string, TFField> {
  const out = new Map<string, TFField>();
  function walk(f: TFField) {
    if (f.id) out.set(f.id, f);
    if (f.properties?.fields) {
      for (const sub of f.properties.fields) walk(sub);
    }
  }
  for (const f of fields) walk(f);
  return out;
}

export function normalizeTFSurvey(
  index: TFFormIndexEntry,
  formDef: TFFormDef | null,
  responseCount: number,
): CanonicalSurvey {
  const cls = classifyTitle(index.title, formDef?.settings?.language);
  const roles = extractTitleRoles(index.title);
  const questionCount = formDef ? flattenFields(formDef.fields).size : 0;

  return {
    id: `tf:${index.id}`,
    source: "typeform",
    source_id: index.id,
    title: index.title,
    survey_family: cls.family,
    client: cls.client,
    program: cls.program,
    facilitator: roles.facilitator,
    coach: roles.coach,
    coachee: roles.coachee,
    country: cls.country,
    language: cls.language,
    is_template: cls.is_template,
    is_test: cls.is_test,
    excluded: cls.excluded,
    excluded_reason: cls.excluded_reason,
    created_at: index.created_at ?? null,
    updated_at: index.last_updated_at ?? null,
    response_count: responseCount,
    question_count: questionCount,
  };
}

export function normalizeTFResponse(
  surveyId: string,
  formDef: TFFormDef,
  raw: TFResponse,
  language: string | null,
): CanonicalResponse {
  const fieldsById = flattenFields(formDef.fields);
  const items: QuestionContext[] = [];
  const open: Record<string, string> = {};
  let nps: number | null = null;

  for (const a of raw.answers ?? []) {
    const field = fieldsById.get(a.field.id);
    if (!field) continue;
    const qText = field.title ?? "";

    if (a.type === "text" && (a.text || a.email)) {
      const slug = makeSlug(qText);
      if (a.text) open[slug] = a.text;
      else if (a.email) open[slug] = a.email;
      continue;
    }
    if (a.type === "email" && a.email) {
      open[makeSlug(qText)] = a.email;
      continue;
    }

    if (a.type === "number" && typeof a.number === "number") {
      if (/recommend|recomendar|recomendarias/i.test(qText) && a.number >= 0 && a.number <= 10) {
        nps = a.number;
      } else {
        items.push({ questionText: qText, score: a.number });
      }
      continue;
    }

    if (a.type === "choice" && a.choice?.label) {
      const score = likertLabelToScore(a.choice.label);
      if (score !== null) {
        items.push({ questionText: qText, score });
      } else {
        open[makeSlug(qText)] = a.choice.label;
      }
      continue;
    }

    if (a.type === "choices" && a.choices?.labels?.length) {
      open[makeSlug(qText)] = a.choices.labels.join(" | ");
    }
  }

  const dimensions = extractDimensions(items);
  if (nps !== null) dimensions.nps = nps;

  const responseId = raw.response_id ?? raw.token;
  return {
    id: `${surveyId}:${responseId}`,
    survey_id: surveyId,
    source: "typeform",
    source_response_id: responseId,
    submitted_at: raw.submitted_at ?? raw.landed_at ?? null,
    total_time_seconds: null,
    language,
    dimensions,
    open_ended: open,
  };
}

