<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { rings } from './stores/rings';
  import { AddRing } from './components';

  async function handleDeleteRingClick(id: number): Promise<void> {
    const result = await rings.deleteRing(id);
    console.log('result', result);
  }

  function handleAddRingClick(): void {
    console.log('adding a ring');
  }

  setTimeout(async () => {
    await rings.getRings();
  }, 1000);
</script>

<main>
  <h1>Ringmaster</h1>

  <diiv class="rings-container">
    <div>Rings:</div>
    <div class="rings-container">
      {#each $rings as ring}
        <div class="ring-row">
          <div
            class="clickable"
            on:click={() => handleDeleteRingClick(ring.id)}
          >
            [delete]
          </div>
          {ring.name}
        </div>
      {/each}
    </div>

    <AddRing />
  </diiv>

  <p>
    <button on:click={handleAddRingClick}>Add ring</button>
  </p>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  .clickable {
    cursor: pointer;
  }

  .clickable:hover {
    color: blue;
  }

  .rings-container {
    text-align: left;
  }

  .ring-row {
    display: flex;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
