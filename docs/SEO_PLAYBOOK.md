# SEO Playbook · concesionaria.ai

Playbook operativo para escribir páginas y posts de concesionaria.ai. Complementa `docs/BLOG.md` (cómo se publica) y `docs/CONTENT_STRATEGY.md` (qué se publica y cuándo). La metodología general de la casa vive en la skill `hyppo-seo` del repo Hyppo; el registro de los tres sitios, en `Hyppo/docs/seo/SITES.md`. Si algo de acá contradice ese registro, gana este repo.

## Objetivo de negocio

Ser la referencia en español para **intención de concesionaria**: dueños, gerentes generales, gerentes comerciales y de marketing de concesionarias de autos en Latinoamérica que buscan cómo atender, calificar y seguir leads con IA, y cómo medir qué vende.

- Las **head queries** las capturan las páginas comerciales (tabla de abajo). El blog **no** compite contra ellas.
- El blog captura la **long tail** informacional ("cómo", "qué es", "X vs Y") y empuja autoridad hacia las páginas comerciales con links internos.

## Dueño de cada búsqueda entre los tres dominios

| Dominio | Es dueño de | No toca |
|---|---|---|
| **concesionaria.ai** | Intención de concesionaria en español: "IA para concesionarias", "software para concesionarias", "CRM para concesionarias", "chatbot para concesionarias", "WhatsApp para concesionarias", "seguimiento de leads automotriz", plan de ahorro, BDC automotriz, atribución en concesionarias | Lo genérico de plataforma o de agencia |
| **gochat.ar** | Intención de plataforma o herramienta: "chatbot para WhatsApp / Instagram", "WhatsApp Business API", "plataforma de chatbot", "agentes de IA en WhatsApp", "alternativa a X". Su página automotriz linkea a concesionaria.ai | "concesionarias" como head term |
| **hyppo.io** | Agencia (performance, growth, marketing digital, data marketing, por país), CDP, retención, data, Customer.io y todo lo que ya rankea | Se deja intacto (decisión de Nico, 2026-11-10) |

**Regla anti-colisión**: concesionaria.ai nunca apunta a una query donde hyppo.io ya tiene una página en el top 20. Se verifica antes de escribir (GSC de hyppo.io de solo lectura con el mismo SA + su sitemap vivo, ver `docs/routines/blog.md`). Posts de hyppo.io que ya cubren temas cercanos: `chatbot-ia-para-empresas` (top 20 para "chatbot para empresas" y "mejor herramienta de ia para calificar consultas de ventas por whatsapp"), `modelos-de-atribucion` ("atribucion"), `conversiones-offline-retail`, `postventa-automotriz-mexico` (también "plazos de crédito automotriz"), `no-show-en-service-automotriz`, `whatsapp-business-24-hour-window`, `ventas-por-whatsapp-y-yape`, `gestionar-grupos-de-whatsapp`, y el caso `/casos/garden/`.

## Mapa de keywords: un head term por URL

| URL | Head term | Secundarias |
|---|---|---|
| `/` | IA para concesionarias | inteligencia artificial para concesionarias de autos |
| `/producto/` | software para concesionarias | sistema para concesionarias con IA, supervisión de respuesta, lead score automotriz |
| `/para-concesionarias/` | sistema de ventas para concesionarias | concesionarios oficiales 0km, usados y multimarca, grupos automotrices |
| `/integraciones/` | integración de CRM y ERP para concesionarias | SAP, Dynamics, Pilot, DMS; CRM para concesionarias (mientras no tenga URL propia) |
| `/demo/` | chatbot para concesionarias | chatbot de WhatsApp para concesionarias, demo |
| `/calculadora-roi/` | calculadora de ROI para concesionarias | cuántos autos para pagar la inversión |
| `/precios/` | precios de ConcesionarIA | precio de un software para concesionarias, planes Gold, Platinum y Enterprise |
| `/casos/grupo-garden/` | caso Grupo Garden (marca) | IA en grupos automotrices. Ángulo concesionaria; la versión técnica es la de hyppo.io |
| `/blog/tiempo-de-respuesta-a-leads/` | tiempo de respuesta a leads en concesionarias | speed to lead automotriz |
| `/blog/seguimiento-de-leads-por-whatsapp/` | seguimiento de leads automotriz | seguimiento de leads por WhatsApp, WhatsApp para concesionarias |
| `/blog/calificar-leads-automotrices-con-ia/` | calificar leads automotrices con IA | Hot, Warm y Cold |
| `/blog/leads-de-plan-de-ahorro/` | leads de plan de ahorro | plan de ahorro en concesionarias |
| `/blog/que-campana-vende-autos/` | cómo saber qué campaña vende autos | atribución de ventas en concesionarias |
| `/blog/bdc-vs-agente-de-ia/` | BDC automotriz vs agente de IA | qué es un BDC automotriz |

Sin URL propia todavía (candidatas, solo con demanda en GSC): "CRM para concesionarias" (landing `/crm-para-concesionarias/`), "WhatsApp para concesionarias" (landing). Páginas por país: no, hasta que GSC muestre demanda por país.

## El estándar de una página comercial

- `<title>` con el head term adelante y ` · ConcesionarIA` al final, hasta ~65 caracteres. Único en el sitio (el gate falla si se repite).
- Meta description de 120 a 160 caracteres, con el head term y la propuesta de valor. Única.
- Un solo `<h1>` con el head term, distinto del title. Sin saltear niveles de heading.
- Canonical autorreferencial (lo pone `Layout.astro`), BreadcrumbList en toda página interna, FAQPage solo si el FAQ está visible con el mismo texto, SoftwareApplication en `/producto/` (sin precios) y en `/precios/` (con un Offer por plan, igual a la tabla visible).
- CTAs como `<a href>` reales a `/demo/#agenda` o a WhatsApp.
- Prueba: solo las métricas del caso Grupo Garden, atribuidas y con link. Precios: solo los de `/precios/` (tabla de content.py).

## El estándar de un post

Contrato completo en `src/content/config.ts` (mismo contrato que hyppo.io):

- `title` (10-90): es el `<h1>` y el `headline` del schema.
- `seoTitle` (10-60): el `<title>`; se le agrega ` · ConcesionarIA`. Apuntar a 49 caracteres o menos para que el total no pase de 65.
- `description` (apuntar a 120-160).
- `summary`: respuesta directa en 40-60 palabras. Es lo que citan los motores de respuesta.
- `category`: `gestion-de-leads` | `whatsapp-e-ia` | `medicion-y-atribucion` | `gestion-comercial`.
- `author`: `nicolas-lew-deveali` | `tomas-lagomarsino`.
- `publishedAt`: fecha real. Nunca tandas con la misma fecha salvo el lanzamiento.
- `image` + `imageAlt`: hero 16:9 sin texto (prompt en `docs/BLOG.md`).
- `keyTakeaways` (3-4), `faq` (3-4, respuestas de 40-80 palabras que se entienden solas), `related` (2-3), `cta`.

Cuerpo: **900 a 1200 palabras** (formato flagship; a dos posts por semana no hay notas cortas). H2 con la respuesta en las primeras líneas de cada sección, H3 bajo los H2 largos, al menos una tabla comparativa o un paso a paso, **2 o más links internos** en el cuerpo (página comercial del cluster + otro post o el caso). Tuteo, sin em-dash, sin AI-slop ("en el mundo actual", "es importante destacar", "en resumen", "potente", "robusto", "sin esfuerzo", "revolucionar"), sin números inventados.

## Selección de temas

1. **GSC primero** (`sc-domain:concesionaria.ai`, el SA es siteOwner desde 2026-11-10; baseline en `docs/gsc/`): queries con impresiones y sin página dedicada. Mientras el sitio nuevo no acumule datos, manda el mapa de clusters.
2. **Mapa de clusters** de `docs/CONTENT_STRATEGY.md`.
3. **Chequeo anti-colisión** contra hyppo.io (top 20) y contra lo que es de gochat.ar.
4. **Anti-canibalización interna**: revisar `docs/CONTENT_LOG.md` y los titles del build.

## Checklist de publicación

1. `npm run verify` verde.
2. Leer el post renderizado entero (no solo el markdown).
3. Imagen generada, mirada y con alt descriptivo.
4. Links internos: 2 o más en el cuerpo + `related` + `cta`.
5. Fila en `docs/CONTENT_LOG.md`.
6. Commit `concesionaria-blog: <slug>` y push a `main` (GitHub Pages deploya si verify pasa).
