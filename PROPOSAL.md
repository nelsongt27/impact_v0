# Axialent Impact Dashboard — Plan / PRD

**Status:** Draft propuesta — pendiente review Nelson
**Fecha:** 2026-04-29
**Autor:** Claude (basado en análisis cross-platform de la data histórica)
**Repo:** `/Users/nelsongranja/2_claude_code_repos/2_axialent/impact_historic`

---

## 1. Executive Summary

Axialent tiene **205 surveys históricos** repartidos entre SurveyMonkey (119) y Typeform (86), con **~2,716 respuestas** acumuladas (2,212 en SM 2025 + 504 en TF 2025-2026). La data cubre workshops, procesos de coaching, programas digitales, diagnósticos de equipos, y check-ins de impacto/ROI.

Los surveys se agrupan en **6 categorías funcionales** y comparten **5 dimensiones Likert recurrentes** (relevance, engagement, facilitator effectiveness, applicability, culture-fit) — esto es la columna vertebral del dashboard.

Propongo un dashboard con **7 vistas** organizadas alrededor de la pregunta "¿qué impacto está generando Axialent?":

1. **Impact Overview** — KPIs cross-client
2. **Per-Client Drill-down** — timeline e impacto por cliente
3. **Per-Program Performance** — rendimiento por programa (Cultura Credicorp, AFNS Gym, etc.)
4. **Facilitator Performance** — efectividad por facilitador cross-client
5. **Coaching Engagement** — tracking participante + coach
6. **Voice of Customer** — clustering de respuestas abiertas
7. **Tools & Concepts Impact** — qué herramientas Axialent generan más impacto

Implementación en **4 fases** (Foundation → Core Views → Advanced Analytics → Predictive).

---

## 2. Data Inventory

### Volúmenes confirmados


| Plataforma           | Surveys | Surveys con responses | Total responses |
| -------------------- | ------- | --------------------- | --------------- |
| SurveyMonkey (2025)  | 119     | 82                    | **2,212**       |
| Typeform (2025–2026) | 86      | 48                    | **504**         |
| **TOTAL**            | **205** | **130**               | **2,716**       |


### Top 10 surveys por volumen de respuestas


| #   | Plataforma | Survey                                                  | Responses |
| --- | ---------- | ------------------------------------------------------- | --------- |
| 1   | SM         | Telus Beyond - Participant Reflection & Feedback        | 730       |
| 2   | SM         | Workshop 1 - Growth Mindset - Credicorp                 | 196       |
| 3   | SM         | Workshop Cultura Credicorp en Acción                    | 176       |
| 4   | SM         | Sesion grupal de coaching - Cultura Credicorp           | 121       |
| 5   | SM         | Cascadeo 2025 - Cultura Credicorp (mar)                 | 89        |
| 6   | SM         | Pulse check reportes directos de Comité BAP             | 85        |
| 7   | SM         | Cascadeo 2025 - Cultura Credicorp (feb)                 | 71        |
| 8   | SM         | Cascadeo 2025 - Cultura Credicorp (jul)                 | 62        |
| 9   | TF         | DESPEGAR LT+ Encuesta Reflexión Participante (kick off) | 52        |
| 10  | SM         | Workshop Perú- Safety Program                           | 44        |


### Clientes con mayor presencia

**SurveyMonkey (2025):** Credicorp (Cultura, Cascadeo, Pulse, Workshops) ~700+ respuestas, Telus (Beyond + Innovation Lab + Development Lab + Coaching) ~770+, CIRION (BG/ARG/BZ multi-fase), Safety Program (Chile/Perú/Colombia), Grupo Posadas, AFNS Gym (interno).

**Typeform (2026):** Despegar LT+ (kick off + Workshop #1 + #2 en MX/ARG/Virtual/BR), Electrolit (Workshops + Coaching), PartnerRe (Workshops + Offsite), Building AI Driven Cultures, Mibanco, AWS (offsites Latam + Business Dev), Pomelo (offsite + coaching), Nocnoc (coaching), Aleatica (SSO offsite + ExCo), BCI (Innovación & Datos).

### Surveys excluidos del scope

- Templates: todos los `TEMPLATE_`* y `TEMPLATE Participant Reflection Survey_AUG2025`, `TEMPLATE Coaching Reflection Survey_AUG2025`, etc. (10+ en TF) — son plantillas sin valor analítico.
- Forms vacíos: `My new form`, `Mi nuevo formulario` (4 en TF) — descartar.
- Surveys sin responses (75 entre ambas plataformas) — listar pero no agregar a métricas.

---

## 3. Survey Taxonomy

### A. Participant Workshop Feedback (~80 surveys, ~1,800 respuestas)

Encuestas de reflexión post-sesión completadas por participantes. **Categoría más grande y la columna vertebral del dashboard.**

**Subtipos:**

- **Standard Participant Reflection Survey** (post-sesión individual) — la mayoría de clientes (Despegar, PartnerRe, Mibanco, Electrolit, Pomelo, Ingram Micro, etc.)
- **Final Session Reflection** — versión cierre de programa (`*_Final Session`)
- **Telus Beyond Participant Reflection** — mega-volume (730), case especial
- **Multi-region variants** (Chile/Perú/Colombia Safety, MX/ARG/Virtual/BR Despegar) — mismo survey, distinto país
- **Multi-language** (ES/EN/PT/Português)

**Dimensiones medidas:** ver §5.

### B. Facilitator Debrief (~25 surveys, ~80 respuestas)

Auto-evaluación post-sesión completada por el facilitador.

**Subtipos:**

- Standard Facilitator Debrief Survey (multi-cliente)
- Per-facilitator: Pablo Carter, Gustavo Leon, Joao Adao, Thierry, Richi Gil, Nicole, etc.
- Per-cliente/programa: AWS, BCI, Electrolit, Pomelo, Nocnoc, Aleatica

### C. Coaching Engagement (~45 surveys, ~150 respuestas)

Engagements 1:1 o grupales — dos POVs:

**C1. Participant POV — "Coaching Reflection Survey" / "Reflexión Sesiones de Coaching Participante"**

- Per-coachee: Ilan Bajarlia, Sergio Bernardes, Gaston Irigoyen, Sebastián Arlin, Joaquín Colella, Agustín Beccar Varela, Claudia Ramos, Elena Sancho
- Per-cliente: BCI, Credicorp, Pomelo, AWS, Aleatica, Nocnoc, Root Capital, Danone, Telus

**C2. Coach POV — "Coaching Process Tracking Form" / "Registro Proceso de Coaching"**

- Per-coach: Joao Adao, Thierry Debeyssac, Pablo Carter
- Per-cliente: Aleatica, Electrolit, BCI, Credicorp, Danone

**C3. Coach Selection / Coach Satisfaction**

- Fem Care RDLT, Fem Care NA FST, Baby Care NA LT — surveys cortos para matching coach-coachee

### D. Team Diagnostics (~10 surveys, ~80 respuestas)

Assessments de salud/funcionamiento de equipo (no programa).

**Subtipos:**

- **Lencioni** (5 dysfunctions of a team) — Sigma Marketing, Electrolit Leadership Team, Peñafiel
- **¿Dónde estamos como equipo?** / "Onde estamos como equipe?" — Pomelo LT, Despegar 2025
- **Pulse Check** (Comité BAP — Credicorp directorio) — recurring
- **Formulario Check In - ELT** — Electrolit Leadership Team

### E. Impact & ROI (~5 surveys, escasos pero estratégicos)

**Esta es la categoría más importante para el dashboard de IMPACTO.**

**Subtipos:**

- **Post Program Impact & ROI Check-In** — sponsor/HR-side, mide leadership shifts + business outcomes + worth as investment + NPS
- **Client Needs Analysis & Impact Design** — pre-engagement (input)
- **Ingram Micro: Avaliação de Impacto e ROI após o Programa** — variante PT
- **Building AI Driven Cultures FINAL Feedback Survey** — post-program específico AI

### F. Internal & Recurring Programs (~40 surveys, ~250 respuestas)

Programas que corren en ciclos (no eventos puntuales).

**Subtipos:**

- **Cultura Credicorp** — multi-survey: Cascadeo (mensual), Equipo de Cultura, Sesion grupal de coaching, Workshop Cultura en Acción, Planes de acción, Equipo Datos & Innovación BCI
- **CIRION - Potenciando conversaciones desafiantes** — multi-fase BG/ARG/BZ: Facilitación 1, Facilitación 2, Clínica conversacional/de conversas
- **TELUS Programs** — Innovation Lab + Development Lab (multi-país)
- **AFNS Gym** (interno Axialent partners) — series temáticas: Team Coaching, Business Meeting Facilitation, Digital Offering, Resilience, In the Spotlight, Four Dimensions of Meaning
- **AI Adoption Survey (Partners)** — interno Axialent
- **Encuesta a Clientes Internos – Equipo de Innovación & Datos (BCI)** — recurrente anual
- **PCP Managing Excellence Journey Wave 5**
- **TI Leadership Innovation Lab** (Guatemala/El Salvador, India, Philippines)

---

## 4. Cross-Platform Mapping

Algunos surveys aparecen en **ambas plataformas** porque Axialent migró parcialmente de SM → TF. Hay que unificarlos:


| Survey familia                 | SurveyMonkey 2025                                          | Typeform 2026                                      |
| ------------------------------ | ---------------------------------------------------------- | -------------------------------------------------- |
| Coaching Reflection Survey     | `522796576_Coaching Reflection Survey.json`                | múltiples (Nocnoc/AWS/Aleatica)                    |
| Coaching Process Tracking Form | `417842651_Coaching Process Tracking Form.json`            | `K1d3sx6P` (Joao Adao 2026), `tVG76MWn` (TEMPLATE) |
| Participant Reflection Survey  | `417825660_Participant Reflection Survey - June 2025.json` | múltiples + `seMiXkJ7` (TEMPLATE_AUG2025)          |
| Facilitator Debrief Survey     | `522798699_Facilitator Debrief Survey June 2025.json`      | múltiples + `Iioe7VgM` (TEMPLATE_AUG2025)          |
| Post Program Impact & ROI      | `417852868_Post Program Impact ROI Check-In.json`          | `spa8kDpY` (TEMPLATE_AUG2025)                      |
| Client Needs Analysis          | `522797055_Client Needs Analysis Impact Design.json`       | `gkNENiTm` (TEMPLATE_AUG2025)                      |
| Encuesta Clientes Internos BCI | `420189805_Encuesta a Clientes Internos...`                | `hptpIV0G` (versión 2026)                          |
| Cultura Credicorp Cascadeo     | múltiples meses 2025                                       | (no migrado — solo SM)                             |


**Política propuesta:** unificar por **(survey_family, client, program, instance_date)** — no por survey ID. Construir una `survey_family_id` derivada del titulo + heurísticas en la capa de normalización.

---

## 5. Common Question Patterns

### 5.1 Dimensiones Likert recurrentes en **Participant Reflection** (cross-platform)

Verificado en SM (SIGMA, PartnerRe, Cascadeo) y TF (Despegar, Building AI Driven Cultures, Mibanco):


| #   | Dimensión                     | Pregunta típica                                                                                       |
| --- | ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1   | **Relevance**                 | "This session is relevant to my current leadership challenges or aspirations."                        |
| 2   | **Engagement**                | "The session was engaging and supported my learning."                                                 |
| 3   | **Facilitator Effectiveness** | "The facilitator was effective in delivering the content and supporting your learning."               |
| 4   | **Applicability**             | "I feel confident in my ability to apply what I learned to real workplace challenges."                |
| 5   | **Culture-fit**               | "This experience is consistent with the values and culture we strive to embody in our everyday work." |


Escala: 1-5 (Likert). **Estas 5 dimensiones son la columna vertebral cross-survey del dashboard.**

### 5.2 Dimensiones recurrentes en **Facilitator Debrief**


| #   | Dimensión                | Pregunta típica                                                                         |
| --- | ------------------------ | --------------------------------------------------------------------------------------- |
| 1   | Goal achievement         | "¿En qué medida la sesión cumplió con sus objetivos?"                                   |
| 2   | Connection/Rapport       | "¿Cuál fue el nivel de conexión en la sala?"                                            |
| 3   | Participant commitment   | "¿Cuál fue el nivel de compromiso de los participantes?"                                |
| 4   | Self-rated effectiveness | "¿Cómo calificarías tu efectividad como facilitador?"                                   |
| 5   | Logistics                | "¿En qué medida el programa se desarrolló sin inconvenientes en términos de logística?" |


### 5.3 Dimensiones en **Coaching Reflection (Participant POV)**


| #   | Dimensión              | Pregunta típica                                                         |
| --- | ---------------------- | ----------------------------------------------------------------------- |
| 1   | Progress on challenges | "This session supported my progress on leadership challenges or goals." |
| 2   | Coach effectiveness    | "My coach was effective in guiding me toward clarity or solutions."     |
| 3   | Communication openness | "Communication with my coach supported openness and clarity."           |
| 4   | Safety                 | "I felt safe and supported to share my thoughts and concerns."          |


### 5.4 Coaching Process Tracking (Coach POV) — campo CLAVE

`Main tools / concepts applied during the sessions. Please indicate all that apply` (multi-select)

**Esto es oro** — permite rastrear qué herramientas/conceptos Axialent se aplican y cruzarlos con los outcomes reportados por el participante. → Vista §7.7 "Tools & Concepts Impact".

### 5.5 NPS estándar

Aparece en AFNS Gym ("how likely are you to recommend this to a colleague?"), Post Program Impact, y Building AI Driven Cultures. Escala 0-10.

### 5.6 Open-ended (qualitativo) recurrente

- "Which topics/tools have had the biggest impact on your thinking or leadership so far?"
- "What would improve your experience?"
- "What was the most valuable insight or takeaway?"
- "What business outcomes have these leadership shifts impacted?" (Impact ROI)
- "What additional support would help you sustain or build on the program's impact?"

→ Vista §7.6 "Voice of Customer" — clustering / theme extraction.

---

## 6. Operational Definition of "Impact"

Extraído directamente de `Post Program Impact & ROI Check-In` (la propia Axialent ya definió esto):

**Impact = combinación de:**

1. **Leadership shifts observables** en participantes post-programa (cambios de comportamiento, decisiones, dinámica de equipo)
2. **Business outcomes ligados a esos shifts** (productividad, engagement, retención — cuando es medible)
3. **Worthwhile-as-investment rating** del sponsor (Likert)
4. **Tangible impact rating** sobre liderazgo y cultura organizacional (Likert)
5. **NPS / recommend-to-other-teams** (Likert/0-10)
6. **Sustainability** — ¿qué soporte adicional necesitan para mantener el impacto?

Estas 6 son las **KPIs primarias del dashboard "Impact Overview"**.

**KPIs secundarias** (proxy de impacto, derivadas de Participant Reflection):

- Avg score de las 5 dimensiones Likert (relevance, engagement, facilitator, applicability, culture-fit)
- Δ entre kick-off y final session (cuando hay ambos puntos)
- NPS aggregate por programa

---

## 7. Dashboard Architecture

7 vistas. Cada una con su data source, métricas, y recomendación de visualización.

### 7.1 Impact Overview (vista principal)

**Audiencia:** liderazgo Axialent, sponsors externos.


| Data Source               | Metric                                    | Visualization                     |
| ------------------------- | ----------------------------------------- | --------------------------------- |
| Post Program Impact & ROI | Avg "tangible impact" rating cross-client | Big number + sparkline trimestral |
| Post Program Impact & ROI | Avg NPS (0-10) cross-client               | Gauge + delta vs trim anterior    |
| Post Program Impact & ROI | "Worth as investment" rating              | Big number                        |
| Participant Reflection    | Avg Applicability (Q4) cross-client       | Big number — proxy de impacto     |
| Participant Reflection    | Total participants reached YTD            | Big number                        |
| All sources               | # programs delivered YTD                  | Big number                        |
| All sources               | Map cliente × país × programa             | World map / heatmap               |


### 7.2 Per-Client Drill-down

**Audiencia:** account leads, KAMs.


| Data Source                                     | Metric                                                     | Visualization             |
| ----------------------------------------------- | ---------------------------------------------------------- | ------------------------- |
| All Participant Reflection (filtered by client) | Timeline scores 5 dimensiones                              | Line chart con 5 series   |
| Coaching Reflection (filtered by client)        | Coachee progress over time                                 | Line chart                |
| Post Program Impact (filtered by client)        | Latest impact ratings                                      | Spider/radar chart        |
| All open-ended (filtered)                       | Voice of Customer wordcloud + theme list                   | Wordcloud + theme bullets |
| Facilitator Debrief (filtered)                  | Facilitator self-rated effectiveness vs participant rating | Side-by-side bar          |
| All sources                                     | Total touchpoints (workshops + coaching + diagnostics)     | Timeline scatter          |


### 7.3 Per-Program Performance

**Audiencia:** program owners. Programas: Cultura Credicorp, AFNS Gym, CIRION, TELUS Labs, Building AI Driven Cultures, Despegar LT+, Safety Program, etc.


| Data Source                                  | Metric                                         | Visualization |
| -------------------------------------------- | ---------------------------------------------- | ------------- |
| Participant Reflection (filtered by program) | 5 Likert dimensions trend across program waves | Line chart    |
| Facilitator Debrief                          | Facilitator effectiveness across program       | Bar           |
| Multi-wave programs (Cascadeo, CIRION)       | Δ score between phase 1 and phase 2            | Slope chart   |
| Coaching tracking (linked program)           | # sessions delivered, tools applied            | Stacked bar   |


### 7.4 Facilitator Performance

**Audiencia:** Axialent operations / facilitator development.


| Data Source                                           | Metric                              | Visualization                   |
| ----------------------------------------------------- | ----------------------------------- | ------------------------------- |
| Participant Reflection Q3 (Facilitator effectiveness) | Avg by facilitator                  | Bar chart ranked                |
| Facilitator Debrief self-rating                       | Self vs participant rating delta    | Scatter (self-awareness signal) |
| All Participant Reflection (filtered by facilitator)  | NPS by facilitator                  | Bar chart                       |
| Facilitator Debrief Q5 (Logistics)                    | Logistics avg by facilitator        | Bar                             |
| All sessions                                          | # sessions delivered by facilitator | Bar                             |


### 7.5 Coaching Engagement

**Audiencia:** coach managers, coachees, KAMs.


| Data Source                       | Metric                                     | Visualization         |
| --------------------------------- | ------------------------------------------ | --------------------- |
| Coaching Reflection (participant) | Progress score across sessions per coachee | Line per coachee      |
| Coaching Process Tracking (coach) | Goal achievement rating per coach          | Bar                   |
| Coaching Process Tracking         | Tools/concepts applied (multi-select)      | Stacked bar by client |
| Coach Selection/Satisfaction      | Match scores                               | Heatmap               |
| Cross-source                      | Coach POV vs Coachee POV alignment         | Side-by-side bar      |


### 7.6 Voice of Customer

**Audiencia:** producto/contenido Axialent, marketing case-studies.


| Data Source                                   | Metric                        | Visualization                 |
| --------------------------------------------- | ----------------------------- | ----------------------------- |
| All open-ended responses                      | Top themes (LLM-clustered)    | Theme list with quote samples |
| "Most valuable insight" responses             | Wordcloud / phrase frequency  | Wordcloud                     |
| "What would improve" responses                | Negative themes               | Theme list                    |
| "Business outcomes" responses (Impact ROI)    | Quantified outcomes mentioned | Highlight quotes table        |
| Cross-filter por cliente/programa/facilitador | Filter stack                  | UI controls                   |


### 7.7 Tools & Concepts Impact

**Audiencia:** Axialent product/methodology owners. **Vista única — no existe en otras consultoras de su tipo.**


| Data Source                              | Metric                                           | Visualization         |
| ---------------------------------------- | ------------------------------------------------ | --------------------- |
| Coaching Process Tracking (coach POV)    | Frequency of each tool/concept applied           | Bar chart ranked      |
| Linked Coaching Reflection (coachee POV) | Avg "progress" rating per session × tool applied | Heatmap tool × score  |
| All sessions where tool X was applied    | Coachee qualitative outcome themes               | Theme list per tool   |
| Cross-program                            | Which tools migrate across programs?             | Sankey program → tool |


---

## 8. Cross-Cutting Filters

Aplicables a cualquier vista:

- **Cliente** (Credicorp, BCI, Despegar, Telus, Electrolit, Pomelo, Aleatica, AWS, PartnerRe, Mibanco, Ingram Micro, CIRION, Danone, Nemak, Grupo Posadas, Sigma, Straumann, Scenic, Nocnoc, Root Capital, Tecnobit, Oesia, Supervia, Peñafiel, P&G, Fem Care, AFNs internal, etc.)
- **Programa** (Cultura Credicorp, AFNS Gym, Despegar LT+, CIRION, TELUS Labs, Safety Program, Building AI Driven Cultures, etc.)
- **Tipo de survey** (las 6 categorías §3)
- **Facilitador** (Pablo Carter, Joao Adao, Thierry Debeyssac, Richi Gil, Gustavo Leon, Nicole, Christian, Piedad, Ekin, etc.)
- **Coach** (Joao Adao, Thierry Debeyssac, Pablo Carter, Sergio Ledesma, etc.)
- **Coachee** (Ilan Bajarlia, Sergio Bernardes, Gaston Irigoyen, etc.)
- **País / Región** (México, Argentina, Brasil, Perú, Chile, Colombia, India, Philippines, Guatemala, El Salvador)
- **Idioma** (ES, EN, PT)
- **Periodo** (mes / trimestre / año)
- **Plataforma origen** (SM / TF) — útil para auditar migración

---

## 9. Implementation Phases

### Fase 1 — Foundation (1-2 semanas)

- ✅ Typeform extractor (DONE — bun extractor en `src/typeform/`)
- **SurveyMonkey extractor o normalizer** sobre la data ya bajada en `2025_survey_monkey/`
- **Schema de normalización canónica** (`survey_family`, `client`, `program`, `facilitator`, `coach`, `instance_date`, `language`, `dimensions`)
- **Mapping de title → survey_family** (regex + override manual donde fuerce)
- **Mapping de title → client** (lookup + manual)
- **DB de destino** decidida (DuckDB local, SQLite, Postgres, JSON files curados — depende de tech stack frontend)

### Fase 2 — Core Views (2-3 semanas)

- Vista 7.1 Impact Overview
- Vista 7.2 Per-Client Drill-down
- Vista 7.3 Per-Program Performance
- Filtros cross-cutting básicos (client, program, period)

### Fase 3 — Advanced Views (2-3 semanas)

- Vista 7.4 Facilitator Performance
- Vista 7.5 Coaching Engagement (incluye link coach POV ↔ participant POV)
- Vista 7.6 Voice of Customer (LLM theme clustering)
- Vista 7.7 Tools & Concepts Impact (vista diferenciadora)

### Fase 4 — Predictive / Closing the Loop (opcional, 2-4 semanas)

- Δ kick-off → final session por participante (impact gain)
- Predictor de NPS basado en early-session ratings
- Alertas (cliente con Δ negativo entre fases)
- Export PDF case-studies por cliente

---

## 10. Open Questions for Nelson

Antes de implementar, decisiones que necesito de vos:

1. **Audiencia primaria del dashboard:** ¿es interno Axialent (operations / leadership) o también lo verán clientes? liderazgo por ahora .. luego clientes
2. **Tech stack:** ¿pensás en Streamlit / Next.js + dashboard lib / Metabase / Tableau / algo custom? Esto afecta Fase 1 (DB). lo mas facil. la primera ditia. 
3. **Hosting:** ¿local-only, Vercel/Netlify, on-prem Axialent? vercel. 
4. **PII:** los Coaching Process Tracking llevan nombre de coachee. ¿Anonimizar antes de construir, o Audiencia es solo interna y no hace falta? no hace falta. 
5. **Periodo histórico:** la propuesta cubre 2025 (SM) + 2025-2026 (TF). ¿Querés data anterior a 2025? ¿Hay backups en SM cuenta de años previos? no hace falta. 
6. **Telus Beyond (730 respuestas):** es un outlier de volumen. ¿Es un programa externo grande o un misclassification? ¿Lo tratamos como "case study único" o como cliente? si hay que tratarlo como un programa digital a escala. 
7. **Cultura Credicorp:** tiene 4 surveys de Cascadeo en 2025 (mismo título, distintos meses). ¿Los tratamos como **waves del mismo survey** o como surveys separados? si. 
8. **Multi-region surveys** (Despegar MX/ARG/Virtual/BR): ¿unificar bajo "Despegar LT+ Workshop #1" con dimensión "país", o separados? si unifica bajo despegar con dimension pais. 
9. **Definición de "programa":** ¿Cultura Credicorp es 1 programa o varios (Cascadeo + Workshop + Sesion grupal + Equipo de Cultura)?  es un programa. 
10. **Prioridad relativa entre las 7 vistas:** si tuvieras que entregar solo 3 primero, ¿cuáles? 1-4
11. **SurveyMonkey: re-extraer o usar el snapshot actual?** El backup tiene fecha `2026-04-27`. ¿Hay surveys que cambiaron desde entonces? ¿O construimos un extractor SM análogo al de TF? ya no va haber mas de survey monkey. solo typeform. 
12. **Templates en Typeform:** ¿son aspiracionales (futuros surveys) o residuales (limpiar la cuenta)? son templates actuales y futuros. no limpies nada. 
13. **AFNS Gym:** parece interno (entrenamiento de partners Axialent). ¿Vista separada o mezclar con el dashboard general? no lo incluyas. 

---

## Appendix A — Data Locations

- Typeform raw data: `/Users/nelsongranja/2_claude_code_repos/2_axialent/impact_historic/data/`
  - `forms_index.json` — 86 forms metadata
  - `forms/{id}.json` — 86 form definitions
  - `responses/{id}.jsonl` — 86 response files (504 total)
  - `state.json` — incremental tracking
- SurveyMonkey raw data: `/Users/nelsongranja/2_claude_code_repos/2_axialent/impact_historic/2025_survey_monkey/`
  - 119 files organized by month (`01/` through `12/`)
  - Each file: `{survey_id}_{name}.json` con `_backup_metadata`, `details`, `responses`
- Internal PRDs: `~/.claude/MEMORY/WORK/`
  - `20260429-094000_typeform-extractor-build/PRD.md` — Typeform extractor (DONE)
  - `20260429-095700_dashboard-proposal-prd/PRD.md` — este PRD

## Appendix B — Schemas (preliminar)

### Typeform (de `forms/{id}.json`)

```ts
{
  id: string,
  type: "quiz" | "score",
  title: string,
  workspace: { href },
  fields: [{ id, ref, type, title, properties, validations }],
  thankyou_screens: [...],
  welcome_screens: [...],
  settings: { language, ... }
}
```

Response (de `responses/{id}.jsonl`):

```ts
{
  response_id, token, landed_at, submitted_at,
  hidden, calculated, variables,
  answers: [{ field: { id, type }, type, ...value }]
}
```

### SurveyMonkey (de `details` en cada file)

```ts
{
  id, title, nickname, language, category,
  date_created, date_modified,
  question_count, response_count, page_count,
  pages: [{ questions: [{ family, subtype, headings: [{ heading }], answers }] }]
}
```

Response (de `responses[]`):

```ts
{
  id, recipient_id, collection_mode, response_status,
  date_created, date_modified, total_time,
  pages: [{ questions: [{ id, answers: [...] }] }]
}
```

---

**Próximo paso recomendado:** revisar §10 con Nelson y, una vez resueltas las decisiones, comenzar Fase 1 (normalizer + schema canónico).