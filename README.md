# 📺 WatchGuru

Discover what to watch tonight: movie and TV recommendations, where to stream them, trailers, cast and per-episode ratings. Built on [The Movie Database (TMDB)](https://www.themoviedb.org/) API.

## Features

- 🎲 **Random pick**: the Guru chooses a well-rated movie or TV show for you — personalized once you share your taste.
- 👤 **Accounts**: email/password (and optional Google) sign-in.
- 📚 **My list**: want to watch, watching, watched, plus per-episode progress for TV shows.
- ⭐ **Guru score**: rate titles with half-star precision and see the community average.
- 🧠 **Taste profile**: favorite and disliked genres, your streaming services and country.
- 💞 **Match rooms**: create a room, share a link or QR, everyone picks genres and swipes the same deck Tinder-style. When a majority likes a title, it's a match. Guests don't need an account.
- 📍 **Where to watch**: streaming, rent and buy options per country (auto-detected).
- 🔍 **Search & discover**: instant search plus filters by genre and sort order.
- 📊 **Episode ratings heatmap** for every season of a show.
- 🌎 **Spanish and English**, with localized URLs (`/es/...`, `/en/...`).
- 🚀 **SEO-ready**: server-rendered pages, canonical/hreflang tags, JSON-LD, sitemap and robots.

## Tech stack

- **Web** (`apps/web`): [Next.js 16](https://nextjs.org/) (App Router, Server Components, ISR), React 19, TypeScript, Tailwind CSS v4
- **API** (`apps/api`): Fastify 5, [Better Auth](https://www.better-auth.com/), Drizzle ORM, PostgreSQL, Zod
- npm workspaces monorepo, Docker Compose for local Postgres

## Architecture

```
Browser ──► Next.js (apps/web) ──► TMDB          (catalog pages, cached/ISR)
               │
               └─ rewrites /api/auth/*, /api/me/*, /api/titles/*, /api/match/*
                               ▼
Browser ══ WebSocket ══► Fastify API (apps/api) ──► PostgreSQL
                               └──────────────► TMDB (personalized picks, match decks)
```

HTTP requests go through the web origin: backend routes are proxied through Next.js rewrites, so auth cookies are first-party and no CORS is needed. Match rooms use a WebSocket straight to the API (`NEXT_PUBLIC_API_URL`), authenticated with a per-participant room token. Catalog pages stay statically cached; user-specific UI (list status, ratings, episode progress) loads client-side.

Room connections are tracked in memory, so run a single API instance (or add a shared pub/sub such as Redis before scaling out).

## Project structure

```
apps/web/src/
├── app/[lang]/        # Routes (home, movies, tv-shows, movie/[id], search, random, login, my-list, taste...)
├── app/api/           # Route handlers (search autocomplete, geo country, streaming providers)
├── components/        # UI: layout, media, detail, library, taste, auth, pages
├── lib/tmdb/          # Server-only TMDB client, API functions and types
├── lib/i18n/          # Locales, dictionaries, client provider
├── lib/api.ts         # Browser client for the backend
└── proxy.ts           # Adds the locale prefix to bare URLs

apps/api/
├── src/routes/        # auth (Better Auth bridge), library + episodes, taste + recommendations
├── src/db/schema.ts   # Drizzle schema (auth tables, library_entry, episode_progress, taste_profile)
├── src/lib/           # Session guard, TMDB client, recommendation logic
└── drizzle/           # SQL migrations
```

## Getting started

Requires Node.js 20.9+ and Docker.

```bash
npm install
npm run db:up                                   # Postgres on localhost:5432
cp apps/web/.env.example apps/web/.env.local    # fill in TMDB_API_KEY
cp apps/api/.env.example apps/api/.env          # fill in BETTER_AUTH_SECRET and TMDB_API_KEY
npm run db:migrate
npm run dev:api                                 # http://localhost:4000
npm run dev                                     # http://localhost:3000 (another terminal)
```

### Environment variables

`apps/web/.env.local`

| Variable               | Description                                                       |
| ---------------------- | ----------------------------------------------------------------- |
| `TMDB_API_KEY`         | TMDB v3 API key. **Server-only**, never exposed to the browser.   |
| `TMDB_BASE_URL`        | Optional. Defaults to `https://api.themoviedb.org/3`.             |
| `NEXT_PUBLIC_SITE_URL` | Public URL used for canonical links, sitemap and Open Graph tags. |
| `API_URL`              | Backend URL the web server proxies to (e.g. `http://localhost:4000`). |
| `NEXT_PUBLIC_API_URL`  | Public backend URL the browser uses for Match WebSockets.          |

`apps/api/.env`

| Variable                                    | Description                                                                 |
| ------------------------------------------- | --------------------------------------------------------------------------- |
| `DATABASE_URL`                              | PostgreSQL connection string.                                               |
| `WEB_URL`                                   | Public URL of the web app (auth cookies and OAuth callbacks live there).    |
| `BETTER_AUTH_SECRET`                        | Random string, 32+ characters.                                              |
| `TMDB_API_KEY`                              | TMDB v3 key for personalized recommendations.                               |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional Google sign-in. Redirect URI: `{WEB_URL}/api/auth/callback/google`. |
| `PORT`                                      | Defaults to `4000`.                                                         |

## Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Web dev server                           |
| `npm run dev:api`    | API dev server (watch mode)              |
| `npm run build`      | Build web and API                        |
| `npm run lint`       | ESLint (web)                             |
| `npm run typecheck`  | TypeScript checks for web and API        |
| `npm run db:up`      | Start local Postgres with Docker Compose |
| `npm run db:migrate` | Apply database migrations                |
| `npm run test:match -w api` | End-to-end check of a 3-person match room (API must be running) |

After changing `apps/api/src/db/schema.ts`, create a migration with `npm run db:generate -w api`.

## Deploying

**Web (Vercel)**

1. Set **Root Directory** to `apps/web` (framework preset: Next.js).
2. Add `TMDB_API_KEY`, `NEXT_PUBLIC_SITE_URL`, `API_URL` and `NEXT_PUBLIC_API_URL` (both the public URL of the API).

**API (any Docker host: Railway, Render, Fly.io...)**

1. Build from the repo root with `apps/api/Dockerfile`.
2. Provision PostgreSQL and set the API environment variables (`WEB_URL` = your web domain).
3. Run migrations on deploy: `node dist/migrate.js` (or use `npm run start:migrate -w api` as the start command).

## Roadmap

- 🔔 Alerts when a watchlisted title lands on your streaming services
- 📋 Public lists and a yearly "Guru Wrapped"

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability data is provided by JustWatch.

## Author

Developed by [Iván Duarte](https://github.com/IvanDuarte1501199).
