# Pet Todo React

A simple React project to manage your pet's todos.

## Prerequisites

- [Node.js 22.x](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [git](https://git-scm.com/)

## Getting Started

1. **Clone the repository (or pull if you already have it):**

```bash
# If you don't have the repo yet
git clone git@github.com:BohdanShtelmakh/per-todo-react.git

# If you already have it
git pull
```

2. **Install dependencies:**

```bash
npm i
```

3. **Start the development server:**

```bash
npm run dev
```

4. **Build for production:**

```bash
npm run build
```

---

## Environment Variables

Create a `.env.local` (not committed) in the project root to configure runtime build-time flags (Vite loads any `VITE_` prefixed vars):

```bash
# Use API mode (true = use backend, false/undefined = use localStorage)
VITE_USE_API=true

# Base URL for Axios requests (only used when VITE_USE_API=true)
# Include protocol + host (and optional port). Example for local backend:
VITE_API_BASE_URL=http://localhost:3000
```

Behavior:

- When `VITE_USE_API=true` the app fetches todos via the backend (search, filter, reorder).
- When not true, todos persist in `localStorage` (`todos`, `filter`, `search` keys).
- Changing these requires restarting `npm run dev` (Vite only reads env at startup).

Optional:

```bash
# Example if backend served behind a prefix or proxy
# VITE_API_BASE_URL=/api
```

Reference: `.env`, `.env.development`, `.env.production`, `.env.local` (Vite priority order).
