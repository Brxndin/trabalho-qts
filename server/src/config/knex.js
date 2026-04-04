import knexLib from 'knex';
import knexConfigs from '../../knexfile.js';

const knex = knexLib(knexConfigs);

export default knex;
