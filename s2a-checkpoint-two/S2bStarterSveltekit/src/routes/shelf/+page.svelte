<script>
	// `data` holds what load() in +page.server.js returned.
	let { data } = $props();

	// $state makes these reactive: the page updates when they change.
    let name = $state('');
    let species = $state('');
    let lightNeeds = $state('medium');

    let submitting = $state(false);
    let submitError = $state('');
    let listError = $state('');

	// Our own copy of the list, seeded from load()'s data, so the page can
	// change straight after an add, star or delete without a reload.
    let plants = $state(data.plants);

	$effect(() => {
        plants = data.plants;
    });

	// ADD — the form. A plain fetch() to OUR OWN /api/sketches route
	// (src/routes/api/sketches/+server.js), never straight to Express.
	// SvelteKit forwards it to Express.
	async function handleSubmit(event) {
        event.preventDefault();

        submitting = true;
        submitError = '';

        try {
            const res = await fetch('/api/plants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    species,
                    lightNeeds
                })
            });

            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }

            const newPlant = await res.json();

            // Only add it to the current list if it matches the filter.
            if (
                data.selectedLight === 'all' ||
                data.selectedLight === newPlant.lightNeeds
            ) {
                plants.push(newPlant);
            }

            name = '';
            species = '';
            lightNeeds = 'medium';

        } catch (err) {
            submitError = 'Could not add the plant. Please try again.';
            console.error(err);
        } finally {
            submitting = false;
        }
    }

	// UPDATE — the favourite star. A PATCH to OUR OWN /api/sketches/<id>
	// route (src/routes/api/sketches/[id]/+server.js), sending only the
	// field that changes.
	async function toggleSwapped(plant) {
        listError = '';

        try {
            const res = await fetch(`/api/plants/${plant.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    swapped: !plant.swapped
                })
            });

            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }

            const updated = await res.json();

            plant.swapped = updated.swapped;

        } catch (err) {
            listError = 'Could not update this plant.';
            console.error(err);
        }
    }

	// DELETE — the ✕ button. A successful delete answers 204 (No Content),
	// so there is no body to read.
	 async function deletePlant(plant) {
        listError = '';

        try {
            const res = await fetch(`/api/plants/${plant.id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }

            plants = plants.filter(p => p.id !== plant.id);

        } catch (err) {
            listError = 'Could not delete this plant.';
            console.error(err);
        }
    }
</script>

<main>
	<h1>Plant Swap Shelf</h1>
	<p>We will find you a new plant</p>

    {#if listError}
        <p class="error">{listError}</p>
    {/if}

	<section>
        <h2>Browse the shelf</h2>

        <nav class="filters">
            <a
                href="/shelf"
                data-sveltekit-reload
                class:active={data.selectedLight === 'all'}
            >All</a>

            <a
                href="/shelf?light=low"
                data-sveltekit-reload
                class:active={data.selectedLight === 'low'}
            >Low</a>

            <a
                href="/shelf?light=medium"
                data-sveltekit-reload
                class:active={data.selectedLight === 'medium'}
            >Medium</a>

            <a
                href="/shelf?light=bright"
                data-sveltekit-reload
                class:active={data.selectedLight === 'bright'}
            >Bright</a>
        </nav>

        {#if plants.length === 0}
            <p>No plants found. Why not add one?</p>
        {:else}
            <ul class="plant-list">
                {#each plants as plant (plant.id)}
                    <li class="plant-card">
                        <div>
                            <h3>
                                <a href={`/shelf/${plant.id}`}>
                                    {plant.name}
                                </a>
                            </h3>

                            <p><em>{plant.species}</em></p>

                            <p>Light: {plant.lightNeeds}</p>

                            <p>
                                Status:
                                {plant.swapped ? 'Swapped' : 'Available'}
                            </p>
                        </div>

                        <div class="buttons">
                            <button
                                onclick={() => toggleSwapped(plant)}
                            >
                                {plant.swapped
                                    ? 'Available again'
                                    : 'Mark swapped'}
                            </button>

                            <button
                                class="delete"
                                onclick={() => deletePlant(plant)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                {/each}
            </ul>
        {/if}
    </section>

    <section>
        <h2>Add a plant</h2>

        <form onsubmit={handleSubmit}>
            <label>
                Plant name
                <input
                    type="text"
                    bind:value={name}
                    required
                />
            </label>

            <label>
                Species
                <input
                    type="text"
                    bind:value={species}
                    required
                />
            </label>

            <label>
                Light requirements
                <select bind:value={lightNeeds}>
                    <option value="low">Low light</option>
                    <option value="medium">Medium light</option>
                    <option value="bright">Bright light</option>
                </select>
            </label>

            <button type="submit" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add plant'}
            </button>

            {#if submitError}
                <p class="error">{submitError}</p>
            {/if}
        </form>
    </section>
</main>

<style>
    main {
        max-width: 42rem;
        margin: 2rem auto;
        padding: 0 1.5rem;
        font-family: system-ui, sans-serif;
    }

    .filters {
        display: flex;
        gap: 0.75rem;
        margin: 1rem 0;
    }

    .filters a {
        padding: 0.5rem 0.8rem;
        background: #eeeeee;
        border-radius: 6px;
        text-decoration: none;
        color: #333333;
    }

    .filters a.active {
        background: #276749;
        color: white;
    }

    .plant-list {
        list-style: none;
        padding: 0;
    }

    .plant-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        background: #f1f7ef;
        padding: 1rem;
        margin-bottom: 0.75rem;
        border-radius: 8px;
    }

    .plant-card h3 {
        margin: 0;
    }

    .plant-card p {
        margin: 0.35rem 0;
    }

    .buttons {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    button {
        cursor: pointer;
        padding: 0.5rem 0.75rem;
    }

    .delete {
        color: #b91c1c;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-width: 22rem;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }

    input, select {
        padding: 0.5rem;
    }

    .error {
        color: #b91c1c;
    }
</style>