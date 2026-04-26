import crypto from 'crypto';
import dayjs from 'dayjs';
import knex from '../config/knex.js';
import { filtraDadosPermitidos } from '../helpers/customValidators.js';
import { Usuario } from '../models/Usuario.js';

export class UsuarioRepository {
    async findAll() {
        const usuarios = await knex('usuarios')
            .select(
                'usuarios.*',
                knex('usuarios_tipos')
                    .select(knex.raw('JSON_ARRAYAGG(tipo)'))
                    .whereRaw('usuarios_tipos.usuario_id = usuarios.id')
                    .as('tipos')
            );

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
                knex('usuarios_tipos')
                    .select(knex.raw('JSON_ARRAYAGG(tipo)'))
                    .whereRaw('usuarios_tipos.usuario_id = usuarios.id')
                    .as('tipos')
            )
            .where('usuarios.id', id)
            .first();

        if (!usuario || !usuario?.id) {
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

    async findByCPF(cpf, idAtual = null) {
        const usuario = await knex('usuarios')
            .select(
                'usuarios.*',
                knex('usuarios_tipos')
                    .select(knex.raw('JSON_ARRAYAGG(tipo)'))
                    .whereRaw('usuarios_tipos.usuario_id = usuarios.id')
                    .as('tipos')
            )
            .where('usuarios.cpf', cpf)
            .modify((query) => {
                if (idAtual) {
                    query.where('usuarios.id', '!=', idAtual);
                }
            })
            .first();

        if (!usuario || !usuario?.id) {
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

    async findByEmail(email, idAtual = null) {
        const usuario = await knex('usuarios')
            .select(
                'usuarios.*',
                knex('usuarios_tipos')
                    .select(knex.raw('JSON_ARRAYAGG(tipo)'))
                    .whereRaw('usuarios_tipos.usuario_id = usuarios.id')
                    .as('tipos')
            )
            .where('usuarios.email', email)
            .modify((query) => {
                if (idAtual) {
                    query.where('usuarios.id', '!=', idAtual);
                }
            })
            .first();

        if (!usuario || !usuario?.id) {
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
        return await knex.transaction(async (trx) => {
            const [usuarioId] = await trx('usuarios')
                .insert({
                    nome: data.nome,
                    email: data.email,
                    // para definir a senha, é necessário acessar o link enviado por e-mail
                    // senha: data.senha,
                    cpf: data.cpf,
                    endereco: data.endereco,
                    telefone: data.telefone,
                });

            // somente administradores são cadastrados diretamente
            await trx('usuarios_tipos')
                .insert({
                    usuario_id: usuarioId,
                    tipo: Usuario.tiposUsuario.ADM
                });

            // token pra recuperação de senha ou primeiro acesso
            const token = await this.createToken(usuarioId, trx);

            return [usuarioId, data.email, token];
        });
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

        return await knex.transaction(async (trx) => {
            return await trx('usuarios')
                .where('usuarios.id', id)
                .update(dadosFiltrados);
        });
    }

    async delete(id) {
        return await knex.transaction(async (trx) => {
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

            await trx('recuperacao_senhas')
                .where('recuperacao_senhas.usuario_id', id)
                .delete();

            await trx('usuarios_tipos')
                .where('usuarios_tipos.usuario_id', id)
                .delete();

            const linhasAlteradas = await trx('usuarios')
                .where('usuarios.id', id)
                .delete();

            return linhasAlteradas;
        });
    }

    async findToken(token) {
        const tokenEncontrado = await knex('recuperacao_senhas')
            .select(
                'recuperacao_senhas.*',
            )
            .where('recuperacao_senhas.token', token)
            .first();

        if (!tokenEncontrado || !tokenEncontrado?.id) {
            return null;
        }

        return tokenEncontrado;
    }

    // token pra recuperação de senha ou primeiro acesso
    async createToken(usuarioId, trx = null) {
        const token = crypto.randomBytes(32).toString('hex');

        const transacao = trx ?? knex;

        await transacao.transaction(async (subTrx) => {
            // remove tokens anteriores
            await this.deleteTokenByUsuario(usuarioId, subTrx);

            // cria novo token
            await subTrx('recuperacao_senhas').insert({
                    usuario_id: usuarioId,
                    token: token,
                    // data atual + 24 horas
                    data_expiracao: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
                });
        });

        return token;
    }

    async deleteToken(token) {
        await knex.transaction(async (trx) => {
            await trx('recuperacao_senhas')
                .where('recuperacao_senhas.token', token)
                // remove os tokens que já expiraram e que são do mesmo usuário do token atual
                .orWhere((query) => {
                    query
                        .where('recuperacao_senhas.usuario_id', (query) => {
                            query
                                .select('sub_recuperacao_senhas.usuario_id')
                                .from('recuperacao_senhas as sub_recuperacao_senhas')
                                .where('sub_recuperacao_senhas.token', token)
                        })
                        .where('recuperacao_senhas.data_expiracao', '<', trx.fn.now());
                })
                .delete();
        });
    }

    async deleteTokenByUsuario(usuarioId, trx = null) {
        const transacao = trx ?? knex;

        await transacao.transaction(async (subTrx) => {
            await subTrx('recuperacao_senhas')
                .where('recuperacao_senhas.usuario_id', usuarioId)
                .delete();
        });
    }
}
