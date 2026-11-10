import rss from '@astrojs/rss';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { SITE_URL } from './site';
import { absoluteUrl } from './seo';
import { BLOG_BASE, getPosts, postPath } from './blog';
import { getCategory } from './categories';
import { getAuthor } from './authors';

/**
 * El feed del blog: /blog/rss.xml. Mismas reglas que el feed de hyppo.io
 * (src/lib/feed.ts de hyppo_landing), porque los consumidores estrictos
 * (LinkedIn como fuente de contenido externa, Search Console como sitemap de
 * tipo rssFeed) descartan el feed ENTERO si no valida como RSS 2.0:
 *
 *   - El autor va como `dc:creator`, NUNCA como `<author>` (en RSS 2.0 tiene que
 *     ser un email; con un nombre el feed es inválido).
 *   - `lastBuildDate` es del CANAL, en RFC 822, no de cada item ni en ISO 8601.
 *   - Tope de RSS_ITEM_LIMIT items: el feed es una ventana a lo reciente; el
 *     archivo completo son el sitemap y el índice del blog.
 *   - Contenido completo, renderizado con markdown-it y sanitizado, con los links
 *     relativos absolutizados (un href="/x/" dentro de un lector RSS no resuelve).
 *
 * `npm run verify` valida todo esto. Si falla, se arregla el feed; jamás se
 * afloja el chequeo.
 */
const md = new MarkdownIt({ html: true, linkify: true });

/** Espejado en scripts/check-site-seo.mjs: si cambia acá, cambia allá. */
export const RSS_ITEM_LIMIT = 20;

function absolutize(html: string): string {
  return html.replace(/(href|src)="\/(?!\/)/g, `$1="${SITE_URL}/`);
}

/** RFC 822, el formato de fecha de RSS 2.0. */
function rfc822(date: Date): string {
  return date.toUTCString();
}

export async function blogFeed(site: URL | undefined) {
  const posts = (await getPosts()).slice(0, RSS_ITEM_LIMIT);

  const lastBuild = posts.length
    ? new Date(
        Math.max(
          ...posts.map((p) => Math.max(p.data.publishedAt.valueOf(), p.data.updatedAt?.valueOf() ?? 0))
        )
      )
    : new Date('2026-11-10T00:00:00Z');

  return rss({
    title: 'Blog de ConcesionarIA',
    description:
      'Guías para concesionarias de autos: gestión de leads, ventas por WhatsApp con IA, medición y gestión comercial.',
    site: site ?? SITE_URL,
    trailingSlash: true,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
      dc: 'http://purl.org/dc/elements/1.1/',
    },
    customData: [
      '<language>es-419</language>',
      `<lastBuildDate>${rfc822(lastBuild)}</lastBuildDate>`,
      `<atom:link href="${absoluteUrl(BLOG_BASE)}rss.xml" rel="self" type="application/rss+xml" />`,
    ].join(''),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: absoluteUrl(postPath(post.slug)),
      pubDate: post.data.publishedAt,
      categories: [getCategory(post.data.category).name],
      content: sanitizeHtml(absolutize(md.render(post.entry.body)), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt', 'width', 'height'],
        },
      }),
      customData: `<dc:creator><![CDATA[${getAuthor(post.data.author).name}]]></dc:creator>`,
    })),
  });
}
