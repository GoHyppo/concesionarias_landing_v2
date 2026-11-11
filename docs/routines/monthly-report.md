# Runbook · Parte B de `hyppo-seo-monthly-report`: reporte mensual de concesionaria.ai

Lo ejecuta la rutina cloud `hyppo-seo-monthly-report` (`trig_01LSbNuEUnU5vt9bYsWnohTt`, día 1 de cada mes) **después** de terminar, commitear y reportar su Parte A (hyppo.io). Este repo está clonado como fuente adicional: trabajá con `cd` a ese clon. Cubre el mes calendario anterior. Una falla acá se reporta y nunca revierte ni frena la Parte A.

## 1) Setup

Antes que nada: `git fetch origin main && git checkout -B main origin/main` (el entorno cloud clona en *detached HEAD*).

Reusar el venv de la Parte A (con `playwright` y chromium ya instalados para el PDF). Credenciales igual que en `docs/routines/blog.md` §2: todo por `scripts/gauth.py` de ESTE repo, sin leer ni imprimir la credencial. Si una fuente falla, el reporte lo dice; nunca se inventan números.

## 2) Datos del mes (mes anterior completo vs el previo, y vs el baseline de `docs/gsc/` si existe)

- **GSC** (`sc-domain:concesionaria.ai`, scope webmasters): clicks, impresiones, CTR y posición media; top 10 queries y top 10 páginas con deltas; posiciones de las queries objetivo de `docs/SEO_PLAYBOOK.md`; impresiones por país; rendimiento de las cohortes de `docs/CONTENT_LOG.md`. El SA es siteOwner desde 2026-11-10; baseline de cero en `docs/gsc/BASELINE_20261110.md`. Si la API falla, el reporte lo dice y se sigue.
- **GA4**: propiedad `563697477` (stream web `G-PQD9FKD7M3`, retención de 14 meses). `POST https://analyticsdata.googleapis.com/v1beta/properties/563697477:runReport` (scope `analytics.readonly`). El SA tiene lectura sobre la propiedad (runReport verificado el 2026-11-10); si la API falla, el reporte lo dice y sigue. Datos: sesiones y usuarios totales y de Organic Search, top landing pages orgánicas, engagement, y los eventos `generate_lead`, `book_demo_view`, `whatsapp_click` y `roi_calculated` por página.
- **Asistentes de IA**: sesiones del canal `AI Assistant` (dimensión `sessionDefaultChannelGroup`) del mes vs el mes previo, sus fuentes (`sessionSource`: chatgpt.com, perplexity.ai, gemini.google.com, etc.) y sus top 5 landing pages, en la propiedad `563697477`. Business Hub de ChatGPT no tiene API ni export: leé `/home/user/hyppo_landing/docs/ai/business-hub-insights.md` (repo privado, clonado en la misma sesión). Si tiene una fila de ConcesionarIA leída en los últimos 10 días, sumá sus números (menciones, vistas del perfil, clicks, temas; ventana móvil de 28 días). Si dice que el perfil de ConcesionarIA está reclamado y no hay lectura reciente, va a ACCIONES QUE REQUIEREN A NICO. **Este repo es PÚBLICO**: los números de Business Hub van solo al HTML/PDF de Drive y a Slack, nunca a `docs/reports/AAAA-MM.md` (los términos de OpenAI no permiten publicarlos).
- **Bing** (desde 2026-11-11; Bing es fuente de la búsqueda de ChatGPT y de Copilot): `python3 scripts/bing_wmt.py --site https://concesionaria.ai/ --month AAAA-MM` da clicks e impresiones de Bing del mes vs el previo, top 10 queries y el último crawl. El script lee la variable `BING_WEBMASTER_API_KEY` sin imprimirla: no la leas ni la imprimas vos. Sumalo a la tabla de métricas. Si devuelve `sin BING_WEBMASTER_API_KEY`, va a ACCIONES QUE REQUIEREN A NICO (cargar esa variable en el entorno de las rutinas); otro error se reporta y se sigue. `dias_con_datos` = 0 en noviembre de 2026 es esperable (sitio recién importado).
- **Acciones del mes**: digests de `docs/seo-digests/`, `docs/SEO_TRACKER.md` y `git log --oneline --since` del mes (posts publicados, optimizaciones, pendientes).

## 3) Reporte (corto: resumen, métricas, acciones)

- `docs/reports/AAAA-MM.md`: resumen ejecutivo de 5 líneas · tabla de métricas clave (GSC + GA4 + sesiones desde asistentes de IA, mes vs mes vs baseline) · acciones del mes · efecto compuesto por cohorte · posiciones objetivo · ACCIONES QUE REQUIEREN A NICO (solo si las hay, con el porqué y el dato). No más de ~80 líneas.
- Versión HTML autocontenida en la marca "Capas" (1 página, fondo escarcha `#E9EDF1` con tarjetas blancas, Onest + Spline Sans Mono desde Google Fonts con fallback, tinta noche `#0B1F3A`, texto secundario pizarra `#4A5A70`, rótulos en mono, numerales grandes para las métricas hero, tablas simples, sin degradados, sin emojis) en `/tmp/reporte-concesionaria-AAAA-MM.html`; PDF con chromium headless de playwright (`page.pdf`).
- Drive: dentro de la carpeta compartida `1pUBZifYMcGACLHwA0Al4NrjFmz4b6nzJ`, buscar (o crear si no existe) la subcarpeta `seo-reports-concesionaria`; subir HTML y PDF con la Drive API (`supportsAllDrives=true`) y obtener los `webViewLink`. **No cambiar permisos**: dar acceso público (anyone/reader) lo bloquea el clasificador de la sesión desatendida y no hace falta, porque los archivos heredan el acceso de la carpeta compartida.

## 4) Slack

UN mensaje **aparte** del de hyppo.io al canal `#hyppo-seo` (id `C0BRXEVBQ9Z`), que empiece con `[ConcesionarIA]`: 4 a 6 bullets con los números clave y sus deltas, una línea de cómo vamos contra el objetivo, las acciones que requieren a Nico (o una línea que diga que no hay), y los links al PDF y al HTML de Drive y al reporte en GitHub (`https://github.com/GoHyppo/concesionarias_landing_v2/blob/main/docs/reports/AAAA-MM.md`). Sin saludos ni relleno.

## 5) Commit

`git pull --rebase origin main`, commit SOLO de `docs/reports/AAAA-MM.md` con `concesionaria-seo-report: AAAA-MM` y push a `main` (si lo rechaza, rebase y reintentá). HTML y PDF van a Drive, nunca al repo.

## Guardrails (este repo)

Solo escribir en `docs/reports/`; nunca tocar `src/` ni el contenido del blog; números siempre reales de las APIs (si una fuente falla, el reporte lo dice); sin em-dash; jamás credenciales en commits ni en el output.
