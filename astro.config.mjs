import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SITE = 'https://concesionaria.ai';

/**
 * lastmod: solo donde sabemos la verdad (misma política que hyppo.io).
 *
 * `new Date()` estamparía la fecha del build en todas las URLs y le enseñaría a
 * Google a ignorar el campo. Las páginas hechas a mano no tienen una fecha
 * confiable, así que van SIN lastmod. El blog sí tiene fuente de verdad en el
 * frontmatter: `updatedAt` si el post se editó, `publishedAt` si no. Se lee con
 * fs porque `serialize()` es sincrónico y no puede consultar la colección.
 */
function leerPosts() {
  const dir = fileURLToPath(new URL('./src/content/blog/', import.meta.url));
  if (!existsSync(dir)) return [];
  const posts = [];
  for (const archivo of readdirSync(dir)) {
    if (!archivo.endsWith('.md')) continue;
    const raw = readFileSync(dir + archivo, 'utf8');
    const fin = raw.indexOf('\n---', 3);
    const fm = fin === -1 ? '' : raw.slice(0, fin);
    const campo = (k) => {
      const m = fm.match(new RegExp(`^${k}:[ \\t]*['"]?([^'"\\n]+?)['"]?[ \\t]*$`, 'm'));
      return m ? m[1].trim() : null;
    };
    if (campo('draft') === 'true') continue;
    const publicado = campo('publishedAt');
    if (!publicado) continue;
    posts.push({
      slug: archivo.replace(/\.md$/, ''),
      categoria: campo('category'),
      autor: campo('author'),
      fecha: campo('updatedAt') || publicado,
    });
  }
  return posts;
}

const LASTMOD = new Map();
{
  const posts = leerPosts();
  // Fechas ISO (AAAA-MM-DD): el orden lexicográfico es el cronológico.
  const masNueva = (lista) => lista.map((p) => p.fecha).sort().at(-1);
  for (const p of posts) LASTMOD.set(`${SITE}/blog/${p.slug}/`, p.fecha);
  if (posts.length) {
    const ultima = masNueva(posts);
    LASTMOD.set(`${SITE}/blog/`, ultima);
    for (let i = 2; i <= 50; i++) LASTMOD.set(`${SITE}/blog/${i}/`, ultima);
    for (const cat of new Set(posts.map((p) => p.categoria).filter(Boolean))) {
      LASTMOD.set(`${SITE}/blog/tema/${cat}/`, masNueva(posts.filter((p) => p.categoria === cat)));
    }
    for (const autor of new Set(posts.map((p) => p.autor).filter(Boolean))) {
      LASTMOD.set(`${SITE}/autores/${autor}/`, masNueva(posts.filter((p) => p.autor === autor)));
    }
  }
}

export default defineConfig({
  site: SITE,
  // GitHub Pages sirve /x/ desde x/index.html y redirige /x a /x/ con 301.
  // Las cuatro fuentes (este flag, build.format, los <loc> del sitemap y los
  // canonicals de src/lib/seo.ts) usan la barra final: si cambia una, cambian
  // todas.
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  integrations: [
    sitemap({
      // El 404 no es una página indexable. /precios/ solo existe si
      // PRICING_PUBLISHED es true (src/lib/site.ts); si no se construye, no hay
      // nada que filtrar.
      filter: (page) => !/\/404\/?$/.test(page),
      serialize(item) {
        const lastmod = LASTMOD.get(item.url);
        if (lastmod) item.lastmod = lastmod;
        item.priority = item.url === `${SITE}/` ? 1.0 : 0.8;
        return item;
      },
    }),
  ],
});
