/**
 * Planes de ConcesionarIA. Fuente: Hyppo/claude_tests/business_case_sdr/content.py
 * (tabla "Planes y precios"). Solo se muestran si PRICING_PUBLISHED es true
 * (src/lib/site.ts); mientras tanto este archivo no se importa desde ninguna
 * página construida.
 *
 * Las features por plan siguen el deck comercial (claude_tests/pitches/
 * concesionaria/build_slides.py); el sitio v2 decía otra cosa (por ejemplo, Gold
 * sin supervisor).
 *
 * PENDIENTE DE NICO: la lista dice Gold 750 / Platinum 2.750 / Enterprise desde
 * 5.000, y hay contratos firmados a otro precio. Confirmar precios y features
 * por plan antes de publicar.
 */
export type Plan = {
  id: 'gold' | 'platinum' | 'enterprise';
  name: string;
  subtitle: string;
  /** Abono mensual en USD, como se muestra. */
  price: string;
  /** Precio numérico para el schema Offer (en Enterprise, el piso del "desde"). */
  priceValue: number;
  pricePrefix?: string;
  setup: string;
  conversations: string;
  extraConversation: string;
  seats: string;
  extraSeat: string;
  target: string;
  features: string[];
  highlight?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: 'gold',
    name: 'Gold',
    subtitle: 'Para empezar a ordenar WhatsApp',
    price: '750',
    priceValue: 750,
    setup: 'USD 1.500',
    conversations: '3.000',
    extraConversation: 'USD 0,25',
    seats: '5',
    extraSeat: 'USD 25 / mes',
    target: 'Concesionarias con un solo punto de venta y un equipo comercial chico.',
    features: [
      'Agente de IA en WhatsApp, las 24 horas',
      'Supervisor que detecta leads sin respuesta',
      'Dashboard de gestión incluido',
      'Integración con planillas y Zapier',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    subtitle: 'Para optimizar la conversión',
    price: '2.750',
    priceValue: 2750,
    setup: 'USD 3.500',
    conversations: '3.000',
    extraConversation: 'USD 0,20',
    seats: '10',
    extraSeat: 'USD 20 / mes',
    target: 'Concesionarias grandes o grupos chicos con varios vendedores.',
    highlight: true,
    features: [
      'Todo lo de Gold',
      'Supervisor y dashboard avanzados',
      'Integración con ERP: SAP, Dynamics o tu DMS',
      'Personalización dedicada',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle: 'Para grupos automotrices',
    price: '5.000',
    priceValue: 5000,
    pricePrefix: 'desde',
    setup: 'A medida',
    conversations: '25.000',
    extraConversation: 'USD 0,15',
    seats: '50',
    extraSeat: 'USD 10 a 15 / mes',
    target: 'Grupos con varias marcas o sucursales bajo una misma operación.',
    features: [
      'Todo lo de Platinum',
      'Instancia de IA dedicada',
      'Dashboard a medida, multimarca',
      'Equipo dedicado de desarrollo y growth',
    ],
  },
];

export const EARLY_ADOPTER =
  'Early adopter: 50% de descuento en la implementación para los primeros 10 clientes.';
