/**
 * Constantes del sitio. Todo lo que es una decisión comercial (publicar precios,
 * a qué número de WhatsApp van los CTAs, qué calendario recibe las demos) vive
 * acá y en ningún otro lado, para que cambiarlo sea tocar una línea.
 *
 * PENDIENTE DE NICO (ver CLAUDE.md, "Decisiones abiertas"):
 *   - PRICING_PUBLISHED: si se publican los planes en /precios/.
 *   - WHATSAPP_NUMBER: hoy es el número de Hyppo Argentina (el mismo que usan
 *     v1, gochat.ar y hyppo.io). El sitio v2 usaba un número de EE. UU.
 *   - BOOKING_URL: calendario de GoHighLevel que recibe las demos (el de v1).
 */

export const SITE_URL = 'https://concesionaria.ai';
export const SITE_NAME = 'ConcesionarIA';
export const SITE_TAGLINE = 'IA para concesionarias';

/**
 * Precios públicos. Con `false`:
 *   - /precios/ NO se construye (getStaticPaths devuelve cero rutas en
 *     src/pages/[pricing].astro), así que tampoco entra al sitemap ni a llms.txt;
 *   - el nav y el footer no la linkean;
 *   - los CTAs dicen "Pide una demo" y el FAQ de precio responde sin cifras;
 *   - la calculadora pide la inversión mensual como dato, sin sugerir un plan.
 * Para publicar: poner `true`, correr `npm run verify` y revisar /precios/.
 */
export const PRICING_PUBLISHED = false;

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

/** Medición. Copiados del index.html del sitio anterior. */
export const GTM_ID = 'GTM-NSHSFT8S';
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
