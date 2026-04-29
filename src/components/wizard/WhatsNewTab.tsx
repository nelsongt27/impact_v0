import type { Changelog } from "@/normalize/types";

interface Props {
  changelog: Changelog;
}

export function WhatsNewTab({ changelog }: Props) {
  const empty =
    changelog.new_forms.length === 0 && changelog.updated_forms.length === 0;
  return (
    <div className="space-y-6">
      <div className="font-mono text-[11px] text-ink-400">
        Last refresh: {changelog.generated_at} · Previous run:{" "}
        {changelog.previous_run_at ?? "never"}
      </div>

      {empty && (
        <div className="rounded-lg border border-ink-100 bg-white p-6 text-sm text-ink-500">
          Nothing new since the previous refresh — the dashboard is up to date.
        </div>
      )}

      {changelog.new_forms.length > 0 && (
        <Section title="New forms" subtitle={`${changelog.new_forms.length} forms appeared since the last refresh`}>
          <ul className="divide-y divide-ink-100 rounded-lg border border-ink-100 bg-white">
            {changelog.new_forms.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span className="text-ink-900">{f.title}</span>
                <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-400">
                  {f.source} · {f.id}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {changelog.updated_forms.length > 0 && (
        <Section
          title="Updated forms"
          subtitle={`${changelog.updated_forms.length} forms with new responses since the last refresh`}
        >
          <ul className="divide-y divide-ink-100 rounded-lg border border-ink-100 bg-white">
            {changelog.updated_forms.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span className="text-ink-900">{f.title}</span>
                <span className="font-mono text-[11px] text-ink-500">
                  {f.previous_response_count} → {f.current_response_count}
                  <span className="ml-2 font-semibold text-amber-700">
                    +{f.delta}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-display text-xl tracking-tightest text-ink-900">
        {title}
      </h3>
      <p className="mb-3 mt-1 font-mono text-[11px] text-ink-400">{subtitle}</p>
      {children}
    </div>
  );
}
