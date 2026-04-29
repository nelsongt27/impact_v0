import type { CanonicalDimensions } from "./types.ts";
import { stripHtml } from "./mappings.ts";

// Each dimension matcher is an OR of regex tested against the question text
// (HTML-stripped, lowercased). Triple-language patterns (ES / EN / PT) where applicable.

export const DIMENSION_MATCHERS: Array<{ key: keyof CanonicalDimensions; pattern: RegExp }> = [
  // === Participant Reflection (5 dims) ===
  { key: "relevance", pattern: /\brelevant(e|s)?\b|\brelevance\b|relevant\s*to\s*my\s*current\s*leadership|relevante\s*para\s*mis?\s*desaf[íi]os?|relevante\s*para\s*mis?\s*aspiraciones?|relevante\s*para\s*mis?\s*aspirações?/i },
  { key: "engagement", pattern: /engaging\s*and\s*supported\s*my\s*learning|chapter\s*was\s*engaging|the\s*session\s*was\s*engaging|sesi[óo]n\s*fue\s*(atractiva|motivadora|interesante|enriquecedora)|fue\s*(atractiva|motivadora|interesante|enriquecedora)\s*y\s*apoy[óo]\s*mi\s*aprendizaje|interesante\/?\s*atractiva|enga(j|g)ante|sesi[óo]n\s*me\s*involucr[óo]|me\s*involucr[óo]\s*en\s*el\s*aprendizaje|sess[ãa]o\s*foi\s*(envolvente|interessante|enriquecedora)|enriquecedora\s*e\s*apoiou|qu[ée]\s*tan\s*satisfecho.*con\s*(la\s*sesi[óo]n|el\s*workshop|la\s*experiencia)|satisfacci[óo]n\s*con\s*la\s*sesi[óo]n|satisfecho\s*con\s*la\s*sesi[óo]n\s*recibida/i },
  { key: "facilitator_effectiveness", pattern: /facilitator\s*was\s*effective|facilitador(es|a|as)?\s*fue\s*(efectivo|eficaz)|facilitador(es|a|as)?\s*fueron\s*(efectivos|eficaces)|facilitador.*(efectivo|eficaz)\s*(en|al)\s*(entregar|transmitir|delivering)|facilitador.*claridad|facilitador.*(entregar|transmitir)\s*el\s*contenido|facilitator.*delivering\s*the\s*content|facilitador(a)?\s*foi\s*eficaz|qu[ée]\s*tan\s*satisfecho.*con\s*(el|la)\s*facilitador(a)?|satisfacci[óo]n\s*con\s*(el|la)\s*facilitador(a)?/i },
  { key: "applicability", pattern: /confident\s*in\s*my\s*ability\s*to\s*apply|aplicar\s*lo\s*aprendido|aplicar\s*lo\s*que\s*aprend[íi]|confianza\s*(en\s*mi\s*capacidad|para)\s*aplicar|me\s*siento\s*con\s*confianza\s*para\s*aplicar|siento\s*confianza\s*en\s*mi\s*capacidad\s*para\s*aplicar|confidence\s*to\s*apply|able\s*to\s*apply\s*what|confian[çc]a\s*(em\s*minha\s*capacidade|para)\s*aplicar/i },
  { key: "culture_fit", pattern: /consistent\s*with\s*the\s*values\s*and\s*culture|consistent\s*with\s*our\s*values|consistente\s*con\s*los\s*valores|consistente\s*con\s*la\s*cultura|coherente\s*con\s*(los\s*)?valores|coherente\s*con\s*la\s*cultura|valores\s*y\s*(la\s*)?cultura\s*que\s*(aspiramos|buscamos)|values\s*and\s*culture\s*we\s*strive|consistente\s*com\s*os\s*valores/i },

  // === Facilitator Debrief (5 dims) ===
  { key: "goal_achievement", pattern: /cumpli[óo]\s*con\s*sus\s*objetivos|achieve\s*its\s*goals|achieved\s*the\s*goals|met\s*its\s*goals|atingiu\s*os\s*objetivos|programa\s*achieve|sesi[óo]n\s*cumpl/i },
  { key: "connection", pattern: /nivel\s*de\s*conexi[óo]n|level\s*of\s*connection|conexi[óo]n\s*en\s*la\s*sala|connection\s*in\s*the\s*room|n[íi]vel\s*de\s*conex[ãa]o|rapport\b/i },
  { key: "participant_commitment", pattern: /nivel\s*de\s*compromiso\s*de\s*los\s*participantes|level\s*of\s*commitment|participant.*level\s*of\s*commitment|compromiso\s*de\s*los\s*participantes|n[íi]vel\s*de\s*comprometimento/i },
  { key: "self_effectiveness", pattern: /tu\s*efectividad\s*como\s*facilitador|your\s*effectiveness\s*as\s*facilitator|how\s*would\s*you\s*rate.*your\s*effectiveness|sua\s*efetividade\s*como\s*facilitador/i },
  { key: "logistics", pattern: /log[íi]stica\s*y\s*coordinaci[óo]n|logistics\s*and\s*coordination|programa\s*se\s*desarroll[óo]\s*sin\s*inconvenientes|program\s*ran\s*smoothly|log[íi]stica\s*e\s*coordena[çc][ãa]o/i },

  // === Coaching Reflection (Participant POV) ===
  { key: "progress_on_goals", pattern: /supported\s*my\s*progress\s*on\s*leadership\s*challenges|progreso\s*en\s*(mis\s*)?desaf[íi]os|sesi[óo]n\s*apoy[óo]\s*mi\s*progreso|progress\s*on\s*goals|progresso\s*nos\s*objetivos/i },
  { key: "coach_effectiveness", pattern: /coach\s*was\s*effective\s*in\s*guiding|mi\s*coach\s*fue\s*efectivo|coach\s*efectivo|coach.*me\s*gui[óo]\s*hacia|effective\s*in\s*guiding\s*me|effective\s*in\s*guiding|coach\s*foi\s*eficaz|qu[ée]\s*tan\s*satisfecho.*con\s*el\s*coach|satisfacci[óo]n\s*con\s*el\s*coach/i },
  { key: "communication_openness", pattern: /communication\s*with\s*my\s*coach|comunicaci[óo]n\s*con\s*mi\s*coach|openness\s*and\s*clarity|apertura\s*y\s*claridad|comunica[çc][ãa]o\s*com\s*meu\s*coach/i },
  { key: "safety", pattern: /safe\s*and\s*supported\s*to\s*share|seguro\s*y\s*apoyado\s*para\s*compartir|sentirme\s*seguro|safety\s*to\s*share|sinto\s*seguro/i },

  // === NPS ===
  { key: "nps", pattern: /how\s*likely\s*are\s*you\s*to\s*recommend|qu[ée]\s*tan\s*probable\s*es\s*que\s*recomiendes|qu[áa]n\s*probable\s*es|recomendarias|likely.*recommend.*colleague|recommend\s*to\s*other\s*teams|recomendar\s*esta?\s*programa|qual\s*a\s*probabilidade.*recomendar/i },
];

export interface QuestionContext {
  questionText: string; // already HTML-stripped
  score: number | null;
}

// Given a list of (questionText, score) pairs from one response,
// extract canonical dimensions by matching question text.
export function extractDimensions(items: QuestionContext[]): CanonicalDimensions {
  const out: CanonicalDimensions = {};

  for (const { questionText, score } of items) {
    if (score === null || score === undefined) continue;
    const text = stripHtml(questionText).toLowerCase().replace(/[*_~`]/g, " ");
    for (const matcher of DIMENSION_MATCHERS) {
      if (out[matcher.key] !== undefined) continue;
      if (matcher.pattern.test(text)) {
        out[matcher.key] = score;
        break;
      }
    }
  }

  return out;
}
