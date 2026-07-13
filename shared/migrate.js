const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { sequelize } = require('./db');

async function runMigrations() {
  const migrationsPath = path.resolve(__dirname, 'migrations');
  const migrationFiles = fs.readdirSync(migrationsPath)
    .filter((file) => file.endsWith('.js'))
    .sort();

  const queryInterface = sequelize.getQueryInterface();

  await sequelize.authenticate();

  await sequelize.getQueryInterface().createTable('SequelizeMeta', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
  }).catch(() => {});

  const applied = await sequelize.query('SELECT name FROM "SequelizeMeta";', {
    type: sequelize.QueryTypes.SELECT,
  }).catch(() => []);

  const appliedNames = new Set(applied.map((row) => row.name));

  for (const file of migrationFiles) {
    if (appliedNames.has(file)) {
      continue;
    }

    const migration = require(path.join(migrationsPath, file));
    console.log(`Running migration: ${file}`);
    await migration.up(queryInterface, Sequelize);
    await sequelize.query('INSERT INTO "SequelizeMeta" (name) VALUES ($1);', {
      bind: [file],
    });
  }

  await sequelize.close();
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
