#!/usr/bin/env node
/**
 * Gate de SEO on-page y de copy sobre el build de concesionaria.ai.
 *
 *   npm run verify   (= astro build && node scripts/check-site-seo.mjs)
 *
 * Portado de hyppo_landing/scripts/check-blog-seo.mjs y endurecido: acá TODAS
 * las páginas son estrictas (no hay HTML heredado que tolerar) y el código de
 * salida falla con cualquier error. El deploy de GitHub Pages corre esto ANTES
 * de publicar, así que un error acá frena el deploy.
 *
 * Qué chequea:
 *  - Un solo <h1> por página y ningún nivel de heading salteado.
 *  - <title> y meta description presentes y únicos (rangos de largo como aviso).
 *  - canonical autorreferencial (y el 404 sin canonical y con noindex).
 *  - Sin noindex en páginas indexables; sin hreflang (el sitio es solo es-419).
 *  - og:image presente y que resuelva.
 *  - <img> con alt (alt="" solo si está marcada como decorativa).
 *  - Links internos y recursos (img/video/source) que resuelvan en el build.
 *  - JSON-LD que parsea; BlogPosting con headline === <h1>, fechas ISO y autor
 *    que existe; respuestas del FAQPage visibles en la página; BreadcrumbList
 *    con URLs que existen, obligatorio en toda página interna.
 *  - Sin em-dash (U+2014) ni emojis en ningún HTML, XML o TXT del build.
 *  - Sin voseo en el texto visible (el sitio usa tuteo).
 *  - CLAIMS: ninguno de los números sin respaldo del sitio anterior, y ningún
 *    porcentaje fuera de los publicados en el caso Grupo Garden (salvo en las
 *    páginas de herramienta/legales que muestran valores del usuario o precios).
 *  - Gate de precios: con PRICING_PUBLISHED = false, /precios/ no existe ni
 *    aparece en sitemap, llms.txt o links.
 *  - Sitemap: cada <loc> existe; lastmod solo en el blog.
 *  - Feed RSS 2.0 válido (dc:creator, lastBuildDate de canal en RFC 822, tope).
 *  - Posts huérfanos y slugs válidos.
 *  - robots.txt con Sitemap, CNAME correcto y GTM en todas las páginas.
 *
 * Si algo falla, se arregla el sitio. Aflojar un chequeo para que pase es apagar
 * la alarma (en particular los de claims y feed).
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const SITE = 'https://concesionaria.ai';
const GTM_ID = 'GTM-NSHSFT8S';
/** Espejo de RSS_ITEM_LIMIT en src/lib/feed.ts. */
const RSS_ITEM_LIMIT = 20;

let failures = 0;
let warnings = 0;
const fail = (where, msg) => {
  failures++;
  console.log(`FAIL ${where}\n     ${msg}`);
};
const warn = (where, msg) => {
  warnings++;
  console.log(`WARN ${where}\n     ${msg}`);
};

if (!existsSync(DIST)) {
  console.error('No hay dist/. Corré `npm run build` primero.');
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* Inventario                                                          */
/* ------------------------------------------------------------------ */

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const textFiles = files.filter((f) => /\.(html|xml|txt)$/.test(f));

const routeOf = (file) => {
  const rel = relative(DIST, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
};

const pages = new Map();
for (const file of htmlFiles) {
  const route = routeOf(file);
  pages.set(route, { file, route, html: readFileSync(file, 'utf8') });
}

function toRoute(href) {
  if (!href) return null;
  if (href.startsWith(SITE)) return href.slice(SITE.length) || '/';
  if (/^(https?:|mailto:|tel:|data:|#)/.test(href)) return null;
  if (!href.startsWith('/')) return null;
  return href.split('#')[0].split('?')[0];
}

const routeExists = (route) =>
  pages.has(route) ||
  existsSync(join(DIST, decodeURI(route).replace(/^\//, ''))) ||
  existsSync(join(DIST, decodeURI(route).replace(/^\//, ''), 'index.html'));

/* ------------------------------------------------------------------ */
/* Parseo (regex sobre HTML que generamos nosotros)                    */
/* ------------------------------------------------------------------ */

const stripTags = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");

const attr = (tag, name) => {
  const m = new RegExp(`\\s${name}="([^"]*)"`, 'i').exec(tag);
  return m ? decode(m[1]) : null;
};

function headings(html) {
  const out = [];
  const re = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(html))) out.push({ level: Number(m[1]), text: decode(stripTags(m[2])) });
  return out;
}

const linkTags = (html, rel) =>
  (html.match(/<link\b[^>]*>/gi) ?? []).filter((t) => new RegExp(`rel="${rel}"`, 'i').test(t));

function jsonLd(html) {
  const out = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      out.push(JSON.parse(m[1]));
    } catch (err) {
      out.push({ __parseError: String(err) });
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Reglas de copy                                                      */
/* ------------------------------------------------------------------ */

/**
 * Claims del sitio anterior sin respaldo público. Si alguno vuelve, falla.
 * Fuente de la lista: el plan SEO aprobado (fase 4) y el sitio v2.
 */
const BANNED_CLAIMS = [
  [/\+?\s?300\s+concesionarias/i, '"+300 concesionarias"'],
  [/300\+?\s+concesionarias/i, '"300 concesionarias activas"'],
  [/1[.,\s]?000[.,\s]?000\s+(de\s+)?leads/i, '"1.000.000 de leads"'],
  [/\b1M\+?\s+leads/i, '"1M leads"'],
  [/98\s?%\s+(de\s+)?satisfacci/i, '"98% satisfacción"'],
  [/\b9[.,]4\s?x\b/i, '"9.4x ROI"'],
  [/\b5[.,]2\s?%/, '"5.2% de conversión"'],
  [/\b0[.,]3\s?%/, '"0.3% de conversión"'],
  [/40\s?%\s+del\s+mercado/i, '"40% del mercado"'],
  [/1[.,]200\s+suscriptores/i, '"+1.200 suscriptores"'],
  [/\b(LGPD|GDPR)\b/, 'LGPD/GDPR'],
  [/Toyota\s+Belgrano/i, '"Toyota Belgrano"'],
  [/Nissan\s+Paraguay/i, 'testimonio "Nissan Paraguay"'],
  [/\b27\s?%\s+de\s+(los\s+)?leads/i, '"27% de leads" (stat de mercado sin fuente)'],
  [/\b70\s?%\s+de\s+las\s+ventas/i, '"70% de las ventas" (stat de mercado sin fuente)'],
  [/17\s+veces\s+m[aá]s/i, '"17 veces más" (stat sin fuente)'],
  [/\+?\s?25\s+integraciones/i, '"+25 integraciones"'],
  [/10\s?[-–a]\s?20\s?x\s+ROI/i, '"10-20x ROI"'],
];

/** Porcentajes publicados en el caso Grupo Garden (src/lib/garden.ts). */
const ALLOWED_PERCENTS = new Set(['100', '41', '94']);
/** Páginas donde los porcentajes son valores del usuario, precios o texto legal. */
const PERCENT_EXEMPT = new Set(['/calculadora-roi/', '/precios/', '/privacidad/', '/terminos/']);

/** Voseo frecuente en copy comercial. El sitio usa tuteo neutro. */
// Formas acentuadas que solo existen en voseo (sin acento son tuteo o neutras).
// Bordes Unicode: \b de JS es ASCII y partiría "venía" en "vení" + "a".
const VOSEO_ACCENTED = /(?<![\p{L}])(tenés|podés|querés|sabés|hacé|pedí|mirá|contá|escribí|agendá|probá|dejá|vení|andá|decí|calculá|descubrí|conocé|empezá|sumá|usá|leé|completá|reservá|hablá|necesitás|vendés|pensá|recordá|elegís|fijate)(?![\p{L}])/giu;

const EMOJI = /[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F2FF}\u{2600}-\u{27BF}\u{2B50}\u{2B55}\u{FE0F}]/u;

/* ------------------------------------------------------------------ */
/* Gate de precios                                                     */
/* ------------------------------------------------------------------ */

const siteTs = readFileSync('src/lib/site.ts', 'utf8');
const pricingPublished = /export const PRICING_PUBLISHED\s*=\s*true/.test(siteTs);

/* ------------------------------------------------------------------ */
/* Posts                                                               */
/* ------------------------------------------------------------------ */

const postRoutePattern = /^\/blog\/([^/]+)\/$/;
const postPages = [...pages.values()].filter((p) => {
  const m = postRoutePattern.exec(p.route);
  return m && m[1] !== 'tema' && !/^\d+$/.test(m[1]);
});
if (postPages.length === 0) fail('dist/', 'No se construyó ningún post del blog.');

/* ------------------------------------------------------------------ */
/* Chequeos por página                                                 */
/* ------------------------------------------------------------------ */

const titles = new Map();
const descriptions = new Map();
const inbound = new Map();

for (const page of pages.values()) {
  const { route, html } = page;
  const where = route;
  const is404 = route === '/404.html';
  const visible = decode(stripTags(html));

  /* headings */
  const hs = headings(html);
  const h1s = hs.filter((h) => h.level === 1);
  if (h1s.length !== 1) fail(where, `Debe haber exactamente un <h1>, hay ${h1s.length}.`);
  let prev = 0;
  for (const h of hs) {
    if (prev && h.level > prev + 1) fail(where, `Heading salteado: h${prev} → h${h.level} ("${h.text.slice(0, 60)}").`);
    prev = h.level;
  }

  /* lang */
  if (!/<html lang="es"/.test(html)) fail(where, 'El <html> no declara lang="es".');

  /* title / description */
  const title = (/<title>([\s\S]*?)<\/title>/i.exec(html) ?? [])[1];
  if (!title) fail(where, 'Sin <title>.');
  else {
    const t = decode(title.trim());
    if (t.length > 65) warn(where, `<title> de ${t.length} caracteres, puede truncarse: "${t}"`);
    if (!is404) titles.set(t, [...(titles.get(t) ?? []), route]);
  }
  const descTag = (html.match(/<meta\b[^>]*name="description"[^>]*>/i) ?? [])[0];
  const desc = descTag ? attr(descTag, 'content') : null;
  if (!desc) fail(where, 'Sin meta description.');
  else {
    if (desc.length < 70 || desc.length > 180) fail(where, `meta description de ${desc.length} caracteres (70-180).`);
    else if (desc.length < 120 || desc.length > 165) warn(where, `meta description de ${desc.length} caracteres (ideal 120-160).`);
    if (!is404) descriptions.set(desc, [...(descriptions.get(desc) ?? []), route]);
  }

  /* canonical + robots */
  const canon = linkTags(html, 'canonical');
  const robotsTag = (html.match(/<meta\b[^>]*name="robots"[^>]*>/i) ?? [])[0];
  const robots = robotsTag ? attr(robotsTag, 'content') : '';
  if (is404) {
    if (canon.length) fail(where, 'El 404 no puede declarar canonical.');
    if (!/noindex/.test(robots)) fail(where, 'El 404 tiene que llevar noindex.');
  } else {
    if (canon.length !== 1) fail(where, `Se esperaba 1 canonical, hay ${canon.length}.`);
    else {
      const href = attr(canon[0], 'href');
      if (href !== `${SITE}${route}`) fail(where, `canonical apunta a ${href} en vez de a sí misma (${SITE}${route}).`);
    }
    if (/noindex/.test(robots)) fail(where, `Página indexable con robots="${robots}".`);
  }
  if (linkTags(html, 'alternate').some((t) => /hreflang=/i.test(t))) {
    fail(where, 'hreflang en un sitio de un solo idioma.');
  }

  /* og:image */
  const ogTag = (html.match(/<meta\b[^>]*property="og:image"[^>]*>/i) ?? [])[0];
  const og = ogTag ? attr(ogTag, 'content') : null;
  if (!og) fail(where, 'Sin og:image.');
  else {
    const r = toRoute(og);
    if (!r || !routeExists(r)) fail(where, `og:image no existe en el build: ${og}`);
  }

  /* GTM */
  if (!html.includes(GTM_ID)) fail(where, `Falta GTM ${GTM_ID}.`);

  /* imágenes con alt */
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    const alt = attr(tag, 'alt');
    const decorative = /aria-hidden="true"|role="presentation"/i.test(tag);
    if (alt === null) fail(where, `<img> sin alt: ${tag.slice(0, 120)}`);
    else if (alt.trim() === '' && !decorative) fail(where, `<img> con alt vacío y sin marcar como decorativa: ${tag.slice(0, 120)}`);
  }

  /* recursos internos (img, video, source) */
  for (const tag of html.match(/<(img|source|video)\b[^>]*>/gi) ?? []) {
    for (const a of ['src', 'poster']) {
      const r = toRoute(attr(tag, a));
      if (r && !routeExists(r)) fail(where, `Recurso interno que no existe: ${r}`);
    }
  }

  /* links internos */
  for (const tag of html.match(/<a\b[^>]*>/gi) ?? []) {
    const target = toRoute(attr(tag, 'href'));
    if (!target) continue;
    if (!routeExists(target)) {
      fail(where, `Link interno roto: ${target}`);
      continue;
    }
    if (target !== route) inbound.set(target, (inbound.get(target) ?? 0) + 1);
  }

  /* voseo */
  const vos = [...new Set((visible.match(VOSEO_ACCENTED) ?? []).map((v) => v.toLowerCase()))];
  if (vos.length) fail(where, `Voseo en el texto visible (usar tuteo): ${vos.join(', ')}`);

  /* claims */
  for (const [re, label] of BANNED_CLAIMS) {
    const m = re.exec(visible);
    if (m) fail(where, `Claim sin respaldo ${label}: "...${visible.slice(Math.max(0, m.index - 40), m.index + 60)}..."`);
  }
  if (!PERCENT_EXEMPT.has(route)) {
    const re = /(\d+(?:[.,]\d+)?)\s?%/g;
    let m;
    while ((m = re.exec(visible))) {
      if (!ALLOWED_PERCENTS.has(m[1])) {
        fail(
          where,
          `Porcentaje fuera de las métricas publicadas de Grupo Garden (${m[0]}): "...${visible.slice(Math.max(0, m.index - 50), m.index + 30)}..."`
        );
      }
    }
  }

  /* JSON-LD */
  const blocks = jsonLd(html);
  for (const b of blocks) if (b.__parseError) fail(where, `JSON-LD que no parsea: ${b.__parseError}`);
  const types = blocks.flatMap((b) => [b['@type']].flat());

  if (postPages.some((p) => p.route === route)) {
    const posting = blocks.find((b) => b['@type'] === 'BlogPosting');
    if (!posting) fail(where, 'Post sin BlogPosting.');
    else {
      if (posting.headline !== (h1s[0]?.text ?? '')) {
        fail(where, `headline del schema ≠ <h1>.\n     schema: "${posting.headline}"\n     h1:     "${h1s[0]?.text}"`);
      }
      for (const f of ['datePublished', 'dateModified']) {
        if (!posting[f] || Number.isNaN(Date.parse(posting[f]))) fail(where, `BlogPosting con ${f} inválido: ${posting[f]}`);
      }
      const ar = toRoute(posting.author?.url);
      if (!posting.author?.name || !ar || !routeExists(ar)) fail(where, `BlogPosting con autor inválido: ${posting.author?.url}`);
      if (!posting.image) warn(where, 'Post sin imagen en el schema.');
    }
    if (!/<meta property="og:type" content="article"/.test(html)) fail(where, 'Post sin og:type article.');
  }

  const faq = blocks.find((b) => b['@type'] === 'FAQPage');
  if (faq) {
    for (const q of faq.mainEntity ?? []) {
      const probe = String(q.acceptedAnswer?.text ?? '').slice(0, 60);
      if (probe && !visible.includes(probe)) fail(where, `Respuesta del FAQPage que no está visible: "${probe}..."`);
      const qProbe = String(q.name ?? '').slice(0, 40);
      if (qProbe && !visible.includes(qProbe)) fail(where, `Pregunta del FAQPage que no está visible: "${qProbe}..."`);
    }
  }

  const crumbs = blocks.find((b) => b['@type'] === 'BreadcrumbList');
  if (!crumbs && route !== '/' && !is404) fail(where, 'Página interna sin BreadcrumbList.');
  if (crumbs) {
    for (const item of crumbs.itemListElement ?? []) {
      const r = toRoute(item.item);
      if (!r || !routeExists(r)) fail(where, `BreadcrumbList apunta a una URL que no existe: ${item.item}`);
    }
  }
  if (route === '/' && !(types.includes('Organization') && types.includes('WebSite'))) {
    fail(where, 'El home tiene que emitir Organization y WebSite.');
  }
  if (route === '/producto/' && !types.includes('SoftwareApplication')) fail(where, '/producto/ sin SoftwareApplication.');
}

/* ------------------------------------------------------------------ */
/* Chequeos globales                                                   */
/* ------------------------------------------------------------------ */

for (const [t, routes] of titles) if (routes.length > 1) fail(routes.join(', '), `<title> duplicado: "${t}"`);
for (const [d, routes] of descriptions) if (routes.length > 1) fail(routes.join(', '), `meta description duplicada: "${d.slice(0, 70)}..."`);

for (const post of postPages) {
  if (!(inbound.get(post.route) > 0)) fail(post.route, 'Post huérfano: ninguna otra página lo linkea.');
  const slug = postRoutePattern.exec(post.route)[1];
  if (!/^[a-z][a-z0-9-]*$/.test(slug)) fail(post.route, `Slug inválido "${slug}".`);
}

/* em-dash y emojis en TODO el texto publicado (HTML, XML, TXT) */
for (const f of textFiles) {
  const raw = readFileSync(f, 'utf8');
  const i = raw.indexOf('\u2014');
  if (i !== -1) fail(f, `Em-dash (U+2014): "...${raw.slice(Math.max(0, i - 50), i + 30).replace(/\s+/g, ' ')}..."`);
  const e = EMOJI.exec(raw);
  if (e) fail(f, `Emoji o símbolo pictográfico (${e[0]}): "...${raw.slice(Math.max(0, e.index - 40), e.index + 20).replace(/\s+/g, ' ')}..."`);
}

/* precios */
const llms = existsSync(join(DIST, 'llms.txt')) ? readFileSync(join(DIST, 'llms.txt'), 'utf8') : '';
const sitemapFiles = files.filter((f) => /sitemap-\d+\.xml$/.test(f));
const sitemapXml = sitemapFiles.map((f) => readFileSync(f, 'utf8')).join('\n');
if (!llms) fail('dist/llms.txt', 'Falta llms.txt.');
if (!pricingPublished) {
  if (pages.has('/precios/')) fail('/precios/', 'PRICING_PUBLISHED es false pero /precios/ se construyó.');
  if (sitemapXml.includes(`${SITE}/precios/`)) fail('sitemap', '/precios/ en el sitemap con precios sin publicar.');
  if (llms.includes('/precios/')) fail('llms.txt', '/precios/ en llms.txt con precios sin publicar.');
} else if (!pages.has('/precios/')) {
  fail('/precios/', 'PRICING_PUBLISHED es true pero /precios/ no se construyó.');
}

/* sitemap */
if (!sitemapFiles.length) fail('dist/', 'Falta el sitemap.');
const locs = [...sitemapXml.matchAll(/<url><loc>([^<]+)<\/loc>(.*?)<\/url>/g)];
if (!locs.length) fail('sitemap', 'El sitemap no tiene URLs.');
for (const [, loc, rest] of locs) {
  const r = toRoute(loc);
  if (!r || !pages.has(r)) fail('sitemap', `<loc> que no existe en el build: ${loc}`);
  if (/404/.test(loc)) fail('sitemap', `El 404 no va en el sitemap: ${loc}`);
  const isBlog = /^\/(blog|autores)\//.test(r ?? '');
  if (/<lastmod>/.test(rest) && !isBlog) fail('sitemap', `lastmod fuera del blog (sin fecha real): ${loc}`);
}
for (const route of pages.keys()) {
  if (route === '/404.html') continue;
  if (!locs.some(([, loc]) => toRoute(loc) === route)) fail('sitemap', `Página indexable que falta en el sitemap: ${route}`);
}

/* robots, CNAME */
const robotsTxt = existsSync(join(DIST, 'robots.txt')) ? readFileSync(join(DIST, 'robots.txt'), 'utf8') : '';
if (!robotsTxt.includes(`Sitemap: ${SITE}/sitemap-index.xml`)) fail('robots.txt', 'Falta la línea Sitemap.');
if (/Disallow:\s*\/\s*$/m.test(robotsTxt)) fail('robots.txt', 'robots.txt bloquea todo el sitio.');
const cname = existsSync(join(DIST, 'CNAME')) ? readFileSync(join(DIST, 'CNAME'), 'utf8').trim() : '';
if (cname !== 'concesionaria.ai') fail('CNAME', `CNAME es "${cname}", se esperaba "concesionaria.ai".`);

/* feed */
const feedPath = join(DIST, 'blog', 'rss.xml');
if (!existsSync(feedPath)) fail(feedPath, 'Falta el feed RSS.');
else {
  const xml = readFileSync(feedPath, 'utf8');
  const items = (xml.match(/<item>/g) ?? []).length;
  const expected = Math.min(postPages.length, RSS_ITEM_LIMIT);
  if (items !== expected) fail(feedPath, `El feed tiene ${items} items, se esperaban ${expected}.`);
  if (!/<atom:link[^>]*rel="self"/.test(xml)) fail(feedPath, 'El feed no declara su self-link.');
  if (/<author>/.test(xml)) fail(feedPath, '<author> en el feed: RSS 2.0 exige un email ahí. Usar <dc:creator>.');
  const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  if (itemBlocks.some((i) => i.includes('<lastBuildDate>'))) fail(feedPath, '<lastBuildDate> dentro de un item.');
  if (itemBlocks.some((i) => !i.includes('<dc:creator>'))) fail(feedPath, 'Item sin <dc:creator>.');
  const lbd = xml.match(/<channel>[\s\S]*?<lastBuildDate>(.*?)<\/lastBuildDate>/)?.[1];
  if (!lbd) fail(feedPath, 'El canal no declara <lastBuildDate>.');
  else if (!/^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/.test(lbd)) fail(feedPath, `<lastBuildDate> no está en RFC 822: "${lbd}"`);
  for (const tag of ['title', 'link', 'description']) {
    if (!new RegExp(`<channel>[\\s\\S]*?<${tag}>`).test(xml)) fail(feedPath, `El canal no tiene <${tag}>.`);
  }
  for (const link of xml.match(/<link>([^<]+)<\/link>/g) ?? []) {
    const url = link.replace(/<\/?link>/g, '');
    const r = toRoute(url);
    if (r && !routeExists(r)) fail(feedPath, `Link del feed que no existe: ${url}`);
  }
}

/* ------------------------------------------------------------------ */

console.log(`\n${pages.size} páginas revisadas (${postPages.length} posts), ${textFiles.length} archivos de texto.`);
if (warnings) console.log(`${warnings} advertencia(s).`);
console.log(failures ? `${failures} error(es). verify en ROJO.` : 'Sin errores. verify en verde.');
process.exit(failures ? 1 : 0);
