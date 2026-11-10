/**
 * Integraciones que muestra /integraciones/.
 *
 * Regla: solo sistemas que figuran en la documentación de producto
 * (Hyppo/docs/concesionaria/concesionaria-product-overview.html, slide
 * "Plugs into the dealer stack"; Hyppo/claude_tests/business_case_sdr/content.py:
 * "SAP, Dynamics, Pilot y el DMS o ERP que ya tenga la concesionaria") o en el
 * caso público de Grupo Garden (TikTok lead forms, QR, GTM, BigQuery, Looker).
 *
 * `published: false` = está en conversación pero no se puede afirmar todavía.
 * PENDIENTE DE NICO: Tecnom figura solo en notas de una oportunidad comercial
 * (API de entrada disponible, salida en validación). Pasar a `true` cuando la
 * integración esté confirmada.
 */
export type Integration = { name: string; note?: string; published?: boolean };
export type IntegrationGroup = { id: string; title: string; text: string; items: Integration[] };

export const INTEGRATION_GROUPS: IntegrationGroup[] = [
  {
    id: 'mensajeria',
    title: 'Mensajería',
    text: 'Donde conversa el cliente. WhatsApp es el canal principal; el resto da continuidad cuando el cliente deja de responder.',
    items: [
      { name: 'WhatsApp Business API', note: 'Canal principal del agente' },
      { name: 'Chat del sitio web' },
      { name: 'Email', note: 'Confirmaciones y seguimientos' },
    ],
  },
  {
    id: 'erp',
    title: 'ERP y DMS',
    text: 'Donde vive la venta. Unir el lead con la factura es lo que permite saber qué campaña vendió.',
    items: [
      { name: 'SAP', note: 'Facturación y posventa' },
      { name: 'Microsoft Dynamics 365', note: 'Carpetas de crédito' },
      { name: 'Pilot' },
      { name: 'DMS o ERP propio', note: 'Según la API disponible' },
    ],
  },
  {
    id: 'crm',
    title: 'CRM',
    text: 'Si tu equipo ya trabaja en un CRM, los leads llegan calificados y con la conversación adjunta.',
    items: [
      { name: 'HubSpot' },
      { name: 'Salesforce' },
      { name: 'Pipedrive' },
      { name: 'Zoho CRM' },
      { name: 'ActiveCampaign' },
      { name: 'Tecnom', published: false },
    ],
  },
  {
    id: 'portales',
    title: 'Portales automotrices',
    text: 'Los leads de los portales entran al mismo flujo que los de la pauta y el WhatsApp directo.',
    items: [{ name: 'Mercado Libre Autos' }, { name: 'OLX Autos' }, { name: 'Kavak' }, { name: 'Autocosmos' }],
  },
  {
    id: 'captura',
    title: 'Pauta y captura de leads',
    text: 'Cada origen queda registrado en el perfil del lead, para atribuir la venta a la campaña correcta.',
    items: [
      { name: 'Meta Ads' },
      { name: 'Google Ads' },
      { name: 'Formularios de TikTok' },
      { name: 'Formularios web vía Google Tag Manager' },
      { name: 'Códigos QR en eventos y salón' },
    ],
  },
  {
    id: 'datos',
    title: 'Datos y reporting',
    text: 'La capa que une todo y la que lo muestra.',
    items: [
      { name: 'Customer.io', note: 'CDP y motor de automatización' },
      { name: 'BigQuery' },
      { name: 'Looker Studio' },
      { name: 'Google Analytics' },
    ],
  },
  {
    id: 'equipo',
    title: 'Trabajo en equipo',
    text: 'Avisos y automatizaciones hacia las herramientas del día a día.',
    items: [{ name: 'Slack' }, { name: 'Zapier' }],
  },
];

/** Solo lo publicable. */
export function publishedGroups(): IntegrationGroup[] {
  return INTEGRATION_GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => i.published !== false) }));
}
