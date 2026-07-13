const express = require('express');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const queue = require('./scheduler');

const app = express();
const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new BullAdapter(queue)],
  serverAdapter,
});

serverAdapter.setBasePath('/bull-board');
app.use('/bull-board', serverAdapter.getRouter());

const port = process.env.BULL_UI_PORT || 8082;
app.listen(port, () => {
  console.log(`Bull UI listening on port ${port}`);
});
