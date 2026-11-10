# concesionaria.ai

Sitio de ConcesionarIA, la IA para concesionarias de Hyppo. Astro 4 estático, en español, publicado en GitHub Pages con dominio propio.

```bash
npm ci
npm run dev       # http://localhost:4321
npm run verify    # build + gate de SEO y copy (corre también en el deploy)
```

Push a `main` → GitHub Actions corre `npm run verify` y, si pasa, deploya `dist/` a GitHub Pages.

Todo lo demás (estructura, reglas de copy y claims, leads y eventos, programa SEO y rutinas) está en [`CLAUDE.md`](CLAUDE.md) y en [`docs/`](docs/).
