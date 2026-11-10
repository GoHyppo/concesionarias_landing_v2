/**
 * Bots de WhatsApp de la página /demo/.
 *
 * Confirmado por Nico (2026-11-10): se muestran estas líneas. Vienen tal cual
 * de la v1 del sitio (tomilagom/concesionarias_landing, components/video-section).
 * Son las líneas reales de las marcas de Grupo Garden en Paraguay: quien escribe
 * habla con el agente en producción de esa marca y la conversación entra a la
 * operación de Garden. La página /demo/ lo dice.
 *
 * Con `DEMO_BOTS_ENABLED = false` la página muestra solo el video y el bloque
 * de agenda, sin links a números de terceros.
 */
export const DEMO_BOTS_ENABLED = true;

export type DemoBot = {
  brand: string;
  /** E.164 sin el +. */
  phone: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
};

export const DEMO_BOTS: DemoBot[] = [
  { brand: 'KIA', phone: '595981669999', logo: '/media/brands/kia.png', logoWidth: 400, logoHeight: 267 },
  { brand: 'Jeep', phone: '595984133200', logo: '/media/brands/jeep.png', logoWidth: 700, logoHeight: 394 },
  { brand: 'Fiat', phone: '595986111250', logo: '/media/brands/fiat.png', logoWidth: 320, logoHeight: 320 },
  { brand: 'Nissan', phone: '595986685555', logo: '/media/brands/nissan.png', logoWidth: 300, logoHeight: 300 },
  { brand: 'Chery', phone: '595994658749', logo: '/media/brands/chery.png', logoWidth: 400, logoHeight: 400 },
];

export function demoBotHref(bot: DemoBot): string {
  const text = `Hola, quiero conocer los modelos de ${bot.brand}`;
  return `https://wa.me/${bot.phone}?text=${encodeURIComponent(text)}`;
}
