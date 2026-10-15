
<script>
  import { petRoster } from './petRoster.svelte';
</script>

<section>
  <h2>Student roster</h2>

  <p>Total students: {petRoster.students.length}</p>

  {#if petRoster.students.length === 0}
    <p>No students have been added yet. Use the form to add one!</p>
  {:else}
    <ul>
      {#each petRoster.students as s (s.id)}
        <li>
          <strong>{s.name}</strong>
          {#if s.petName}
            <p>
              Pet: {s.petName}
              ({s.petType || 'Unspecified'})
            </p>
          {:else}
            <p>No pet</p>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</section>
