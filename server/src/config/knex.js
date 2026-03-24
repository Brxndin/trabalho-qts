import 'dotenv/config';
import knexLib from 'knex';

const knex = knexLib({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_ROOT_PASSWORD,
    database: process.env.DB_DATABASE
  }
});

export default knex;
