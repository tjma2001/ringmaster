const axios = require('axios').default;
const dayjs = require('dayjs');
const { authenticatedLndGrpc } = require('lightning');
const lnService = require('ln-service');
const fs = require('fs');
const router = require('express').Router({ mergeParams: true });
const DbManager = require('../lib/DbManager');
const dbManager = new DbManager();

const baseUrl = `https://1ml.com`;

const tlsCert = fs.readFileSync('tls.cert', { encoding: 'utf8' });
const macaroonFile = fs.readFileSync('macaroon.file', { encoding: 'utf8' });

const { lnd } = authenticatedLndGrpc({
  cert: tlsCert,
  macaroon: macaroonFile,
  socket: '127.0.0.1:10009',
});

const getNodeFrom1ml = async (pubkey) => {
  const url = `${baseUrl}/node/${pubkey}/json`;
  const nodeStats = await axios.get(url);
  await dbManager.updateNodeStats(pubkey, nodeStats.data);
  return nodeStats.data;
};

router.get('/:nodeId', async (req, res) => {
  try {
    console.log(req.params);
    const node = await dbManager.getNodeStats(req.params.nodeId);
    console.log('dbnode', node);
    if (node) {
      const nodeStats = JSON.parse(node.nodeStats);
      console.log('nodeStats', nodeStats);
      if (nodeStats.last_update) {
        const dateTime = nodeStats.last_update * 1000;
        console.log('dayjs', dayjs(dateTime).toISOString());
        // console.log(dayjs().)
        // const date = new dayjs(dateTime);
        res.status(200).send(nodeStats);
      } else {
        console.log('get node from 1ml');
        const nodeStats = await getNodeFrom1ml(req.params.nodeId);
        res.status(200).send(nodeStats);
      }
    } else {
      console.log('node not found in db, getting from 1ml');
      const nodeStats = await getNodeFrom1ml(req.params.nodeId);
      console.log('result', nodeStats);
      res.status(200).send(nodeStats);
    }
  } catch (error) {
    console.log('error', error);
    res.status(500).send(error);
  }
});

router.get('/node/:nodeId', async (req, res) => {
  try {
    const result = await lnService.getNode({ is_omitting_channels: false, public_key: req.params.nodeId, lnd });
    // const result = await lnService.getChannels({ partner_public_key: req.params.nodeId, lnd });
    // const result = await lnService.
    console.log('node', result);
    res.status(200).send(result);
  } catch (error) {
    console.error('node details error:', error);
    res.status(500).send(error);
  }
});



module.exports = router;
