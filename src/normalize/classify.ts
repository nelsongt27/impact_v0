import {
  CLIENT_PATTERNS,
  COUNTRY_PATTERNS,
  EXCLUDED_PATTERNS,
  FAMILY_PATTERNS,
  PROGRAM_PATTERNS,
  TEMPLATE_PATTERNS,
  TEST_PATTERNS,
  stripHtml,
} from "./mappings.ts";
import type { SurveyFamily } from "./types.ts";

export interface Classification {
  family: SurveyFamily;
  client: string | null;
  program: string | null;
  country: string | null;
  language: "es" | "en" | "pt" | null;
  is_template: boolean;
  is_test: boolean;
  excluded: boolean;
  excluded_reason: string | null;
}

export function classifyTitle(rawTitle: string, hintLanguage?: string | null): Classification {
  const title = stripHtml(rawTitle);

  // Excluded
  for (const e of EXCLUDED_PATTERNS) {
    if (e.pattern.test(title)) {
      return baseClassification(title, hintLanguage, {
        excluded: true,
        excluded_reason: e.reason,
      });
    }
  }

  return baseClassification(title, hintLanguage, {
    excluded: false,
    excluded_reason: null,
  });
}

function baseClassification(
  title: string,
  hintLanguage: string | null | undefined,
  flags: { excluded: boolean; excluded_reason: string | null },
): Classification {
  const is_test = TEST_PATTERNS.some((p) => p.test(title));
  const is_template = TEMPLATE_PATTERNS.some((p) => p.test(title));

  let family: SurveyFamily = "unknown";
  for (const rule of FAMILY_PATTERNS) {
    if (rule.pattern.test(title)) {
      family = rule.value;
      break;
    }
  }

  let program: string | null = null;
  let client: string | null = null;
  for (const rule of PROGRAM_PATTERNS) {
    if (rule.pattern.test(title)) {
      program = rule.program;
      client = rule.client;
      break;
    }
  }

  if (!client) {
    for (const rule of CLIENT_PATTERNS) {
      if (rule.pattern.test(title)) {
        client = rule.value;
        break;
      }
    }
  }

  let country: string | null = null;
  for (const rule of COUNTRY_PATTERNS) {
    if (rule.pattern.test(title)) {
      country = rule.value;
      break;
    }
  }

  return {
    family,
    client,
    program,
    country,
    language: detectLanguage(title, hintLanguage),
    is_template,
    is_test,
    excluded: flags.excluded,
    excluded_reason: flags.excluded_reason,
  };
}

function detectLanguage(title: string, hint?: string | null): "es" | "en" | "pt" | null {
  if (hint) {
    const h = hint.toLowerCase();
    if (h.startsWith("es")) return "es";
    if (h.startsWith("en")) return "en";
    if (h.startsWith("pt")) return "pt";
  }
  // Heuristic on title
  if (/portugu[êe]s|pesquisa|reflex[ãa]o|onde\s*estamos|^facilita[çc][ãa]o|potencializando|conversas\s*desafiadoras|sess[õo]es?/i.test(title)) {
    return "pt";
  }
  if (/encuesta|reflexi[óo]n|d[óo]nde\s*estamos|sesi[óo]n|facilitaci[óo]n|c[óo]mo|qu[ée]|los?|las?|del?|y\b|en\s/i.test(title)) {
    return "es";
  }
  if (/survey|reflection|workshop|coaching|feedback|the\s|for\s|of\s|and\s/i.test(title)) {
    return "en";
  }
  return null;
}
