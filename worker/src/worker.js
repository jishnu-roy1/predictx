const { sequelize, Job, ensureDatabaseExists } = require('../shared/db');

async function startWorker() {
  await ensureDatabaseExists();
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  console.log('Worker started');

  setInterval(async () => {
    const job = await Job.create({ status: 'heartbeat', payload: { timestamp: new Date().toISOString() } });
    console.log('Worker heartbeat saved job id', job.id);
  }, 10000);
}

startWorker().catch((err) => {
  console.error('Worker failed to start:', err);
  process.exit(1);
});
