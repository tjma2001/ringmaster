<script type="ts">
  import { rings } from '../../stores/rings';

  export let close = false;

  let ringName = '';
  let showAddRing = false;

  async function handleCreateClick() {
    const result = await rings.createRing(ringName);
    if (result) {
      console.log('good result');
    } else {
      console.log('bad result');
    }
  }

  async function handleCancelClick() {
    close = true;
  }

  function handleToggleShowRing(value: boolean) {
    if (value === undefined) {
      showAddRing = !showAddRing;
    } else {
      showAddRing = value;
    }
  }
</script>

<div class="wrapper">
  <div class="title">
    <div on:click={() => handleToggleShowRing(true)}>Add new ring</div>
    <div class="cancel" on:click={() => handleToggleShowRing(false)}>
      [cancel]
    </div>
  </div>

  {#if showAddRing}
    <input
      type="text"
      name="ringname"
      placeholder="ring name"
      bind:value={ringName}
    />
    <button on:click={handleCreateClick}>create</button>
  {/if}
</div>

<style>
  .cancel {
    cursor: pointer;
    margin-left: 1rem;
  }
  .cancel:hover {
    color: blue;
  }
  .title {
    margin: 0.5em 0;
    display: flex;
  }
  .wrapper {
    margin: 1rem 0;
  }
</style>
