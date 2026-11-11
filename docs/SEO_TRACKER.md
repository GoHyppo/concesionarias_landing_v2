# SEO Tracker · concesionaria.ai

Tracker de implementación SEO en el formato de la casa (igual que hyppo.io). Lo mantiene la Parte B de la rutina `hyppo-seo-ops` y cualquier sesión que implemente una tanda. Estados: `pendiente` / `listo` / `descartado`. Dificultad: `fácil` / `medio` / `difícil`.

| Fecha pedido | Documento | Pedido | Estado | Dificultad | Responsable | Fecha implementación |
|---|---|---|---|---|---|---|
| 2026-11-10 | Plan SEO fase 4 | Rebuild de la SPA (Vite + HashRouter) a Astro estático con URLs reales y barra final | listo (en vivo desde 2026-11-10) | difícil | Hyppo | 2026-11-10 |
| 2026-11-10 | Plan SEO fase 4 | Title, description, canonical, OG con imagen 1200x630, JSON-LD (Organization, WebSite, SoftwareApplication, BreadcrumbList, FAQPage visible) | listo | medio | Hyppo | 2026-11-10 |
| 2026-11-10 | Plan SEO fase 4 | robots.txt, sitemap (lastmod solo blog), llms.txt generado, 404 noindex, CNAME | listo | fácil | Hyppo | 2026-11-10 |
| 2026-11-10 | Plan SEO fase 4 | Redirección de los links viejos con # (`#/producto`, `#/precios`, `#/concesionarias`, `#/recursos`, `#/blog`) | listo | fácil | Hyppo | 2026-11-10 |
| 2026-11-10 | Plan SEO fase 4 | Leads al CRM por el calendario de GoHighLevel de Pio (sin depender de Customer.io) + eventos `generate_lead`, `book_demo_view`, `whatsapp_click`, `roi_calculated` | listo | medio | Hyppo | 2026-11-10 |
| 2026-11-10 | Plan SEO fase 4 | Quitar claims sin respaldo del sitio v2 y bloquearlos en el gate | listo | medio | Hyppo | 2026-11-10 |
| 2026-11-10 | Plan SEO fase 4 | Blog (stack de hyppo.io) + RSS + 6 posts semilla con hero | listo | medio | Hyppo | 2026-11-10 |
| 2026-11-10 | Plan SEO fase 4 | `npm run verify` bloquea el deploy de GitHub Pages | listo | fácil | Hyppo | 2026-11-10 |
| 2026-11-10 | Decisión de Nico | Publicar la tabla completa de precios de content.py en `/precios/` con un Offer por plan en el schema | listo | medio | Hyppo | 2026-11-10 |
| 2026-11-10 | Decisión de Nico | WhatsApp de Hyppo AR (+54 9 11 6354-2275) y calendario de GoHighLevel de Pio como destinos de los leads | listo | fácil | Hyppo | 2026-11-10 |
| 2026-11-10 | Plan SEO fase 4 | Propiedad `sc-domain:concesionaria.ai` en Search Console con el SA como siteOwner; baseline de cero en `docs/gsc/BASELINE_20261110.md` | listo | fácil | Nico | 2026-11-10 |
| 2026-11-10 | Plan SEO fase 4 | GA4 propiedad `563697477` (stream `G-PQD9FKD7M3`, key events `generate_lead`, `book_demo_view`, `whatsapp_click`) cargado con gtag.js en todas las páginas y exigido por el gate | listo | fácil | Nico / Hyppo | 2026-11-10 |
| 2026-11-10 | Plan SEO fase 4 | Repo transferido a `GoHyppo/concesionarias_landing_v2` con push confirmado | listo | fácil | Tomás / Nico | 2026-11-10 |
| 2026-11-10 | Plan SEO fase 4 | Merge de `astro-rebuild` a `main` (deploya concesionaria.ai) | listo (`0d0260c` en vivo en concesionaria.ai, deploy de Pages OK) | fácil | Nico | 2026-11-10 |
| 2026-11-10 | Plan SEO fase 4 | Enviar `sitemap-index.xml` y `blog/rss.xml` en Search Console después del go-live | listo | fácil | Hyppo | 2026-11-10 |
| 2026-11-10 | Plan SEO fase 4 | Owner de Search Console `nicolas@hyppo.io` agregado en `sc-domain:concesionaria.ai` | listo | fácil | Hyppo | 2026-11-10 |
| 2026-11-10 | URL Inspection | La home sigue indexada desde la SPA vacía (último rastreo 2026-11-03): pedir Request Indexing desde la UI de Search Console (Nico ya es owner) | listo (resuelto solo: URL Inspection del 2026-11-11 muestra `lastCrawlTime` 2026-11-10T23:54, `Submitted and indexed`, ya sobre el sitio Astro; no hizo falta Request Indexing manual) | fácil | Nico | 2026-11-11 |
| 2026-11-10 | Plan SEO fase 4 | Confirmar `generate_lead` con una reserva de prueba en GA4 DebugView | pendiente | fácil | Hyppo | |
| 2026-11-10 | Plan SEO fase 4 | Apagar Pages y quitar el CNAME del repo v1 (`tomilagom/concesionarias_landing`) | pendiente | fácil | Tomás | |
| 2026-11-10 | Decisión de Nico | Bots de demo por marca: se mantienen las líneas en producción de Grupo Garden (`/demo/` lo aclara) | listo | fácil | Nico | 2026-11-10 |
| 2026-11-10 | Decisión de Nico | Legales: GoHyppo LLC constituida en Delaware en `/privacidad/`; `/terminos/` mantiene Florida como ley elegida, igual que hyppo.io | listo | fácil | Hyppo | 2026-11-10 |
| 2026-11-10 | Decisión de Nico | Montos de precios solo en `/precios/` (gate los lee de `src/lib/pricing.ts`) | listo | fácil | Hyppo | 2026-11-10 |
| 2026-11-10 | Plan SEO fase 4 | Doc "ConcesionarIA blog review" para revisar posts | descartado (Nico revisa los posts ex post en el sitio vivo; CONTENT_STRATEGY §7) | fácil | Nico | 2026-11-10 |
| 2026-11-10 | Plan SEO fase 5 | Agregar la Parte B a las 3 rutinas de hyppo.io (`docs/routines/`) | listo (2026-11-10 ~23:50 UTC, Parte A verificada byte a byte) | medio | Hyppo | 2026-11-10 |
| 2026-11-10 | Plan SEO fase 4 | Actualizar `Hyppo/docs/concesionaria/concesionaria-technical-reference.md` (hosting = GitHub Pages, repo = `GoHyppo/concesionarias_landing_v2`) | listo (Hyppo `e616f7ce` / `0e0c45eb`) | fácil | Hyppo | 2026-11-10 |
