"use client";

import { useMemo, useState } from "react";

import type { SurveyFamily, SurveyOverride } from "@/normalize/types";

import type { WizardSurveyRow } from "./WizardTabs";

const FAMILY_OPTIONS: SurveyFamily[] = [
  "participant_reflection",
  "facilitator_debrief",
  "coaching_reflection",
  "coaching_process",
  "coach_selection",
  "team_diagnostic",
  "pulse_check",
  "impact_roi",
  "client_needs",
  "prework",
  "internal_clients_perception",
  "remesh_feedback",
  "afns_gym",
  "unknown",
];

interface Props {
  surveys: WizardSurveyRow[];
  pending: Record<string, SurveyOverride>;
  setPending: React.Dispatch<
    React.SetStateAction<Record<string, SurveyOverride>>
  >;
  clients: string[];
  programs: string[];
  readOnly: boolean;
}

export function NeedsMappingTab({
  surveys,
  pending,
  setPending,
  clients,
  programs,
  readOnly,
}: Props) {
  const [filter, setFilter] = useState<"unmapped" | "all">("unmapped");
  const [search, setSearch] = useState("");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error" | "readonly"
  >("idle");
  const [saveMessage, setSaveMessage] = useState<string>("");

  const rows = useMemo(() => {
    let items = surveys;
    if (filter === "unmapped") {
      items = items.filter(
        (s) =>
          !s.client ||
          !s.program ||
          s.survey_family === "unknown",
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (s) => s.title.toLowerCase().includes(q) || s.id.includes(q),
      );
    }
    return items;
  }, [surveys, filter, search]);

  const updateField = (
    id: string,
    field: keyof SurveyOverride,
    value: string,
  ) => {
    setPending((prev) => {
      const next = { ...prev };
      const current = { ...(next[id] ?? {}) };
      if (value === "") {
        delete (current as Record<string, unknown>)[field];
      } else {
        (current as Record<string, unknown>)[field] = value;
      }
      if (Object.keys(current).length === 0) {
        delete next[id];
      } else {
        next[id] = current;
      }
      return next;
    });
  };

  const save = async () => {
    if (readOnly) {
      setSaveStatus("readonly");
      setSaveMessage(
        "Read-only on Vercel. Edit locally with `bun run dev`, commit and push.",
      );
      return;
    }
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/overrides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveys: pending }),
      });
      const json = (await res.json()) as { ok?: boolean; note?: string };
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      setSaveStatus("saved");
      setSaveMessage(json.note ?? "Saved.");
    } catch (err) {
      setSaveStatus("error");
      setSaveMessage(err instanceof Error ? err.message : String(err));
    }
  };

  const pendingCount = Object.keys(pending).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <FilterChip
            active={filter === "unmapped"}
            onClick={() => setFilter("unmapped")}
            label="Unmapped only"
          />
          <FilterChip
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="All surveys"
          />
        </div>
        <input
          type="text"
          placeholder="Search title or id…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 flex-1 min-w-[200px] rounded-md border border-ink-200 bg-white px-3 font-mono text-xs text-ink-900 outline-none placeholder:text-ink-400 focus:border-amber-400"
        />
        <span className="font-mono text-[11px] text-ink-400">
          {rows.length} of {surveys.length}
        </span>
        <button
          type="button"
          onClick={save}
          disabled={saveStatus === "saving" || pendingCount === 0}
          className="rounded-full bg-ink-800 px-5 py-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-paper transition-colors hover:bg-ink-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saveStatus === "saving"
            ? "Saving…"
            : `Save ${pendingCount} ${pendingCount === 1 ? "override" : "overrides"}`}
        </button>
      </div>

      {saveStatus !== "idle" && saveMessage && (
        <div
          className={
            saveStatus === "error"
              ? "rounded-md border border-brick/40 bg-brick/5 px-4 py-3 font-mono text-xs text-brick"
              : saveStatus === "readonly"
                ? "rounded-md border border-amber-200 bg-amber-50 px-4 py-3 font-mono text-xs text-amber-700"
                : "rounded-md border border-ink-100 bg-paper-2 px-4 py-3 font-mono text-xs text-ink-700"
          }
        >
          {saveMessage}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-ink-100">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-ink-100 bg-paper-2">
              <th className="px-3 py-3 text-left font-mono text-[10px] uppercase tracking-eyebrow text-ink-500">
                Survey
              </th>
              <th className="px-3 py-3 text-left font-mono text-[10px] uppercase tracking-eyebrow text-ink-500">
                Client
              </th>
              <th className="px-3 py-3 text-left font-mono text-[10px] uppercase tracking-eyebrow text-ink-500">
                Program
              </th>
              <th className="px-3 py-3 text-left font-mono text-[10px] uppercase tracking-eyebrow text-ink-500">
                Family
              </th>
              <th className="px-3 py-3 text-right font-mono text-[10px] uppercase tracking-eyebrow text-ink-500">
                Resp.
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 bg-white">
            {rows.map((s) => {
              const ov = pending[s.id] ?? {};
              const effClient =
                (ov.client !== undefined ? ov.client : s.client) ?? "";
              const effProgram =
                (ov.program !== undefined ? ov.program : s.program) ?? "";
              const effFamily = ov.survey_family ?? s.survey_family;
              const isOverridden = !!pending[s.id];
              return (
                <tr key={s.id} className="hover:bg-paper-2/50">
                  <td className="max-w-[280px] px-3 py-2">
                    <div className="truncate text-ink-900" title={s.title}>
                      {isOverridden && (
                        <span className="mr-1 font-mono text-[10px] text-amber-700">
                          ●
                        </span>
                      )}
                      {s.title}
                    </div>
                    <div className="font-mono text-[10px] text-ink-400">
                      {s.source} · {s.id} · {s.country ?? "—"}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <EditableSelect
                      value={effClient}
                      options={clients}
                      onChange={(v) => updateField(s.id, "client", v)}
                      placeholder="(none)"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <EditableSelect
                      value={effProgram}
                      options={programs}
                      onChange={(v) => updateField(s.id, "program", v)}
                      placeholder="(none)"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={effFamily}
                      onChange={(e) =>
                        updateField(s.id, "survey_family", e.target.value)
                      }
                      className="w-full rounded border border-ink-200 bg-white px-2 py-1 font-mono text-[11px] text-ink-900 outline-none focus:border-amber-400"
                    >
                      {FAMILY_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-xs text-ink-700">
                    {s.response_count}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-ink-800 px-3 py-1 font-mono text-[10px] uppercase tracking-eyebrow text-paper"
          : "rounded-full bg-paper-2 px-3 py-1 font-mono text-[10px] uppercase tracking-eyebrow text-ink-500 hover:bg-ink-50"
      }
    >
      {label}
    </button>
  );
}

function EditableSelect({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [custom, setCustom] = useState(false);
  const isCustom = custom || (value && !options.includes(value));
  if (isCustom) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-w-[140px] rounded border border-amber-300 bg-white px-2 py-1 font-mono text-[11px] text-ink-900 outline-none focus:border-amber-500"
        />
        <button
          type="button"
          onClick={() => {
            setCustom(false);
            onChange("");
          }}
          className="font-mono text-[10px] text-ink-400 hover:text-ink-700"
          title="Switch back to dropdown"
        >
          ×
        </button>
      </div>
    );
  }
  return (
    <select
      value={value}
      onChange={(e) => {
        if (e.target.value === "__custom__") {
          setCustom(true);
        } else {
          onChange(e.target.value);
        }
      }}
      className="w-full min-w-[140px] rounded border border-ink-200 bg-white px-2 py-1 font-mono text-[11px] text-ink-900 outline-none focus:border-amber-400"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
      <option value="__custom__">+ custom…</option>
    </select>
  );
}
