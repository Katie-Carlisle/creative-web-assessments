
import { error } from '@sveltejs/kit';
import { fetchPlant } from '#lib/server/plantApi.js';

export async function load({ params }) {
    let plant;

    try {
        plant = await fetchPlant(params.id);
    } catch (err) {
        console.error('Failed to fetch plant:', err.message);
        error(502, "Couldn't reach the Plant API. Is Express running?");
    }

    if (!plant) {
        error(404, 'Plant not found');
    }

    return { plant };
}
