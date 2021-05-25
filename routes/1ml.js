const axios = require('axios').default;
const router = require('express').Router({ mergeParams: true });

const baseUrl = `https://1ml.com`;

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

module.exports = router;