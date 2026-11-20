# S2bStarterSveltekit

The SvelteKit app for the Plant Swap. It never talks to MongoDB, and the browser never talks to Express. The browser calls this app's own routes, and this app calls the Express API (`S2bStarterExpress`).

## Run it

Start `S2bStarterExpress` first, then:

```
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173

## Where things are

| File | What it does |
|---|---|
| `src/routes/shelf/+page.server.js` | `load()`: gets the list of plants from Express before the page is sent. |
| `src/routes/shelf/+page.svelte` | The page |
| `src/routes/api/plants/+server.js` | Add a plant (POST). Forwards to Express. |
| `src/routes/api/plants/[id]/+server.js` | Change (PATCH) or delete (DELETE) one plant. Forwards to Express. |
| `src/lib/server/plantApi.js` | The only file that calls Express. |
| `src/env.js` | Lists the variables from `.env` the app may use. |
| `src/routes/+error.svelte` | The page shown when `load()` calls `error()`. |

## The flow

```
page button → fetch('/api/plants/...') → [id]/+server.js → plantApi.js → Express → MongoDB
```
