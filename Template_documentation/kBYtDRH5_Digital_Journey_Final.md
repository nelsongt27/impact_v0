# 09_TEMPLATE_Digital_journey_final

- **Form ID:** `kBYtDRH5`
- **Type:** quiz
- **Language:** en
- **Audience:** Participant at end of digital journey / leadership development program (with practice sessions + Axia AI coach)
- **Created:** 2026-05-21
- **Last updated:** 2026-05-21
- **Published:** 2026-05-21
- **Display URL:** https://form.typeform.com/to/kBYtDRH5
- **Hidden fields:** `projectname` _(passed via URL param)_
- **Milestones:** active on field `9eba884b-b2db-4220-b577-249a1827dfd1` (Q1)
- **Total fields:** 5 (4 opinion_scale + 1 long_text) — **all optional**

## Welcome screen

> **Congratulations, you have finished this journey!**
>
> Thank you for participating in our program. Your insights are essential to help us understand the impact of our leadership development experience and support ongoing improvement. Please share your honest feedback about your journey and outcomes.

## Questions

### 1. On a scale from 1 to 5, to what extent have the learnings from this program improved your effectiveness as a leader?

- **Type:** `opinion_scale` (1–5, starts at 1)
- **Required:** no
- **Field ID:** `BGhkcxfV9tY4`
- **Labels:** `1 = Not at all` → `10 = To a great extent` _(sic — label dice "10" pero la escala es 1-5)_
- **Milestone field:** yes (active)

### 2. On a scale from 1 to 5, how likely are you to recommend this program to a colleague?

- **Type:** `opinion_scale` (0–10, 11 steps, NPS-style, starts at 0)
- **Required:** no
- **Field ID:** `9foe0DQKphBw`
- **Labels:** `1 = Not at all likely` → `10 = Extremely likely`
- **Nota:** título dice "1 a 5" pero la escala real es 0–10 (NPS estándar). Inconsistencia entre wording y configuración.

### 3. Practice sessions: On a scale from 1 to 5, to what extent did the practice sessions help deepen or improve what you learned on the platform?

- **Type:** `opinion_scale` (1–5, starts at 1)
- **Required:** no
- **Field ID:** `AZgG5fbh4qyj`
- **Labels:** `1 = Not at all` → `10 = To a great extent` _(sic — label dice "10" pero la escala es 1-5)_

### 4. The conversation with Axia, my AI coach, helped me put my results in context and understand them more deeply.

- **Type:** `opinion_scale` (1–5, starts at 1)
- **Required:** no
- **Field ID:** `yOnxqnge5EA0`
- **Labels:** Strongly disagree → Strongly Agree

### 5. Please share any additional comments about your experience.

- **Type:** `long_text` (open-ended)
- **Required:** no
- **Field ID:** `LGbc9IsgeLjp`
- **Helper text:** _Consider: What did you like most? What did you like least? How can this program be more impactful?_

## Thank-you screen

_(Default Typeform screen — no custom thank-you configured)_

---

## Notas / bugs detectados

- **Q1 y Q3 — label inconsistente:** escala configurada 1–5 pero el label derecho dice `10 = To a great extent`. Probable copy-paste de la versión NPS. Sugiero corregir a `5 = To a great extent`.
- **Q2 — título vs escala inconsistente:** título dice "On a scale from 1 to 5" pero la escala real es 0–10 (NPS). Decidir: ¿NPS 0-10 (correcto para "recommend") o cambiar título a "1 to 5"?
- **Todo opcional:** ningún campo es required — riesgo de respuestas vacías / submits parciales.
- **Hidden field `projectname`** se inyecta vía URL — para distinguir respuestas por proyecto/cliente.
- **Milestone activo en Q1** = Typeform marca esta pregunta como el "punto clave" para tracking de progreso/abandono.
- Form recién creado y publicado el mismo día (2026-05-21) — está fresh, probablemente todavía sin respuestas.
