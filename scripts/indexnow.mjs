#!/usr/bin/env node
// IndexNow: avisa a Bing (y por él a ChatGPT search, Copilot, Yandex, Seznam,
// Naver) que una URL es nueva o cambió. Bing es una de las fuentes de la
// búsqueda de ChatGPT, así que esto acorta el tiempo hasta que un post nuevo
// puede aparecer citado.
//
// La clave de IndexNow NO es un secreto: el protocolo exige publicarla en
// /<clave>.txt para probar que el sitio es nuestro. Por eso vive en public/.
//
// Uso:
//   SITE=https://hyppo.io node scripts/indexnow.mjs <base-sha> <head-sha>
//       -> manda solo las URLs de los posts que cambiaron entre esos commits
//   SITE=https://hyppo.io node scripts/indexnow.mjs --all
//       -> manda todas las URLs del sitemap (primera vez o cambios de páginas)
//   Agregá --dry-run para ver qué mandaría sin mandar nada.
//
// Antes de mandar espera a que el deploy esté vivo (la clave y cada URL
// responden 200), así Bing no encuentra un 404 al ir a buscarlas.
import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';

const SITE = (process.env.SITE || '').replace(/\/$/, '');
if (!/^https:\/\/[a-z0-9.-]+$/.test(SITE)) {
  console.error('Falta SITE (ej. SITE=https://hyppo.io)');
  process.exit(1);
}
const HOST = new URL(SITE).host;
const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const ALL = args.includes('--all');
const shas = args.filter((a) => !a.startsWith('--'));

const keyFile = readdirSync('public').find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error('No hay archivo de clave IndexNow en public/ (<32 hex>.txt)');
  process.exit(1);
}
const KEY = keyFile.replace(/\.txt$/, '');
const KEY_URL = `${SITE}/${keyFile}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = { 'user-agent': 'indexnow-submit (+github actions)' };

async function sitemapUrls() {
  const index = await (await fetch(`${SITE}/sitemap-index.xml`, { headers: UA })).text();
  const children = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const urls = [];
  for (const c of children) {
    const xml = await (await fetch(c, { headers: UA })).text();
    urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  }
  return urls;
}

function changedSlugs(base, head) {
  let out = '';
  try {
    out = execSync(`git diff --name-only --diff-filter=AM ${base} ${head} -- src/content/blog`, {
      encoding: 'utf8',
    });
  } catch {
    out = execSync(`git diff --name-only --diff-filter=AM HEAD~1 HEAD -- src/content/blog`, {
      encoding: 'utf8',
    });
  }
  return [
    ...new Set(
      out
        .split('\n')
        .map((p) => p.match(/src\/content\/blog\/(?:[a-z]{2}\/)?([^/]+)\.mdx?$/))
        .filter(Boolean)
        .map((m) => m[1]),
    ),
  ];
}

async function waitFor(url, label, tries = 30) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: UA, redirect: 'manual' });
      if (r.status === 200) return true;
    } catch {}
    await sleep(20000);
  }
  console.warn(`Sigue sin responder 200 tras ~${tries * 20}s: ${label}`);
  return false;
}

let urls;
if (ALL) {
  urls = await sitemapUrls();
} else {
  const [base, head] = shas.length === 2 ? shas : ['HEAD~1', 'HEAD'];
  const slugs = changedSlugs(base, head);
  if (!slugs.length) {
    console.log('Sin posts nuevos o editados: nada que avisar.');
    process.exit(0);
  }
  // Esperamos el sitemap nuevo: los posts nuevos aparecen recién tras el deploy.
  for (let i = 0; i < 30; i++) {
    const all = await sitemapUrls();
    urls = all.filter((u) => slugs.some((s) => u.endsWith(`/${s}/`)));
    if (urls.length >= slugs.length) break;
    await sleep(20000);
  }
  if (!urls.length) {
    console.warn(`Los slugs ${slugs.join(', ')} no aparecen en el sitemap: no mando nada.`);
    process.exit(0);
  }
}

console.log(`${urls.length} URL(s) para ${HOST}:`);
urls.slice(0, 40).forEach((u) => console.log('  ' + u));
if (urls.length > 40) console.log(`  ... y ${urls.length - 40} más`);
if (DRY) process.exit(0);

await waitFor(KEY_URL, KEY_URL);
if (!ALL) for (const u of urls) await waitFor(u, u, 15);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8', ...UA },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_URL, urlList: urls.slice(0, 10000) }),
});
console.log(`IndexNow respondió ${res.status} ${res.statusText}`);
// 200 = ok, 202 = recibido (la clave se valida después). Otro código = avisar.
if (![200, 202].includes(res.status)) {
  console.error(await res.text());
  process.exit(1);
}
