# 11_TEMPLATE Post Program Impact & ROI Check-In_AUG2025

- **Form ID:** `spa8kDpY`
- **Type:** quiz
- **Language setting:** es (UI bilingual; questions in EN)
- **Audience:** Client sponsor (HR / business leader) — post-program reflection ("Delivering on the Promise")
- **Created:** 2025-09-02
- **Last updated:** 2026-05-21
- **Published:** 2025-12-15
- **Display URL:** https://form.typeform.com/to/spa8kDpY
- **Estimated time:** 10–15 minutes
- **Total fields:** 9 (5 short_text + 2 multiple_choice + 1 opinion_scale + 1 native_nps)

## Welcome screen

> **Post Program Impact & ROI Check-In — Delivering on the Promise**
>
> Thank you for partnering with us on this leadership development journey. Your feedback is essential to help us understand how the program is driving change in your organization.
>
> This short reflection will take 10–15 minutes to complete, and will help us:
>
> - Confirm that the program delivered on its promise
> - Identify meaningful leadership and business outcomes
> - Ensure continued return on your investment
>
> Your insights will guide how we sustain momentum and deepen the program's longterm impact for your team and your organization.

## Questions

### 1. What *leadership shifts* have you observed in participants since completing the program?

- **Type:** `short_text` (open-ended)
- **Required:** yes
- **Field ID:** `1ZANK9xpmFMB`
- **Helper text:** _Please share any noticeable changes in leadership behavior, decision-making, or team dynamics._

### 2. To what extent has this program helped your leaders more effectively address your *organization's leadership challenges*?

- **Type:** `multiple_choice` (single select, 5-point scale)
- **Required:** yes
- **Field ID:** `VF1S7Ru2nPFL`
- **Choices:**
  - Very highly
  - Highly
  - Moderately
  - Sligthly _(sic — typo, debería ser "Slightly")_
  - Not at all

### 3. What *business outcomes* have these leadership shifts impacted?

- **Type:** `short_text` (open-ended)
- **Required:** yes
- **Field ID:** `4scpyanH7I9E`
- **Helper text:** _Please include any measurable indicators (e.g., productivity, engagement, retention)._

### 4. How worthwhile was this program as an *investment for your organization*?

- **Type:** `opinion_scale` (0–10, 11 steps, starts at 0)
- **Required:** yes
- **Field ID:** `o5pucp0QU5MQ`
- **Labels:** `No at all` _(sic — debería ser "Not at all")_ → `Completely`

### 5. How would you rate the program *management and logistics* (e.g., scheduling, prework, communications, coordination)?

- **Type:** `multiple_choice` (single select, 5-point scale)
- **Required:** no
- **Field ID:** `BTv5Htrnkox7`
- **Choices:**
  - Excellent
  - Very good
  - Good
  - Fair
  - Poor

### 6. Please share any comments about what worked well or what could be improved.

- **Type:** `short_text` (open-ended)
- **Required:** no
- **Field ID:** `Szx0T5RY2xyx`

### 7. What *additional support* would help you sustain or build on the program's impact?

- **Type:** `short_text` (open-ended)
- **Required:** yes
- **Field ID:** `qpIZcEnh8Ktv`

### 8. How likely is it that you would recommend this program to other teams or organizations?

- **Type:** `nps` (native Typeform NPS, 0–10, 11 steps)
- **Required:** yes
- **Field ID:** `UBO2gqVqvzz8`

### 9. Why or why not?

- **Type:** `short_text` (open-ended)
- **Required:** no
- **Field ID:** `8nwOzaBDuKHi`
- _(Follow-up a Q8 NPS — pide rationale del score)_

## Thank-you screen

> Thank you for your feedback!

---

## Notas / bugs detectados

- **Q2 typo:** "Sligthly" → debería ser "Slightly".
- **Q4 label typo:** "No at all" → debería ser "Not at all".
- **Q1, Q3, Q6, Q7, Q9 son `short_text`** — para preguntas open-ended de impacto/business outcomes podrían beneficiarse de `long_text` (los sponsors suelen escribir párrafos). Considerar upgrade si se cortan respuestas.
- **Q8 usa `nps` nativo** (no `opinion_scale`) — bien, es el tipo correcto para NPS. Es el único form de la colección que usa el field type nativo de NPS de Typeform.
