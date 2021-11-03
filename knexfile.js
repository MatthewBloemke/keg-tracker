/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  DATABASE_HOST_DEVELOPMENT = "localhost",
  DATABASE_HOST_TEST = "localhost",
  DATABASE_HOST = "localhost",
  DEBUG,
  DATABASE_PASSWORD,
  DATABASE_NAME
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: {
      host: DATABASE_HOST_DEVELOPMENT,
      user: 'postgres',
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME
     },
    migrations: {
      directory: path.join(__dirname, "src", "server", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "server", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: {
      host: DATABASE_HOST_TEST,
      user: 'postgres',
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME
     },
    migrations: {
      directory: path.join(__dirname, "src", "server", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "server", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: {
      host: DATABASE_HOST,
      user: 'postgres',
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME
     },
    migrations: {
      directory: path.join(__dirname, "src", "server", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "server", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};