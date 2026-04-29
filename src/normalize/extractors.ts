import { stripHtml } from "./mappings.ts";

const NAME_RE = /[A-ZÁÉÍÓÚÑa-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]+)+/;

export interface TitleRoles {
  facilitator: string | null;
  coach: string | null;
  coachee: string | null;
}

export function extractTitleRoles(rawTitle: string): TitleRoles {
  const t = stripHtml(rawTitle);
  return {
    facilitator: extractFacilitator(t),
    coach: extractCoach(t),
    coachee: extractCoachee(t),
  };
}

function extractFacilitator(t: string): string | null {
  const m1 = new RegExp(`facilitador(?:a)?\\s+(${NAME_RE.source})\\s*[-–]?`, "i").exec(t);
  if (m1?.[1]) return m1[1].trim();
  const m2 = new RegExp(`facilitated\\s+by\\s+([A-Za-z]+(?:\\s+[A-Za-z]+)+)`, "i").exec(t);
  if (m2?.[1]) return m2[1].trim();
  return null;
}

function extractCoach(t: string): string | null {
  // SM convention: "Coaching Process Tracking Form - {Client} /{Coach}" or "..._{Coach}"
  const m1 = /coaching\s+process\s+tracking\s+form[\s_-]*([A-Za-z]+\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]+)?)/i.exec(t);
  if (m1?.[1]) return m1[1].trim();
  // TF convention: "Coaching ... – {Coach}" / "...  Coaching {Coach}"
  const m2 = new RegExp(`coaching[^–-]*[–-]\\s*(${NAME_RE.source})\\s*$`, "i").exec(t);
  if (m2?.[1]) return m2[1].trim();
  return null;
}

function extractCoachee(t: string): string | null {
  const m = new RegExp(
    `reflexi[óo]n\\s+sesiones?\\s+de\\s+coaching\\s+participante[^-]*[-–]\\s*(${NAME_RE.source})\\s*$`,
    "i",
  ).exec(t);
  return m?.[1]?.trim() ?? null;
}
