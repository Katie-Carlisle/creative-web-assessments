
<script>
    let { status, error } = $props();
</script>

<svelte:head>
    <title>Plant not found | Plant Swap Shelf</title>
</svelte:head>

<main>
    {#if status === 404}
        <h1>Plant not found</h1>
        <p>Sorry, we couldn't find that plant. It may have been removed.</p>
    {:else}
        <h1>Something went wrong</h1>
        <p>{error?.message ?? 'An unexpected error occurred.'}</p>
    {/if}

    <a href="/shelf">← Return to the shelf</a>
</main>

<style>
    main {
        max-width: 650px;
        margin: 100px auto;
        padding: 2rem;
        text-align: center;
    }

    a {
        display: inline-block;
        margin-top: 1.5rem;
    }
</style>
