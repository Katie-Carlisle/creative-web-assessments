/**
 * index.js — the Sketch Gallery API (Express).
 * ------------------------------------------------------------------
 * This is a separate program from the SvelteKit app, with its own
 * package.json, its own port and its own .env.
 *
 * It connects to MongoDB Atlas, then answers four routes. Each route
 * checks the request, calls ONE function from ./lib/sketchData.js, and
 * sends back the result with a status code. The database work lives in
 * sketchData.js, not here.
 * ------------------------------------------------------------------
 */

import 'dotenv/config'; // reads the .env file into process.env
import express from 'express';
import mongoose from 'mongoose';
import * as plantData from './lib/plantData.js';

const app = express();
const PORT = process.env.PORT || 3001;

const validLightNeeds = ['low', 'medium', 'bright'];

// Parses incoming JSON request bodies into req.body.
app.use(express.json());

// A request logger, handy when two servers are running side by side.
app.use((req, res, next) => {
	console.log(`[plant-api] ${req.method} ${req.path}`);
	next();
});

// --- GET /api/sketches — list every sketch ---------------------------------
app.get('/api/plants', async (req, res) => {
    try {
        const light = req.query.light;

        if (light && !validLightNeeds.includes(light)) {
            return res.status(400).json({
                error: 'Light must be low, medium or bright'
            });
        }

        const plants = await plantData.getAll(light);

        res.json(plants);

    } catch (err) {
        console.error('Failed to retrieve plants:', err.message);

        res.status(500).json({
            error: 'Could not retrieve plants'
        });
    }
});

// --- POST /api/sketches — add a new sketch ----------------------------------
app.post('/api/plants', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                error: 'Plant information is required'
            });
        }

        const { name, species, lightNeeds } = req.body;

        if (
            typeof name !== 'string' || !name.trim() ||
            typeof species !== 'string' || !species.trim() ||
            !validLightNeeds.includes(lightNeeds)
        ) {
            return res.status(400).json({
                error: 'Name, species and valid light requirements are required'
            });
        }

        const newPlant = await plantData.create({
            name: name.trim(),
            species: species.trim(),
            lightNeeds
        });

        res.status(201).json(newPlant);

    } catch (err) {
        console.error('Failed to create plant:', err.message);

        res.status(500).json({
            error: 'Could not create plant'
        });
    }
});

// --- PATCH /api/sketches/:id — change some fields of one sketch --------------
// The URL says WHICH sketch (:id). The JSON body says WHAT to change,
// e.g. { "favourite": true }.
app.patch('/api/plants/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({
                error: 'Plant not found'
            });
        }

        if (typeof req.body?.swapped !== 'boolean') {
            return res.status(400).json({
                error: 'A boolean swapped value is required'
            });
        }

        const updated = await plantData.update(id, {
            swapped: req.body.swapped
        });

        if (!updated) {
            return res.status(404).json({
                error: 'Plant not found'
            });
        }

        res.json(updated);

    } catch (err) {
        console.error('Failed to update plant:', err.message);

        res.status(500).json({
            error: 'Could not update plant'
        });
    }
});

// --- DELETE /api/sketches/:id — remove one sketch ----------------------------
app.delete('/api/plants/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({
                error: 'Plant not found'
            });
        }

        const removed = await plantData.remove(id);

        if (!removed) {
            return res.status(404).json({
                error: 'Plant not found'
            });
        }

        res.status(204).send();

    } catch (err) {
        console.error('Failed to delete plant:', err.message);

        res.status(500).json({
            error: 'Could not delete plant'
        });
    }
});

// --- Connect to MongoDB, then start listening --------------------------------
// The connection string (MONGODB_URI) comes from .env. The database name is
// part of that string. The collection comes from the model's name (see
// models/Sketch.js).
async function start() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing from .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Connected to MongoDB');

    } catch (err) {
        console.error('Could not connect to MongoDB:', err.message);

        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(
            `Plant Swap Shelf API listening on http://localhost:${PORT}`
        );
    });
}

start();
