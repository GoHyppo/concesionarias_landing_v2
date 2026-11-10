import { GARDEN_CASE_URL } from './site';

/**
 * Las ÚNICAS métricas que el sitio puede mostrar.
 *
 * Vienen del caso Grupo Garden publicado en hyppo.io/casos/garden/ y se citan
 * siempre atribuidas a ese caso, con link. Cualquier otro número (cantidad de
 * concesionarias, leads procesados, ROI promedio, tasas de conversión de
 * mercado) está prohibido mientras no haya una fuente pública que lo respalde.
 * scripts/check-site-seo.mjs falla si reaparece alguno de los números que tenía
 * el sitio anterior (ver BANNED_CLAIMS ahí).
 */
export const GARDEN_SOURCE = GARDEN_CASE_URL;

export type GardenMetric = { value: string; label: string; text: string };

export const GARDEN_METRICS: GardenMetric[] = [
  {
    value: '100%',
    label: 'Leads trazables',
    text: 'de los leads nuevos con trazabilidad de punta a punta, del primer mensaje de WhatsApp a la factura en SAP.',
  },
  {
    value: '100%',
    label: 'Respuesta en segundos',
    text: 'de los leads nuevos respondidos en segundos, las 24 horas.',
  },
  {
    value: '+41%',
    label: 'Asistencia a test drive',
    text: 'más clientes asistiendo al test drive que agendaron, desde que corren los recordatorios automáticos.',
  },
  {
    value: '3,2x',
    label: 'Seguimientos por lead',
    text: 'más seguimientos entregados por lead que con el bot anterior, sin sumar personal.',
  },
  {
    value: '94%',
    label: 'Clasificación automática',
    text: 'de los leads clasificados como Hot, Warm o Cold sin intervención humana en el ruteo.',
  },
  {
    value: '10',
    label: 'Marcas en 7 meses',
    text: 'marcas del grupo operando sobre la misma arquitectura, de noviembre de 2025 a mayo de 2026.',
  },
];

/** Marcas del grupo que operan con el sistema, según el caso publicado. */
export const GARDEN_BRANDS = [
  'KIA',
  'Nissan',
  'Chevrolet',
  'BMW',
  'MINI',
  'Fiat',
  'Jeep',
  'Ram',
  'Chery',
  'Mazda',
  'Volvo',
  'iCAUR',
];

/**
 * Logos disponibles (heredados de la v1 del sitio). Solo marcas que están en
 * GARDEN_BRANDS: el sitio no muestra logos de marcas que no operan con el
 * sistema. Crestanevada estaba en la v1 y quedó afuera por eso.
 */
export const GARDEN_LOGOS = [
  { name: 'Grupo Garden', src: '/media/brands/grupo-garden.png', width: 424, height: 292 },
  { name: 'KIA', src: '/media/brands/kia.png', width: 400, height: 267 },
  { name: 'Nissan', src: '/media/brands/nissan.png', width: 300, height: 300 },
  { name: 'Fiat', src: '/media/brands/fiat.png', width: 320, height: 320 },
  { name: 'Jeep', src: '/media/brands/jeep.png', width: 700, height: 394 },
  { name: 'Chery', src: '/media/brands/chery.png', width: 400, height: 400 },
];
