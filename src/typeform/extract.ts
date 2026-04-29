import { mkdir, readFile, writeFile, appendFile } from "node:fs/promises";
import { join } from "node:path";

import { TypeformClient, TypeformError } from "./client.ts";
import type {
  FormListItem,
  FormListResponse,
  ResponsesPage,
  ExtractionState,
  FormState,
} from "./types.ts";

const ROOT = join(import.meta.dir, "..", "..");
const DATA_DIR = join(ROOT, "data");
const FORMS_DIR = join(DATA_DIR, "forms");
const RESPONSES_DIR = join(DATA_DIR, "responses");
const FORMS_INDEX_PATH = join(DATA_DIR, "forms_index.json");
const STATE_PATH = join(DATA_DIR, "state.json");

const PAGE_SIZE = 200;
const REQUEST_DELAY_MS = 250;

const FULL_REFRESH = process.argv.includes("--full");

async function ensureDirs(): Promise<void> {
  for (const dir of [DATA_DIR, FORMS_DIR, RESPONSES_DIR]) {
    await mkdir(dir, { recursive: true });
  }
}

async function loadState(fullRefresh: boolean): Promise<ExtractionState> {
  if (fullRefresh) {
    return { last_run_at: new Date().toISOString(), forms: {} };
  }
  try {
    const raw = await readFile(STATE_PATH, "utf8");
    return JSON.parse(raw) as ExtractionState;
  } catch {
    return { last_run_at: new Date().toISOString(), forms: {} };
  }
}

async function saveState(state: ExtractionState): Promise<void> {
  state.last_run_at = new Date().toISOString();
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2));
}

async function listAllForms(client: TypeformClient): Promise<FormListItem[]> {
  const all: FormListItem[] = [];
  let page = 1;
  while (true) {
    const data = await client.get<FormListResponse>(
      `/forms?page=${page}&page_size=${PAGE_SIZE}`,
    );
    all.push(...data.items);
    if (page >= data.page_count || data.items.length === 0) break;
    page++;
    await Bun.sleep(REQUEST_DELAY_MS);
  }
  return all;
}

// Walks responses backwards using `before` cursor (Typeform returns DESC by submitted_at).
// On incremental runs, stops at the prior token boundary.
async function fetchResponsesForForm(
  client: TypeformClient,
  formId: string,
  outPath: string,
  prior: FormState | undefined,
  fullRefresh: boolean,
): Promise<{ written: number; newestToken: string | null }> {
  const incremental = !fullRefresh && prior?.last_response_token;
  if (!incremental) {
    await writeFile(outPath, "");
  }

  let before: string | null = null;
  let written = 0;
  let newestToken: string | null = prior?.last_response_token ?? null;
  let firstPage = true;

  while (true) {
    const params = new URLSearchParams({ page_size: String(PAGE_SIZE) });
    if (before) params.set("before", before);

    let page: ResponsesPage;
    try {
      page = await client.get<ResponsesPage>(
        `/forms/${formId}/responses?${params.toString()}`,
      );
    } catch (err) {
      // Form deleted / no longer accessible — skip without aborting batch.
      if (err instanceof TypeformError && err.status === 404) {
        return { written: 0, newestToken: prior?.last_response_token ?? null };
      }
      throw err;
    }

    if (!page.items || page.items.length === 0) break;

    if (firstPage && page.items[0]?.token) {
      newestToken = page.items[0].token;
      firstPage = false;
    }

    const lines: string[] = [];
    let hitPriorBoundary = false;
    for (const item of page.items) {
      if (
        incremental &&
        prior?.last_response_token &&
        item.token === prior.last_response_token
      ) {
        hitPriorBoundary = true;
        break;
      }
      lines.push(JSON.stringify(item));
    }
    if (lines.length > 0) {
      await appendFile(outPath, lines.join("\n") + "\n");
      written += lines.length;
    }

    if (hitPriorBoundary) break;

    const oldest = page.items.at(-1);
    if (!oldest) break;
    before = oldest.token;
    await Bun.sleep(REQUEST_DELAY_MS);
  }

  return { written, newestToken };
}

async function main(): Promise<void> {
  const client = new TypeformClient(process.env["TYPEFORM_API_KEY"]);
  await ensureDirs();

  const state = await loadState(FULL_REFRESH);
  const startedAt = Date.now();

  console.log(
    `▶ Typeform extractor — mode: ${FULL_REFRESH ? "FULL REFRESH" : "INCREMENTAL"}`,
  );

  console.log("▶ Listing forms…");
  const forms = await listAllForms(client);
  await writeFile(FORMS_INDEX_PATH, JSON.stringify(forms, null, 2));
  console.log(`✓ Found ${forms.length} forms — saved to data/forms_index.json`);

  let totalResponses = 0;
  let processed = 0;
  let failed = 0;

  for (const form of forms) {
    processed++;
    const tag = `[${processed}/${forms.length}] ${form.id} "${form.title.slice(0, 60)}"`;

    try {
      const definition = await client.get<unknown>(`/forms/${form.id}`);
      await writeFile(
        join(FORMS_DIR, `${form.id}.json`),
        JSON.stringify(definition, null, 2),
      );

      const outPath = join(RESPONSES_DIR, `${form.id}.jsonl`);
      const prior = state.forms[form.id];
      const { written, newestToken } = await fetchResponsesForForm(
        client,
        form.id,
        outPath,
        prior,
        FULL_REFRESH,
      );

      const priorTotal = prior?.total_responses ?? 0;
      const updated: FormState = {
        last_response_token: newestToken,
        total_responses: priorTotal + written,
      };
      state.forms[form.id] = updated;
      totalResponses += written;

      console.log(
        `${tag} — +${written} responses (total: ${updated.total_responses})`,
      );
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`${tag} — FAILED: ${msg}`);
    }

    await saveState(state);
    await Bun.sleep(REQUEST_DELAY_MS);
  }

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log("");
  console.log("══════════════ EXTRACTION SUMMARY ══════════════");
  console.log(`Forms processed:      ${processed}/${forms.length}`);
  console.log(`Forms failed:         ${failed}`);
  console.log(`New responses pulled: ${totalResponses}`);
  console.log(`Total time:           ${elapsed}s`);
  console.log(`Data root:            ${DATA_DIR}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
