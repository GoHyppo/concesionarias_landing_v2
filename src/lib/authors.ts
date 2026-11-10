/**
 * Autores del blog. Personas reales con nombre, cargo, foto y página propia,
 * igual que en hyppo.io (de donde salen los nombres, los perfiles de LinkedIn y
 * las fotos). Es la entidad Person a la que un buscador le atribuye experiencia.
 *
 * Reglas:
 * - Solo firma quien escribió o revisó el post.
 * - `linkedin` es el `sameAs`. Si un perfil cambia, se actualiza acá; mejor
 *   omitir el campo que apuntar a un perfil equivocado.
 * - `image` es la foto real (public/media/authors/<id>.webp). El schema solo la
 *   declara porque la página la muestra.
 */
export const AUTHOR_IDS = ['nicolas-lew-deveali', 'tomas-lagomarsino'] as const;

export type AuthorId = (typeof AUTHOR_IDS)[number];

export type Author = {
  id: AuthorId;
  name: string;
  role: string;
  /** Bio corta: card al pie del post. */
  short: string;
  /** Bio larga: página del autor y `description` del schema Person. */
  long: string;
  linkedin?: string;
  image?: string;
  expertise: string[];
};

export const AUTHORS: readonly Author[] = [
  {
    id: 'nicolas-lew-deveali',
    name: 'Nicolas Lew Deveali',
    role: 'CEO y co-fundador de Hyppo',
    short:
      'CEO y co-fundador de Hyppo, la empresa detrás de ConcesionarIA. Escribe sobre gestión de leads, medición y cómo los datos de ventas se vuelven decisiones.',
    long: 'CEO y co-fundador de Hyppo, la empresa de growth y datos detrás de ConcesionarIA. Hyppo implementó el sistema en Grupo Garden, el mayor retailer de vehículos de Paraguay, donde pasó de una marca a diez en siete meses. Su trabajo arranca casi siempre en el mismo lugar: los datos que la concesionaria ya tiene y no está usando.',
    linkedin: 'https://www.linkedin.com/in/nicolaslew/',
    image: '/media/authors/nicolas-lew-deveali.webp',
    expertise: ['Gestión de leads', 'Medición y atribución', 'Retención', 'Customer.io'],
  },
  {
    id: 'tomas-lagomarsino',
    name: 'Tomas Lagomarsino',
    role: 'CTO de Hyppo',
    short:
      'CTO de Hyppo. Diseña la arquitectura de datos, las integraciones y los agentes de IA que sostienen la venta por WhatsApp de ConcesionarIA.',
    long: 'CTO de Hyppo. Es el responsable de la parte que no se ve de ConcesionarIA: el esquema de eventos, la identidad del cliente entre sistemas, las integraciones con SAP y Dynamics y los agentes de IA que atienden por WhatsApp. Diseñó la librería de workflows que se replica marca por marca, que es la razón por la que una marca nueva se suma en días.',
    linkedin: 'https://www.linkedin.com/in/tomaslagomarsino/',
    image: '/media/authors/tomas-lagomarsino.webp',
    expertise: ['Agentes de IA', 'WhatsApp', 'Arquitectura de datos', 'Integraciones con ERP'],
  },
];

export function getAuthor(id: AuthorId): Author {
  const found = AUTHORS.find((a) => a.id === id);
  if (!found) throw new Error(`Autor desconocido: ${id}`);
  return found;
}

/** /autores/<id>/ */
export function authorPath(id: AuthorId): string {
  return `/autores/${id}/`;
}
