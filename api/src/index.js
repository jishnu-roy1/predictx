const express = require('express');
const { sequelize, ensureDatabaseExists } = require('../shared/db');
const authRouter = require('./routes/auth');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API ready' });
});

async function start() {
  await ensureDatabaseExists();
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start API:', err);
  process.exit(1);
});
