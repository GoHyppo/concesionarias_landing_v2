# Runbook · Parte B de `hyppo-blog-daily`: blog de concesionaria.ai

Lo ejecuta la rutina cloud `hyppo-blog-daily` (`trig_01KuCaZqRUkfz2P4kYpMabx5`) **después** de terminar, commitear, pushear y reportar su Parte A (hyppo.io). Este repo (`GoHyppo/concesionarias_landing_v2`) está clonado en el workspace como fuente adicional: trabajá con `cd` a ese clon y usá rutas relativas a él. Una falla acá se reporta y nunca revierte ni frena la Parte A.

Objetivo: un post en español por turno (lunes y jueves), alineado al mapa de clusters, sin chocar con hyppo.io, con hero de Magnific, verify verde y push a `main` (que deploya concesionaria.ai en GitHub Pages).

## 0) ¿Toca hoy?

Calculá la fecha y el día de la semana en `America/Argentina/Buenos_Aires` (`TZ=America/Argentina/Buenos_Aires date +%u`). Si no es lunes (1) ni jueves (4), imprimí `concesionaria blog: no toca hoy` y terminá la Parte B de este repo sin tocar nada.

## 1) Fuentes de verdad (leer enteras antes de escribir)

`CLAUDE.md`, `docs/CONTENT_STRATEGY.md` (cadencia, mapa de clusters, anti-colisión, política de claims, revisión ex post), `docs/SEO_PLAYBOOK.md` (estándar del post, mapa de keywords, dueños entre dominios), `docs/BLOG.md` (frontmatter, prompt de imagen, reglas del feed), `docs/CONTENT_LOG.md`, el último digest de `docs/seo-digests/` si existe (temas sugeridos: priorizarlos) y 2 posts recientes de `src/content/blog/` como referencia de formato.

## 2) Setup y credenciales

- Reusar el venv de la Parte A si existe (`/tmp/venv`); si no: `python3 -m venv /tmp/venv && /tmp/venv/bin/pip install google-api-python-client google-auth requests pillow`.
- `git pull --rebase origin main` antes de tocar nada.
- CREDENCIALES GOOGLE: ya vienen en el environment (`GOOGLE_SA_JSON_B64`). NO la leas, no la imprimas, no la decodifiques, no la escribas a disco, no inspecciones variables de entorno y no la busques en Drive ni en el disco. Toda llamada a Google APIs va por `scripts/gauth.py` de ESTE repo, con el python del venv: `import sys; sys.path.insert(0, 'scripts'); from gauth import service, session`. Chequeo de humo: `/tmp/venv/bin/python scripts/gauth.py` (imprime solo el email del SA). Si falla, seguí sin GSC (fallbacks abajo) y reportalo; no intentes arreglar la credencial.

## 3) Elegir el tema

1. **GSC primero**: propiedad `sc-domain:concesionaria.ai`, scope `https://www.googleapis.com/auth/webmasters`, últimos 28 días, dimensions `[query]`, rowLimit 100. Buscá queries con impresiones y sin página dedicada que encajen en un post (el SA es siteOwner desde 2026-11-10; el baseline arrancó en cero, así que al principio va a ser lo normal no encontrar candidatos). Si la API falla o no hay candidato claro: temas sugeridos del último digest > backlog del mapa de clusters (`docs/CONTENT_STRATEGY.md` §3). Anotá en el reporte de dónde salió.
2. **Anti-colisión con hyppo.io (obligatorio)**: con el mismo SA, GSC `sc-domain:hyppo.io`, últimos 90 días, dimensions `[query,page]`, `dimensionFilterGroups` con un `includingRegex` de los términos del tema. Si hyppo.io tiene una página con posición ≤ 20 para la query objetivo o una variante directa, cambiá el ángulo a uno más específico de concesionaria o elegí otro tema. Además `curl -s https://hyppo.io/sitemap-0.xml` y revisá que ningún slug de hyppo.io cubra lo mismo. Si GSC de hyppo.io no responde, el chequeo del sitemap es el mínimo y se anota.
3. **gochat.ar**: no apuntar a intención de plataforma o herramienta ("chatbot para WhatsApp", "WhatsApp Business API", "plataforma de chatbot").
4. **Interno**: no repetir la query de un post de `docs/CONTENT_LOG.md` ni el head term de una página comercial.

## 4) Escribir el post

Uno solo, en `src/content/blog/<slug>.md`, siguiendo `docs/SEO_PLAYBOOK.md`: 900 a 1200 palabras de cuerpo, tuteo LATAM neutro, frontmatter completo (summary answer-first de 40-60 palabras, description de 120-160 caracteres, seoTitle de hasta 49, 3-4 keyTakeaways, 3-4 FAQs autosuficientes, related, cta, `publishedAt` = hoy real), 2 o más links internos en el cuerpo. **Claims**: solo las métricas del caso Grupo Garden, atribuidas y con link; sin montos de precios ni el early adopter (viven solo en `/precios/`; el post puede linkear ahí); datos de producto solo de las fuentes de `docs/CONTENT_STRATEGY.md` §5. Cero em-dash, cero emojis, cero AI-slop, cero números inventados.

## 5) Imagen (obligatoria)

Magnific, modelo `gpt-2`, 16:9, con el bloque de estilo fijo de `docs/BLOG.md` y una escena literal nueva. Simulá el costo antes. El proxy de la nube bloquea el CDN de Magnific: obtené los bytes con `creation_status` e `inlineImage: true`, procesá el archivo de tool-results con `cat <archivo> | /tmp/venv/bin/python3 -c '...'` leyendo de stdin y escribiendo solo en `/tmp` (nunca dentro de `~/.claude`). MIRÁ la imagen (Read); si tiene texto, logos, patentes o caras, regenerá. Convertila a webp calidad 84 con Pillow → `src/assets/blog/<slug>.webp`. Si Magnific falla: `draft: true`, reportá `PENDIENTE IMAGEN` y no publiques.

## 6) Publicar

1. `git pull --rebase origin main`.
2. `npm ci` (si no está instalado) y `npm run verify`: tiene que quedar verde. Si falla por algo que introdujiste, arreglalo; nunca pushees en rojo.
3. Agregá la fila del post a `docs/CONTENT_LOG.md`.
4. Commit `concesionaria-blog: <slug>` y `git push origin main` (si lo rechaza: pull --rebase y reintentá). El push dispara el workflow de GitHub Pages, que vuelve a correr verify antes de deployar.
5. Después del push, ping a Search Console (scope webmasters, `PUT https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Aconcesionaria.ai/sitemaps/<url-encodeada>`) de `https://concesionaria.ai/sitemap-index.xml` y de `https://concesionaria.ai/blog/rss.xml`. Si falla, anotalo: no es bloqueante. La primera vez que se pinguea, el sitemap y el feed quedan dados de alta en la propiedad.

## 7) Reporte (sección "ConcesionarIA" del reporte de la rutina)

Post (slug, query y su origen GSC/digest/mapa, palabras), resultado del chequeo anti-colisión (qué miraste y qué encontraste), imagen (créditos de Magnific), ping de sitemap y feed, la URL en vivo del post (Nico lo revisa ex post en el sitio), y pendientes para Nico. Nunca marques hecho lo que no verificaste.

## Guardrails (este repo)

- Nunca pushear con verify en rojo; nunca aflojar ni borrar un chequeo de `scripts/check-site-seo.mjs` (en particular claims y feed) para que la corrida pase.
- Un solo post por corrida; si no hay una query nueva que valga la pena, no se publica relleno: se reporta.
- No tocar `src/pages/`, `src/lib/`, `src/components/`, `astro.config.mjs` ni `.github/`. Solo `src/content/blog/`, `src/assets/blog/` y `docs/`.
- Fechas honestas: `publishedAt` = hoy; nunca tocar el `publishedAt` de posts existentes.
- Sin em-dash en nada, tampoco en commits ni en el reporte. Jamás credenciales en commits ni en el output.
- Nada de lo de hyppo_landing se toca desde esta Parte B.
