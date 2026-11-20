

import { json } from '@sveltejs/kit';
import { updatePlant, deletePlant } from '#lib/server/plantApi.js';

export async function PATCH({ params, request }) {
	let changes;
	try {
		changes = await request.json();
	} catch (err) {
		return json({ error: 'Send a JSON body of changes' }, { status: 400 });
	}

	try {
		const updated = await updatePlant(params.id, changes);

		if (!updated) {
			 return json({ error: 'Plant not found' }, { status: 404 });
		}

		return json(updated);
	} catch (err) {
		console.error('Failed to update plant', err.message);
		return json({ error: 'Could not update plant' }, { status: 502 });
	}
}

export async function DELETE({ params }) {
	try {
		const wasDeleted = await deletePlant(params.id);

		if (!wasDeleted) {
			return json({ error: 'Plant not found' }, { status: 404 });
		}

		// 204 = No Content: it worked, and there is nothing to send back.
		// A 204 has no body, so we send a bare Response instead of json().
		return new Response(null, { status: 204 });
	} catch (err) {
		console.error('Failed to delete plant', err.message);
		return json({ error: 'Could not delete plant' }, { status: 502 });
	}
}
