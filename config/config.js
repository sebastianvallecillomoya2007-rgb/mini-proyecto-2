const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const configFor = (prefix, defaultDatabase) => ({
  username: process.env[`${prefix}_USER`] || process.env.DB_USER,
  password: process.env[`${prefix}_PASSWORD`] || process.env.DB_PASSWORD,
  database: process.env[`${prefix}_NAME`] || defaultDatabase || process.env.DB_NAME,
  host: process.env[`${prefix}_HOST`] || process.env.DB_HOST,
  port: Number(process.env[`${prefix}_PORT`] || process.env.DB_PORT || 3306),
  dialect: 'mysql',
});

module.exports = {
  development: configFor('DB'),
  test: configFor('DB_TEST', 'database_test'),
  production: configFor('DB_PROD', 'database_production'),
};
