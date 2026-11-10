# concesionaria.ai · guía para Claude

Sitio de **ConcesionarIA**, el producto de IA para concesionarias de Hyppo. Astro 4 estático, solo en español (es-419, tuteo), servido por **GitHub Pages** con dominio propio `concesionaria.ai`. Repo: **`GoHyppo/concesionarias_landing_v2`** (transferido desde la cuenta de Tomás el 2026-11-10). Reemplaza a la SPA de Vite + React (HashRouter) que vivía en `client/`.

Repos hermanos con la misma arquitectura: `GoHyppo/hyppo_landing` (hyppo.io) y `GoHyppo/gochat_landing` (gochat.ar). El registro de los tres sitios está en `Hyppo/docs/seo/SITES.md`.

---

## Stack y deploy

- `npm run dev` (local) · `npm run build` · `npm run verify` (= `astro build` + `scripts/check-site-seo.mjs`).
- **Deploy**: push a `main` → `.github/workflows/deploy.yml` → `npm ci` → **`npm run verify`** → upload `dist/` → `deploy-pages`. Si verify falla, no hay deploy. Los PR corren verify sin desplegar.
- Dominio: `public/CNAME` = `concesionaria.ai` + Settings > Pages del repo. Pages se sirve desde la org GoHyppo (`www` hace CNAME a `gohyppo.github.io`); el `CNAME` del build sigue siendo `concesionaria.ai`. GitHub Pages sirve `/x/` desde `x/index.html` y redirige `/x` a `/x/` con 301.
- **Contrato de barra final**: `trailingSlash: 'always'` + `build.format: 'directory'` en `astro.config.mjs`, `<loc>` del sitemap, canonicals (`absoluteUrl()` en `src/lib/seo.ts`) y todos los links internos llevan `/` final. Si cambia uno, cambian todos.
- `404.astro` → `dist/404.html` (Pages lo sirve para cualquier ruta desconocida): sin canonical y con noindex.
- Los links viejos con `#` (`#/producto`, `#/precios`, `#/concesionarias`, `#/recursos`, `#/blog`) los resuelve un script inline en `src/pages/index.astro` con `location.replace`.

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Decisiones comerciales (precios publicados sí/no, WhatsApp, calendario) y medición (GA4, GTM, Customer.io) | `src/lib/site.ts` |
| Métricas permitidas (caso Grupo Garden) y logos de marcas | `src/lib/garden.ts` |
| Bots de demo por marca | `src/lib/demo-bots.ts` |
| Planes y precios (tabla de content.py, interruptor `PRICING_PUBLISHED`) | `src/lib/pricing.ts` + `src/pages/[pricing].astro` |
| Integraciones | `src/lib/integrations.ts` |
| Schemas JSON-LD | `src/lib/seo.ts` |
| Blog: datos, rutas, feed | `src/lib/blog.ts`, `src/lib/feed.ts`, `src/lib/categories.ts`, `src/lib/authors.ts`, `src/content/config.ts` |
| Posts | `src/content/blog/<slug>.md` + hero `src/assets/blog/<slug>.webp` |
| `/llms.txt` (generado) | `src/pages/llms.txt.ts` |
| Gate | `scripts/check-site-seo.mjs` |
| Credenciales Google para rutinas | `scripts/gauth.py` (copia exacta del de hyppo_landing) |

Rutas: `/`, `/producto/`, `/para-concesionarias/`, `/integraciones/`, `/casos/grupo-garden/`, `/demo/` (agenda en `#agenda`), `/calculadora-roi/`, `/precios/` (publicada; existe solo mientras `PRICING_PUBLISHED = true`), `/blog/`, `/blog/<slug>/`, `/blog/tema/<categoria>/`, `/autores/<id>/`, `/blog/rss.xml`, `/llms.txt`, `/privacidad/`, `/terminos/`.

## Leads y medición

- **El lead entra al CRM por el calendario de GoHighLevel de Pio** (`BOOKING_URL`, `crm.hyppo.io/widget/bookings/piorichards-concesionarias-ai`, el de la v1; confirmado por Nico), embebido en `src/components/BookDemo.astro`. No depende de ningún script de analítica. Todos los CTAs "Pide una demo" son `<a href="/demo/#agenda">`.
- WhatsApp: un solo número, el de Hyppo AR `+54 9 11 6354-2275` (`WHATSAPP_NUMBER` en `src/lib/site.ts`, confirmado por Nico). Cada link lleva `data-wa="<ubicación>"`.
- **GA4** propiedad `563697477`, stream web `G-PQD9FKD7M3`, cargado con gtag.js en `src/layouts/Layout.astro` (retención de 14 meses; key events registrados: `generate_lead`, `book_demo_view`, `whatsapp_click`). Va directo y no por GTM: el contenedor `GTM-NSHSFT8S` (head + noscript, también en el layout) no tiene etiqueta de GA4, así que no hay doble conteo. Si alguien agrega GA4 dentro de GTM, hay que sacar una de las dos.
- Customer.io (write key pública `a29e4a60ecae3bf4179f`, workspace concesionarIA 210963) con `page()`.
- Eventos vía `window.ciaTrack`, a tres destinos: `gtag('event', '<nombre>', {...})` para GA4, un push `{event: '<nombre>', ...}` al `dataLayer` para triggers de GTM, y `track` en Customer.io. Nombres exactos:
  - `whatsapp_click` (`placement`, `link_url`): click en cualquier `a[href*="wa.me/"]`.
  - `book_demo_view`: el bloque de agenda entra en pantalla (una vez por página).
  - `generate_lead` (`method: ghl_booking`): el iframe de GoHighLevel manda `postMessage(['set-sticky-contacts', ...])` cuando la persona deja sus datos. Es la señal disponible desde fuera del iframe: **confirmarla con una reserva de prueba en GA4 DebugView (o Tag Assistant)** antes de confiar en el key event.
  - `roi_calculated`: botón Calcular de la calculadora. No envía los valores ingresados (la página y la política de privacidad lo prometen).
- El gate exige GTM y el gtag.js + `gtag('config')` de `G-PQD9FKD7M3` en todas las páginas.

## Reglas duras (no se negocian)

- **Claims**: las ÚNICAS métricas públicas son las del caso Grupo Garden publicado en `hyppo.io/casos/garden/` (100% de leads trazables, 100% respondidos en segundos, +41% asistencia a test drive, 3,2x seguimientos, 94% clasificados automáticamente, 10 marcas en 7 meses), siempre atribuidas al caso y con link. Prohibido lo que tenía el sitio anterior: "+300 concesionarias", "1.000.000 de leads", "98% de satisfacción", "9,4x ROI", "5,2% vs 0,3%", "40% del mercado", "+1.200 suscriptores", LGPD/GDPR, testimonios anónimos de "Gerente", "Toyota Belgrano", "Nissan Paraguay", los stats de mercado sin fuente (27%, 40%, 70%). El gate falla si reaparecen, y falla con cualquier porcentaje fuera de 100/41/94 en páginas que no sean la calculadora, precios o legales (el 50% del early adopter vive solo en `/precios/`). Ante la duda, se deja afuera.
- **Español LATAM neutro con tuteo** (tienes, puedes, pide). Nada de voseo (tenés, podés, pedí): el gate lo chequea.
- **Sin em-dash (U+2014)** en ningún archivo publicado, **sin emojis** (íconos SVG en `src/components/Icon.astro`). El gate revisa todo el HTML, XML y TXT del build.
- **Un head term = una URL**, y nunca una query donde hyppo.io tenga una página en el top 20 (ver "Programa SEO").
- **Sin páginas por país** hasta que GSC muestre demanda (anti-doorway).
- **Precios**: solo los de `src/lib/pricing.ts` (la tabla de content.py) y **solo en `/precios/`**. El resto del sitio, los posts, el feed y `llms.txt` linkean a esa página sin repetir montos ni el early adopter; el gate lee los montos de `pricing.ts` y falla si aparecen en otra página. Ningún precio, descuento o modelo de cobro fuera de esa tabla.
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

## Precios

Publicados (decisión de Nico, 2026-11-10). La tabla de `src/lib/pricing.ts` es la de `Hyppo/claude_tests/business_case_sdr/content.py` tal cual: Gold USD 750, Platinum USD 2.750 y Enterprise desde USD 5.000 por mes; conversaciones incluidas (3.000 / 3.000 / 25.000), conversación adicional (USD 0,25 / 0,20 / 0,15), licencias de vendedor (5 / 10 / 50), licencia adicional (USD 25 / 20 / 10 a 15 por mes), implementación única (USD 1.500 / 3.500 / a medida), y early adopter: 50% de la implementación para las primeras 10 concesionarias de Argentina. Las contradicciones del sitio viejo se resolvieron a favor de content.py: no existe "solo pagas por leads calificados" ni "Platinum = 750 + 500", y no hay listas de features por plan. El SoftwareApplication de `/precios/` tiene un Offer por plan armado desde el mismo arreglo, y el gate verifica que cada Offer esté visible con el mismo abono. Los montos viven solo en `/precios/`: el FAQ del home y la calculadora linkean a la tabla sin repetir cifras. Para despublicar: `PRICING_PUBLISHED = false` y `npm run verify`.

## Decisiones abiertas (para Nico)

Las que tocan código tienen su comentario `PENDIENTE` en el archivo citado:
- Tecnom como integración: `published: false` en `src/lib/integrations.ts`.
- "Implementación en 14 días": figura en content.py pero contradice a la v1 ("4 semanas"); queda afuera del sitio hasta que Nico lo confirme.
- ID del Doc de revisión del blog: `docs/CONTENT_STRATEGY.md` §7.
- `publishedAt` de los 6 posts semilla: 2026-11-10. Si el sitio sale después, ponerles la fecha real de salida antes del merge.
- No hay formulario GHL propio de ConcesionarIA (solo el calendario); si se crea, se suma en `BookDemo.astro`.

Ya resueltas (2026-11-10): precios publicados, WhatsApp de Hyppo AR, calendario de Pio, bots de demo (se muestran las líneas en producción de Grupo Garden; `/demo/` lo aclara), Search Console `sc-domain:concesionaria.ai` (SA como siteOwner), GA4 `563697477`, repo transferido a GoHyppo, y GoHyppo LLC como sociedad de **Delaware** en `/privacidad/` (hyppo.io dice Florida y está mal; la cláusula de ley aplicable de `/terminos/` sigue eligiendo Florida, igual que los términos de hyppo.io).
