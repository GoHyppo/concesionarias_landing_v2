# concesionaria.ai · guía para Claude

Sitio de **ConcesionarIA**, el producto de IA para concesionarias de Hyppo. Astro 4 estático, solo en español (es-419, tuteo), servido por **GitHub Pages** con dominio propio `concesionaria.ai`. Reemplaza a la SPA de Vite + React (HashRouter) que vivía en `client/`.

Repos hermanos con la misma arquitectura: `GoHyppo/hyppo_landing` (hyppo.io) y `GoHyppo/gochat_landing` (gochat.ar). El registro de los tres sitios está en `Hyppo/docs/seo/SITES.md`.

---

## Stack y deploy

- `npm run dev` (local) · `npm run build` · `npm run verify` (= `astro build` + `scripts/check-site-seo.mjs`).
- **Deploy**: push a `main` → `.github/workflows/deploy.yml` → `npm ci` → **`npm run verify`** → upload `dist/` → `deploy-pages`. Si verify falla, no hay deploy. Los PR corren verify sin desplegar.
- Dominio: `public/CNAME` = `concesionaria.ai` + Settings > Pages del repo. GitHub Pages sirve `/x/` desde `x/index.html` y redirige `/x` a `/x/` con 301.
- **Contrato de barra final**: `trailingSlash: 'always'` + `build.format: 'directory'` en `astro.config.mjs`, `<loc>` del sitemap, canonicals (`absoluteUrl()` en `src/lib/seo.ts`) y todos los links internos llevan `/` final. Si cambia uno, cambian todos.
- `404.astro` → `dist/404.html` (Pages lo sirve para cualquier ruta desconocida): sin canonical y con noindex.
- Los links viejos con `#` (`#/producto`, `#/precios`, `#/concesionarias`, `#/recursos`, `#/blog`) los resuelve un script inline en `src/pages/index.astro` con `location.replace`.

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Decisiones comerciales (precios publicados sí/no, WhatsApp, calendario, GTM, Customer.io) | `src/lib/site.ts` |
| Métricas permitidas (caso Grupo Garden) y logos de marcas | `src/lib/garden.ts` |
| Bots de demo por marca | `src/lib/demo-bots.ts` |
| Planes y precios (gated) | `src/lib/pricing.ts` + `src/pages/[pricing].astro` |
| Integraciones | `src/lib/integrations.ts` |
| Schemas JSON-LD | `src/lib/seo.ts` |
| Blog: datos, rutas, feed | `src/lib/blog.ts`, `src/lib/feed.ts`, `src/lib/categories.ts`, `src/lib/authors.ts`, `src/content/config.ts` |
| Posts | `src/content/blog/<slug>.md` + hero `src/assets/blog/<slug>.webp` |
| `/llms.txt` (generado) | `src/pages/llms.txt.ts` |
| Gate | `scripts/check-site-seo.mjs` |
| Credenciales Google para rutinas | `scripts/gauth.py` (copia exacta del de hyppo_landing) |

Rutas: `/`, `/producto/`, `/para-concesionarias/`, `/integraciones/`, `/casos/grupo-garden/`, `/demo/` (agenda en `#agenda`), `/calculadora-roi/`, `/precios/` (solo con `PRICING_PUBLISHED = true`), `/blog/`, `/blog/<slug>/`, `/blog/tema/<categoria>/`, `/autores/<id>/`, `/blog/rss.xml`, `/llms.txt`, `/privacidad/`, `/terminos/`.

## Leads y medición

- **El lead entra al CRM por el calendario de GoHighLevel** (`BOOKING_URL`, `crm.hyppo.io/widget/bookings/piorichards-concesionarias-ai`, el de la v1), embebido en `src/components/BookDemo.astro`. No depende de ningún script de analítica. Todos los CTAs "Pide una demo" son `<a href="/demo/#agenda">`.
- WhatsApp: un solo número, `WHATSAPP_NUMBER` en `src/lib/site.ts`. Cada link lleva `data-wa="<ubicación>"`.
- GTM `GTM-NSHSFT8S` (head + noscript) y Customer.io (write key pública `a29e4a60ecae3bf4179f`, workspace concesionarIA 210963) con `page()`, en `src/layouts/Layout.astro`.
- Eventos al `dataLayer` (y replicados en Customer.io con `track`), vía `window.ciaTrack`:
  - `whatsapp_click` (`placement`, `link_url`): click en cualquier `a[href*="wa.me/"]`.
  - `book_demo_view`: el bloque de agenda entra en pantalla (una vez por página).
  - `generate_lead` (`method: ghl_booking`): el iframe de GoHighLevel manda `postMessage(['set-sticky-contacts', ...])` cuando la persona deja sus datos. Es la señal disponible desde fuera del iframe: **confirmarla en el modo preview de GTM** con una reserva de prueba antes de usarla como conversión.
  - `roi_calculated`: botón Calcular de la calculadora. No envía los valores ingresados (la página y la política de privacidad lo prometen).

## Reglas duras (no se negocian)

- **Claims**: las ÚNICAS métricas públicas son las del caso Grupo Garden publicado en `hyppo.io/casos/garden/` (100% de leads trazables, 100% respondidos en segundos, +41% asistencia a test drive, 3,2x seguimientos, 94% clasificados automáticamente, 10 marcas en 7 meses), siempre atribuidas al caso y con link. Prohibido lo que tenía el sitio anterior: "+300 concesionarias", "1.000.000 de leads", "98% de satisfacción", "9,4x ROI", "5,2% vs 0,3%", "40% del mercado", "+1.200 suscriptores", LGPD/GDPR, testimonios anónimos de "Gerente", "Toyota Belgrano", "Nissan Paraguay", los stats de mercado sin fuente (27%, 40%, 70%). El gate falla si reaparecen, y falla con cualquier porcentaje fuera de 100/41/94 en páginas que no sean la calculadora, precios o legales. Ante la duda, se deja afuera.
- **Español LATAM neutro con tuteo** (tienes, puedes, pide). Nada de voseo (tenés, podés, pedí): el gate lo chequea.
- **Sin em-dash (U+2014)** en ningún archivo publicado, **sin emojis** (íconos SVG en `src/components/Icon.astro`). El gate revisa todo el HTML, XML y TXT del build.
- **Un head term = una URL**, y nunca una query donde hyppo.io tenga una página en el top 20 (ver "Programa SEO").
- **Sin páginas por país** hasta que GSC muestre demanda (anti-doorway).
- **Precios**: `PRICING_PUBLISHED = false` hasta que Nico lo apruebe. Con false, `/precios/` no se construye y nada lo linkea.
- Marca GoChat: se nombra GoChat como plataforma de Hyppo; su proveedor upstream no se nombra nunca, en ningún archivo ni commit.
- Fechas honestas: `publishedAt` es la fecha real de publicación y no se toca después.
- Nunca credenciales en el repo (es un repo que puede ser público).

## Diseño

Marca ConcesionarIA (deck comercial `Hyppo/claude_tests/pitches/concesionaria/build_slides.py`): fondo `#05040A`, violeta `#6D2EFF`, naranja `#FF6A00` como acento puntual, Space Grotesk self-hosted (`public/fonts/`). Tokens en `src/styles/global.css`.
- Texto violeta sobre fondo oscuro: usar `--violet-text` (lila, ~7:1), nunca el violeta puro (3,4:1).
- Sobre naranja, texto oscuro (blanco sobre naranja no pasa AA).
- Logos de marcas: solo marcas de Grupo Garden que operan con el sistema, en tiles blancos.
- Mobile-first; el menú mobile es un `<details>` (funciona sin JS). Estilos que apuntan a markup de un componente hijo (por ejemplo `Icon.astro`) van con `:global()`.

---

## Programa SEO

Este sitio corre el mismo programa SEO que hyppo.io, adaptado. Leer antes de tocar páginas, titles o contenido:

- `docs/SEO_PLAYBOOK.md`: mapa de keywords (un head term por URL), dueño de cada búsqueda entre concesionaria.ai, gochat.ar y hyppo.io, estándar de posts.
- `docs/CONTENT_STRATEGY.md`: mapa de clusters, cadencia (2 posts por semana, lunes y jueves), regla anti-colisión con hyppo.io, política de claims, Doc de revisión.
- `docs/BLOG.md`: cómo publicar un post, frontmatter, pipeline de imagen (prompt de Magnific).
- `docs/SEO_TRACKER.md` (tracker de implementación) y `docs/CONTENT_LOG.md` (registro de publicación).
- `docs/seo-digests/`, `docs/reports/`, `docs/gsc/`, `docs/blog-queue/`.
- **Rutinas**: no hay rutinas propias. Las tres rutinas cloud de hyppo.io corren primero hyppo.io y después una Parte B que lee y sigue `docs/routines/blog.md` (lunes y jueves), `docs/routines/seo-ops.md` (jueves) y `docs/routines/monthly-report.md` (día 1). Las rutinas pushean a `main`: `git pull --rebase origin main` antes de trabajar y antes de pushear.
- **`npm run verify` verde antes de cualquier push.**

## Decisiones abiertas (para Nico)

Cada una tiene su comentario `PENDIENTE` en el archivo:
- Publicar precios o no: `PRICING_PUBLISHED` en `src/lib/site.ts` (y confirmar planes en `src/lib/pricing.ts`).
- Número de WhatsApp: `WHATSAPP_NUMBER` en `src/lib/site.ts` (hoy el de Hyppo AR; el v2 usaba uno de EE. UU.).
- Calendario y formulario de GoHighLevel que reciben los leads: `BOOKING_URL` en `src/lib/site.ts`. No hay formulario GHL propio de ConcesionarIA; si se crea, se suma en `BookDemo.astro`.
- Bots de demo por marca (líneas reales de Grupo Garden): `src/lib/demo-bots.ts`.
- Tecnom como integración: `published: false` en `src/lib/integrations.ts`.
- Propiedades de Search Console y GA4 para el SA, y el ID del Doc de revisión del blog: `docs/CONTENT_STRATEGY.md`.
- `publishedAt` de los 6 posts semilla: 2026-11-10. Si el sitio sale después, ponerles la fecha real de salida antes del merge.
