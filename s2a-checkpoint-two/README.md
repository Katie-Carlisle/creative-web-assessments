# Plant Swap Shelf 🌱

A full-stack Plant Swap Shelf application built with SvelteKit, Express.js, MongoDB Atlas and Mongoose.

The application allows users to manage plants available at a  plant swap. Users can add plants, view individual plant details, mark plants as swapped or available, delete plants, and filter the shelf according to light requirements.

## Project Structure

The repository contains two separate Node.js applications:

- **express-api** – Express.js backend API, responsible for communicating with MongoDB Atlas through Mongoose.
- **sveltekit-app** – SvelteKit frontend, responsible for the user interface, page loading and forwarding requests to the Express API.

## Running the Application

Both applications must run simultaneously in separate terminals. Backend/server first.

### 1. Express API

Open a terminal and navigate to the Express project:

```bash
cd S2bStarterExpress
npm install
```

Create a `.env` file using `.env.example` as a template and add your MongoDB Atlas connection string:

```env
MONGODB_URI=your_mongodb_connection_string
```

Start the Express server:

```bash
npm run dev
```

The API runs at:

`http://localhost:3001`

### 2. SvelteKit Application

Open a second terminal and navigate to the SvelteKit project:

```bash
cd S2bStarterSveltekit
npm install
```

Create a `.env` file using `.env.example` as a template:

```env
PLANT_API_URL=http://localhost:3001
```

Start the SvelteKit application:

```bash
npm run dev
```

The frontend is available at:

`http://localhost:5173`

Keep both servers running while using the application.

---

## Follow the Flow

### 1. Where is the database and collection decided?

The Express application connects to MongoDB using `mongoose.connect(process.env.MONGODB_URI)` in `express-api/index.js`. The database name is specified within the connection string in the Express `.env` file. The plant collection is determined by the Mongoose model in `express-api/models/Plant.js`, where `mongoose.model('Plant', plantSchema)` creates the model, Mongoose automatically uses the lowercase plural collection name `plants`.

### 2. Follow the filter

When a visitor opens `/shelf?light=low`, the request follows this path:

1. `sveltekit-app/src/routes/shelf/+page.server.js` reads the `light` parameter from the URL using `url.searchParams.get('light')`.
2. The `load()` function calls `fetchPlants(light)` in `sveltekit-app/src/lib/server/plantApi.js`.
3. `fetchPlants()` sends a GET request to `/api/plants?light=low`.
4. `express-api/index.js` reads and validates `req.query.light`, then calls `plantData.getAll(light)`.
5. `express-api/lib/plantData.js` builds a MongoDB filter and uses `Plant.find(filter)` to retrieve matching plants.
6. Express returns the matching plants as JSON. SvelteKit receives the response and returns the plant data to `+page.svelte`, which displays the filtered shelf.

### 3. What is a plant's ID?

Each plant receives a unique MongoDB ObjectId when it is created. In MongoDB, this is stored as `_id`; Express serialises the Mongoose document to JSON, exposing the ID as a string through the Mongoose virtual `id` property, enabled by `toJSON: { virtuals: true }` in `express-api/models/Plant.js`. The SvelteKit shelf uses `plant.id` to create links such as `/shelf/6b00435a7ee3dff79b032255`, and the dynamic route reads this value through `params.id` in `sveltekit-app/src/routes/shelf/[id]/+page.server.js` before requesting the individual plant from Express.

---

## Technologies Used

- SvelteKit
- Express.js
- Node.js
- MongoDB Atlas
- Mongoose
- JavaScript
- HTML and CSS

## Environment Variables

Each application has its own `.env` file and `.env.example` template. The actual `.env` files contain local configuration and are excluded from version control using `.gitignore`. The MongoDB connection string is kept exclusively in the Express application.