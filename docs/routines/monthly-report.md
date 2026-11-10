# Runbook · Parte B de `hyppo-seo-monthly-report`: reporte mensual de concesionaria.ai

Lo ejecuta la rutina cloud `hyppo-seo-monthly-report` (`trig_01LSbNuEUnU5vt9bYsWnohTt`, día 1 de cada mes) **después** de terminar, commitear y reportar su Parte A (hyppo.io). Este repo está clonado como fuente adicional: trabajá con `cd` a ese clon. Cubre el mes calendario anterior. Una falla acá se reporta y nunca revierte ni frena la Parte A.

## 1) Setup

Reusar el venv de la Parte A (con `playwright` y chromium ya instalados para el PDF). Credenciales igual que en `docs/routines/blog.md` §2: todo por `scripts/gauth.py` de ESTE repo, sin leer ni imprimir la credencial. Si una fuente falla, el reporte lo dice; nunca se inventan números.

## 2) Datos del mes (mes anterior completo vs el previo, y vs el baseline de `docs/gsc/` si existe)

- **GSC** (`sc-domain:concesionaria.ai`, scope webmasters): clicks, impresiones, CTR y posición media; top 10 queries y top 10 páginas con deltas; posiciones de las queries objetivo de `docs/SEO_PLAYBOOK.md`; impresiones por país; rendimiento de las cohortes de `docs/CONTENT_LOG.md`. Si da 403: "Search Console sin acceso del SA (pendiente de Nico)" y seguir.
- **GA4**: propiedad **PENDIENTE** (la de GTM-NSHSFT8S; el ID va en `docs/CONTENT_STRATEGY.md` §8 cuando Nico lo pase). Mientras diga PENDIENTE, saltear GA4 con una nota en el reporte. Cuando exista: `POST https://analyticsdata.googleapis.com/v1beta/properties/<ID>:runReport` (scope `analytics.readonly`): sesiones y usuarios totales y de Organic Search, top landing pages orgánicas, engagement, y los eventos `generate_lead`, `book_demo_view`, `whatsapp_click` y `roi_calculated` por página.
- **Acciones del mes**: digests de `docs/seo-digests/`, `docs/SEO_TRACKER.md` y `git log --oneline --since` del mes (posts publicados, optimizaciones, pendientes).

## 3) Reporte (corto: resumen, métricas, acciones)

- `docs/reports/AAAA-MM.md`: resumen ejecutivo de 5 líneas · tabla de métricas clave (GSC + GA4, mes vs mes vs baseline) · acciones del mes · efecto compuesto por cohorte · posiciones objetivo · ACCIONES QUE REQUIEREN A NICO (solo si las hay, con el porqué y el dato). No más de ~80 líneas.
- Versión HTML autocontenida (1 página, fondo blanco, Space Grotesk desde Google Fonts con fallback, tinta oscura + UN acento violeta `#6D2EFF`, numerales grandes para las métricas hero, tablas simples, sin emojis) en `/tmp/reporte-concesionaria-AAAA-MM.html`; PDF con chromium headless de playwright (`page.pdf`).
- Drive: dentro de la carpeta compartida `1pUBZifYMcGACLHwA0Al4NrjFmz4b6nzJ`, buscar (o crear si no existe) la subcarpeta `seo-reports-concesionaria`; subir HTML y PDF con la Drive API (`supportsAllDrives=true`), permiso anyone/reader, y obtener los `webViewLink`.

## 4) Slack

UN mensaje **aparte** del de hyppo.io al canal `#hyppo-seo` (id `C0BRXEVBQ9Z`), que empiece con `[ConcesionarIA]`: 4 a 6 bullets con los números clave y sus deltas, una línea de cómo vamos contra el objetivo, las acciones que requieren a Nico (o una línea que diga que no hay), y los links al PDF y al HTML de Drive y al reporte en GitHub (`https://github.com/tomilagom/concesionarias_landing_v2/blob/main/docs/reports/AAAA-MM.md`). Sin saludos ni relleno.

## 5) Commit

`git pull --rebase origin main`, commit SOLO de `docs/reports/AAAA-MM.md` con `concesionaria-seo-report: AAAA-MM` y push a `main` (si lo rechaza, rebase y reintentá). HTML y PDF van a Drive, nunca al repo.

## Guardrails (este repo)

Solo escribir en `docs/reports/`; nunca tocar `src/` ni el contenido del blog; números siempre reales de las APIs (si una fuente falla, el reporte lo dice); sin em-dash; jamás credenciales en commits ni en el output.
