const express = require('express');
const server = express();
const cors = require('cors');

const DbManager = require('./lib/DbManager');
const ringRoutes = require('./routes/ring');
const nodeRoutes = require('./routes/node');
const lightning = require('./routes/lightning');
//add route for lightning queries

const dbManager = new DbManager();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use(ringRoutes);
server.use('/rings/:ringId/nodes/', nodeRoutes);
server.use('/lightning/', lightning);

server.get('/', async (req, res) => {
  try {
    const rings = await dbManager.getRings();
    res.render('pages/index', { rings });
  } catch (error) {
    res.render('pages/index', { error: 'could not load rings' });
  }
});

server.listen(9004, () => {
  console.log('server running on port: 9004');
});
