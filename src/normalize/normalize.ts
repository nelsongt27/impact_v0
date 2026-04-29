import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import {
  normalizeTFResponse,
  normalizeTFSurvey,
  type TFFormDef,
  type TFFormIndexEntry,
  type TFResponse,
} from "./typeform.ts";
import {
  normalizeSMResponse,
  normalizeSMSurvey,
  type SMFile,
} from "./surveymonkey.ts";
import type {
  CanonicalResponse,
  CanonicalSurvey,
  NormalizationStats,
  Source,
  UnmatchedReport,
} from "./types.ts";

const ROOT = join(import.meta.dir, "..", "..");
const TF_FORMS_INDEX = join(ROOT, "data", "forms_index.json");
const TF_FORMS_DIR = join(ROOT, "data", "forms");
const TF_RESPONSES_DIR = join(ROOT, "data", "responses");
const SM_ROOT = join(ROOT, "2025_survey_monkey");
const OUT_DIR = join(ROOT, "data", "normalized");

async function ensureOutDir(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });
}

async function loadJsonl<T = unknown>(path: string): Promise<T[]> {
  let raw: string;
  try {
    raw = await readFile(path, "utf8");
  } catch {
    return [];
  }
  const out: T[] = [];
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    try {
      out.push(JSON.parse(t) as T);
    } catch {
      // skip malformed line
    }
  }
  return out;
}

async function loadJson<T = unknown>(path: string): Promise<T | null> {
  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function processTypeform(): Promise<{
  surveys: CanonicalSurvey[];
  responses: CanonicalResponse[];
}> {
  const index = (await loadJson<TFFormIndexEntry[]>(TF_FORMS_INDEX)) ?? [];
  const surveys: CanonicalSurvey[] = [];
  const responses: CanonicalResponse[] = [];

  for (const entry of index) {
    const formDef = await loadJson<TFFormDef>(join(TF_FORMS_DIR, `${entry.id}.json`));
    const respFile = join(TF_RESPONSES_DIR, `${entry.id}.jsonl`);
    const rawResponses = await loadJsonl<TFResponse>(respFile);

    const survey = normalizeTFSurvey(entry, formDef, rawResponses.length);
    surveys.push(survey);

    if (formDef && !survey.excluded) {
      for (const r of rawResponses) {
        responses.push(normalizeTFResponse(survey.id, formDef, r, survey.language));
      }
    }
  }

  return { surveys, responses };
}

async function processSurveyMonkey(): Promise<{
  surveys: CanonicalSurvey[];
  responses: CanonicalResponse[];
}> {
  const surveys: CanonicalSurvey[] = [];
  const responses: CanonicalResponse[] = [];

  const months = await readdir(SM_ROOT, { withFileTypes: true });
  for (const m of months) {
    if (!m.isDirectory()) continue;
    const monthDir = join(SM_ROOT, m.name);
    const files = await readdir(monthDir);
    for (const fname of files) {
      if (!fname.endsWith(".json")) continue;
      const path = join(monthDir, fname);
      const file = await loadJson<SMFile>(path);
      if (!file?.details) continue;

      const survey = normalizeSMSurvey(file);
      surveys.push(survey);

      if (!survey.excluded) {
        for (const r of file.responses ?? []) {
          responses.push(normalizeSMResponse(survey.id, file.details, r, survey.language));
        }
      }
    }
  }

  return { surveys, responses };
}

function buildStats(
  surveys: CanonicalSurvey[],
  responses: CanonicalResponse[],
): NormalizationStats {
  const bySource: Record<Source, { surveys: number; responses: number }> = {
    typeform: { surveys: 0, responses: 0 },
    surveymonkey: { surveys: 0, responses: 0 },
  };
  const byFamily: Record<string, { surveys: number; responses: number }> = {};
  const byClient: Record<string, { surveys: number; responses: number }> = {};
  const byProgram: Record<string, { surveys: number; responses: number }> = {};

  const responsesBySurvey = new Map<string, number>();
  for (const r of responses) {
    responsesBySurvey.set(r.survey_id, (responsesBySurvey.get(r.survey_id) ?? 0) + 1);
  }

  let templates = 0;
  let tests = 0;
  let excluded = 0;
  let noResponses = 0;
  let unmatchedClient = 0;
  let unmatchedProgram = 0;
  let unmatchedFamily = 0;

  for (const s of surveys) {
    const r = responsesBySurvey.get(s.id) ?? 0;
    bySource[s.source].surveys++;
    bySource[s.source].responses += r;

    const fkey = s.survey_family;
    byFamily[fkey] ??= { surveys: 0, responses: 0 };
    byFamily[fkey].surveys++;
    byFamily[fkey].responses += r;

    const ckey = s.client ?? "(unmatched)";
    byClient[ckey] ??= { surveys: 0, responses: 0 };
    byClient[ckey].surveys++;
    byClient[ckey].responses += r;

    const pkey = s.program ?? "(unmatched)";
    byProgram[pkey] ??= { surveys: 0, responses: 0 };
    byProgram[pkey].surveys++;
    byProgram[pkey].responses += r;

    if (s.is_template) templates++;
    if (s.is_test) tests++;
    if (s.excluded) excluded++;
    if (r === 0) noResponses++;
    if (!s.client && !s.is_test && !s.is_template) unmatchedClient++;
    if (!s.program && !s.is_test && !s.is_template) unmatchedProgram++;
    if (s.survey_family === "unknown" && !s.is_test) unmatchedFamily++;
  }

  return {
    generated_at: new Date().toISOString(),
    total_surveys: surveys.length,
    total_responses: responses.length,
    by_source: bySource,
    by_family: byFamily,
    by_client: byClient,
    by_program: byProgram,
    flagged: {
      templates,
      tests,
      excluded,
      no_responses: noResponses,
      unmatched_client: unmatchedClient,
      unmatched_program: unmatchedProgram,
      unmatched_family: unmatchedFamily,
    },
  };
}

function buildUnmatched(surveys: CanonicalSurvey[]): UnmatchedReport {
  const out: UnmatchedReport = {
    unmatched_client: [],
    unmatched_program: [],
    unmatched_family: [],
  };
  for (const s of surveys) {
    if (s.is_test || s.is_template) continue;
    if (!s.client) out.unmatched_client.push({ survey_id: s.id, title: s.title });
    if (!s.program) out.unmatched_program.push({ survey_id: s.id, title: s.title, client: s.client });
    if (s.survey_family === "unknown") out.unmatched_family.push({ survey_id: s.id, title: s.title });
  }
  return out;
}

async function main(): Promise<void> {
  await ensureOutDir();
  const startedAt = Date.now();

  console.log("▶ Normalizing Typeform…");
  const tf = await processTypeform();
  console.log(`  ✓ ${tf.surveys.length} surveys, ${tf.responses.length} responses`);

  console.log("▶ Normalizing SurveyMonkey…");
  const sm = await processSurveyMonkey();
  console.log(`  ✓ ${sm.surveys.length} surveys, ${sm.responses.length} responses`);

  const surveys = [...tf.surveys, ...sm.surveys];
  const responses = [...tf.responses, ...sm.responses];

  const stats = buildStats(surveys, responses);
  const unmatched = buildUnmatched(surveys);

  await writeFile(join(OUT_DIR, "surveys.json"), JSON.stringify(surveys, null, 2));
  await writeFile(join(OUT_DIR, "responses.json"), JSON.stringify(responses, null, 2));
  await writeFile(join(OUT_DIR, "stats.json"), JSON.stringify(stats, null, 2));
  await writeFile(join(OUT_DIR, "unmatched.json"), JSON.stringify(unmatched, null, 2));

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(2);
  console.log("");
  console.log("══════════════ NORMALIZATION SUMMARY ══════════════");
  console.log(`Total surveys:        ${stats.total_surveys}`);
  console.log(`Total responses:      ${stats.total_responses}`);
  console.log(`  Typeform:           ${stats.by_source.typeform.surveys} surveys, ${stats.by_source.typeform.responses} responses`);
  console.log(`  SurveyMonkey:       ${stats.by_source.surveymonkey.surveys} surveys, ${stats.by_source.surveymonkey.responses} responses`);
  console.log("");
  console.log(`Templates:            ${stats.flagged.templates}`);
  console.log(`Tests (placeholder):  ${stats.flagged.tests}`);
  console.log(`Excluded (AFNS Gym):  ${stats.flagged.excluded}`);
  console.log(`Surveys w/o responses: ${stats.flagged.no_responses}`);
  console.log(`Unmatched client:     ${stats.flagged.unmatched_client}`);
  console.log(`Unmatched program:    ${stats.flagged.unmatched_program}`);
  console.log(`Unmatched family:     ${stats.flagged.unmatched_family}`);
  console.log("");
  console.log(`Output: ${OUT_DIR}`);
  console.log(`Elapsed: ${elapsed}s`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
