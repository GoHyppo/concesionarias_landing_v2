/**
 * Planes y precios de ConcesionarIA, TAL CUAL la tabla "Planes y precios" de
 * Hyppo/claude_tests/business_case_sdr/content.py (decisión de Nico,
 * 2026-11-10: publicar la tabla completa y resolver las contradicciones del
 * sitio anterior a favor de content.py).
 *
 * Quedan afuera a propósito, porque no están en content.py o lo contradicen:
 *   - "Solo pagas por leads calificados" (v2): el modelo es abono mensual.
 *   - "Platinum = 750 base + 500 extra leads" (v2): Platinum es USD 2.750.
 *   - Listas de features por plan (v2 y el deck no coinciden entre sí).
 *   - Las "referencias de mercado" de content.py (ganancia por auto, costo de un
 *     equipo de calificación, costo por lead): son supuestos internos sin fuente
 *     pública, y la política de claims del sitio no los permite.
 *
 * Solo se muestran si PRICING_PUBLISHED es true (src/lib/site.ts). El schema
 * SoftwareApplication de /precios/ arma un Offer por plan desde este mismo
 * arreglo, así la página y el structured data no pueden divergir (el gate lo
 * verifica).
 */
export type Plan = {
  id: 'gold' | 'platinum' | 'enterprise';
  name: string;
  /** Abono mensual en USD, como se muestra (formato es-AR). */
  price: string;
  /** Abono como número, para el Offer del schema. En Enterprise es el piso. */
  priceValue: number;
  /** "desde" en Enterprise: el abono es un mínimo. */
  isFrom?: boolean;
  conversations: string;
  extraConversation: string;
  seats: string;
  extraSeat: string;
  setup: string;
  highlight?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: 'gold',
    name: 'Gold',
    price: '750',
    priceValue: 750,
    conversations: '3.000',
    extraConversation: '0,25',
    seats: '5',
    extraSeat: '25',
    setup: '1.500',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: '2.750',
    priceValue: 2750,
    conversations: '3.000',
    extraConversation: '0,20',
    seats: '10',
    extraSeat: '20',
    setup: '3.500',
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '5.000',
    priceValue: 5000,
    isFrom: true,
    conversations: '25.000',
    extraConversation: '0,15',
    seats: '50',
    extraSeat: '10 a 15',
    setup: 'A medida',
  },
];

/** Filas de la tabla, en el orden y con los rótulos de content.py. */
export const PRICE_ROWS: { label: string; value: (p: Plan) => string }[] = [
  { label: 'Abono mensual (USD)', value: (p) => (p.isFrom ? `desde ${p.price}` : p.price) },
  { label: 'Conversaciones incluidas', value: (p) => p.conversations },
  { label: 'Conversación adicional (USD)', value: (p) => p.extraConversation },
  { label: 'Licencias de vendedor incluidas', value: (p) => p.seats },
  { label: 'Licencia adicional (USD / mes)', value: (p) => p.extraSeat },
  { label: 'Implementación, única vez (USD)', value: (p) => p.setup },
];

/**
 * Oferta de lanzamiento. content.py: "50% en la implementación para los primeros
 * 10 clientes"; Nico precisó que son las primeras 10 concesionarias de Argentina
 * (igual que el deck comercial).
 */
export const EARLY_ADOPTER =
  'Early adopter: 50% de descuento en la implementación para las primeras 10 concesionarias de Argentina.';

/** El producto, con las palabras de content.py ("El producto"). */
export const PRODUCT_PARTS = [
  {
    title: 'Agente de IA en WhatsApp',
    text: 'Atiende, califica y agenda 24/7. Entrega catálogos y planes de financiación. La IA califica, el vendedor cierra, en el mismo hilo.',
  },
  {
    title: 'Motor de automatización',
    text: 'Seguimientos disparados por comportamiento, score de calidad del lead, y un supervisor que detecta al lead sin respuesta y lo reasigna.',
  },
  {
    title: 'Dashboard de gestión',
    text: 'Ranking de vendedores, performance por modelo y por campaña, y atribución de cada venta a la campaña que la originó.',
  },
  {
    title: 'Integraciones',
    text: 'SAP, Dynamics, Pilot y el DMS o ERP que ya tenga la concesionaria.',
  },
];

/** Texto del abono para cards y FAQs: "USD 750", "desde USD 5.000". */
export function monthlyLabel(p: Plan): string {
  return `${p.isFrom ? 'desde ' : ''}USD ${p.price}`;
}
