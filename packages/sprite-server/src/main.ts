/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';

const app = express();

app.use('/sprites/assets', express.static(path.join(__dirname, 'assets')));

app.get('/sprites', (req, res) => {
  res.send({ message: 'Welcome to sprite-server!' });
});

app.get('*', (req, res) => {
  res.status(404).send({ message: 'sprite-server does not have this route', path: req.path });
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
