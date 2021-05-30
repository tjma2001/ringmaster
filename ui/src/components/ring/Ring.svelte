<script type="ts">
  import axios from 'axios';

  import { rings } from '../../stores/rings';
  export let ring;

  let nodes = [];
  let nodeAddress = '';
  let nodeName = '';
  let nodeDetails;
  let selectedNode;
  let showAddNode = false;

  function addNodeToggle() {
    showAddNode = !showAddNode;
  }

  async function getNodeDetails(nodeAddress) {
    try {
      const result = await axios.get(
        `http://localhost:9004/lightning/node/${nodeAddress}`
      );
      console.log('result', result.data);
      const channels = result.data.channels;
      console.log('length', channels.length);
      if (channels.length > 0) {
        const reducer = (acc, curr) =>
          acc +
          curr.policies
            .filter((policy) => policy.public_key === nodeAddress)
            .reduce(
              (_acc, _curr) =>
                _acc +
                Number(_curr.max_htlc_mtokens ? _curr.max_htlc_mtokens : 0),
              0
            );
        const count = channels.reduce(reducer, 0);
        console.log('count', count / 1000);
      }
    } catch (error) {
      console.error(error);
    }
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
    nodeDetails = undefined;
    try {
      const result = await axios.get(
        `http://localhost:9004/lightning/${node.address}`
      );
      console.log('result', result.data);
      nodeDetails = { ...result.data };
      console.log('node details', nodeDetails);
    } catch (error) {
      console.error(error);
      nodeDetails = {
        color: '#000000',
        error,
      };
    }
  }

  async function generateRing() {
    console.log('Generating ring');
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
    <div class="link" on:click={generateRing}>[Generate ring}</div>
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
        <div class="link" on:click={() => getNodeDetails(node.address)}>
          [get]
        </div>
      </div>
    {/each}
  </div>

  <!-- {JSON.stringify(nodeDetails)} -->

  {#if nodeDetails}
    <div class="node-container" style="border: 2px solid {nodeDetails.color}">
      {#if nodeDetails.error}
        <div>Couldn't get node details</div>
      {:else}
        <div style="background-color: {nodeDetails.color}">
          Node Details: {nodeDetails.alias}
        </div>
        <div>
          <div>Address:</div>
          <ul>
            {#each nodeDetails.addresses as address}
              <li>
                {address.addr}
              </li>
            {/each}
          </ul>
          <div>Channel count: {nodeDetails.channelcount}</div>
          <div>Capacity: {nodeDetails.capacity}</div>
        </div>
      {/if}
    </div>
  {/if}

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
