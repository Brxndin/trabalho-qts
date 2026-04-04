import 'dotenv/config';

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_ROOT_PASSWORD,
        database: process.env.DB_DATABASE,
    },
    migrations: {
        directory: './src/database/migrations',
    },
    seeds: {
        directory: './src/database/seeds',
    },
};
