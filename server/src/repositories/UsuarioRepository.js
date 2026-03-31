import knex from '../config/knex.js';
import dayjs from 'dayjs';
import { Usuario } from '../models/Usuario.js';
import { filtraDadosPermitidos } from '../helpers/customValidators.js';

export class UsuarioRepository {
    async findAll() {
        const usuarios = await knex('usuarios')
            .select(
                'usuarios.*',
                knex.raw('JSON_ARRAYAGG(usuarios_tipos.tipo) as tipos')
            )
            .join('usuarios_tipos', 'usuarios_tipos.usuario_id', 'usuarios.id');

        return usuarios.map((usuario) => new Usuario({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipos: JSON.parse(usuario.tipos),
        }));
    }

    async findById(id) {
        const usuario = await knex('usuarios')
            .select(
                'usuarios.*',
                knex.raw('JSON_ARRAYAGG(usuarios_tipos.tipo) as tipos')
            )
            .join('usuarios_tipos', 'usuarios_tipos.usuario_id', 'usuarios.id')
            .where('usuarios.id', id)
            .first();

        if (!usuario) {
            return null;
        }

        return new Usuario({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            senha: usuario.senha,
            tipos: JSON.parse(usuario.tipos)
        });
    }

    async findByCPF(cpf) {
        const usuario = await knex('usuarios')
            .select(
                'usuarios.*',
                knex.raw('JSON_ARRAYAGG(usuarios_tipos.tipo) as tipos')
            )
            .join('usuarios_tipos', 'usuarios_tipos.usuario_id', 'usuarios.id')
            .where('usuarios.cpf', cpf)
            .first();

        if (!usuario) {
            return null;
        }

        return new Usuario({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            senha: usuario.senha,
            tipos: JSON.parse(usuario.tipos)
        });
    }

    async findByEmail(email) {
        const usuario = await knex('usuarios')
            .select(
                'usuarios.*',
                knex.raw('JSON_ARRAYAGG(usuarios_tipos.tipo) as tipos')
            )
            .join('usuarios_tipos', 'usuarios_tipos.usuario_id', 'usuarios.id')
            .where('usuarios.email', email)
            .first();

        if (!usuario) {
            return null;
        }

        return new Usuario({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            senha: usuario.senha,
            tipos: JSON.parse(usuario.tipos)
        });
    }

    async findByToken(token) {
        const usuario = await knex('usuarios')
            .select(
                'usuarios.*',
                knex.raw('JSON_ARRAYAGG(usuarios_tipos.tipo) as tipos')
            )
            .join('usuarios_tipos', 'usuarios_tipos.usuario_id', 'usuarios.id')
            .join('recuperacao_senhas', 'recuperacao_senhas.usuario_id', 'usuarios.id')
            .where('recuperacao_senhas.token', token)
            .first();

        if (!usuario) {
            return null;
        }

        return new Usuario({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            senha: usuario.senha,
            tipos: JSON.parse(usuario.tipos)
        });
    }

    async create(data) {
        const [id] = await knex('usuarios')
            .insert({
                nome: data.nome,
                email: data.email,
                senha: data.senha,
                cpf: data.cpf,
                endereco: data.endereco,
                telefone: data.telefone,
            });

        data.tipos.forEach(async (tipo) => {
            await knex('usuarios_tipos')
                .insert({
                    usuario_id: id,
                    tipo: tipo
                });
        });

        return id;
    }

    async update(id, data) {
        const dadosFiltrados = filtraDadosPermitidos(data, {
            nome: 'nome',
            email: 'email',
            senha: 'senha',
            cpf: 'cpf',
            endereco: 'endereco',
            telefone: 'telefone',
        });

        await knex.transaction(async (trx) => {
            await trx('usuarios')
                .where('usuarios.id', id)
                .update(dadosFiltrados);
        });
    }

    async delete(id) {
        await knex.transaction(async (trx) => {
            // # to do
            // verificar quais dados podem ser removidos e quais não
            // isso por que, se não permitir remover consultas, da pra tirar daqui, mas terá que ter validação pra jogar um erro tratado
            // se não for tratado, vai ir um erro de sql dizendo que o usuário ainda tem relação em tabelas
            await trx('consultas')
                .where('consultas.usuario_id', id)
                .delete();

            await trx('medicos')
                .where('medicos.usuario_id', id)
                .delete();

            await trx('funcionarios')
                .where('funcionarios.usuario_id', id)
                .delete();

            await trx('pacientes')
                .where('pacientes.usuario_id', id)
                .delete();

            await trx('usuarios_tipos')
                .where('usuarios_tipos.usuario_id', id)
                .delete();

            await trx('usuarios')
                .where('usuarios.id', id)
                .delete();
        });
    }
}
