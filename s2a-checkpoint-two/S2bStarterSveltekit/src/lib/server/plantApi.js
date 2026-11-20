

import { PLANT_API_URL } from '$app/env/private';

// Get every PLANT.
export async function fetchPlants(light) {
    const query = light
        ? `?light=${encodeURIComponent(light)}`
        : '';

    const res = await fetch(`${PLANT_API_URL}/api/plants${query}`);

    if (!res.ok) {
        throw new Error(`Plant API responded with ${res.status}`);
    }

    return res.json();
}

//get one plant
export async function fetchPlant(id) {
    const res = await fetch(`${PLANT_API_URL}/api/plants/${id}`);

    if (res.status === 404) {
        return null;
    }

    if (!res.ok) {
        throw new Error(`Plant API responded with ${res.status}`);
    }

    return res.json();
}

// Add a PLANT. `data` looks like { title, artist, colorTag }.
export async function createPlant(data) {
    const res = await fetch(`${PLANT_API_URL}/api/plants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error(`Plant API responded with ${res.status}`);
    }

    return res.json();
}

// Change some fields of one PLANT, e.g. changes = { favourite: true }.
// Gives back the updated PLANT, or null if there is no PLANT with that id.
export async function updatePlant(id, changes) {
    const res = await fetch(`${PLANT_API_URL}/api/plants/${id}`, {
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

// Delete one PLANT. Gives back true if it was deleted, false if there was
// no PLANT with that id.
export async function deletePlant(id) {
    const res = await fetch(`${PLANT_API_URL}/api/plants/${id}`, {
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
