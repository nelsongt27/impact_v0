"use client";

import { useState } from "react";

import type {
  Changelog,
  OverridesFile,
  SurveyFamily,
  SurveyOverride,
} from "@/normalize/types";

import { AuditTab } from "./AuditTab";
import { NeedsMappingTab } from "./NeedsMappingTab";
import { WhatsNewTab } from "./WhatsNewTab";

export interface WizardSurveyRow {
  id: string;
  title: string;
  source: "typeform" | "surveymonkey";
  client: string | null;
  program: string | null;
  survey_family: SurveyFamily;
  country: string | null;
  language: "es" | "en" | "pt" | null;
  response_count: number;
  override_applied: boolean;
}

interface Props {
  changelog: Changelog;
  overrides: OverridesFile;
  surveys: WizardSurveyRow[];
  clients: string[];
  programs: string[];
  readOnly: boolean;
}

type TabKey = "new" | "needs" | "audit";

export function WizardTabs({
  changelog,
  overrides,
  surveys,
  clients,
  programs,
  readOnly,
}: Props) {
  const [tab, setTab] = useState<TabKey>(
    changelog.new_forms.length > 0 || changelog.updated_forms.length > 0
      ? "new"
      : "needs",
  );
  const [pending, setPending] = useState<Record<string, SurveyOverride>>(
    overrides.surveys ?? {},
  );

  return (
    <div>
      <div className="mb-6 flex items-center gap-1 border-b border-ink-100">
        <TabButton
          active={tab === "new"}
          onClick={() => setTab("new")}
          label="What's new"
          count={changelog.new_forms.length + changelog.updated_forms.length}
        />
        <TabButton
          active={tab === "needs"}
          onClick={() => setTab("needs")}
          label="Needs mapping"
          count={changelog.unmapped_forms.length}
        />
        <TabButton
          active={tab === "audit"}
          onClick={() => setTab("audit")}
          label="Audit"
          count={Object.keys(pending).length}
        />
      </div>

      {tab === "new" && <WhatsNewTab changelog={changelog} />}
      {tab === "needs" && (
        <NeedsMappingTab
          surveys={surveys}
          pending={pending}
          setPending={setPending}
          clients={clients}
          programs={programs}
          readOnly={readOnly}
        />
      )}
      {tab === "audit" && <AuditTab pending={pending} surveys={surveys} />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "border-b-2 border-amber-400 px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-eyebrow text-ink-900"
          : "border-b-2 border-transparent px-4 py-3 font-mono text-[11px] uppercase tracking-eyebrow text-ink-400 transition-colors hover:text-ink-700"
      }
    >
      {label}
      <span className="ml-2 rounded-full bg-paper-2 px-2 py-0.5 text-ink-500">
        {count}
      </span>
    </button>
  );
}
