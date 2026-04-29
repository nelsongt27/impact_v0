---
description: Actualiza NEXT.md con el estado de la sesión actual antes de cerrar
---

Actualizá (o creá si no existe) el archivo NEXT.md en la raíz del proyecto
con el estado actual de la sesión. Usá exactamente esta estructura:

# NEXT — Axialent Impact Dashboard

_Última actualización: [fecha de hoy en formato YYYY-MM-DD]_

## Dónde quedamos
[Resumen en 2-4 bullets de lo último que estábamos haciendo, incluyendo
archivo y línea específica si aplica. Ser concreto: no "trabajando en el wizard"
sino "agregando filtro de family al wizard en
src/components/wizard/NeedsMappingTab.tsx línea 82, falta validar
el caso cuando family es 'unknown'"]

## Lo que hicimos en esta sesión
[Bullets de cambios concretos: features agregadas, bugs resueltos,
refactors hechos, decisiones tomadas. Incluir archivos tocados y commits si
los hay.]

## Decisiones tomadas
[Decisiones de diseño, arquitectura, o producto que tomamos hoy y que
deberían recordarse. Si no hubo decisiones nuevas, poner "Ninguna en
esta sesión".]

## Siguiente sesión
[Checklist accionable de qué hacer primero al volver. Ordenado por
prioridad. Cada ítem debe ser ejecutable sin contexto adicional.]
- [ ] ...
- [ ] ...

## Preguntas abiertas
[Cosas sin resolver: decisiones pendientes, dudas técnicas, mappings que
pedir confirmación a Nelson, info que falta. Si no hay, poner "Ninguna".]

## Estado del código
- Branch actual: [nombre]
- Commits sin pushear: [sí/no — qué quedó]
- Wizard local: [con cambios sin guardar / clean]
- Última prod deploy: [URL del deploy + status]
- GitHub Action última corrida: [fecha + resultado]

## URLs / accesos clave
- Producción: https://impact-v0.vercel.app (axialent / aX!A20S6)
- Repo: https://github.com/nelsongt27/impact_v0
- Local: http://localhost:3000

---

Importante:
- Si NEXT.md ya existe, reemplazá el contenido entero, no agregues al final.
- No inventes nada. Si no sabés algo (ej: estado de Vercel deploy), ponelo
  como "no verificado".
- Sé específico con nombres de archivos, líneas, y nombres de funciones.
- Si quedó código sin commitear, mencionalo explícitamente y decí qué incluye.
- Si hay overrides en `data/overrides.json` sin commitear, mencionalo.
