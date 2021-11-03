/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  POSTGRES_HOST_DEVELOPMENT = "localhost",
  POSTGRES_HOST_TEST = "localhost",
  POSTGRES_HOST = "localhost",
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
  POSTGRES_DEBUG_MODE
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: {
      host: POSTGRES_HOST_DEVELOPMENT,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DATABASE
     },
    migrations: {
      directory: path.join(__dirname, "src", "server", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "server", "db", "seeds"),
    },
    debug: !!POSTGRES_DEBUG_MODE,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: {
      host: POSTGRES_HOST_TEST,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DATABASE
     },
    migrations: {
      directory: path.join(__dirname, "src", "server", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "server", "db", "seeds"),
    },
    debug: !!POSTGRES_DEBUG_MODE,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: {
      host: POSTGRES_HOST,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DATABASE
     },
    migrations: {
      directory: path.join(__dirname, "src", "server", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "server", "db", "seeds"),
    },
    debug: !!POSTGRES_DEBUG_MODE,
  },
};