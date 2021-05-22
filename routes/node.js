const router = require('express').Router({ mergeParams: true });
const DbManager = require('../lib/DbManager');

const dbManager = new DbManager();

router.get('/', async (req, res) => {
  console.log(req.params);
  try {
    const results = await dbManager.getNodesFromRing(req.params.ringId);
    res.status(200).send(results);
  } catch (error) {
    console.error('failure to get nodes', error);
    res.status(500).send(error);
  }
});

router.post('/', async (req, res) => {
  const params = req.body;
  try {
    console.log(params);
    if (params.name && params.address && params.ringId && params.name.trim().length === 0 && params.address.trim().length === 0 && !isNaN(params.ringId)) {
      res.status(400).send({ message: 'Invalid name and address. values required ' });
      return;
    }
    const result = await dbManager.addNodeToRing(params);
    res.status(201).send('ok');
  } catch (error) {
    if (error === 'not found') {
      res.status(404).send({ message: 'Ring not found' });
    } else {
      console.error('failure to add node', error);
      res.status(500).send({ message: 'failure to add ndoe', error });
    }
  }
});

router.delete('/:id', async (req, res) => {
  const params = req.params;
  try {
    const ring = await dbManager.getRing(req.params.ringId);
    if (ring) {
      console.log('here');
      const node = await dbManager.getNode(req.params.id);
      if (node) {
        const result = await dbManager.deleteNode(params.id);
        res.status(200).send('deleted');
      } else {
        res.status(400).send({ message: 'Node not found' });
      }
    } else {
      res.status(400).send({ message: 'Ring not found' });
    }
  } catch (error) {
    console.error('failure to delete node', error);
    res.status(500).send({ message: 'failure to delete node', error });
  }
});

module.exports = router;
