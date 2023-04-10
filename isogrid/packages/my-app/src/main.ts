/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';

const app = express();
app.set('view engine', 'ejs')
app.set('views',process.cwd() +'/packages/my-app/src/views')

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to my-app!' });
});

app.get('/', (req, res) => {
  res.render('index.ejs', {
    title:'my app'
  })
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
