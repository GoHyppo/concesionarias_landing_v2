import { SITE_URL, SITE_NAME, HYPPO_URL } from './site';

/**
 * Structured data del sitio.
 *
 * La regla que gobierna todo: el schema describe lo que la página MUESTRA.
 * `headline` es el <h1>, las respuestas del FAQPage son el texto visible, los
 * precios de un Offer están en la página. Schema que contradice a la página es
 * una violación de las guidelines y el castigo alcanza al dominio entero.
 * Por eso no hay AggregateRating ni reseñas: no tenemos reseñas públicas.
 */

/** URL absoluta con barra final (el contrato de trailing slash del sitio). */
export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  const [base, hash] = clean.split('#');
  const withSlash = /\.[a-z0-9]+$/i.test(base) || base.endsWith('/') ? base : `${base}/`;
  return `${SITE_URL}${withSlash}${hash ? `#${hash}` : ''}`;
}

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const HYPPO_ID = 'https://hyppo.io/#organization';
const LOGO_URL = `${SITE_URL}/media/concesionaria-ai-logo.png`;

/**
 * ConcesionarIA como organización. Es un producto de Hyppo: `parentOrganization`
 * apunta al mismo @id que usa hyppo.io para su Organization, así los buscadores
 * conectan las dos entidades en vez de ver dos empresas sueltas.
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: LOGO_URL,
    description:
      'IA para concesionarias de autos: un agente de WhatsApp que responde, califica y hace el seguimiento de cada lead, con datos y dashboards de gestión.',
    parentOrganization: {
      '@type': 'Organization',
      '@id': HYPPO_ID,
      name: 'Hyppo',
      url: HYPPO_URL,
    },
    areaServed: { '@type': 'Place', name: 'Latinoamérica' },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: 'es-419',
    publisher: { '@id': ORG_ID },
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export type FaqItem = { q: string; a: string };

/** Solo en páginas que MUESTRAN estas mismas preguntas y respuestas. */
export function faqPageSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export type OfferInput = {
  name: string;
  /** Abono mensual en USD. Si `isFrom`, es el piso ("desde"). */
  price: number;
  isFrom?: boolean;
  description: string;
};

/**
 * El producto como SoftwareApplication. Una sola entidad (`@id` fijo, `url` =
 * /producto/) que emiten /producto/ (sin precios) y /precios/ (con un Offer por
 * plan, armado desde src/lib/pricing.ts: el mismo arreglo que pinta la tabla
 * visible). Sin `aggregateRating`: no hay reseñas públicas que lo respalden.
 *
 * Cada Offer lleva el abono mensual como UnitPriceSpecification con unidad MON.
 * En Enterprise ("desde USD 5.000") el precio es un mínimo: `minPrice`.
 */
export function softwareApplicationSchema(opts: { description: string; offers?: OfferInput[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${absoluteUrl('/producto/')}#software`,
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'CRM y automatización de ventas para concesionarias',
    operatingSystem: 'Web, WhatsApp',
    url: absoluteUrl('/producto/'),
    description: opts.description,
    inLanguage: 'es-419',
    publisher: { '@id': ORG_ID },
    ...(opts.offers?.length
      ? {
          offers: opts.offers.map((o) => ({
            '@type': 'Offer',
            name: o.name,
            description: o.description,
            price: o.price,
            priceCurrency: 'USD',
            url: absoluteUrl('/precios/'),
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              ...(o.isFrom ? { minPrice: o.price } : { price: o.price }),
              priceCurrency: 'USD',
              unitCode: 'MON',
              referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
            },
          })),
        }
      : {}),
  };
}

/* ============================================================
   Blog
   ============================================================ */

function publisherRef() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: { '@type': 'ImageObject', url: LOGO_URL },
  };
}

export type SchemaAuthor = {
  name: string;
  path: string;
  sameAs?: string[];
  jobTitle?: string;
  description?: string;
  image?: string;
};

function authorNode(author: SchemaAuthor) {
  return {
    '@type': 'Person',
    '@id': `${absoluteUrl(author.path)}#person`,
    name: author.name,
    url: absoluteUrl(author.path),
    ...(author.jobTitle ? { jobTitle: author.jobTitle } : {}),
    ...(author.description ? { description: author.description } : {}),
    ...(author.sameAs?.length ? { sameAs: author.sameAs } : {}),
    ...(author.image ? { image: `${SITE_URL}${author.image}` } : {}),
    worksFor: { '@type': 'Organization', '@id': HYPPO_ID, name: 'Hyppo', url: HYPPO_URL },
  };
}

export function blogPostingSchema(opts: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  author: SchemaAuthor;
  image?: string;
  section: string;
  abstract?: string;
  wordCount?: number;
}) {
  const url = absoluteUrl(opts.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    headline: opts.headline,
    description: opts.description,
    ...(opts.abstract ? { abstract: opts.abstract } : {}),
    inLanguage: 'es-419',
    datePublished: opts.datePublished,
    // Sin edición real, dateModified = datePublished. Nunca la fecha del build.
    dateModified: opts.dateModified ?? opts.datePublished,
    author: authorNode(opts.author),
    publisher: publisherRef(),
    ...(opts.image ? { image: [opts.image] } : {}),
    articleSection: opts.section,
    ...(opts.wordCount ? { wordCount: opts.wordCount } : {}),
    isPartOf: {
      '@type': 'Blog',
      '@id': `${absoluteUrl('/blog/')}#blog`,
      name: 'Blog de ConcesionarIA',
      url: absoluteUrl('/blog/'),
    },
  };
}

/** Índice del blog y hubs de categoría: CollectionPage + ItemList de ESA página. */
export function blogCollectionSchema(opts: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
  isBlogRoot?: boolean;
}) {
  const url = absoluteUrl(opts.path);
  return {
    '@context': 'https://schema.org',
    '@type': opts.isBlogRoot ? ['CollectionPage', 'Blog'] : 'CollectionPage',
    '@id': opts.isBlogRoot ? `${absoluteUrl('/blog/')}#blog` : url,
    url,
    name: opts.name,
    description: opts.description,
    inLanguage: 'es-419',
    isPartOf: { '@id': WEBSITE_ID },
    publisher: publisherRef(),
    mainEntity: {
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}

/** Página de autor: ProfilePage con la entidad Person. */
export function personSchema(opts: { author: SchemaAuthor; posts: { name: string; path: string }[] }) {
  const url = absoluteUrl(opts.author.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': url,
    url,
    inLanguage: 'es-419',
    mainEntity: authorNode(opts.author),
    hasPart: opts.posts.map((post) => ({
      '@type': 'BlogPosting',
      name: post.name,
      url: absoluteUrl(post.path),
    })),
  };
}
