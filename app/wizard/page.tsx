import { SectionTitle } from "@/components/SectionTitle";
import { WizardTabs } from "@/components/wizard/WizardTabs";
import { changelog, overrides, surveys } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function WizardPage() {
  // Distinct existing values become the dropdown choices in the editor.
  const clients = [
    ...new Set(surveys.map((s) => s.client).filter(Boolean)),
  ].sort() as string[];
  const programs = [
    ...new Set(surveys.map((s) => s.program).filter(Boolean)),
  ].sort() as string[];

  // Send only what the wizard needs — keep the payload tight.
  const surveyRows = surveys
    .filter((s) => !s.is_template && !s.is_test && !s.excluded)
    .map((s) => ({
      id: s.id,
      title: s.title,
      source: s.source,
      client: s.client,
      program: s.program,
      survey_family: s.survey_family,
      country: s.country,
      language: s.language,
      response_count: s.response_count,
      override_applied: s.override_applied,
    }));

  const isProd = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);

  return (
    <div>
      <SectionTitle
        eyebrow="Iteration 02 · Data management"
        title="Wizard"
        subtitle="Detect new data, fix mappings, audit overrides — all in one place."
      />

      <WizardTabs
        changelog={changelog}
        overrides={overrides}
        surveys={surveyRows}
        clients={clients}
        programs={programs}
        readOnly={isProd}
      />
    </div>
  );
}
