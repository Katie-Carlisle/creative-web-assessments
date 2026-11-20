
<script>
    let { data } = $props();
</script>

<svelte:head>
    <title>{data.plant.name} | Plant Swap Shelf</title>
</svelte:head>

<main>
    <a href="/shelf">← Back to the shelf</a>

    <article>
        <h1>{data.plant.name}</h1>

        <p class="species">{data.plant.species}</p>

        <div class="details">
            <p>
                <strong>Light requirements:</strong>
                {data.plant.lightNeeds}
            </p>

            <p>
                <strong>Status:</strong>
                {data.plant.swapped ? 'Swapped' : 'Available'}
            </p>

            <p>
                <strong>Plant ID:</strong>
                <span class="id">{data.plant.id}</span>
            </p>
        </div>
    </article>
</main>

<style>
    main {
        max-width: 700px;
        margin: 60px auto;
        padding: 2rem;
    }

    article {
        margin-top: 2rem;
        padding: 2rem;
        border: 1px solid #ddd;
        border-radius: 12px;
    }

    h1 {
        margin-bottom: 0.5rem;
    }

    .species {
        font-style: italic;
        color: #66836b;
        margin-bottom: 2rem;
    }

    .details p {
        margin: 1rem 0;
    }

    .id {
        overflow-wrap: anywhere;
        font-size: 0.85rem;
    }
</style>
