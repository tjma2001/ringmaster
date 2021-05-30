const axios = require('axios').default;
const { authenticatedLndGrpc } = require('lightning');
const lnService = require('ln-service');
const fs = require('fs');
const router = require('express').Router({ mergeParams: true });

const baseUrl = `https://1ml.com`;

const tlsCert = fs.readFileSync('tls.cert', { encoding: 'utf8' });
const macaroonFile = fs.readFileSync('macaroon.file', { encoding: 'utf8' });

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
