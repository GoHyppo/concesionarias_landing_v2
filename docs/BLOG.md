# El blog · cómo publicar y por qué está armado así

Guía operativa, portada del blog de hyppo.io (`hyppo_landing/docs/BLOG.md`) y simplificada: este sitio es solo en español, así que no hay árboles por idioma ni hreflang.

## Publicar un post

### 1. El archivo

```
src/content/blog/<slug>.md        → https://concesionaria.ai/blog/<slug>/
src/assets/blog/<slug>.webp       → hero 16:9 sin texto
```

Reglas del slug: 3 a 6 palabras, minúsculas, guiones, **empieza con letra** (`/blog/2/` es la página 2 del índice), sin fecha ni categoría. No se cambia después de publicar: GitHub Pages no tiene redirects del lado del servidor, así que un slug movido es una URL perdida.

### 2. Frontmatter

El contrato está tipado en `src/content/config.ts` (el build falla si falta algo o si un largo se pasa). Mismos campos que hyppo.io:

```yaml
---
title: 'Tiempo de respuesta a leads en concesionarias: por qué los minutos venden autos'
seoTitle: 'Tiempo de respuesta a leads en concesionarias'
description: 'Entre 120 y 160 caracteres: el snippet del SERP y la descripción de OG.'
summary: 'La respuesta a la query en 40 a 60 palabras, sola, sin depender del resto.'
category: 'gestion-de-leads'
author: 'nicolas-lew-deveali'
publishedAt: 2026-11-10
# updatedAt: 2026-12-01      ← solo si el contenido cambió de verdad
image: '../../assets/blog/<slug>.webp'
imageAlt: 'Qué se ve en la ilustración'
keyTakeaways:
  - 'Frases que se entienden solas, con dato cuando lo hay.'
faq:
  - q: '¿Pregunta que la gente hace de verdad?'
    a: 'Respuesta de 40 a 80 palabras, el mismo texto que se ve en la página.'
related: ['otro-slug', 'otro-mas']
cta: '/producto/'
draft: false
---
```

| Campo | Dónde sale | Para qué |
|---|---|---|
| `title` | `<h1>` y `headline` del schema | Tienen que ser idénticos (el gate lo verifica) |
| `seoTitle` | `<title>` + ` · ConcesionarIA` | Pelea el click; hasta 49 caracteres |
| `description` | meta description, OG, cards | El snippet |
| `summary` | párrafo grande arriba del cuerpo y `abstract` del schema | La respuesta |

### 3. El cuerpo

- Sin `#` (el h1 es el `title`). `##` para secciones, `###` para subsecciones, sin saltear niveles.
- La respuesta en las primeras 40 a 60 palabras de cada sección.
- Al menos una tabla o un paso a paso numerado.
- 2 o más links internos con anchor descriptivo: `/producto/`, `/para-concesionarias/`, `/integraciones/`, `/demo/`, `/calculadora-roi/`, `/casos/grupo-garden/` u otros posts.
- Tuteo, sin em-dash, sin emojis, sin números inventados (política de claims en `docs/CONTENT_STRATEGY.md`).

### 4. La imagen (Magnific)

Se genera con el MCP de Magnific, modelo `gpt-2`, 16:9 (sale de 1344x752), y se convierte a webp calidad 84 con Pillow. **Mirarla siempre antes de commitear** y regenerar si tiene texto, logos, patentes o caras. Simular el costo antes (cada generación costó 85 créditos en noviembre de 2026).

Bloque fijo de estilo (se completan `[ELEMENT]` y `[SCENE]` por post):

> Editorial illustration, clean flat geometric vector style with subtle film grain, on a deep near-black background (#05040A). Electric violet (#6D2EFF) and soft lilac tints are the main accent, used on outlines, shapes and soft glows. Exactly one small element is picked out in flat solid orange (#FF6A00): [ELEMENT]. Scene: [SCENE]. Automotive B2B mood, calm and precise, generous negative space, minimal composition, soft subtle shadows. No text, no letters, no numbers, no logos, no brand badges on cars, no license plates, no watermark, no interface text, no people, no faces, no photographic realism.

Escenas usadas en los posts semilla (referencia para no repetir metáforas):

| Post | Elemento naranja | Escena |
|---|---|---|
| `tiempo-de-respuesta-a-leads` | the chat bubble | a quiet car showroom at night seen from the side, one simplified car silhouette on the floor, a large minimalist wall clock without numerals whose hands are two short glowing violet bars, and a smartphone resting on a small counter with a single rounded chat bubble rising from its screen |
| `seguimiento-de-leads-por-whatsapp` | the car key | seen from above, a winding road made of a chain of rounded chat bubbles, starting at a smartphone on the left and ending at a single car key on the right, with small blank calendar tiles placed like milestones along the road |
| `calificar-leads-automotrices-con-ia` | one single token in the brightest lane | a minimal sorting machine seen from the front, small rounded tokens shaped like chat bubbles fall from the top into a geometric sorter that routes them into three parallel lanes of different violet intensity, bright, medium and dim |
| `leads-de-plan-de-ahorro` | the one car lifted out of the circle | seen from above, a closed circle of identical small simplified car silhouettes arranged evenly around an empty round center, like a group waiting its turn; one car is gently lifted out of the ring and floats slightly above it |
| `que-campana-vende-autos` | the folded blank document at the end of the line | a thin continuous violet line runs from a small megaphone on the left, through a few dotted waypoints shaped like chat bubbles and a simplified car on a round showroom turntable, and ends at a folded blank document with no writing on the right |
| `bdc-vs-agente-de-ia` | the relay baton | two simple desks side by side seen from the front; on the left desk a call-center headset rests on a stand, on the right desk floats a small glowing geometric chat node; between them a single relay baton is being passed across, connected to both desks by thin violet lines |
| `costo-por-venta-vs-costo-por-lead` | the small weight on the scale | two simplified funnel shapes side by side, a narrow funnel feeding a single rounded chat bubble token and a wider funnel feeding a single simplified car silhouette, both connected underneath to a minimal two pan balance scale, one pan holding a few small chat bubble tokens and the other holding one single small geometric weight |

Gotcha de la nube: el proxy de las rutinas bloquea el CDN de Magnific. Pedir los bytes con `creation_status` e `inlineImage: true`, procesar el archivo de tool-results con `cat <archivo> | python3 -c '...'` leyendo de stdin, y escribir solo en `/tmp` antes de mover el webp al repo. Si Magnific falla, el post se guarda con `draft: true` y no se publica.

### 5. Verificar y publicar

```bash
git pull --rebase origin main
npm ci            # si hace falta
npm run verify    # build + scripts/check-site-seo.mjs
```

Después: fila en `docs/CONTENT_LOG.md`, commit `concesionaria-blog: <slug>`, push a `main`. GitHub Pages deploya solo si verify pasa en el workflow.

---

## La arquitectura, y por qué

| Ruta | Qué es |
|---|---|
| `/blog/` | Índice: intro, temas, lo último (9 por página) |
| `/blog/2/` | Páginas siguientes (canonical propio, sin noindex) |
| `/blog/<slug>/` | Post |
| `/blog/tema/<categoria>/` | Hub de categoría con copy propia; existe solo si tiene posts |
| `/autores/<id>/` | Página del autor (entidad Person) |
| `/blog/rss.xml` | Feed con el contenido completo de los 20 posts más nuevos |

- **Cuatro categorías, sin tags** (`src/lib/categories.ts`): cada hub es una URL indexable con copy propia y le pasa autoridad a una página comercial. Agregar una categoría es una decisión de estrategia.
- **La categoría no va en la URL del post**: se puede recategorizar sin mover la URL.
- **Structured data**: cada post emite `BlogPosting` + `BreadcrumbList` (+ `FAQPage` si tiene FAQ visible); índice y hubs emiten `CollectionPage` con el `ItemList` de esa página; autor emite `ProfilePage`. El schema describe lo que la página muestra.
- **Sitemap**: `lastmod` solo en el subárbol del blog, con la fecha real del frontmatter (`astro.config.mjs`). Las páginas hechas a mano van sin lastmod a propósito.
- **`/llms.txt`** se genera desde el contenido real (`src/pages/llms.txt.ts`).

## El feed RSS (no romperlo)

`/blog/rss.xml` es una integración: Search Console lo puede usar como sitemap de tipo rssFeed y LinkedIn como fuente de contenido externa, y los dos descartan el feed entero si no valida. Reglas, todas verificadas por `npm run verify`:

- El autor va en `dc:creator`, nunca en `<author>` (en RSS 2.0 tiene que ser un email).
- `lastBuildDate` es del canal y va en RFC 822.
- El canal tiene `title`, `link` y `description`; el feed declara su self-link.
- Tope de 20 items (`RSS_ITEM_LIMIT` en `src/lib/feed.ts`, espejado en el gate).

Si verify marca un error de feed, se arregla el feed. Nunca se afloja el chequeo.
