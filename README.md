# JoshKirk.co.uk v2

Next.js (App Router, TS) site with a 3D parallax hero (React Three Fiber), a static gallery powered by a Sharp-based build script, and simple single-admin auth for private albums. Deployable to Raspberry Pi 5 via Docker + Caddy.

## Temporary static holding page

The self-contained page in `docs/` is a simple placeholder published at [this-josh.github.io/website](https://this-josh.github.io/website/). GitHub Pages serves the `main` branch's `/docs` folder. It does not require Node, a server-side app, or the Next.js build. To preview it locally:

```bash
cd docs
python3 -m http.server 8000
```

Open `http://localhost:8000`. The custom domain and DNS still point to Adobe Portfolio pending the domain cutover.

## Quick start (Mac)

1) Prereqs

- Install Node 20+, pnpm (optional), and ImageMagick
- `brew install node pnpm imagemagick`

2) Install deps

```bash
pnpm i  # or npm i / yarn
```

3) Configure env

```bash
cp .env.example .env
# Set NEXTAUTH_SECRET (32 bytes) and AUTH_* vars
```

4) Place hero image

- Copy `_DSC3689-HDR-2.jpg` to `public/hero.jpg` (3200–3600px width)
- (Optional) Generate a depth map → `public/hero-depth.png` via `scripts/make-depthmap.py`

5) Build gallery (optional)

- Put source images under `NAS/albums/...` (or set `GALLERY_SRC` in `.env`)
- Run `pnpm gallery` to generate `public/photos` and `data/photos.manifest.json`

6) Run dev

```bash
pnpm dev
```

Visit http://localhost:3000

## Auth (private area)

- Uses NextAuth Credentials provider
- Protects `/private/*` via `middleware.ts`
- Sign in at `/login`. Set `AUTH_USERNAME` and `AUTH_PASSWORD_HASH` in `.env`.

## API

- `GET /api/photos?album=slug` → returns filtered manifest

## Deploy (Docker + Caddy)

```bash
docker compose build
docker compose up -d
```

Optionally adapt `Caddyfile` and `NEXTAUTH_URL` for a domain or Cloudflare Tunnel.

## Scripts

- `scripts/build-gallery.mjs`: Sharp-powered generator (thumbs + manifest)
- `scripts/make-depthmap.py`: optional MiDaS depth map (Python)

