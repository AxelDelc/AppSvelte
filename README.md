# Explorateur de pays

Application SvelteKit permettant d'explorer les pays du monde, avec authentification et système de favoris.

## Stack technique

- **SvelteKit** (Node adapter, SSR) + **Svelte 5** (runes)
- **Better Auth** — authentification email/mot de passe
- **Prisma** + **PostgreSQL** (Supabase) — stockage des favoris
- **Tailwind CSS** — styles
- **Vitest** + **Playwright** — tests
- **TypeScript** strict

## Prérequis

- Node.js 18+
- pnpm
- Une base de données PostgreSQL (ex : Supabase)

## Installation

```sh
pnpm install
pnpm exec playwright install  # requis pour les tests navigateur
```

## Variables d'environnement

Créer un fichier `.env` à la racine :

```env
DATABASE_URL=       # Connexion poolée Supabase (Prisma runtime)
DIRECT_URL=         # Connexion directe Supabase (migrations uniquement)
BETTER_AUTH_SECRET= # Secret aléatoire pour la signature des sessions
BETTER_AUTH_URL=    # URL de base de l'app (ex: http://localhost:5173)
```

## Commandes

```sh
pnpm dev            # Serveur de développement
pnpm build          # Build de production
pnpm check          # Vérification des types Svelte/TypeScript
pnpm lint           # Prettier + ESLint
pnpm format         # Auto-formatage
pnpm test:unit      # Tous les tests Vitest
pnpm commit         # Commit conventionnel via commitizen
```

Lancer un seul fichier de test :

```sh
pnpm vitest run src/routes/page.svelte.spec.ts
```

## Base de données

```sh
pnpm prisma migrate dev   # Appliquer les migrations
pnpm prisma studio        # Interface graphique Prisma
```

## Architecture

### Routes

| Route | Description |
|---|---|
| `/` | Grille de pays avec recherche, filtre par région, tri et pagination (28 items/page) |
| `/countries/[code]` | Détail d'un pays (population, capitale, langues, monnaies, favoris) |
| `/login` | Connexion email/mot de passe |
| `/register` | Création de compte |
| `/profile` | Profil utilisateur et liste des favoris |
| `/api/auth/[...all]` | Endpoints Better Auth (sessions, cookies) |
| `/api/favorites` | API REST pour ajouter/supprimer/lister les favoris |

### Flux de données

1. `+page.server.ts` charge les données côté serveur (session, favoris DB, liste des pays)
2. `+page.svelte` reçoit les données et gère filtrage/tri/pagination **côté client** via `$derived` (Svelte 5)
3. Les mutations de favoris passent par `fetch /api/favorites` avec mise à jour optimiste

### Sources de données

- **Pays** : librairie npm `world-countries` (données statiques)
- **Population** : API externe `countriesnow.space`
- **Drapeaux** : `flagcdn.com`

### Authentification

Better Auth avec adaptateur Prisma. Les sessions sont gérées via cookies HTTP. Le client (`src/lib/auth-client.ts`) expose `signIn`, `signOut`, `signUp` et `useSession` pour usage côté navigateur.
