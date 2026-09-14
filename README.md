# 📺 WatchGuru

Discover what to watch tonight: movie and TV recommendations, where to stream them, trailers, cast and per-episode ratings. Built on [The Movie Database (TMDB)](https://www.themoviedb.org/) API.

## Features

- 🎲 **Random pick**: the Guru chooses a well-rated movie or TV show for you.
- 📍 **Where to watch**: streaming, rent and buy options per country (auto-detected).
- 🔍 **Search & discover**: instant search plus filters by genre and sort order.
- 📊 **Episode ratings heatmap** for every season of a show.
- 🌎 **Spanish and English**, with localized URLs (`/es/...`, `/en/...`).
- 🚀 **SEO-ready**: server-rendered pages, canonical/hreflang tags, JSON-LD, sitemap and robots.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, Server Components, ISR) + React 19
- TypeScript, Tailwind CSS v4, lucide-react
- npm workspaces monorepo (`apps/web` today, `apps/api` next)

## Project structure

```
apps/web/
├── src/app/[lang]/        # Routes (home, movies, tv-shows, movie/[id], search, random...)
├── src/app/api/           # Route handlers (search autocomplete, geo country)
├── src/components/        # UI: layout, media rails/cards, detail sections, pages
├── src/lib/tmdb/          # Server-only TMDB client, API functions and types
├── src/lib/i18n/          # Locales, dictionaries, client provider
├── src/proxy.ts           # Adds the locale prefix to bare URLs
└── public/                # Logo, icons and genre images
```

## Getting started

Requires Node.js 20.9+.

```bash
npm install
cp apps/web/.env.example apps/web/.env.local   # then fill in TMDB_API_KEY
npm run dev
```

Open http://localhost:3000.

### Environment variables (`apps/web/.env.local`)

| Variable               | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| `TMDB_API_KEY`         | TMDB v3 API key. **Server-only**, never exposed to the browser.       |
| `TMDB_BASE_URL`        | Optional. Defaults to `https://api.themoviedb.org/3`.                 |
| `NEXT_PUBLIC_SITE_URL` | Public URL used for canonical links, sitemap and Open Graph tags.     |

## Scripts

| Command         | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Start the dev server          |
| `npm run build` | Production build              |
| `npm run start` | Serve the production build    |
| `npm run lint`  | ESLint                        |

## Deploying to Vercel

1. In the project settings set **Root Directory** to `apps/web` (framework preset: Next.js).
2. Add `TMDB_API_KEY` and `NEXT_PUBLIC_SITE_URL` as environment variables.
3. Remove the old `VITE_TMDB_*` variables.

## Roadmap

- 👤 Accounts (own backend): watched list, watchlist and **Guru ratings**
- 🧠 Taste onboarding and personalized recommendations
- 💞 **Match rooms**: swipe with your partner or friends until you agree on what to watch
- 🔔 Alerts when a watchlisted title lands on your streaming services

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability data is provided by JustWatch.

## Author

Developed by [Iván Duarte](https://github.com/IvanDuarte1501199).
