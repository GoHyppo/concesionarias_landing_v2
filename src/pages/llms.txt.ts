import type { APIContext } from 'astro';
import { SITE_URL, PRICING_PUBLISHED, GARDEN_CASE_URL } from '../lib/site';
import { absoluteUrl } from '../lib/seo';
import { BLOG_BASE, categoryPath, getPosts, getUsedCategories, postPath } from '../lib/blog';
import { getCategory } from '../lib/categories';
import { AUTHORS, authorPath } from '../lib/authors';

/**
 * /llms.txt generado desde el contenido real (mismo criterio que hyppo.io): un
 * índice a mano queda viejo al tercer post. Solo lista URLs que existen; /precios/
 * entra solo si PRICING_PUBLISHED es true. Sin em-dash: separador " : ".
 */
export async function GET(_context: APIContext) {
  const posts = await getPosts();
  const cats = await getUsedCategories();

  const lines: string[] = [
    '# ConcesionarIA',
    '',
    '> IA para concesionarias de autos. Un agente de IA atiende cada lead por WhatsApp en segundos, lo califica',
    '> (Hot, Warm, Cold), agenda test drives y hace el seguimiento; una capa de datos (Customer.io) une cada lead',
    '> con la venta del ERP; y dashboards de gestión muestran el embudo y la atribución por campaña. Producto de',
    '> Hyppo (https://hyppo.io/). Sitio en español (es-419), para concesionarias de Latinoamérica.',
    '',
    `- Sitio: ${SITE_URL}/`,
    `- Caso publicado: Grupo Garden, Paraguay, 10 marcas en 7 meses: ${absoluteUrl('/casos/grupo-garden/')} (versión completa: ${GARDEN_CASE_URL})`,
    '',
    '## Páginas',
    '',
    `- IA para concesionarias (inicio): ${absoluteUrl('/')}`,
    `- Software para concesionarias (producto): ${absoluteUrl('/producto/')}`,
    `- Para concesionarias 0km, usados y grupos: ${absoluteUrl('/para-concesionarias/')}`,
    `- Integraciones con CRM, ERP y portales: ${absoluteUrl('/integraciones/')}`,
    `- Chatbot para concesionarias, demo en vivo: ${absoluteUrl('/demo/')}`,
    `- Calculadora de ROI para concesionarias: ${absoluteUrl('/calculadora-roi/')}`,
    ...(PRICING_PUBLISHED ? [`- Precios: ${absoluteUrl('/precios/')}`] : []),
    '',
    '## Blog',
    '',
    `- Índice: ${absoluteUrl(BLOG_BASE)}`,
    `- RSS (contenido completo): ${absoluteUrl(BLOG_BASE)}rss.xml`,
    '',
    '### Temas',
    '',
    ...cats.map((id) => {
      const c = getCategory(id);
      return `- ${c.name}: ${absoluteUrl(categoryPath(id))} : ${c.blurb}`;
    }),
    '',
    '### Artículos',
    '',
    ...posts.map(
      (p) =>
        `- ${p.data.title} (${p.data.publishedAt.toISOString().slice(0, 10)}): ${absoluteUrl(postPath(p.slug))} : ${p.data.description}`
    ),
    '',
    '## Autores',
    '',
    ...AUTHORS.filter((a) => posts.some((p) => p.data.author === a.id)).map(
      (a) => `- ${a.name}, ${a.role}: ${absoluteUrl(authorPath(a.id))}`
    ),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
