<script type="ts">
  import { createEventDispatcher } from 'svelte';
  import { rings } from '../../stores/rings';

  let ringName = '';

  const dispatch = createEventDispatcher();

  async function handleCreateClick() {
    const result = await rings.createRing(ringName);
    if (result) {
      console.log('good result');
      dispatch('createdRing');
    } else {
      console.log('bad result');
    }
  }
</script>

<div class="wrapper">
  <input
    type="text"
    name="ringname"
    placeholder="ring name"
    bind:value={ringName}
  />
  <button on:click={handleCreateClick}>create</button>
</div>

<style>
  .wrapper {
    margin: 1rem 0;
  }
</style>
