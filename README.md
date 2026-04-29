# Axialent — Impact Dashboard

Dashboard de impacto sobre la data histórica de surveys de Axialent (Typeform + SurveyMonkey).

## Stack

- **Next.js 15** App Router + React 18 + TypeScript strict
- **Tailwind CSS** con paleta de marca Axialent (Navy + Golden Yellow)
- **Recharts** para visualizaciones
- **Bun** para extracción y normalización de data
- Data: JSON estático en `data/normalized/` (consumido por Next.js al build)
- Deploy target: **Vercel**

## Pipeline

```
Typeform / SurveyMonkey raw  →  bun run normalize  →  data/normalized/*.json  →  Next.js dashboard
```

## Setup

```bash
bun install
cp .env.example .env  # llenar TYPEFORM_API_KEY si vas a re-extraer
```

## Comandos

```bash
# Pipeline de data
bun run extract              # baja respuestas Typeform (incremental)
bun run extract:typeform:full  # full refresh
bun run normalize            # normaliza SM + TF → data/normalized/*.json

# Dashboard
bun run dev                  # dev server en http://localhost:3000
bun run build                # build prod (corre normalize automático via prebuild)
bun run start                # sirve build prod
```

## Vistas

**Core (Fase 2):**

1. **Overview (`/`)** — KPIs cross-client + trend de las 5 dimensiones Likert + distribución por tipo de survey + top 10 clientes.
2. **Clients (`/clients`)** — lista + drill-down por cliente con timeline, programas, voice of customer, y tabla de surveys.
3. **Programs (`/programs`)** — lista + drill-down por programa con KPIs, trend wave-by-wave (útil para Cascadeo Cultura Credicorp), y surveys con país/idioma.
4. **Facilitators (`/facilitators`)** — ranking por efectividad, sesiones delivered, y tabla detalle por facilitador con clientes alcanzados.

**Advanced (Fase 3):**

5. **Coaching (`/coaching`)** — coach POV ↔ coachee POV: tablas de coachees con avg progress + coach effectiveness, y de coaches con sessions delivered + self-rated connection/engagement.
6. **Voice (`/voice`)** — temas de respuestas abiertas agrupadas en 4 categorías (Biggest impact, What would improve, Most valuable insight, Business outcomes) con frequency-based phrase ranking + sample quotes. Filtro por cliente.
7. **Tools (`/tools`)** — herramientas y conceptos Axialent ranked por frequency, dual POV: coach (qué aplican en sesiones) vs participant (qué dijo que tuvo más impacto).

## Estructura

```
app/                     # Next.js App Router
  layout.tsx
  page.tsx               # Vista 1
  clients/{,[slug]}/page.tsx   # Vista 2
  programs/{,[slug]}/page.tsx  # Vista 3
  facilitators/page.tsx        # Vista 4
src/
  components/            # KpiCard, ChartCard, Header, Nav, charts/...
  lib/                   # data, aggregations, format, slug
  normalize/             # canonical schema + normalizer (Bun)
  typeform/              # Typeform extractor (Bun)
data/
  forms_index.json       # raw TF (gitignored)
  forms/                 # raw TF (gitignored)
  responses/             # raw TF (gitignored)
  normalized/            # canonical (committed, consumed by Next.js)
2025_survey_monkey/      # raw SM 2025 snapshot (one-shot, no re-extraction)
```

## Deploy a Vercel

1. `vercel link` (o conectar el repo desde el dashboard de Vercel)
2. Push a la rama de deploy
3. Vercel detecta Next.js automático, corre `bun run build` (que también corre `normalize`)

No hace falta DB ni env vars en Vercel: la data va bundle-ada en el build.

## Decisiones de diseño

- **Audiencia:** liderazgo Axialent (interno).
- **No PII alarms:** uso interno autorizado por Nelson.
- **AFNS Gym excluido** del dashboard (programa interno de partners).
- **Cultura Credicorp** = 1 programa (Cascadeo, Workshops, Sesion grupal todos agregan).
- **Despegar LT+** = 1 programa con país como dimensión (MX/AR/BR/Virtual).
- **Telus Beyond** = programa digital a escala (730 respuestas, top 1 por volumen).
- **Templates Typeform** preservados en data pero filtrados de las vistas.
