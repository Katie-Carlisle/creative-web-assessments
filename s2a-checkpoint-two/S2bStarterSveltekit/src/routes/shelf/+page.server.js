/**
 * src/routes/gallery/+page.server.js — loads the sketches for /gallery
 * ------------------------------------------------------------------
 * load() runs on the server before the page is sent. It asks Express for
 * the sketches (through sketchApi.js) and gives them to +page.svelte as
 * the `data` prop.
 *
 * If Express cannot be reached, we call error(), and SvelteKit shows
 * src/routes/+error.svelte with our message.
 * ------------------------------------------------------------------
 */


import { error } from '@sveltejs/kit';
import { fetchPlants } from '#lib/server/plantApi.js';

export async function load({ url }) {
    try {
        // Read the light filter from the URL.
        const light = url.searchParams.get('light');

        // Only allow the three valid filter values.
        if (light && !['low', 'medium', 'bright'].includes(light)) {
            error(400, 'Invalid light requirement');
        }

        // Ask Express for the plants, passing the selected filter.
        const plants = await fetchPlants(light);

        return {
            plants,
            selectedLight: light || 'all'
        };

    } catch (err) {
        console.error('Failed to reach the Plant API:', err.message);

        error(502, "Couldn't reach the Plant API. Is Express running?");
    }
}

