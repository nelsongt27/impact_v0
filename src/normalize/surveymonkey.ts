import { likertLabelToScore, makeSlug, stripHtml } from "./mappings.ts";
import { extractDimensions, type QuestionContext } from "./dimensions.ts";
import { classifyTitle } from "./classify.ts";
import { extractTitleRoles } from "./extractors.ts";
import type {
  CanonicalResponse,
  CanonicalSurvey,
} from "./types.ts";

interface SMQuestionAnswer {
  rows?: Array<{ id: string; text?: string; position?: number }>;
  choices?: Array<{ id: string; text?: string; weight?: string | number; position?: number }>;
  other?: { id: string; text?: string };
}

interface SMQuestion {
  id: string;
  family: string;
  subtype: string;
  headings?: Array<{ heading: string }>;
  answers?: SMQuestionAnswer;
}

interface SMPage {
  id: string;
  questions: SMQuestion[];
}

interface SMDetails {
  id: string;
  title: string;
  language?: string;
  date_created?: string;
  date_modified?: string;
  question_count?: number;
  pages?: SMPage[];
}

interface SMResponseAnswer {
  choice_id?: string;
  row_id?: string;
  text?: string;
  other_id?: string;
  choice_metadata?: { weight?: string | number };
}

interface SMResponseQuestion {
  id: string;
  answers?: SMResponseAnswer[];
}

interface SMResponsePage {
  id: string;
  questions?: SMResponseQuestion[];
}

interface SMResponse {
  id: string;
  date_modified?: string;
  date_created?: string;
  total_time?: number;
  language?: string;
  pages?: SMResponsePage[];
}

export interface SMFile {
  _backup_metadata?: { survey_id?: string; title?: string };
  details: SMDetails;
  responses: SMResponse[];
}

export function normalizeSMSurvey(file: SMFile): CanonicalSurvey {
  const d = file.details;
  const cls = classifyTitle(d.title, d.language);
  const roles = extractTitleRoles(d.title);

  return {
    id: `sm:${d.id}`,
    source: "surveymonkey",
    source_id: d.id,
    title: d.title,
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
    created_at: d.date_created ?? null,
    updated_at: d.date_modified ?? null,
    response_count: file.responses.length,
    question_count: d.question_count ?? countQuestions(d),
    override_applied: false,
  };
}

export function normalizeSMResponse(
  surveyId: string,
  details: SMDetails,
  raw: SMResponse,
  surveyLanguage: string | null,
): CanonicalResponse {
  const questionsById = indexQuestions(details);
  const items: QuestionContext[] = [];
  const open: Record<string, string> = {};
  let nps: number | null = null;

  for (const page of raw.pages ?? []) {
    for (const q of page.questions ?? []) {
      const def = questionsById.get(q.id);
      if (!def) continue;
      const qText = def.headings?.[0]?.heading ?? "";

      for (const ans of q.answers ?? []) {
        if (def.family === "matrix" && def.subtype === "rating" && ans.choice_metadata?.weight !== undefined) {
          const score = Number(ans.choice_metadata.weight);
          if (!Number.isNaN(score)) {
            items.push({ questionText: qText, score });
          }
          continue;
        }

        if (def.family === "single_choice" && ans.choice_id) {
          const choice = def.answers?.choices?.find((c) => c.id === ans.choice_id);
          if (choice) {
            // SM Likert questions almost never set `weight` — they store the
            // ordering implicitly in choice text ("Strongly agree" → 5, etc.).
            // Try numeric weight first, then label-based scoring, then fall back.
            const w =
              choice.weight !== undefined && choice.weight !== null
                ? Number(choice.weight)
                : null;
            if (w !== null && !Number.isNaN(w) && w !== 0) {
              items.push({ questionText: qText, score: w });
            } else if (choice.text) {
              const stripped = stripHtml(choice.text);
              const labelScore = likertLabelToScore(stripped);
              if (labelScore !== null && labelScore >= 1 && labelScore <= 5) {
                items.push({ questionText: qText, score: labelScore });
              } else {
                const num = Number(stripped);
                if (!Number.isNaN(num) && num >= 0 && num <= 10 && /recommend|recomendar/i.test(qText)) {
                  nps = num;
                } else {
                  open[makeSlug(qText)] = stripped;
                }
              }
            }
          }
          continue;
        }

        // open_ended/single with a numeric answer is a rating question disguised as
        // a short-answer field — common pattern in older SM forms (e.g. "5" / "8").
        if (def.family === "open_ended" && ans.text) {
          const stripped = stripHtml(ans.text);
          if (def.subtype === "single") {
            const num = Number(stripped);
            if (!Number.isNaN(num) && num >= 0 && num <= 10) {
              items.push({ questionText: qText, score: num });
              continue;
            }
          }
          open[makeSlug(qText)] = stripped;
          continue;
        }

        if (def.family === "demographic" && ans.text) {
          open[makeSlug(qText)] = stripHtml(ans.text);
          continue;
        }

        if (def.family === "multiple_choice" && ans.choice_id) {
          const choice = def.answers?.choices?.find((c) => c.id === ans.choice_id);
          if (choice?.text) {
            const slug = makeSlug(qText);
            const prev = open[slug] ?? "";
            open[slug] = prev ? `${prev} | ${stripHtml(choice.text)}` : stripHtml(choice.text);
          }
          continue;
        }

        if (ans.text) {
          open[makeSlug(qText)] = stripHtml(ans.text);
        }
      }
    }
  }

  const dimensions = extractDimensions(items);
  if (nps !== null) dimensions.nps = nps;

  return {
    id: `${surveyId}:${raw.id}`,
    survey_id: surveyId,
    source: "surveymonkey",
    source_response_id: raw.id,
    submitted_at: raw.date_modified ?? raw.date_created ?? null,
    total_time_seconds: typeof raw.total_time === "number" ? raw.total_time : null,
    language: raw.language ?? surveyLanguage,
    dimensions,
    open_ended: open,
  };
}

function indexQuestions(details: SMDetails): Map<string, SMQuestion> {
  const out = new Map<string, SMQuestion>();
  for (const page of details.pages ?? []) {
    for (const q of page.questions ?? []) {
      out.set(q.id, q);
    }
  }
  return out;
}

function countQuestions(details: SMDetails): number {
  let n = 0;
  for (const page of details.pages ?? []) {
    n += page.questions?.length ?? 0;
  }
  return n;
}

