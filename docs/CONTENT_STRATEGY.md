# Estrategia de contenido · blog de concesionaria.ai

Fuente de verdad del blog: qué se publica, cuándo y con qué reglas. Complementa `docs/SEO_PLAYBOOK.md` (estándar técnico) y `docs/BLOG.md` (cómo se publica). La ejecuta la Parte B de la rutina `hyppo-blog-daily` siguiendo `docs/routines/blog.md`; los cambios de criterio los aprueba Nico.

## 1. El norte

- **SEO**: ganar la intención de concesionaria en español ("IA, software, CRM, chatbot y WhatsApp para concesionarias", "seguimiento de leads automotriz") con páginas comerciales, y la long tail informacional con el blog. Cada post suma una query nueva al cluster y empuja autoridad a su página comercial.
- **Go-to-market**: ConcesionarIA vende orden comercial sobre WhatsApp, con prueba real (Grupo Garden). El contenido suena a operador que ya lo implementó, no a vendedor de software.
- **ICP**: dueño o gerente general, gerente comercial y gerente de marketing de concesionarios oficiales 0km, usados y multimarca y grupos automotrices de Latinoamérica de habla hispana. Mercados prioritarios: Argentina, Paraguay, Uruguay, Chile, México, Perú, Colombia.

## 2. Cadencia

- **2 posts por semana, en español: lunes y jueves** (fecha de America/Argentina/Buenos_Aires). Otro día, la rutina no publica.
- Formato flagship de 900 a 1200 palabras (ver el playbook).
- Calidad sobre cantidad: si no hay una query nueva que valga la pena, no se publica relleno; se reporta y se propone para el próximo turno.

## 3. Mapa de clusters

Cada categoría alimenta una página comercial. Temas candidatos (backlog, en orden aproximado de prioridad; cada uno pasa el chequeo anti-colisión antes de escribirse):

| Categoría → página | Publicado | Candidatos |
|---|---|---|
| `gestion-de-leads` → `/producto/` | tiempo de respuesta a leads · leads de plan de ahorro | leads dormidos: cómo reactivarlos · asignación de leads entre vendedores · leads de Mercado Libre Autos y portales · leads de fin de semana y fuera de horario · motivos de descarte de un lead |
| `whatsapp-e-ia` → `/demo/` | seguimiento de leads por WhatsApp · calificar leads automotrices con IA | test drive por WhatsApp: agendar y que el cliente vaya (ángulo venta 0km, no service) · catálogo y financiación por WhatsApp · cuándo la IA le pasa la conversación al vendedor · WhatsApp para concesionarias (pilar) |
| `medicion-y-atribucion` → `/calculadora-roi/` | qué campaña vende autos | embudo de ventas de una concesionaria: etapas y métricas · costo por venta vs costo por lead · cómo medir a los vendedores de autos · Google Ads para concesionarias (ángulo medición) |
| `gestion-comercial` → `/para-concesionarias/` | BDC vs agente de IA | qué reporte necesita el dueño de una concesionaria · objeciones frecuentes en la venta de autos · estandarizar procesos en un grupo multimarca · CRM para concesionarias: qué pedirle |

Temas del sitio anterior que **no** se escriben como estaban: los que dependían de números sin fuente ("WhatsApp dominó el 90% de las consultas", "+300 campañas", "1M+ leads", "40% del mercado").

## 4. Anti-colisión y anti-canibalización (antes de escribir)

1. **hyppo.io**: la query elegida no puede ser una donde hyppo.io tenga una página en el top 20. Chequeo de solo lectura: GSC `sc-domain:hyppo.io` con dimensiones `query,page` y un filtro `includingRegex` con los términos del tema (últimos 90 días), más su sitemap vivo (`https://hyppo.io/sitemap-0.xml`). Si hay colisión, se cambia el ángulo (más específico de concesionaria) o el tema.
2. **gochat.ar**: no apuntar a intención de plataforma o herramienta ("chatbot para WhatsApp", "WhatsApp Business API", "plataforma de chatbot").
3. **Interna**: la query no repite la de un post existente ni el head term de una página comercial (ver `docs/CONTENT_LOG.md` y el mapa del playbook).

## 5. Política de claims

- Las únicas métricas que el sitio puede usar son las del caso Grupo Garden publicado en hyppo.io/casos/garden/: 100% de leads trazables, 100% respondidos en segundos, +41% de asistencia a test drive, 3,2x más seguimientos, 94% de leads clasificados automáticamente, 10 marcas en 7 meses. Siempre atribuidas a ese caso y con link (`/casos/grupo-garden/` o el de hyppo.io).
- Nada de estadísticas de mercado sin fuente, ROI promedio, cantidad de clientes, satisfacción, certificaciones o testimonios anónimos. Un cliente se nombra solo si tiene un caso publicado.
- Datos de producto: solo lo que está en `Hyppo/docs/concesionaria/` (overview y referencia técnica), en la descripción de producto de `Hyppo/claude_tests/business_case_sdr/content.py` y en el caso público.
- Ante la duda, se deja afuera. El gate (`npm run verify`) falla si reaparece un claim prohibido o un porcentaje fuera de los permitidos.

## 6. Voz

Español LATAM neutro con **tuteo** (tienes, puedes, pide), directo y concreto, sin hype. Sin em-dash, sin emojis, sin AI-slop. Personas reales firman: Nicolas Lew Deveali (gestión de leads, medición, negocio) y Tomas Lagomarsino (WhatsApp, IA, datos, integraciones).

## 7. Doc de revisión

- **ID del Doc: PENDIENTE.** Nico tiene que crear un Google Doc vacío "ConcesionarIA blog review", compartirlo con el SA `claude-vscode-test@vx-operation.iam.gserviceaccount.com` como Editor y pasar el ID (el SA no puede crear Docs).
- Mientras no exista: cada post nuevo deja su copia en `docs/blog-queue/AAAA-MM-DD_<slug>.md` (mismo formato de abajo), commiteada junto con el post.
- Formato de entrada (newest-first, igual que hyppo.io):

```
=== AAAA-MM-DD | <slug> | <mercado> | <material> ===
[FECHA] AAAA-MM-DD
[URL] https://concesionaria.ai/blog/<slug>/
[ES] <título>
<cuerpo completo>
[MEDIA] <link de Drive o nota>
```

- Cuando exista el Doc: al inicio de cada corrida se comparan solo las 5 entradas más nuevas contra el markdown del repo; las ediciones de Nico ganan (commit `concesionaria-blog-sync: <slug> (edición de Nico)` y `updatedAt` con la fecha real). Si una entrada dice `CANCELADO`, el post pasa a `draft: true`.

## 8. Medición del efecto compuesto

- Cada post agrega una fila a `docs/CONTENT_LOG.md`.
- La Parte B de `hyppo-seo-ops` (jueves) cruza ese log con Search Console: impresiones, clicks, CTR y posición por cohorte de publicación.
- Accesos pendientes para medir: propiedad `sc-domain:concesionaria.ai` con el SA como Owner, y la propiedad GA4 detrás de GTM-NSHSFT8S con el SA como Viewer (ID: PENDIENTE).
