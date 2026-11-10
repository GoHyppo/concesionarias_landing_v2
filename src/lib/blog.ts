import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIES, type CategoryId } from './categories';

export type BlogEntry = CollectionEntry<'blog'>;

export type Post = {
  entry: BlogEntry;
  /** Slug = nombre del archivo sin extensión. */
  slug: string;
  data: BlogEntry['data'];
};

/** Posts por página en el índice y en cada categoría (tres filas de tres). */
export const POSTS_PER_PAGE = 9;

export const BLOG_BASE = '/blog/';

/**
 * Todos los posts publicados, más nuevos primero. Los drafts se filtran SIEMPRE,
 * también en dev: si no, el chequeo de SEO local miraría otro sitio del que se
 * publica. Para ver un draft, sacale el flag.
 */
export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection('blog', ({ data }) => data.draft !== true);
  return entries
    .map((entry) => ({ entry, slug: entry.slug, data: entry.data }))
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export async function getPostsByCategory(category: CategoryId): Promise<Post[]> {
  return (await getPosts()).filter((p) => p.data.category === category);
}

/** Categorías con al menos un post, en orden fijo. Un hub vacío no se publica. */
export async function getUsedCategories(): Promise<CategoryId[]> {
  const posts = await getPosts();
  return CATEGORIES.map((c) => c.id).filter((id) => posts.some((p) => p.data.category === id));
}

/**
 * Relacionados: los declarados en `related`, completados con los más nuevos de
 * la misma categoría y, si faltan, con lo más nuevo del blog.
 */
export async function getRelated(post: Post, limit = 3): Promise<Post[]> {
  const pool = await getPosts();
  const picked: Post[] = [];
  for (const slug of post.data.related ?? []) {
    const match = pool.find((p) => p.slug === slug && p.slug !== post.slug);
    if (match && !picked.includes(match)) picked.push(match);
  }
  for (const c of pool) {
    if (picked.length >= limit) break;
    if (c.slug !== post.slug && c.data.category === post.data.category && !picked.includes(c)) picked.push(c);
  }
  for (const c of pool) {
    if (picked.length >= limit) break;
    if (c.slug !== post.slug && !picked.includes(c)) picked.push(c);
  }
  return picked.slice(0, limit);
}

/* Rutas: siempre con barra final. */

export function postPath(slug: string): string {
  return `/blog/${slug}/`;
}

export function categoryPath(id: CategoryId): string {
  return `/blog/tema/${id}/`;
}

/** Página N de un listado. La 1 no lleva sufijo (/blog/ y /blog/1/ serían duplicados). */
export function pagePath(base: string, page: number): string {
  return page <= 1 ? base : `${base}${page}/`;
}

/* Formato */

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString();
}

/** Minutos de lectura a 200 palabras por minuto, con piso de 1. */
export function readingMinutes(body: string): number {
  const words = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/* getStaticPaths: una sola implementación por ruta. */

function paginate<T>(items: T[]): T[][] {
  if (items.length === 0) return [[]];
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += POSTS_PER_PAGE) pages.push(items.slice(i, i + POSTS_PER_PAGE));
  return pages;
}

export async function blogIndexPaths() {
  const posts = await getPosts();
  const used = await getUsedCategories();
  const pages = paginate(posts);
  return pages.map((chunk, i) => ({
    params: { page: i === 0 ? undefined : String(i + 1) },
    props: { posts: chunk, current: i + 1, total: pages.length, used },
  }));
}

export async function blogPostPaths() {
  const posts = await getPosts();
  const used = await getUsedCategories();
  return Promise.all(
    posts.map(async (post) => ({
      params: { slug: post.slug },
      props: { post, related: await getRelated(post), used },
    }))
  );
}

export async function blogCategoryPaths() {
  const used = await getUsedCategories();
  const out: { params: { category: string; page: string | undefined }; props: Record<string, unknown> }[] = [];
  for (const id of used) {
    const pages = paginate(await getPostsByCategory(id));
    pages.forEach((chunk, i) => {
      out.push({
        params: { category: id, page: i === 0 ? undefined : String(i + 1) },
        props: { id, posts: chunk, current: i + 1, total: pages.length, used },
      });
    });
  }
  return out;
}

export async function blogAuthorPaths() {
  const posts = await getPosts();
  const ids = [...new Set(posts.map((p) => p.data.author))];
  return ids.map((id) => ({
    params: { author: id },
    props: { id, posts: posts.filter((p) => p.data.author === id) },
  }));
}
