# S2bStarterExpress

The Express API for the Plant Swap. It is the only program that talks to MongoDB, through Mongoose. The SvelteKit app (`S2bStarterSveltekit`) talks to this.

## Run it

```
npm install
cp .env.example .env     # then edit .env: your connection string and database name
npm run dev
```

It listens on http://localhost:3001.

## Where things are

| File | What it does |
|---|---|
| `index.js` | Connects to MongoDB (using `MONGODB_URI` from `.env`), then the four routes. Each route checks the request, calls one function from `lib/plantData.js`, and sends a status code. |
| `lib/plantData.js` | The database work |
| `models/Plant.js` | The schema and the model |
| `.env` | Secret settings. Not committed. `.env.example` lists the names. |

## Routes

| Method | Path | Success |
|---|---|---|
| GET | `/api/plants` | 200 and the list |
| POST | `/api/plants` | 201 and the new plant |
| PATCH | `/api/plants/:id` | 200 and the updated plant|
| DELETE | `/api/plants/:id` | 204 |
