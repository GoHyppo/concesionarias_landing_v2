#!/usr/bin/env node
// Acceso de buscadores y asistentes de IA (2026-11-11, AEO).
//
// Sin flags (corre dentro de `npm run verify`, sobre el build en dist/):
//   - robots.txt deja pasar a cada bot de IA con un grupo propio `Allow: /` y
//     nadie (ni `*`) tiene `Disallow: /`.
//   - existe la clave de IndexNow (dist/<32 hex>.txt con su propio nombre adentro).
//   - existe llms.txt y no está vacío.
// --live: además le pide al sitio vivo el home, /robots.txt y /llms.txt con el
//   user-agent real de cada bot y exige 200 (detecta un firewall o CDN que los
//   frene aunque robots.txt diga que sí), y valida el robots.txt vivo. Lo corre
//   la rutina de seo-ops. El dominio sale de la línea Sitemap de robots.txt.
//
// Si esto falla, el bug está en robots.txt, en el deploy o en el servidor:
// nunca se arregla sacando un bot de esta lista.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const BOTS = {
  'OAI-SearchBot': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.3; +https://openai.com/searchbot',
  'ChatGPT-User': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot',
  GPTBot: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot',
  PerplexityBot: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
  'Perplexity-User': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)',
  ClaudeBot: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
  'Claude-SearchBot': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-SearchBot/1.0; +https://www.anthropic.com)',
  'Claude-User': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-User/1.0; +https://www.anthropic.com)',
  'Google-Extended': null, // token de robots.txt, no hace requests propios
  'Applebot-Extended': null, // ídem
  Bingbot: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
};
const LIVE = process.argv.includes('--live');
const errors = [];
const fail = (m) => errors.push(m);

function parseRobots(txt) {
  const groups = [];
  let cur = null;
  let lastWasAgent = false;
  for (const raw of txt.split('\n')) {
    const line = raw.replace(/#.*/, '').trim();
    if (!line) continue;
    const [k, ...rest] = line.split(':');
    const key = k.trim().toLowerCase();
    const val = rest.join(':').trim();
    if (key === 'user-agent') {
      if (!lastWasAgent) groups.push((cur = { agents: [], rules: [] }));
      cur.agents.push(val.toLowerCase());
      lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if (cur && (key === 'allow' || key === 'disallow')) cur.rules.push([key, val]);
    }
  }
  return groups;
}

function checkRobots(txt, where) {
  const groups = parseRobots(txt);
  for (const g of groups)
    if (g.rules.some(([k, v]) => k === 'disallow' && v === '/'))
      fail(`${where}: "Disallow: /" para ${g.agents.join(', ')}`);
  for (const bot of Object.keys(BOTS)) {
    const g = groups.find((x) => x.agents.includes(bot.toLowerCase()));
    if (!g) fail(`${where}: falta el grupo explícito "User-agent: ${bot}" con "Allow: /"`);
    else if (!g.rules.some(([k, v]) => k === 'allow' && v === '/'))
      fail(`${where}: el grupo de ${bot} no tiene "Allow: /"`);
  }
  const m = txt.match(/^\s*Sitemap:\s*(https:\/\/[^/\s]+)/im);
  if (!m) fail(`${where}: sin línea Sitemap`);
  return m ? m[1] : null;
}

// ---- build (dist/)
if (!existsSync('dist/robots.txt')) {
  console.error('No hay dist/robots.txt: corré el build antes (npm run verify lo hace).');
  process.exit(1);
}
const site = checkRobots(readFileSync('dist/robots.txt', 'utf8'), 'dist/robots.txt');
const keyFile = readdirSync('dist').find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) fail('dist/: falta la clave de IndexNow (<32 hex>.txt, viene de public/)');
else if (readFileSync(`dist/${keyFile}`, 'utf8').trim() !== keyFile.slice(0, 32))
  fail(`dist/${keyFile}: el contenido tiene que ser la clave misma`);
if (!existsSync('dist/llms.txt') || readFileSync('dist/llms.txt', 'utf8').trim().length < 50)
  fail('dist/llms.txt falta o está vacío');

// ---- sitio vivo
if (LIVE && site) {
  // curl y no fetch: en las rutinas en la nube la salida a internet pasa por un
  // proxy que curl respeta (HTTPS_PROXY) y el fetch de Node no. Sin -L: un
  // redirect cuenta como falla, el home tiene que dar 200 directo.
  const MARK = '\n__HTTP_STATUS__';
  const get = async (url, ua) => {
    try {
      const out = execFileSync(
        'curl',
        ['-s', '--max-time', '25', ...(ua ? ['-A', ua] : []), '-w', `${MARK}%{http_code}`, url],
        { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 },
      );
      const i = out.lastIndexOf(MARK);
      const status = Number(out.slice(i + MARK.length));
      return { status, body: status === 200 ? out.slice(0, i) : '' };
    } catch (e) {
      return { status: `error ${e.message.split('\n')[0]}`, body: '' };
    }
  };
  const robots = await get(`${site}/robots.txt`);
  if (robots.status !== 200) fail(`${site}/robots.txt respondió ${robots.status}`);
  else checkRobots(robots.body, `${site}/robots.txt (vivo)`);
  if (keyFile) {
    const k = await get(`${site}/${keyFile}`);
    if (k.status !== 200 || k.body.trim() !== keyFile.slice(0, 32))
      fail(`${site}/${keyFile} (clave IndexNow) respondió ${k.status}`);
  }
  for (const [bot, ua] of Object.entries(BOTS)) {
    if (!ua) continue;
    for (const path of ['/', '/robots.txt', '/llms.txt']) {
      const r = await get(site + path, ua);
      if (r.status !== 200) fail(`${bot} recibe ${r.status} en ${site}${path} (firewall, CDN o servidor lo frena)`);
    }
  }
}

if (errors.length) {
  console.error(`Acceso de bots de IA: ${errors.length} problema(s)`);
  errors.forEach((e) => console.error('  FAIL ' + e));
  process.exit(1);
}
console.log(`Acceso de bots de IA: ok (${Object.keys(BOTS).length} bots${LIVE ? `, sitio vivo ${site}` : ', build'}).`);
