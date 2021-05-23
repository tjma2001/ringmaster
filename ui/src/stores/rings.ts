import { writable } from 'svelte/store';
import axios from 'axios';

function createRings () {
  const { subscribe, set, update } = writable([]);

  const baseUrl = 'http://localhost:9004';

  const addNodeToRing = async (ringId: number, name: string, address: string) => {
    try {
      console.log('here');
      const result = await axios.post(`${baseUrl}/rings/${ringId}/nodes`, { name, address });
      console.log('result', result);
      if(result.status === 201) {
        return true;
      }
      return false;
    } catch (error) {
      console.log('error', error);
      return false;
    }
  }

  const deleteNodeFromRing = async(ringId: number, nodeId: number) => {
    try {
      const result = await axios.delete(`${baseUrl}/rings/${ringId}/nodes/${nodeId}`);
      if(result.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.log('error', error);
      return false;
    }
  }

  const getRings = async () => {
    try {
      console.log('getting rings');
      const rings = await axios.get(`${baseUrl}/rings`);
      console.log('rings', rings.data);
      set(rings.data);
    } catch (error) {
      console.error('could not load rings');
    }
  }

  const getRing = async (ringId) => {
    try {
      const result = await axios.get(`${baseUrl}/rings/${ringId}/nodes`);
      console.log('ring id',  ringId, result.data);
      if(result.status === 200) {
        return result.data;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const createRing = async (name: string): Promise<boolean> => {
    try {
      const result = await axios.post(`${baseUrl}/rings`, {name});
      if (result.status === 201) {
        await getRings();
        return true;
      } else {
        console.error('status:', result.status, result.statusText);
        return false;
      } 
    } catch (error) {
      console.error('failure to create ring');
      console.error(error);
      return false;
    }
  }

  const deleteRing = async (id: number): Promise<boolean> => {
    try {
      const result = await axios.delete(`${baseUrl}/rings/${id}`);
      if(result.status === 200) {
        await getRings();
        return true;
      }
      console.log('failure to delete ring', result.status, result.statusText);
      return false;
    } catch (error) {
      console.log('Error deleting ring', error);
      return false;
    }
  }

  return {
    subscribe,
    addNodeToRing,
    createRing,
    deleteNodeFromRing,
    deleteRing,
    getRings,
    getRing,
  }
}

export const rings = createRings();
