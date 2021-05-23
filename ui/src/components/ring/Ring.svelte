<script type="ts">
  import axios from 'axios';

  import { rings } from '../../stores/rings';
  export let ring;

  let nodes = [];
  let nodeName = '';
  let nodeAddress = '';
  let selectedNode;
  let showAddNode = false;

  console.log('ring:', ring);

  function addNodeToggle() {
    showAddNode = !showAddNode;
  }

  async function handleAddNodeSubmit() {
    console.log('adding node');
    const result = await rings.addNodeToRing(ring.id, nodeName, nodeAddress);
    if (result) {
      console.log('result', result);
      nodes = [...(await rings.getRing(ring.id))];
    }
  }

  async function handleDeleteNode(id: number) {
    try {
      console.log('delete node from ring', id);
      const result = await rings.deleteNodeFromRing(ring.id, id);
      if (result) {
        nodes = [...(await rings.getRing(ring.id))];
      }
    } catch (error) {
      console.error('error', error);
    }
  }

  async function showNodeDetails(node) {
    console.log('show node', node);
    try {
      const result = await axios.get(
        `https://1ml.com/node/${node.address}/json`
      );
      console.log('result', result.data);
    } catch (error) {
      console.error(error);
    }
  }

  $: (async () => {
    console.log('here');
    nodes = [...(await rings.getRing(ring.id))];
  })();
</script>

<div>
  <div><h3>Ring: {ring.name}</h3></div>
  <div class="title">
    <div>Nodes:</div>
    <div class="link" on:click={addNodeToggle}>[Add node to ring]</div>
  </div>

  <div class="node-container">
    {#each nodes as node, index}
      <div class="node-line">
        <div class="node-line-count">{index}.</div>
        <div class="link" on:click={() => handleDeleteNode(node.id)}>
          [delete]
        </div>
        <div class="node-line-content" on:click={() => showNodeDetails(node)}>
          {node.name}
          [{node.address}]
        </div>
        <div />
      </div>
    {/each}
  </div>

  {#if showAddNode}
    <div class="add-node-form">
      <div>
        <input
          type="text"
          name="name"
          bind:value={nodeName}
          placeholder="node name"
        />
      </div>
      <div>
        <input
          type="text"
          name="address"
          bind:value={nodeAddress}
          placeholder="node address"
        />
      </div>
      <div>
        <button on:click={addNodeToggle}>cancel</button>
        <button on:click={handleAddNodeSubmit}>Add node</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .link {
    cursor: pointer;
    margin-left: 1rem;
  }
  .link:hover {
    color: blue;
  }
  .add-node-form {
    margin-top: 1rem;
  }
  .node-container {
    margin-top: 1rem;
  }
  .node-line {
    display: flex;
  }
  .node-line-content {
    cursor: pointer;
    margin-left: 0.25rem;
  }
  .node-line-count {
    width: 0.25rem;
  }
  .node-line-content:hover {
    color: green;
    text-decoration: underline;
  }
  .title {
    display: flex;
  }
</style>
