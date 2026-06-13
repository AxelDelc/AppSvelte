# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm check        # Svelte type-check
pnpm lint         # Prettier check + ESLint
pnpm format       # Auto-format with Prettier
pnpm test:unit    # Run all Vitest tests
pnpm commit       # Conventional commit via commitizen
```

Run a single test file:
```bash
pnpm vitest run src/routes/page.svelte.spec.ts
```

## Architecture

**SvelteKit** app (Node adapter, SSR) with **Svelte 5** runes syntax. Data comes from the [REST Countries API](https://restcountries.com/v3.1/) — no database queries for country data.

**Database layer** (PostgreSQL via Supabase + Prisma) is wired up for auth only. `src/lib/server/auth.ts` initializes **Better Auth** with the Prisma adapter. The Prisma schema currently has no models — run `pnpm prisma migrate dev` to apply migrations when models are added.

**Data flow for the main page:**
1. `src/routes/+page.server.ts` calls `getCountries()` from `$lib/server/test.ts`, which hits the REST Countries API.
2. `+page.svelte` receives the country array as props and handles all filtering/sorting/pagination client-side with derived state (Svelte 5 `$derived`).

**Route structure:**
- `/` — country explorer grid with search, region filter, sort, 28-item pagination
- `/countries/[code]` — detail page; `+page.server.ts` fetches by alpha code from REST Countries API

## Environment Variables

Required in `.env`:
- `DATABASE_URL` — Supabase pooled connection (used at runtime by Prisma/Better Auth)
- `DIRECT_URL` — Supabase direct connection (used only for `prisma migrate`)
- `BETTER_AUTH_SECRET` — Random secret for session signing
- `BETTER_AUTH_URL` — App base URL (e.g. `http://localhost:5173`)

## Code Style

- **Formatter**: Prettier with tabs, single quotes, 100-char width, no trailing commas
- **Svelte plugin** sorts Tailwind classes automatically on format
- **TypeScript**: strict mode; `no-undef` disabled (TypeScript handles it)
- ESLint flat config (`eslint.config.js`) — run lint before committing

## Testing

Vitest is split into two projects (see `vite.config.ts`):
- **client** — browser tests via Playwright/Chromium for `.svelte` spec files
- **server** — Node environment for non-component tests

Playwright must be installed (`pnpm exec playwright install`) for browser tests to run.
