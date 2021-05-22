<script type="ts">
  import { rings } from '../stores/rings';
  let ringName = '';

  async function handleCreateClick() {
    console.log('handle click', ringName);
    console.log(rings);
    const result = await rings.createRing(ringName);
    if (result) {
      console.log('good result');
    } else {
      console.log('bad result');
    }
  }
</script>

<div class="wrapper">
  <div>Add new ring</div>
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
    margin: 1rem;
  }
</style>
