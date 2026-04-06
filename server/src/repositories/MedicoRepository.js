import crypto from 'crypto';
import dayjs from 'dayjs';
import knex from '../config/knex.js';
import { filtraDadosPermitidos, isEmptyObject } from '../helpers/customValidators.js';
import { Medico } from '../models/Medico.js';
import { Usuario } from '../models/Usuario.js';

export class MedicoRepository {
    async findAll() {
        const medicos = await knex('medicos')
            .select(
                'medicos.*',
                'usuarios.nome',
                'usuarios.cpf',
                'usuarios.endereco',
                'usuarios.telefone',
            )
            .leftJoin('usuarios', 'usuarios.id', 'medicos.usuario_id');

        return medicos.map((medico) => new Medico({
            id: medico.id,
            nome: medico.nome,
            cpf: medico.cpf,
            crm: medico.crm,
            telefone: medico.telefone,
            endereco: medico.endereco,
        }));
    }

    async findById(id) {
        const medico = await knex('medicos')
            .select(
                'medicos.*',
                'usuarios.nome',
                'usuarios.cpf',
                'usuarios.endereco',
                'usuarios.telefone',
            )
            .leftJoin('usuarios', 'usuarios.id', 'medicos.usuario_id')
            .where('medicos.id', id)
            .first();

        if (!medico || !medico?.id) {
            return null;
        }

        return new Medico({
            id: medico.id,
            nome: medico.nome,
            cpf: medico.cpf,
            crm: medico.crm,
            telefone: medico.telefone,
            endereco: medico.endereco,
        });
    }

    async findByCPF(cpf) {
        const medico = await knex('medicos')
            .select(
                'medicos.*',
                'usuarios.nome',
                'usuarios.cpf',
                'usuarios.telefone',
                'usuarios.endereco',
            )
            .join('usuarios', 'usuarios.id', 'medicos.usuario_id')
            .where('usuarios.cpf', cpf)
            .first();

        if (!medico || !medico?.id) {
            return null;
        }

        return new Medico({
            id: medico.id,
            nome: medico.nome,
            cpf: medico.cpf,
            crm: medico.crm,
            telefone: medico.telefone,
            endereco: medico.endereco,
        });
    }

    async findByEmail(email) {
        const medico = await knex('medicos')
            .select(
                'medicos.*',
                'usuarios.nome',
                'usuarios.cpf',
                'usuarios.telefone',
                'usuarios.endereco',
            )
            .join('usuarios', 'usuarios.id', 'medicos.usuario_id')
            .where('usuarios.email', email)
            .first();

        if (!medico || !medico?.id) {
            return null;
        }

        return new Medico({
            id: medico.id,
            nome: medico.nome,
            cpf: medico.cpf,
            crm: medico.crm,
            telefone: medico.telefone,
            endereco: medico.endereco,
        });
    }

    async findUsuarioByEmail(email, idMedicoAtual = nul) {
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
                if (idMedicoAtual) {
                    query
                        // se não for raw, acaba tratando como uma coluna
                        .join('medicos', 'medicos.id', knex.raw('?', [idMedicoAtual]))
                        .whereRaw('usuarios.id != medicos.usuario_id');
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

    async findUsuarioByCPF(cpf, idMedicoAtual = nul) {
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
                if (idMedicoAtual) {
                    query
                        // se não for raw, acaba tratando como uma coluna
                        .join('medicos', 'medicos.id', knex.raw('?', [idMedicoAtual]))
                        .whereRaw('usuarios.id != medicos.usuario_id');
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
        // verifica se já tem usuário com os dados informados
        const usuario = await this.findUsuarioByEmail(data.email);

        return await knex.transaction(async (trx) => {
            let usuarioId = null;
            let emailCadastrado = null;
            let token = null;

            if (!usuario) {
                [usuarioId] = await trx('usuarios')
                    .insert({
                        nome: data.nome,
                        email: data.email,
                        // sobre a senha, será melhor gerar um e-mail e mandar pra pessoa escolher quando ela quiser
                        // senha: data.senha,
                        cpf: data.cpf,
                        endereco: data.endereco,
                        telefone: data.telefone,
                    });

                await trx('usuarios_tipos')
                    .insert({
                        usuario_id: usuarioId,
                        tipo: Usuario.tipos.MEDICO,
                    });

                // token pra recuperação de senha ou primeiro acesso
                token = await this.createToken(usuarioId, trx);

                emailCadastrado = data.email;
            } else {
                // # to do
                // verificar para validar os dados enviados semelhante à função de update
                await trx('usuarios')
                    .where('usuarios.id', usuario.id)
                    .update({
                        nome: data.nome,
                        // # to do
                        // verificar se e-mail e cpf podem ser alterados
                        // talvez seja interessante o front bloquear a edição desses
                        // email: data.email,
                        // cpf: data.cpf,
                        endereco: data.endereco,
                        telefone: data.telefone,
                    })

                usuarioId = usuario.id;
                emailCadastrado = usuario.email;
            }

            const [medicoId] = await trx('medicos')
                .insert({
                    crm: data.crm,
                    usuario_id: usuarioId
                });

            return [medicoId, emailCadastrado, token]; 
        });
    }

    async update(id, data) {
        const dadosFiltradosUsuario = filtraDadosPermitidos(data, {
            nome: 'nome',
            email: 'email',
            // # to do
            // sobre a senha, será melhor gerar um e-mail e mandar pra pessoa escolher quando ela quiser
            // senha: 'senha',
            // cpf deverá ter validação pra não duplicar
            cpf: 'cpf',
            endereco: 'endereco',
            telefone: 'telefone',
        });

        const dadosFiltradosMedico = filtraDadosPermitidos(data, {
            crm: 'crm'
        });

        return await knex.transaction(async (trx) => {
            let linhasAfetadas = 0;
            
            if (!isEmptyObject(dadosFiltradosUsuario)) {
                linhasAfetadas += await trx('usuarios')
                    .join('medicos', 'medicos.usuario_id', 'usuarios.id')
                    .where('medicos.id', id)
                    .update(dadosFiltradosUsuario);
            }
                
            if (!isEmptyObject(dadosFiltradosMedico)) {
                linhasAfetadas += await trx('medicos')
                    .where('medicos.id', id)
                    .update(dadosFiltradosMedico);
            }

            return linhasAfetadas;
        });
    }

    // por regra não remove consultas, mas se um dia a regra da consulta cair, a função está preparada
    async delete(id) {
        return await knex.transaction(async (trx) => {
            const tiposUsuario = await trx('usuarios_tipos')
                .select('usuarios_tipos.*')
                .join('usuarios', 'usuarios.id', 'usuarios_tipos.usuario_id')
                .join('medicos', 'medicos.usuario_id', 'usuarios.id')
                .where('medicos.id', id);

            let linhasAfetadas = 0;

            // se o usuário tem mais de um tipo, continua existindo
            if (tiposUsuario.length > 1) {
                await trx('consultas')
                    .where('consultas.medico_id', id)
                    .delete();

                await trx('usuarios_tipos')
                    .where('usuarios_tipos.usuario_id', (query) => {
                        query
                            .select('medicos.usuario_id')
                            .from('medicos')
                            .where('medicos.id', id)
                    })
                    .where('usuarios_tipos.tipo', Usuario.tipos.FUNCIONARIO)
                    .delete();

                linhasAfetadas = await trx('medicos')
                    .where('medicos.id', id)
                    .delete();
            } else if (tiposUsuario.length == 1) {
                const usuarioId = tiposUsuario[0].usuario_id;

                await trx('consultas')
                    .where('consultas.medico_id', id)
                    .delete();

                linhasAfetadas = await trx('medicos')
                    .where('medicos.id', id)
                    .delete();

                await trx('recuperacao_senhas')
                    .where('recuperacao_senhas.usuario_id', usuarioId)
                    .delete();

                await trx('usuarios_tipos')
                    .where('usuarios_tipos.usuario_id', usuarioId)
                    .delete();

                await trx('usuarios')
                    .where('usuarios.id', usuarioId)
                    .delete();
            }

            return linhasAfetadas;
        });
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

    async deleteTokenByUsuario(usuarioId, trx = null) {
        const transacao = trx || knex;

        await transacao.transaction(async (subTrx) => {
            await subTrx('recuperacao_senhas')
                .where('recuperacao_senhas.usuario_id', usuarioId)
                .delete();
        });
    }
}
