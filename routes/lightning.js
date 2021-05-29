const axios = require('axios').default;
const { authenticatedLndGrpc } = require('lightning');
const lnService = require('ln-service');
const fs = require('fs');
const router = require('express').Router({ mergeParams: true });

const baseUrl = `https://1ml.com`;

const tlsCert = fs.readFileSync('tls.cert', { encoding: 'base64' });
const macaroonFile = fs.readFileSync('macaroon.file', { encoding: 'base64' });

const { lnd } = authenticatedLndGrpc({
  cert: tlsCert,
  macaroon: macaroonFile,
  socket: 'localhost:10009',
});

router.get('/:nodeId', async (req, res) => {
  try {
    const url = `${baseUrl}/node/${req.params.nodeId}/json`;
    const result = await axios.get(url);
    console.log(result.data);
    res.status(200).send(result.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/node/:nodeId', async (req, res) => {
  try {
    const nodePublicKey = (await lnService.getWalletInfo({ lnd })).public_key;
    console.log(nodePublicKey);
    const node = await lnService.getNode({ is_omitting_channels: false, public_key: req.params.nodeId, lnd });
    console.log('node', node);
    res.status(200).send(node);
  } catch (error) {
    console.error('node details error:', error);
    res.status(500).send(error);
  }
});



module.exports = router;
