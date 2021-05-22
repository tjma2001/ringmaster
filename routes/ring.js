const router = require('express').Router();
const DbManager = require('../lib/DbManager');

const dbManager = new DbManager();


router.get('/rings', async (req, res) => {
  try {
    const result = await dbManager.getRings();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Failed to get rings', error });
  }
});

router.get('/rings/:id', async (req, res) => {
  try {
    const result = await dbManager.getRing(req.params.id);
    if (!result) {
      res.status(404).send({ message: 'Ring not found' });
      return;
    }
    res.status(200).send(result);
  } catch (error) {
    res.render('pages/ring', { nodes: [], message: 'failed to get ring nodes', error });
  }
});

router.post('/rings', async (req, res) => {
  const params = req.body;
  try {
    console.log('creating ring', params);
    if (!params.name || params.name.trim().length === 0) {
      res.status(400).send({ message: 'Ring must have a valid name' });
      return;
    }
    await dbManager.createRing(params);
    res.status(201).send({ message: 'ring created' });
  } catch (error) {
    res.status(500).send({ message: 'failure to create ring', error });
  }
});

router.put('/ring/:id', async (req, res) => {
  const params = req.body;
  try {
    console.log('updating ring', params);
    if (!params.name || params.name.trim().length === 0) {
      res.status(400).send({ message: 'Ring must have a valid name' });
      return;
    }
    const result = await dbManager.updateRing(req.params.id, params.name);
    if (result === false) {
      res.status(404).send({ message: 'ring not found' });
      return;
    }
    res.status(200).send('ok');
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'failure to update ring', error });
  }
});

router.delete('/rings/:id', async (req, res) => {
  console.log('deleting ', req.params);
  try {
    const result = await dbManager.deleteRing(req.params.id);
    res.status(200).send('ok');
  } catch (error) {
    res.status(500).send({ message: 'could not delete ring', error });
  }
});

router.post('/rings/:id/generate', async (req, res) => {
  console.log('generating ring');
  res.status(200).send('ok');
});


module.exports = router;
