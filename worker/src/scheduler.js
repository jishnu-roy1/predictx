const Bull = require('bull');

const queue = new Bull('jobs', {
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
  },
});

queue.process(async (job) => {
  console.log('Processing Bull job:', job.id, job.data);
  return { processedAt: new Date().toISOString() };
});

module.exports = queue;
