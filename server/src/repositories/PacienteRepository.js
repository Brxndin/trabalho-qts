import crypto from 'crypto';
import dayjs from 'dayjs';
import knex from '../config/knex.js';
import { filtraDadosPermitidos, isEmptyObject } from '../helpers/customValidators.js';
import { Paciente } from '../models/Paciente.js';
import { Usuario } from '../models/Usuario.js';

export class PacienteRepository {
    async findAll() {
        const pacientes = await knex('pacientes')
            .select(
                'pacientes.*',
                'usuarios.nome',
                'usuarios.cpf',
                'usuarios.telefone',
            )
            .leftJoin('usuarios', 'usuarios.id', 'pacientes.usuario_id');

        return pacientes.map((paciente) => new Paciente({
            id: paciente.id,
            nome: paciente.nome,
            cpf: paciente.cpf,
            dataNascimento: dayjs(paciente.data_nascimento).format('YYYY-MM-DD'),
            telefone: paciente.telefone,
        }));
    }

    async findById(id) {
        const paciente = await knex('pacientes')
            .select(
                'pacientes.*',
                'usuarios.nome',
                'usuarios.cpf',
                'usuarios.telefone',
            )
            .leftJoin('usuarios', 'usuarios.id', 'pacientes.usuario_id')
            .where('pacientes.id', id)
            .first();

        if (!paciente || !paciente?.id) {
            return null;
        }

        return new Paciente({
            id: paciente.id,
            nome: paciente.nome,
            cpf: paciente.cpf,
            dataNascimento: dayjs(paciente.data_nascimento).format('YYYY-MM-DD'),
            telefone: paciente.telefone,
        });
    }

    async findByCPF(cpf) {
        const paciente = await knex('pacientes')
            .select(
                'pacientes.*',
                'usuarios.nome',
                'usuarios.cpf',
                'usuarios.telefone',
            )
            .join('usuarios', 'usuarios.id', 'pacientes.usuario_id')
            .where('usuarios.cpf', cpf)
            .first();

        if (!paciente || !paciente?.id) {
            return null;
        }

        return new Paciente({
            id: paciente.id,
            nome: paciente.nome,
            cpf: paciente.cpf,
            dataNascimento: dayjs(paciente.data_nascimento).format('YYYY-MM-DD'),
            telefone: paciente.telefone,
        });
    }

    async findByEmail(email) {
        const paciente = await knex('pacientes')
            .select(
                'pacientes.*',
                'usuarios.nome',
                'usuarios.cpf',
                'usuarios.telefone',
            )
            .join('usuarios', 'usuarios.id', 'pacientes.usuario_id')
            .where('usuarios.email', email)
            .first();

        if (!paciente || !paciente?.id) {
            return null;
        }

        return new Paciente({
            id: paciente.id,
            nome: paciente.nome,
            cpf: paciente.cpf,
            dataNascimento: dayjs(paciente.data_nascimento).format('YYYY-MM-DD'),
            telefone: paciente.telefone,
        });
    }

    async findUsuarioByEmail(email, idPacienteAtual = null) {
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
                if (idPacienteAtual) {
                    query
                        // se não for raw, acaba tratando como uma coluna
                        .join('pacientes', 'pacientes.id', knex.raw('?', [idPacienteAtual]))
                        .whereRaw('usuarios.id != pacientes.usuario_id');
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

    async findUsuarioByCPF(cpf, idPacienteAtual = null) {
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
                if (idPacienteAtual) {
                    query
                        // se não for raw, acaba tratando como uma coluna
                        .join('pacientes', 'pacientes.id', knex.raw('?', [idPacienteAtual]))
                        .whereRaw('usuarios.id != pacientes.usuario_id');
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
                        // é gerado um e-mail e a pessoa escolhe quando acessar o link
                        // senha: data.senha,
                        cpf: data.cpf,
                        telefone: data.telefone,
                    });

                await trx('usuarios_tipos')
                    .insert({
                        usuario_id: usuarioId,
                        tipo: Usuario.tipos.PACIENTE,
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

            const [pacienteId] = await trx('pacientes')
                .insert({
                    data_nascimento: data.dataNascimento,
                    usuario_id: usuarioId
                });

            return [pacienteId, emailCadastrado, token]; 
        });
    }

    async update(id, data) {
        const dadosFiltradosUsuario = filtraDadosPermitidos(data, {
            nome: 'nome',
            email: 'email',
            // para trocar a senha, é necessário usar a opção "Esqueci a senha"
            // senha: 'senha',
            cpf: 'cpf',
            telefone: 'telefone'
        });

        const dadosFiltradosPaciente = filtraDadosPermitidos(data, {
            dataNascimento: 'data_nascimento'
        });

        return await knex.transaction(async (trx) => {
            let linhasAfetadas = 0;
            
            if (!isEmptyObject(dadosFiltradosUsuario)) {
                linhasAfetadas += await trx('usuarios')
                    .join('pacientes', 'pacientes.usuario_id', 'usuarios.id')
                    .where('pacientes.id', id)
                    .update(dadosFiltradosUsuario);
            }
                
            if (!isEmptyObject(dadosFiltradosPaciente)) {
                linhasAfetadas += await trx('pacientes')
                    .where('pacientes.id', id)
                    .update(dadosFiltradosPaciente);
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
        const transacao = trx ?? knex;

        await transacao.transaction(async (subTrx) => {
            await subTrx('recuperacao_senhas')
                .where('recuperacao_senhas.usuario_id', usuarioId)
                .delete();
        });
    }
}
