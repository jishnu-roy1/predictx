const { sequelize, Job, ensureDatabaseExists } = require('../shared/db');
const queue = require('./scheduler');

async function startWorker() {
  await ensureDatabaseExists();
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  console.log('Worker started');

  queue.on('completed', (job, result) => {
    console.log(`Bull job ${job.id} completed`, result);
  });

  queue.on('failed', (job, err) => {
    console.error(`Bull job ${job.id} failed`, err);
  });

  setInterval(async () => {
    const job = await Job.create({ status: 'heartbeat', payload: { timestamp: new Date().toISOString() } });
    await queue.add({ jobId: job.id, status: job.status });
    console.log('Worker heartbeat saved job id', job.id);
  }, 10000);
}

startWorker().catch((err) => {
  console.error('Worker failed to start:', err);
  process.exit(1);
});
