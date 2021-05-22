const express = require('express');
const server = express();
const DbManager = require('./lib/DbManager');
const ringRoutes = require('./routes/ring');
const nodeRoutes = require('./routes/node');

const dbManager = new DbManager();


server.set('view engine', 'ejs');
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use(ringRoutes);
server.use('/rings/:ringId/nodes/', nodeRoutes);

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