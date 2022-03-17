/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  POSTGRES_HOST_DEV = "localhost",
  POSTGRES_HOST_TEST = "localhost",
  POSTGRES_HOST = "localhost",
  POSTGRES_USER,
  POSTGRES_DATABASE,
  POSTGRES_PASSWORD,
  POSTGRES_DEBUG_MODE,
  POSTGRES_USER_TEST,
  POSTGRES_PASSWORD_TEST,
  POSTGRES_DATABASE_TEST,
  POSTGRES_USER_DEV,
  POSTGRES_PASSWORD_DEV,
  POSTGRES_DATABASE_DEV,
} = process.env;
console.log(process.env.POSTGRES_USER)
module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: {
      host: POSTGRES_HOST_DEV,
      user: POSTGRES_USER_DEV,
      password: POSTGRES_PASSWORD_DEV,
      database: POSTGRES_DATABASE_DEV
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
      user: POSTGRES_USER_TEST,
      password: POSTGRES_PASSWORD_TEST,
      database: POSTGRES_DATABASE_TEST
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