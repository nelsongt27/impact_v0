import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { NextResponse } from "next/server";

import type { OverridesFile, SurveyOverride } from "@/normalize/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // need fs

const OVERRIDES_PATH = join(process.cwd(), "data", "overrides.json");

const ALLOWED_FIELDS: Array<keyof SurveyOverride> = [
  "client",
  "program",
  "survey_family",
  "country",
  "language",
];

async function loadOverrides(): Promise<OverridesFile> {
  try {
    const raw = await readFile(OVERRIDES_PATH, "utf8");
    return JSON.parse(raw) as OverridesFile;
  } catch {
    return { version: 1, updated_at: new Date().toISOString(), surveys: {} };
  }
}

export async function GET(): Promise<NextResponse> {
  const overrides = await loadOverrides();
  return NextResponse.json(overrides);
}

export async function POST(req: Request): Promise<NextResponse> {
  // Vercel serverless filesystem is read-only outside /tmp. The wizard's
  // edit mode therefore only works in dev (`bun run dev`) — Nelson commits
  // overrides.json manually after editing locally.
  if (process.env.VERCEL === "1" || process.env.VERCEL_ENV) {
    return NextResponse.json(
      {
        error: "read-only on Vercel",
        message:
          "Edit overrides locally with `bun run dev`, then commit and push to update production.",
      },
      { status: 503 },
    );
  }

  const body = (await req.json()) as Partial<OverridesFile>;
  if (!body || typeof body !== "object" || !body.surveys) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const sanitised: Record<string, SurveyOverride> = {};
  for (const [id, override] of Object.entries(body.surveys)) {
    const o: SurveyOverride = {};
    if (!override || typeof override !== "object") continue;
    for (const field of ALLOWED_FIELDS) {
      if (field in override) {
        const v = (override as Record<string, unknown>)[field];
        if (v === null || v === undefined || typeof v === "string") {
          (o as Record<string, unknown>)[field] = v;
        }
      }
    }
    if (Object.keys(o).length > 0) sanitised[id] = o;
  }

  const next: OverridesFile = {
    version: 1,
    updated_at: new Date().toISOString(),
    surveys: sanitised,
  };
  await writeFile(OVERRIDES_PATH, JSON.stringify(next, null, 2) + "\n");

  // Re-run normalize so the dashboard reflects the new overrides without a
  // manual step. Bun.spawn keeps the request fast — caller awaits exit.
  let normalizeOk = false;
  let normalizeError: string | null = null;
  try {
    const proc = Bun.spawn(["bun", "run", "normalize"], {
      cwd: process.cwd(),
      stdout: "pipe",
      stderr: "pipe",
    });
    const exit = await proc.exited;
    normalizeOk = exit === 0;
    if (!normalizeOk) {
      normalizeError = await new Response(proc.stderr).text();
    }
  } catch (err) {
    normalizeError = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json({
    ok: true,
    count: Object.keys(sanitised).length,
    normalize: normalizeOk ? "ok" : "failed",
    normalize_error: normalizeError,
    note: normalizeOk
      ? `Saved ${Object.keys(sanitised).length} override(s) and ran normalize. Reload to see updates. Commit + push to deploy.`
      : `Saved overrides but normalize failed: ${normalizeError}. Run \`bun run normalize\` manually.`,
  });
}
