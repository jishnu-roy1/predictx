const { Sequelize } = require('sequelize');
const { Client } = require('pg');

const DB_HOST = process.env.DB_HOST || 'postgres';
const DB_PORT = process.env.DB_PORT || '5432';
const DB_NAME = process.env.DB_NAME || 'mydb';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';

const DATABASE_URL = process.env.DATABASE_URL || `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

async function ensureDatabaseExists() {
  const adminClient = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: 'postgres',
  });

  await adminClient.connect();

  try {
    const result = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME]);
    if (result.rowCount === 0) {
      try {
        await adminClient.query(`CREATE DATABASE "${DB_NAME}"`);
      } catch (error) {
        if (error.code !== '23505') {
          throw error;
        }
      }
    }
  } finally {
    await adminClient.end();
  }
}

const Job = require('./models/job')(sequelize);
const User = require('./models/user')(sequelize);

module.exports = {
  sequelize,
  Job,
  User,
  ensureDatabaseExists,
};
