const http = require('http');
const { sequelize, ensureDatabaseExists } = require('../shared/db');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('API ready\n');
});

async function start() {
  await ensureDatabaseExists();
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  server.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start API:', err);
  process.exit(1);
});
