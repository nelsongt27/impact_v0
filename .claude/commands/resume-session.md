---
description: Retoma la sesión leyendo NEXT.md y proponiendo por dónde seguir
---

Empezamos nueva sesión de trabajo en Axialent Impact Dashboard. Hacé lo
siguiente en orden:

1. Leé el archivo NEXT.md en la raíz del proyecto.
2. Si existe, leé también CLAUDE.md (contexto general).
3. Resumime en 3-4 líneas el estado actual y qué estábamos por hacer.
4. Verificá que el server local no esté corriendo todavía (no asumas):
   `lsof -nP -iTCP:3000 -sTCP:LISTEN | head -3`. Si está prendido, decímelo.
5. Verificá si hay commits sin pushear: `git status` y `git log origin/main..HEAD`.
6. Proponeme concretamente por qué ítem de la lista "Siguiente sesión"
   arrancamos hoy. Si hay preguntas abiertas relevantes, mencionámelas.
7. Esperá mi confirmación antes de empezar a modificar código o correr
   `bun run dev`.

No asumas nada que no esté en NEXT.md. Si falta info, preguntame.

Notas del proyecto:
- Stack: Next.js 15 · TS strict · Tailwind 3 · Recharts · Bun
- NUNCA correr `bun run build` con `bun run dev` activo (corrompe `.next/`)
- Wizard write-mode solo en local (`bun run dev`); en Vercel es read-only
- Para refrescar data: `bun run refresh` local, o GitHub Action manual dispatch
