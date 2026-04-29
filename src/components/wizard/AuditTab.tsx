import type { SurveyOverride } from "@/normalize/types";

import type { WizardSurveyRow } from "./WizardTabs";

interface Props {
  pending: Record<string, SurveyOverride>;
  surveys: WizardSurveyRow[];
}

export function AuditTab({ pending, surveys }: Props) {
  const surveysById = new Map(surveys.map((s) => [s.id, s]));
  const entries = Object.entries(pending);

  return (
    <div className="space-y-4">
      <p className="font-mono text-xs text-ink-400">
        {entries.length} survey{entries.length === 1 ? "" : "s"} have manual
        overrides applied. The JSON below is what gets committed to{" "}
        <code className="rounded bg-paper-2 px-1.5 py-0.5">
          data/overrides.json
        </code>
        .
      </p>

      {entries.length === 0 ? (
        <div className="rounded-lg border border-ink-100 bg-white p-6 text-sm text-ink-500">
          No overrides yet. Use the Needs mapping tab to map surveys.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-lg border border-ink-100 bg-white">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 bg-paper-2">
                  <th className="px-3 py-3 text-left font-mono text-[10px] uppercase tracking-eyebrow text-ink-500">
                    Survey
                  </th>
                  <th className="px-3 py-3 text-left font-mono text-[10px] uppercase tracking-eyebrow text-ink-500">
                    Override
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {entries.map(([id, ov]) => {
                  const s = surveysById.get(id);
                  return (
                    <tr key={id}>
                      <td className="max-w-[320px] px-3 py-2">
                        <div className="truncate text-ink-900">
                          {s?.title ?? "(unknown survey)"}
                        </div>
                        <div className="font-mono text-[10px] text-ink-400">
                          {id}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <ul className="space-y-0.5 font-mono text-[11px] text-ink-700">
                          {Object.entries(ov).map(([k, v]) => (
                            <li key={k}>
                              <span className="text-ink-400">{k}:</span>{" "}
                              <span className="text-ink-900">{String(v)}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <details className="rounded-lg border border-ink-100 bg-paper-2 p-4">
            <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-eyebrow text-ink-500">
              Raw JSON ({entries.length} entries)
            </summary>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all font-mono text-[11px] text-ink-700">
              {JSON.stringify({ surveys: pending }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
