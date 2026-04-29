import type { SurveyFamily } from "./types.ts";

export interface PatternRule<T> {
  pattern: RegExp;
  value: T;
}

// All matching is done on lowercased + HTML-stripped title.
// Order matters: first match wins.

export const EXCLUDED_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /afns?\s*gym|gym\s*satisfaction|afns?\s*gym\s*program/i, reason: "AFNS Gym (Axialent internal — excluded per scope)" },
  { pattern: /^mi\s*nuevo\s*formulario|^my\s*new\s*form/i, reason: "Test form (placeholder)" },
];

export const TEST_PATTERNS: RegExp[] = [
  /^mi\s*nuevo\s*formulario/i,
  /^my\s*new\s*form/i,
];

export const TEMPLATE_PATTERNS: RegExp[] = [
  /^template[\s_-]/i,
  /\btemplate\b.*aug2025/i,
  /^TEMPLATE_/,
  /\bsolo\s+self\s*led\b/i,
  /\bplatform\s*only\b/i,
];

// Family detection — order matters (more specific first).
export const FAMILY_PATTERNS: Array<PatternRule<SurveyFamily>> = [
  { pattern: /afns?\s*gym|gym\s*satisfaction/i, value: "afns_gym" },
  { pattern: /coach\s*selection|coach\s*satisfaction/i, value: "coach_selection" },
  { pattern: /coaching\s*process\s*tracking|registro\s*proceso\s*de\s*coaching/i, value: "coaching_process" },
  { pattern: /coaching\s*reflection|reflexi[óo]n\s*sesiones?\s*de\s*coaching|encuesta\s*de\s*reflexi[óo]n\s*sesi[óo]n\s*de\s*coaching|reflex[ãa]o\s*sess[õo]es?\s*de\s*coaching|sesi[óo]n\s*grupal\s*de\s*coaching/i, value: "coaching_reflection" },
  { pattern: /facilitator\s*debrief|debrief\s*facilitador|encuesta\s*facilitador|encuesta\s*debrief/i, value: "facilitator_debrief" },
  { pattern: /post\s*program\s*impact|impact.*roi.*check[\s-]*in|avalia[çc][ãa]o\s*de\s*impacto/i, value: "impact_roi" },
  { pattern: /client\s*needs\s*analysis|needs.*impact\s*design/i, value: "client_needs" },
  { pattern: /lencioni|d[óo]nde\s*estamos\s*como\s*equipo|onde\s*estamos\s*como\s*equipe|formulario\s*check\s*in|equipo\s*de\s*cultura/i, value: "team_diagnostic" },
  { pattern: /pulse\s*check/i, value: "pulse_check" },
  { pattern: /clientes?\s*internos?|equipo\s*de\s*innovaci[óo]n|innovation\s*&?\s*data/i, value: "internal_clients_perception" },
  { pattern: /remesh/i, value: "remesh_feedback" },
  { pattern: /prework|pre[\s-]*work|preparaci[óo]n\s*de\s*reto|\bedc\b|planes\s*de\s*acci[óo]n.*retos/i, value: "prework" },
  // Most generic last — broad catchers for participant reflection / workshop feedback:
  { pattern: /participant\s*reflection|reflexi[óo]n\s*participante|reflexi[óo]n\s*del\s*participante|reflex[ãa]o\s*do\s*participante|pesquisa\s*de\s*reflex[ãa]o|encuesta\s*reflexi[óo]n|reflection\s*survey|encuesta\s*de\s*reflexi[óo]n|participant\s*reflection\s*&?\s*feedback|reflection\s*&?\s*feedback|cascadeo|workshop\s*cultura\s*credicorp\s*en\s*acci[óo]n|workshop\s*\d+\s*-\s*growth\s*mindset|leadership\s*innovation\s*lab|leadership\s*development\s*lab|innovation\s*lab\s*workshop|ai\s*adoption\s*survey|^\s*partnerre\s*$|^\s*credicorp\s*-\s*(espa[ñn]ol|ingles)\s*$|wave\s*\d+.*feedback\s*survey|building\s*ai\s*driven\s*cultures.*feedback|managing\s*excellence.*feedback|feedback\s*survey\s*$/i, value: "participant_reflection" },
];

// Programs — checked BEFORE clients because some programs imply a client.
// Each program returns { program, client } so we can short-circuit.
export interface ProgramRule {
  pattern: RegExp;
  program: string;
  client: string | null; // null when program spans multiple clients (rare here)
}

export const PROGRAM_PATTERNS: ProgramRule[] = [
  // Credicorp Cultura program — collects all related surveys
  { pattern: /cascadeo|cultura\s*credicorp|cultura\s*credicorp\s*en\s*acci[óo]n|equipo\s*de\s*cultura|sesion\s*grupal\s*de\s*coaching\s*-\s*cultura|planes?\s*de\s*acci[óo]n.*credicorp|growth\s*mindset.*credicorp|prework\s*edc|edc/i, program: "Cultura Credicorp", client: "Credicorp" },
  { pattern: /comit[ée]?\s*bap/i, program: "Comité BAP Pulse", client: "Credicorp" },
  { pattern: /equipo\s*innovaci[óo]n.*datos|equipo\s*datos.*innovaci[óo]n|innovaci[óo]n\s*&?\s*datos/i, program: "BCI Innovación & Datos", client: "BCI" },

  // Despegar LT+
  { pattern: /despegar.*lt\+|despegar\s*-?\s*lt\+/i, program: "Despegar LT+", client: "Despegar" },
  { pattern: /onde\s*estamos\s*como\s*equipe.*despegar|d[óo]nde\s*estamos\s*como\s*equipo.*despegar|despegar\s*2025/i, program: "Despegar Team Baseline", client: "Despegar" },

  // Telus
  { pattern: /telus\s*beyond/i, program: "Telus Beyond", client: "Telus" },
  { pattern: /telus.*innovation\s*lab|ti\s*leadership\s*innovation\s*lab/i, program: "TELUS Innovation Lab", client: "Telus" },
  { pattern: /telus.*development\s*lab|leadership\s*development\s*lab/i, program: "TELUS Development Lab", client: "Telus" },
  { pattern: /telus.*coaching/i, program: "TELUS Coaching", client: "Telus" },

  // CIRION
  { pattern: /cirion/i, program: "CIRION Conversaciones Desafiantes", client: "CIRION" },

  // Multi-region Safety Program
  { pattern: /safety\s*program/i, program: "Safety Program", client: null },

  // Building AI Driven Cultures
  { pattern: /building\s*ai\s*driven\s*cultures|ai\s*driven\s*cultures/i, program: "Building AI Driven Cultures", client: null },

  // PartnerRe
  { pattern: /offsite\s*2026\s*partnerre|partnerre.*offsite/i, program: "PartnerRe Offsite 2026", client: "PartnerRe" },
  { pattern: /partnerre.*workshop|workshop.*partnerre/i, program: "PartnerRe Workshops 2026", client: "PartnerRe" },

  // Aleatica / Aletica
  { pattern: /(ale[áa]tica|aletica).*sso|offsite\s*sso|sso\s*aleatica|sso\s*ale[áa]tica/i, program: "Aleatica SSO Offsite", client: "Aleatica" },
  { pattern: /(ale[áa]tica|aletica).*exco|exco.*ale[áa]tica/i, program: "Aleatica ExCo Coaching", client: "Aleatica" },
  { pattern: /coaching\s*process\s*tracking\s*form\s*-\s*(ale[áa]tica|aletica)|registro\s*proceso\s*de\s*coaching.*ale[áa]tica/i, program: "Aleatica Coaching", client: "Aleatica" },

  // Electrolit
  { pattern: /electrolit.*coaching|electrolit.*registro\s*proceso/i, program: "Electrolit Coaching", client: "Electrolit" },
  { pattern: /electrolit.*workshop|electrolit.*reflexi[óo]n/i, program: "Electrolit Workshops", client: "Electrolit" },
  { pattern: /lencioni.*electrolit/i, program: "Electrolit Lencioni", client: "Electrolit" },

  // AWS
  { pattern: /aws.*latam|latam.*business\s*lt/i, program: "AWS Latam Business LT", client: "AWS" },
  { pattern: /aws.*business\s*dev|growth\s*and\s*engagement|business\s*dev.*growth/i, program: "AWS Business Dev Growth & Engagement", client: "AWS" },

  // Pomelo
  { pattern: /offsite\s*lt\s*pomelo|pomelo.*offsite/i, program: "Pomelo LT Offsite", client: "Pomelo" },
  { pattern: /pomelo.*coaching|reflexi[óo]n\s*sesiones\s*de\s*coaching\s*participante\s*pomelo/i, program: "Pomelo Coaching", client: "Pomelo" },

  // Nocnoc
  { pattern: /nocnoc/i, program: "Nocnoc Coaching", client: "Nocnoc" },

  // Mibanco
  { pattern: /mibanco/i, program: "Mibanco Workshops", client: "Mibanco" },

  // Ingram Micro
  { pattern: /ingram\s*micro.*sr\.?\s*staff/i, program: "Ingram Micro Sr. Staff", client: "Ingram Micro" },
  { pattern: /ingram\s*micro.*multiplicadores/i, program: "Ingram Micro Multiplicadores", client: "Ingram Micro" },
  { pattern: /ingram\s*micro/i, program: "Ingram Micro", client: "Ingram Micro" },

  // CPM
  { pattern: /cpm.*cba|cpm.*ai\s*coach/i, program: "CPM CBA & AI Coach", client: "CPM" },

  // Grupo Posadas
  { pattern: /grupo\s*posadas/i, program: "Grupo Posadas Workshops", client: "Grupo Posadas" },

  // Sigma
  { pattern: /sigma\s*us.*summer\s*workshop|sigma.*workshop/i, program: "SIGMA Workshops", client: "SIGMA" },
  { pattern: /lencioni.*sigma|sigma.*marketing/i, program: "SIGMA Marketing Lencioni", client: "SIGMA" },

  // BCI generic (after the BCI Innovación rule above)
  { pattern: /bci.*encuesta\s*reflexi[óo]n|bci.*workshop|bci.*equipo\s*datos/i, program: "BCI Workshops", client: "BCI" },
  { pattern: /bci.*coaching|registro\s*proceso\s*de\s*coaching\s*-\s*bci|reflexi[óo]n\s*sesiones?\s*de\s*coaching\s*participante\s*-?\s*bci/i, program: "BCI Coaching", client: "BCI" },

  // Danone
  { pattern: /danone.*top\s*line|danone.*16\/4|danone\s*equipo\s*topline/i, program: "Danone TopLine", client: "Danone" },
  { pattern: /danone.*coaching|coaching.*danone|coaching\s*process\s*tracking\s*form\s*-\s*danone/i, program: "Danone Coaching", client: "Danone" },
  { pattern: /^danone/i, program: "Danone Workshops", client: "Danone" },

  // Peñafiel
  { pattern: /pe[ñn]afiel.*lencioni/i, program: "Peñafiel Lencioni", client: "Peñafiel" },
  { pattern: /pe[ñn]afiel.*workshop|pe[ñn]afiel\s*-/i, program: "Peñafiel Workshops", client: "Peñafiel" },

  // Other clients
  { pattern: /straumann/i, program: "Straumann Workshops", client: "Straumann" },
  { pattern: /scenic/i, program: "Scenic Offsite", client: "Scenic" },
  { pattern: /tecnobit/i, program: "Tecnobit Formación Gestores", client: "Tecnobit" },
  { pattern: /oes[íi]a/i, program: "Oesía Masterclass", client: "Oesía" },
  { pattern: /supervia|superv[íi]a/i, program: "Supervia Workshops", client: "Supervia" },
  { pattern: /nemak/i, program: "Nemak Workshops", client: "Nemak" },
  { pattern: /root\s*capital/i, program: "Root Capital Coaching", client: "Root Capital" },
  { pattern: /pcp\s*managing\s*excellence/i, program: "PCP Managing Excellence", client: "PCP" },
  { pattern: /p&g\s*baby\s*care|baby\s*care\s*na\s*lt/i, program: "P&G Baby Care", client: "P&G" },
  { pattern: /fem\s*care/i, program: "P&G Fem Care", client: "P&G" },
  { pattern: /fintech\s*product\s*elt/i, program: "Fintech Product ELT", client: null },
  { pattern: /mp\s*product\s*elt/i, program: "MP Product ELT", client: null },
  { pattern: /leadership\s*summit/i, program: "Leadership Summit", client: null },
  { pattern: /ai\s*adoption\s*survey.*partners/i, program: "Axialent AI Adoption (Partners)", client: "Axialent" },
];

// Client patterns — fallback when program didn't bind a client.
export const CLIENT_PATTERNS: PatternRule<string>[] = [
  { pattern: /credicorp|bap/i, value: "Credicorp" },
  { pattern: /\bbci\b/i, value: "BCI" },
  { pattern: /despegar/i, value: "Despegar" },
  { pattern: /telus/i, value: "Telus" },
  { pattern: /electrolit/i, value: "Electrolit" },
  { pattern: /pomelo/i, value: "Pomelo" },
  { pattern: /ale[áa]tica|aletica/i, value: "Aleatica" },
  { pattern: /\baws\b/i, value: "AWS" },
  { pattern: /partnerre/i, value: "PartnerRe" },
  { pattern: /mibanco/i, value: "Mibanco" },
  { pattern: /ingram\s*micro/i, value: "Ingram Micro" },
  { pattern: /cirion/i, value: "CIRION" },
  { pattern: /danone/i, value: "Danone" },
  { pattern: /nemak/i, value: "Nemak" },
  { pattern: /grupo\s*posadas/i, value: "Grupo Posadas" },
  { pattern: /\bsigma\b/i, value: "SIGMA" },
  { pattern: /straumann/i, value: "Straumann" },
  { pattern: /scenic/i, value: "Scenic" },
  { pattern: /nocnoc/i, value: "Nocnoc" },
  { pattern: /root\s*capital/i, value: "Root Capital" },
  { pattern: /tecnobit/i, value: "Tecnobit" },
  { pattern: /oes[íi]a/i, value: "Oesía" },
  { pattern: /supervia|superv[íi]a/i, value: "Supervia" },
  { pattern: /pe[ñn]afiel/i, value: "Peñafiel" },
  { pattern: /p&g|baby\s*care|fem\s*care/i, value: "P&G" },
  { pattern: /\bcpm\b/i, value: "CPM" },
  { pattern: /pcp/i, value: "PCP" },
  { pattern: /afns?\b/i, value: "Axialent" }, // AFNS Gym is internal Axialent
];

export const COUNTRY_PATTERNS: PatternRule<string>[] = [
  { pattern: /argentina|\barg\b/i, value: "AR" },
  { pattern: /m[ée]xico|\bmx\b|m[ée]xico\s*-/i, value: "MX" },
  { pattern: /brasil|brazil|\bbr\b|portugu[êe]s|portugues/i, value: "BR" },
  { pattern: /per[uú]/i, value: "PE" },
  { pattern: /chile/i, value: "CL" },
  { pattern: /colombia/i, value: "CO" },
  { pattern: /india/i, value: "IN" },
  { pattern: /philippines/i, value: "PH" },
  { pattern: /guatemala|el\s*salvador/i, value: "GT-SV" },
  { pattern: /miami/i, value: "US-MIA" },
  { pattern: /espa[ñn]a|\bspain\b/i, value: "ES" },
  { pattern: /\bvirtual\b/i, value: "VIRTUAL" },
];

// Likert label → score (1-5). Triple-language: ES / EN / PT.
// Order: most specific first ("strongly agree" before "agree").
export function likertLabelToScore(label: string): number | null {
  if (!label) return null;
  const num = Number(label);
  if (!Number.isNaN(num) && num >= 0 && num <= 10) return num;

  const l = label.toLowerCase().trim();
  if (/completamente\s*de\s*acuerdo|totalmente\s*de\s*acuerdo|strongly\s*agree|fortemente\s*concordo|concordo\s*totalmente/.test(l)) return 5;
  if (/^de\s*acuerdo$|^de\s*acuerdo\s|^agree$|^agree\s|concordo|^muy\s*satisfecho/.test(l)) return 4;
  if (/algo\s*de\s*acuerdo|somewhat\s*agree|ni\s*de\s*acuerdo|neither|neutral|parcialmente|nem\s*concordo|^satisfecho/.test(l)) return 3;
  if (/^en\s*desacuerdo$|^en\s*desacuerdo\s|^disagree$|^disagree\s|discordo(?!\s*totalmente)|^poco\s*satisfecho/.test(l)) return 2;
  if (/completamente\s*en\s*desacuerdo|totalmente\s*en\s*desacuerdo|strongly\s*disagree|discordo\s*totalmente|fortemente\s*discordo|^nada\s*satisfecho/.test(l)) return 1;
  return null;
}

export function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

export function makeSlug(text: string): string {
  return stripHtml(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}
