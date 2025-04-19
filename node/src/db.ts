// src/db.ts
import { Sequelize } from 'sequelize';

// export const sequelize = new Sequelize("postgres://postgres:100845@localhost/demoRustdb", {
//   logging: false,
// });
export const sequelize = new Sequelize({
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '100845',
  database: 'demoRustdb',
  dialect: 'postgres',
});
