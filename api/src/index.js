import express from 'express';
import { sequelize, ensureDatabaseExists } from '../shared/db.js';
import authRouter from './routes/auth.js';
import authTestRouter from './routes/authTest.js';

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/auth', authRouter);
app.use('/api', authTestRouter);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API ready' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('Error handling request:', err.stack);
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ error: message });
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
