import { defineCollection, z } from 'astro:content';
import { CATEGORY_IDS } from '../lib/categories';
import { AUTHOR_IDS } from '../lib/authors';

/**
 * Un post = un archivo en src/content/blog/<slug>.md. El sitio es solo en
 * español, así que no hay carpetas por idioma: el nombre del archivo es el slug
 * y la URL es /blog/<slug>/.
 *
 * Es el mismo contrato de frontmatter que el blog de hyppo.io (mismos nombres de
 * campo), para que la skill hyppo-blog-post y las rutinas escriban igual en los
 * tres sitios.
 *
 * Los slugs empiezan con letra: /blog/[slug] y la paginación /blog/[...page]
 * comparten el namespace, y un post slugueado "2" chocaría con la página 2.
 * scripts/check-site-seo.mjs lo verifica.
 */
const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      /** <h1> y `headline` del schema. Tienen que coincidir. */
      title: z.string().min(10).max(90),
      /** <title> del SERP, sin el sufijo " · ConcesionarIA" (lo agrega la página). */
      seoTitle: z.string().min(10).max(60).optional(),
      /** <meta name="description">. Apuntar a 120-160 caracteres. */
      description: z.string().min(70).max(180),
      /** Resumen answer-first de 40-60 palabras: párrafo grande arriba del cuerpo
          y `abstract` del schema. Es lo que cita un motor de respuestas. */
      summary: z.string().min(80).max(400),
      category: z.enum(CATEGORY_IDS),
      author: z.enum(AUTHOR_IDS),
      /** Fecha real de publicación, ISO. Nunca se toca después de publicar. */
      publishedAt: z.date(),
      /** Fecha real de la última edición sustancial. */
      updatedAt: z.date().optional(),
      /** Hero 16:9 en src/assets/blog/<slug>.webp (ruta relativa). */
      image: image().optional(),
      imageAlt: z.string().min(5).optional(),
      /** 2 a 6 frases que se entienden solas. */
      keyTakeaways: z.array(z.string().min(20)).min(2).max(6).optional(),
      /** FAQ visible Y FAQPage schema, con el mismo texto. */
      faq: z
        .array(z.object({ q: z.string().min(8), a: z.string().min(20) }))
        .max(8)
        .optional(),
      /** Slugs de posts relacionados. */
      related: z.array(z.string()).max(3).optional(),
      /** Página comercial a la que el post le entrega el lector. Default: la
          página del cluster de su categoría. */
      cta: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
