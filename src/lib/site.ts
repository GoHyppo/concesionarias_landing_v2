/**
 * Constantes del sitio. Todo lo que es una decisión comercial (publicar precios,
 * a qué número de WhatsApp van los CTAs, qué calendario recibe las demos) vive
 * acá y en ningún otro lado, para que cambiarlo sea tocar una línea.
 *
 * Decisiones confirmadas por Nico (2026-11-10):
 *   - PRICING_PUBLISHED = true: la tabla completa de precios es pública.
 *   - WHATSAPP_NUMBER: el número de Hyppo Argentina (el mismo de v1, gochat.ar
 *     y hyppo.io). El número de EE. UU. del sitio v2 quedó afuera.
 *   - BOOKING_URL: el calendario de GoHighLevel de Pio (el de la v1).
 */

export const SITE_URL = 'https://concesionaria.ai';
export const SITE_NAME = 'ConcesionarIA';
export const SITE_TAGLINE = 'IA para concesionarias';

/**
 * Precios públicos (src/lib/pricing.ts, tal cual content.py). Es un interruptor:
 *   - `true` (hoy): se construye /precios/, entra al nav, al footer, al sitemap y
 *     a llms.txt, el FAQ de precio del home da las cifras y la calculadora usa el
 *     abono de Gold como valor de ejemplo.
 *   - `false`: /precios/ NO se construye (getStaticPaths devuelve cero rutas en
 *     src/pages/[pricing].astro), nada la linkea y no aparece ninguna cifra.
 * Después de cambiarlo: `npm run verify` (el gate chequea los dos estados).
 */
export const PRICING_PUBLISHED = true;

/** WhatsApp comercial, en formato E.164 sin el +. Un solo lugar para todo el sitio. */
export const WHATSAPP_NUMBER = '5491163542275';
export const WHATSAPP_DISPLAY = '+54 9 11 6354-2275';
const WHATSAPP_TEXT = 'Hola, vengo de concesionaria.ai y quiero conocer ConcesionarIA.';

/** Link de WhatsApp con el mensaje inicial cargado. */
export function whatsappHref(text: string = WHATSAPP_TEXT): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Calendario de GoHighLevel (crm.hyppo.io) que recibe las demos. Es el mismo
 * widget que usaba la v1 del sitio: el lead entra al CRM del lado del servidor,
 * sin depender de ningún script de analítica en el navegador.
 */
export const BOOKING_URL = 'https://crm.hyppo.io/widget/bookings/piorichards-concesionarias-ai';
export const GHL_ORIGIN = 'https://crm.hyppo.io';

/** Dónde vive el bloque de agenda. Todos los CTAs de demo apuntan acá. */
export const DEMO_PATH = '/demo/';
export const BOOKING_ANCHOR = '/demo/#agenda';

/** Medición. GTM copiado del index.html del sitio anterior. */
export const GTM_ID = 'GTM-NSHSFT8S';
/**
 * GA4 de concesionaria.ai (propiedad 563697477, stream web). Se carga directo
 * con gtag.js y NO por GTM: el contenedor GTM-NSHSFT8S no tiene ninguna etiqueta
 * de GA4, así que no hay doble conteo. Si alguien agrega GA4 dentro de GTM,
 * sacar una de las dos. Key events registrados en la propiedad: generate_lead,
 * book_demo_view, whatsapp_click.
 */
export const GA4_ID = 'G-PQD9FKD7M3';
/** Write key pública de Customer.io (workspace concesionarIA 210963). Es una
    key de navegador, pensada para ir en el HTML. */
export const CIO_WRITE_KEY = 'a29e4a60ecae3bf4179f';

export const HYPPO_URL = 'https://hyppo.io/';
/** El caso público de Grupo Garden. Es la ÚNICA fuente de métricas del sitio. */
export const GARDEN_CASE_URL = 'https://hyppo.io/casos/garden/';
export const PRIVACY_CONTACT = 'it@hyppo.io';

export type NavItem = { label: string; href: string };

/** Navegación principal. /precios/ entra solo si los precios están publicados. */
export const NAV: NavItem[] = [
  { label: 'Producto', href: '/producto/' },
  { label: 'Para concesionarias', href: '/para-concesionarias/' },
  { label: 'Integraciones', href: '/integraciones/' },
  { label: 'Caso Garden', href: '/casos/grupo-garden/' },
  ...(PRICING_PUBLISHED ? [{ label: 'Precios', href: '/precios/' }] : []),
  { label: 'Blog', href: '/blog/' },
];

/** Texto del CTA principal. Con precios publicados podría cambiar; hoy es la demo. */
export const CTA_DEMO_LABEL = 'Pide una demo';
