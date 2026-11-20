

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


// --- GET /api/plants/:id — retrieve one individual plant ----------------
app.get('/api/plants/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({
                error: 'Plant not found'
            });
        }

        const plant = await plantData.getById(id);

        if (!plant) {
            return res.status(404).json({
                error: 'Plant not found'
            });
        }

        res.json(plant);

    } catch (err) {
        console.error('Failed to retrieve plant:', err.message);

        res.status(500).json({
            error: 'Could not retrieve plant'
        });
    }
});



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
