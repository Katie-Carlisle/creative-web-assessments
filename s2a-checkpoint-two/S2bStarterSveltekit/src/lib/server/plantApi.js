/**
 * src/lib/server/sketchApi.js — the ONE place this app talks to Express.
 * ------------------------------------------------------------------
 * The +page.server.js and +server.js files call these functions; these
 * functions make the actual fetch() to Express, server to server. The
 * browser never sees the Express address.
 *
 * This file is in src/lib/server/, so SvelteKit only lets server code
 * import it (a .svelte component cannot).
 *
 * If Express cannot be reached, fetch() throws and the error travels up
 * to the caller, which decides what to show. If Express answers with an
 * error status, we throw too, except 404 on update and delete, where
 * "not found" is an expected answer: update gives back null, delete gives
 * back false.
 * ------------------------------------------------------------------
 */

import { SKETCH_API_URL } from '$app/env/private';

// Get every sketch.
export async function fetchPlants(light) {
    const query = light
        ? `?light=${encodeURIComponent(light)}`
        : '';

    const res = await fetch(`${SKETCH_API_URL}/api/plants${query}`);

    if (!res.ok) {
        throw new Error(`Plant API responded with ${res.status}`);
    }

    return res.json();
}

//get one plant
export async function fetchPlant(id) {
    const res = await fetch(`${SKETCH_API_URL}/api/plants/${id}`);

    if (res.status === 404) {
        return null;
    }

    if (!res.ok) {
        throw new Error(`Plant API responded with ${res.status}`);
    }

    return res.json();
}

// Add a sketch. `data` looks like { title, artist, colorTag }.
export async function createPlant(data) {
    const res = await fetch(`${SKETCH_API_URL}/api/plants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error(`Plant API responded with ${res.status}`);
    }

    return res.json();
}

// Change some fields of one sketch, e.g. changes = { favourite: true }.
// Gives back the updated sketch, or null if there is no sketch with that id.
export async function updatePlant(id, changes) {
    const res = await fetch(`${SKETCH_API_URL}/api/plants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes)
    });

    if (res.status === 404) {
        return null;
    }

    if (!res.ok) {
        throw new Error(`Plant API responded with ${res.status}`);
    }

    return res.json();
}

// Delete one sketch. Gives back true if it was deleted, false if there was
// no sketch with that id.
export async function deletePlant(id) {
    const res = await fetch(`${SKETCH_API_URL}/api/plants/${id}`, {
        method: 'DELETE'
    });

    if (res.status === 404) {
        return false;
    }

    if (!res.ok) {
        throw new Error(`Plant API responded with ${res.status}`);
    }

    return true;
}
