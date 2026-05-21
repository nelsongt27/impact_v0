# 07_TEMPLATE_CLA_IMPACT_ING

- **Form ID:** `pOUwCYuh`
- **Type:** quiz
- **Language:** en
- **Audience:** Leader who completed Conscious Leadership Assessment + debrief conversation with Axia
- **Created:** 2026-04-20
- **Last updated:** 2026-05-21
- **Published:** 2026-04-20
- **Display URL:** https://form.typeform.com/to/pOUwCYuh
- **Hidden fields:** `bussinesname` _(passed via URL param)_
- **Total fields:** 6 (4 opinion_scale + 2 long_text)

## Welcome screen

> **Conscious Leadership Assessment — Debrief**
>
> Congratulations on completing the process! A couple of quick questions (~3 minutes) to capture what you're taking away from this experience.

## Questions

### 1. This experience revealed something about how I lead that I hadn't seen with the same clarity before.

- **Type:** `opinion_scale` (1–5, starts at 1)
- **Required:** yes
- **Field ID:** `JF4aMYennc1c`
- **Ref:** `q1_revelacion`
- **Labels:** Strongly disagree → Strongly agree

### 2. The conversation with Axia made me think more deeply than I would have by reviewing the report on my own.

- **Type:** `opinion_scale` (1–5, starts at 1)
- **Required:** yes
- **Field ID:** `wE5MwqNGBg4V`
- **Ref:** `q2_valor_axia`
- **Labels:** Strongly disagree → Strongly agree

### 3. I identified a specific pattern I want to work on.

- **Type:** `opinion_scale` (1–5, starts at 1)
- **Required:** yes
- **Field ID:** `bQwfqWBfyg5U`
- **Ref:** `q4_patron`
- **Labels:** Strongly disagree → Strongly agree

### 4. In one sentence: what is the most important realization you're taking away?

- **Type:** `long_text` (open-ended)
- **Required:** yes
- **Field ID:** `gvHYyYioztWD`
- **Ref:** `q3_realizacion`

### 5. What will you do differently in the next two weeks?

- **Type:** `long_text` (open-ended)
- **Required:** yes
- **Field ID:** `6gKzaDGLXPPE`
- **Ref:** `q5_accion`

### 6. How likely are you to recommend this experience to another leader?

- **Type:** `opinion_scale` (0–10, 11 steps, NPS-style, starts at 0)
- **Required:** yes
- **Field ID:** `es2k91SbqOT4`
- **Ref:** `q6_nps`
- **Labels:** Strongly disagree → Strongly agree _(sic — labels heredados de las preguntas 1-3; semánticamente debería ser Not at all likely → Extremely likely para un NPS)_

## Thank-you screen

> Muchas gracias por sus comentarios!

---

## Notas

- **Numeración de refs no es secuencial:** el orden es q1 → q2 → q4 → q3 → q5 → q6 (q3 está después de q4). Sugiere que q3 fue reordenada durante el diseño.
- **Hidden field `bussinesname`** se inyecta vía URL — para distinguir respuestas por cliente/empresa (typo en el nombre: "bussinesname" en lugar de "businessname").
- **Pregunta NPS final (#6)** hereda labels de Likert "Strongly disagree/agree" — anti-patrón, debería usar "Not at all likely / Extremely likely". Marcar como bug si el equipo lo quiere corregir.
- Thank-you en español pero el resto del form en inglés.
