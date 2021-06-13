<script lang="ts">
  import { rings } from './stores/rings';
  import { AddRing } from './components/ring';
  import Ring from './components/ring/Ring.svelte';

  let selectedRing;
  let showAddRing = false;

  async function handleDeleteRingClick(id: number): Promise<void> {
    const result = await rings.deleteRing(id);
    console.log('result', result);
  }

  function handleSelectRingClick(ringId): void {
    console.log('ringId', ringId);
    selectedRing = $rings.find((ring) => ring.id === ringId);
    console.log('selectedRing', selectedRing);
  }

  function handleToggleShowRing(): void {
    showAddRing = !showAddRing;
  }

  setTimeout(async () => {
    await rings.getRings();
  }, 1000);
</script>

<svelte:head>
  <link href="https://unpkg.com/ace-css/css/ace.min.css" rel="stylesheet" />
</svelte:head>

<main>
  <h1>Ringmaster</h1>

  <diiv class="rings-container">
    <div class="header">
      <div class="title">Rings:</div>
      <div on:click={() => handleToggleShowRing()} class="link ml2">
        [{!showAddRing ? 'Add ring' : 'Cancel'}]
      </div>
    </div>
    <div class="rings-container">
      {#each $rings as ring}
        <div class="ring-row">
          <div
            class="clickable"
            on:click={() => handleDeleteRingClick(ring.id)}
          >
            [delete]
          </div>
          <div
            on:click={() => handleSelectRingClick(ring.id)}
            class="ring-name"
          >
            {ring.name}
          </div>
        </div>
      {/each}
    </div>

    {#if showAddRing}
      <AddRing on:createdRing={() => (showAddRing = false)} />
    {/if}

    {#if selectedRing}
      <Ring ring={selectedRing} />
    {/if}
  </diiv>
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
  .header {
    display: flex;
  }
  .link {
    cursor: pointer;
  }
  .link:hover {
    color: blue;
  }
  .rings-container {
    text-align: left;
  }
  .ring-name {
    margin-left: 0.25rem;
    cursor: pointer;
  }
  .ring-name:hover {
    color: blue;
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
