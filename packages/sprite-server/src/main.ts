/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { cellRouter } from './cell';
import { assets } from './assetData';
import { compositeRouter } from './composite';

const app = express();

app.use('/sprites/assets', express.static(path.join(__dirname, 'assets')));

app.get('/sprites', (req, res) => {
  res.json({ assets });
});

app.use('/sprites/cell', cellRouter)
app.use('/sprites/composite', compositeRouter)

app.get('*', (req, res) => {
  res.status(404).send({});
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/sprites`);
});
server.on('error', console.error);
