/**
 * Las cuatro categorías del blog. Pocas y estables, sin tags (mismo criterio que
 * hyppo.io, ver docs/BLOG.md).
 *
 * Cada categoría es una URL indexable (/blog/tema/<id>/) y el hub de un cluster
 * que le pasa autoridad a una página comercial (`service`). El post gana la
 * búsqueda informacional; la página comercial hace la conversión. Si un post no
 * encaja en ninguna, el problema es el post, no la taxonomía.
 *
 * La categoría NO va en la URL del post (/blog/<slug>/), así un post se puede
 * recategorizar sin mover su URL. La URL del hub sí es permanente.
 */
export const CATEGORY_IDS = [
  'gestion-de-leads',
  'whatsapp-e-ia',
  'medicion-y-atribucion',
  'gestion-comercial',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export type Category = {
  id: CategoryId;
  /** Página comercial a la que el cluster le pasa autoridad. */
  service: string;
  /** Nombre corto: chips, cards, breadcrumb. */
  name: string;
  /** <h1> del hub. */
  h1: string;
  /** <title> del hub, sin el sufijo " · ConcesionarIA". */
  seoTitle: string;
  /** <meta name="description"> del hub (120-160). */
  description: string;
  /** Copy propia del hub: lo que separa un archivo indexable de uno thin. */
  intro: [string, string];
  /** Una línea para la card del índice. */
  blurb: string;
  /** Label del link a la página comercial del cluster. */
  serviceLabel: string;
};

export const CATEGORIES: readonly Category[] = [
  {
    id: 'gestion-de-leads',
    service: '/producto/',
    name: 'Gestión de leads',
    h1: 'Gestión de leads en concesionarias',
    seoTitle: 'Gestión de leads en concesionarias: guías',
    description:
      'Cómo atender, ordenar y no perder los leads de una concesionaria: tiempo de respuesta, asignación, leads de plan de ahorro y reactivación.',
    intro: [
      'Una concesionaria no pierde ventas en la pauta: las pierde entre el primer mensaje y la visita al salón. El lead que nadie contestó, el que quedó en el teléfono de un vendedor que se fue, el que pidió precio un viernes a la noche y el lunes ya había comprado en otro lado.',
      'Acá escribimos sobre esa parte del proceso: cuánto tarda tu equipo en responder, cómo se reparte cada consulta, qué hacer con los leads que no compran hoy y cómo se mide todo eso sin depender de planillas.',
    ],
    blurb: 'Tiempo de respuesta, asignación, plan de ahorro y reactivación de leads.',
    serviceLabel: 'Ver cómo funciona ConcesionarIA',
  },
  {
    id: 'whatsapp-e-ia',
    service: '/demo/',
    name: 'WhatsApp e IA',
    h1: 'WhatsApp e IA para concesionarias',
    seoTitle: 'WhatsApp e IA para concesionarias',
    description:
      'Guías para vender autos por WhatsApp con agentes de IA: calificación de leads, seguimiento automático, test drives y el traspaso al vendedor.',
    intro: [
      'En la venta de autos, la conversación arranca casi siempre por WhatsApp. El problema es que WhatsApp, tal como lo usa la mayoría de las concesionarias, es una bandeja personal: no deja datos, no avisa cuando un lead se enfría y no le muestra nada al gerente.',
      'Estas guías explican cómo se arma un canal de WhatsApp que trabaja con un agente de IA: qué preguntas hace para calificar, cuándo le pasa la conversación a un vendedor, cómo se programan los seguimientos y qué queda registrado.',
    ],
    blurb: 'Agentes de IA, calificación, seguimiento y traspaso al vendedor.',
    serviceLabel: 'Probar el agente en una demo',
  },
  {
    id: 'medicion-y-atribucion',
    service: '/calculadora-roi/',
    name: 'Medición y atribución',
    h1: 'Medición y atribución para concesionarias',
    seoTitle: 'Medición y atribución en concesionarias',
    description:
      'Cómo saber qué campaña vende autos y no solo cuál trae leads: atribución hasta la factura, embudo de ventas y métricas para el gerente.',
    intro: [
      'La mayoría de las concesionarias sabe cuántos leads le trae cada campaña y casi ninguna sabe cuántos autos vendió cada una. La diferencia está en un dato que se pierde en el camino: qué lead terminó en una factura.',
      'Acá escribimos sobre cómo cerrar ese circuito: unir el lead de la pauta con la venta del ERP, armar un embudo que se pueda leer por canal, modelo y vendedor, y calcular cuánto rinde de verdad lo que se invierte.',
    ],
    blurb: 'Atribución hasta la factura, embudo de ventas y retorno de la inversión.',
    serviceLabel: 'Calcular el retorno de tu concesionaria',
  },
  {
    id: 'gestion-comercial',
    service: '/para-concesionarias/',
    name: 'Gestión comercial',
    h1: 'Gestión comercial de concesionarias',
    seoTitle: 'Gestión comercial de concesionarias',
    description:
      'Cómo organizar el equipo comercial de una concesionaria con IA: BDC, vendedores, supervisión de respuesta y decisiones para el dueño.',
    intro: [
      'Sumar tecnología no ordena un equipo comercial por sí sola. Lo que cambia el resultado es quién atiende cada consulta, con qué información llega el vendedor a la conversación y qué ve el gerente cuando algo se traba.',
      'Estas guías están escritas para dueños, gerentes generales y gerentes comerciales: cómo repartir el trabajo entre un BDC, un agente de IA y los vendedores, y cómo supervisarlo sin auditar chats a mano.',
    ],
    blurb: 'BDC, vendedores, supervisión y decisiones para el dueño.',
    serviceLabel: 'Ver ConcesionarIA según tu tipo de concesionaria',
  },
];

export function getCategory(id: CategoryId): Category {
  const found = CATEGORIES.find((c) => c.id === id);
  if (!found) throw new Error(`Categoría desconocida: ${id}`);
  return found;
}
