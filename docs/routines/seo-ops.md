# Runbook · Parte B de `hyppo-seo-ops`: SEO ops de concesionaria.ai

Lo ejecuta la rutina cloud `hyppo-seo-ops` (`trig_01TjWqqD71qaKmqquLqWKSK9`) **después** de terminar, commitear, pushear y reportar su Parte A (hyppo.io). Este repo está clonado como fuente adicional: trabajá con `cd` a ese clon. Una falla acá se reporta y nunca revierte ni frena la Parte A.

## 0) ¿Toca hoy?

Solo los **jueves** (`TZ=America/Argentina/Buenos_Aires date +%u` = 4). Otro día, imprimí `concesionaria seo-ops: no toca hoy` y terminá.

Leé primero, enteros: `CLAUDE.md`, `docs/SEO_PLAYBOOK.md` (mapa de keywords), `docs/SEO_TRACKER.md`, `docs/CONTENT_STRATEGY.md`, `docs/CONTENT_LOG.md`, el último digest de `docs/seo-digests/` y el baseline de `docs/gsc/` si existe.

Credenciales: igual que en `docs/routines/blog.md` §2 (venv de la Parte A, `scripts/gauth.py` de ESTE repo, nunca leer ni imprimir la credencial; si falla, correr sin GSC y reportarlo).

## 1) SENSE

a. `git fetch origin main && git checkout -B main origin/main && npm ci && npm run verify` (el entorno cloud clona en *detached HEAD*; sin el checkout el `git pull --rebase` del commit falla). Si falla, arreglar los errores del validador es clase pre-aprobada (con la excepción del feed y de los claims: ahí el bug está en el contenido, nunca en el chequeo).
b. **Sitio vivo**: `curl -s https://concesionaria.ai/sitemap-0.xml`, y con `curl -sI` + `curl -s` una muestra de 10 URLs (home, `/producto/`, `/para-concesionarias/`, `/integraciones/`, `/demo/`, `/calculadora-roi/`, `/casos/grupo-garden/`, `/blog/` y 2 posts recientes): 200, canonical autorreferencial, sin `noindex`. Además: `/producto` (sin barra) tiene que dar 301 a `/producto/`; `http://concesionaria.ai/` tiene que redirigir a `https://`; `robots.txt`, `llms.txt` y `sitemap-index.xml` en 200; `/precios/` en 200 mientras `PRICING_PUBLISHED` sea true (404 si se despublica). En el HTML vivo de la home tienen que estar `GTM-NSHSFT8S` y `gtag/js?id=G-PQD9FKD7M3`: si falta alguno, la medición está caída (crítico).
c. **Canario Safe Browsing**: `curl -s 'https://transparencyreport.google.com/transparencyreport/api/v3/safebrowsing/status?site=concesionaria.ai'`; el segundo campo del array es el status (1 = limpio). Si no da 1, va PRIMERO en el digest como crítico, con el output crudo.
d. **Feed**: `curl -sI https://concesionaria.ai/blog/rss.xml` en 200 con content-type XML (GitHub Pages puede servir `application/xml` o `application/rss+xml`; los dos sirven), y el XML parsea sin `<author>` y sin `<lastBuildDate>` dentro de items. Si falla, es crítico.
e. **Salud del deploy**: confirmá que el último commit de `main` está en producción. Con `gh run list --repo GoHyppo/concesionarias_landing_v2 --branch main --limit 3` si hay `gh`, o con la API pública de GitHub (`/repos/GoHyppo/concesionarias_landing_v2/actions/runs?branch=main&per_page=3`). Un run fallido (verify en rojo o deploy caído) es crítico. Contraste extra: el post más nuevo de `src/content/blog/` tiene que responder 200 en vivo.
f. **Acceso de asistentes de IA** (desde 2026-11-11): `npm run check:ai` (`scripts/check-ai-access.mjs --live`) valida el robots.txt vivo y la clave de IndexNow, y pide el home, `/robots.txt` y `/llms.txt` con el user-agent real de OAI-SearchBot, ChatGPT-User, GPTBot, Perplexity, Claude y Bingbot: todos tienen que dar 200. Si falla es crítico: ChatGPT, Perplexity y Claude dejan de poder leer y citar el sitio. El arreglo va en robots.txt, en el deploy o en el servidor (si es del servidor o de un firewall, proponelo para Nico); nunca se arregla sacando un bot del script.

## 2) MEASURE (GSC `sc-domain:concesionaria.ai`, scope webmasters)

El SA es siteOwner de la propiedad desde 2026-11-10. Si la API falla (403 o error), anotalo como crítico para Nico y saltá a REPORT.

a. Serie por fecha de los últimos 28 días (clicks, impresiones) con delta contra el digest anterior y contra `docs/gsc/BASELINE_20261110.md` (cero clicks y cero impresiones en los 90 días previos al relanzamiento). En la primera corrida con datos, guardá además el snapshot en `docs/gsc/baseline_AAAAMMDD.json`.
b. Posiciones de las queries objetivo del mapa de keywords (`docs/SEO_PLAYBOOK.md`), con dimensions `[query,page]`: impresiones, posición y qué URL rankea. Marcá canibalización si dos URLs propias se reparten la misma query.
c. Cohortes del blog: para las URLs de `docs/CONTENT_LOG.md`, impresiones, clicks, CTR y posición de 28 días.
d. Clusters de demanda sin página: top 100 queries por impresiones.
e. **Indexación real** con la URL Inspection API (`POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect`, `siteUrl: 'sc-domain:concesionaria.ai'`, ~20 URLs): páginas comerciales + posts de los últimos 14 días. Tabla de coverageState y lastCrawlTime con deltas. Si una página comercial lleva 2 semanas o más sin indexar, reenviá el sitemap por API y sumala a la lista de "Request Indexing manual" para Nico (nunca la Indexing API para páginas normales).

## 3) ACT (clase pre-aprobada)

Optimización de CTR solo en **posts del blog** (nunca home, páginas comerciales ni legales) con 50 impresiones o más y CTR menor a 1% en 28 días: podés reescribir `seoTitle` y/o `description` (120-160), máximo 3 posts por corrida, con Actual → Optimizado + el dato de GSC en el digest. Nunca el `title` (H1), el cuerpo, `publishedAt` ni el slug. Commit separado `concesionaria-seo-ops: ctr <slug>`, con verify verde.

## 4) DECIDE (propuestas, no ejecutar)

Próxima tanda de quick wins (Actual vs Optimizado con datos), 1 a 3 temas de post desde los clusters sin página (pasando el chequeo anti-colisión con hyppo.io), y cualquier página nueva: solo con demanda concreta en GSC citando el dato. **Páginas por país solo con demanda en GSC por país.** Cambios en páginas comerciales: siempre propuesta.

## 5) REPORT

Digest en `docs/seo-digests/AAAA-MM-DD.md`: estado del sitio (canario, feed, deploy, redirects), serie GSC con deltas, posiciones objetivo, indexación real, efecto compuesto por cohorte, clusters sin página, acciones ejecutadas con justificación, pendientes (incluida la lista de Request Indexing) y propuestas. Actualizá `docs/SEO_TRACKER.md` si algo cambió.

## 6) COMMIT

`git pull --rebase origin main`, commit de `docs/` con `concesionaria-seo-ops: digest AAAA-MM-DD` y push a `main` (si lo rechaza, rebase y reintentá). Los fixes y CTR van en commits separados, siempre con verify verde.

## 7) Slack (solo si hay algo relevante)

Un mensaje **aparte** del de hyppo.io al canal `#hyppo-seo` (id `C0BRXEVBQ9Z`), que empiece con `[ConcesionarIA]`, solo si ocurre al menos uno de: canario no limpio · feed caído o inválido · `check:ai` en rojo (un bot de IA no puede leer el sitio) · verify o deploy rotos · redirects o canonicals rotos en vivo · optimizaciones de CTR o fixes ejecutados · una página comercial lleva 2 semanas o más sin indexar · cluster de demanda nuevo que amerita página · una query objetivo entra al top 10 o se cae del top 20 · un pendiente que requiere a Nico (por ejemplo, la API de GSC falla o la medición de GA4 no aparece en el sitio vivo). Formato: 3 a 6 bullets con números, qué hizo la rutina y qué tiene que hacer Nico, más el link al digest (`https://github.com/GoHyppo/concesionarias_landing_v2/blob/main/docs/seo-digests/AAAA-MM-DD.md`). Si todo está verde y sin acciones, no se manda nada.

## Guardrails (este repo)

Nunca pushear con verify en rojo; no tocar `publishedAt`, slugs ni cuerpos de posts; no tocar `src/pages/`, `src/lib/`, componentes, `astro.config.mjs` ni `.github/`; no crear URLs nuevas; máximo 3 optimizaciones de CTR por corrida; jamás la Indexing API para páginas normales; nunca aflojar los chequeos de feed o de claims; fechas honestas; sin em-dash; jamás credenciales en commits ni en el output; Slack solo con contenido relevante.
