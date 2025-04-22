// src/db.ts
import { Sequelize } from 'sequelize';


const host = 'postgres' // docker network bridges
const port = 5432 // default port in docker-compose.yml

// environment variables will be passed directly in docker-compose.yml
const username = process.env.POSTGRES_USER
const password = process.env.POSTGRES_PASSWORD
const database = process.env.POSTGRES_DB

export const sequelize = new Sequelize({
  host,
  port,
  username,
  password,
  database,
  dialect: 'postgres',
});
