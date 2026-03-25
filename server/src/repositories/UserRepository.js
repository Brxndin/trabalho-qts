import knex from '../config/knex.js';
import { User } from '../models/User.js';

export class UserRepository {
    async findAll() {
        const rows = await knex('usuarios').select('*');

        return rows.map((row) => new User({
            id: row.id,
            nome: row.nome,
            email: row.email,
            tipo: row.tipo,
        }));
    }

    async findById(id) {
        const row = await knex('usuarios')
            .select('usuarios.*')
            .where({ id })
            .first();

        if (!row) {
            return null;
        }

        return new User({
            id: row.id,
            nome: row.nome,
            email: row.email,
            tipo: row.tipo,
        });
    }

    async create(userData) {
        const [id] = await knex('usuarios')
            .insert({
                nome: userData.nome,
                email: userData.email,
                tipo: userData.tipo,
                senha: userData.senha,
            });

        return id;
    }
}
