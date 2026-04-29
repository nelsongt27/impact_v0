# NEXT — Axialent Impact Dashboard

_Última actualización: 2026-04-29_

## Dónde quedamos

- Acabamos de cerrar Iteración 2 (refresh + changelog + wizard) y aplicamos el design system Axialent. Dashboard live en `https://impact-v0.vercel.app` con basic auth (axialent / aX!A20S6).
- Hay **55 surveys unmapped** esperando mapping manual en `/wizard` → tab "Needs mapping". Es lo más crítico para arrancar la próxima sesión.
- GitHub Action `Refresh Typeform data` configurada y secret seteado, pero todavía NO se ejecutó por primera vez — pendiente trigger manual para validar que el workflow corre end-to-end.

## Lo que hicimos en esta sesión

**Pipeline + datos**
- Construí extractor Typeform incremental (`src/typeform/extract.ts`) — 86 forms, 504 respuestas
- Construí normalizer cross-platform (`src/normalize/`) — clasifica por client/program/family/country/language vía regex patterns
- **Bug crítico arreglado:** SM `single_choice` no tiene `weight` — usa `quiz_options.score:0` (irrelevante). Fix usa `likertLabelToScore(choice.text)` como fallback. Recuperó 1,052 respuestas (cobertura 42% → 82%).

**Dashboard (8 vistas)**
- `/` Overview · `/clients/[slug]` · `/programs/[slug]` · `/facilitators` · `/coaching` · `/voice` · `/tools` · `/wizard`
- Selector temporal `30d/90d/1y/all` con Δ vs período previo en Overview + clients
- Coaching pivot a client-first (era confuso porque solo había 1 coach extraído)
- Voice of Customer: 4 temas frequency-based (no LLM en MVP)
- Tools: dual POV (coach POV vs participant POV), saca metodología real ("Inteligencia Emocional", "Liderazgo Auténtico", "Indagación Productiva", "escalera de inferencias")

**Iteración 2 — refresh + wizard**
- `data/overrides.json` aplicado después de auto-classification (ver `src/normalize/overrides.ts`)
- `data/normalized/changelog.json` generado en cada normalize (compara vs surveys.json previo)
- `/wizard` con 3 tabs: What's new · Needs mapping · Audit
- `/api/overrides` POST auto-corre `bun run normalize` después de save (Bun.spawn) y la página recarga
- "+ Add new…" prominente en dropdowns (era "+ custom…" enterrado al fondo)
- GitHub Action `.github/workflows/refresh-data.yml` (cron 06:00 UTC + manual dispatch)

**Design system**
- `app/tokens.css` (paleta ax-ink 50-950, ax-amber 50-700, paper, cobalt, cyan)
- Fonts vía `next/font`: DM Serif Display + Albert Sans + JetBrains Mono
- Logo Axialent real en header (`public/brand/logo-primary.png`)
- Bulk rename `text-navy*` → `text-ink*` (perl con `\b` boundaries) en 8 page files

**Deploy**
- Pushed a `https://github.com/nelsongt27/impact_v0`
- Proyecto Vercel `impact-v0` linked al repo, auto-deploy en push a `main`
- Basic auth middleware (env vars `DASHBOARD_USER` + `DASHBOARD_PASS`)
- Secret GitHub `TYPEFORM_API_KEY` instalado vía gh CLI

**Workflow / DX**
- Slash commands `.claude/commands/close-session.md` y `.claude/commands/resume-session.md` añadidos al final (este `NEXT.md` lo escribe `/close-session`)

## Decisiones tomadas

- **Wizard write solo en dev** (Vercel filesystem read-only). Edit local → commit → push → redeploy.
- **`2025_survey_monkey/` se commitea al repo** (Nelson confirmó no PII issue, repo privado). Lo necesita el GitHub Action para re-normalizar.
- **`data/forms/` y `data/responses/` quedan gitignored** — el GitHub Action las regenera fresh cada noche desde Typeform API.
- **Cultura Credicorp = 1 programa unificado**, Despegar multi-region = 1 programa con `country` dim, AFNS Gym EXCLUIDO, Templates flagged pero retenidos, SM snapshot final 2025.
- **Filosofía editorial:** hairlines no shadows, B&W + amber accent, italic-on-emphasis, mono para números/eyebrows, paper bg (no white).
- **NUNCA `bun run build` con `dev` activo** — corrompe `.next/` cache (webpack module error). Saved como memoria.

## Siguiente sesión

Ordenado por prioridad:

- [ ] **Verificar GitHub Action end-to-end** — GitHub UI → Actions → "Refresh Typeform data" → Run workflow. Confirmar que extract corre con el secret, normaliza, y commitea (o sale "no changes" si nada cambió). Verificar Vercel auto-redeploya.
- [ ] **Mapear los 55 unmapped surveys** vía `/wizard` local. `bun run dev`, abrir wizard, tab "Needs mapping". Para cada survey: pick client + program + family. Usar `+ Add new…` para crear valores nuevos. Save → auto-normaliza. Después: `git add data/overrides.json data/normalized && git commit && git push`.
- [ ] **Probar el flow completo** post-mapping: ¿el dashboard refleja los nuevos clients/programs en `/clients` y `/programs`? ¿La cuenta de unmapped en `/wizard` baja?
- [ ] **(Opcional) Wizard write en producción**: implementar `/api/overrides` POST que use GitHub API (Octokit + `GITHUB_TOKEN` env var en Vercel) para commitear `overrides.json` desde prod. Hoy es read-only en Vercel — Nelson puede editar desde local solamente.
- [ ] **(Opcional) Aumentar dim coverage 82% → 90%+**: investigar los ~467 responses sin dimension match. Sample 3-5 surveys de baja coverage, ver el wording de questions, expandir matchers.

## Preguntas abiertas

- ¿GitHub Action permission "contents: write" funciona OK la primera vez? Si falla por permission, ir a repo Settings → Actions → Workflow permissions = "Read and write".
- ¿Telus Beyond (730/2,623 = 28% del total) debería contar para el promedio cross-client de Overview o tratarse como case especial? Hoy se incluye — agregar filtro "exclude Telus Beyond" si Nelson lo nota como sesgo.
- ¿Vercel project settings tienen el branch `main` configurado correctamente para auto-deploy? Verificar en próxima sesión.

## Estado del código

- Branch actual: `main`
- Último commit: `d5702e5` "Wizard UX: surface '+ Add new...' option + auto-run normalize on save"
- Commits sin pushear: ninguno (todo synced — verificar con `git status` al volver)
- Wizard local: clean (`data/overrides.json` está vacío `{ surveys: {} }`)
- Última prod deploy: `https://impact-v0-f9suc6xnf-nelson-granjas-projects.vercel.app` → READY · alias `https://impact-v0.vercel.app`
- GitHub Action última corrida: **no corrida todavía** — pendiente trigger manual
- Tests: no hay test suite (smoke testing vía curl en sesiones)

## URLs / accesos clave

- Producción: https://impact-v0.vercel.app (axialent / aX!A20S6)
- Repo: https://github.com/nelsongt27/impact_v0
- Vercel dashboard: https://vercel.com/nelson-granjas-projects/impact-v0
- Local dev: `bun run dev` → http://localhost:3000
- Vercel CLI token: en `/Users/nelsongranja/2_claude_code_repos/2_axialent/axialent-surveymonkey-backup/.env`

## Atajos útiles

```bash
# Dev local
bun run dev

# Re-normalizar tras editar overrides.json manualmente
bun run normalize

# Pull data fresca de Typeform + re-normalizar
bun run refresh

# Push manual a Vercel (CI auto-deploya con git push también)
# Token guardado en /Users/nelsongranja/2_claude_code_repos/2_axialent/axialent-surveymonkey-backup/.env
export VERCEL_TOKEN=$(grep VERCEL_AUTH_TOKEN /Users/nelsongranja/2_claude_code_repos/2_axialent/axialent-surveymonkey-backup/.env | cut -d= -f2)
vercel deploy --prod --yes --token=$VERCEL_TOKEN
```
