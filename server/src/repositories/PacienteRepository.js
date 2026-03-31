import dayjs from 'dayjs';
import knex from '../config/knex.js';
import { filtraDadosPermitidos } from '../helpers/customValidators.js';
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
            dataNascimento: paciente.data_nascimento,
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

        if (!paciente) {
            return null;
        }

        return new Paciente({
            id: paciente.id,
            nome: paciente.nome,
            cpf: paciente.cpf,
            dataNascimento: paciente.data_nascimento,
            telefone: paciente.telefone,
        });
    }

    async findUsuarioByCPF(cpf) {
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

    async create(data) {
        const id = await knex.transaction(async (trx) => {
            const [usuarioId] = await trx('usuarios')
                .insert({
                    nome: data.nome,
                    email: data.email,
                    // sobre a senha, será melhor gerar um e-mail e mandar pra pessoa escolher quando ela quiser
                    // senha: data.senha,
                    cpf: data.cpf,
                    telefone: data.telefone,
                });

            const [medicoId] = await trx('pacientes')
                .insert({
                    data_nascimento: data.dataNascimento,
                    usuario_id: usuarioId
                });

            return medicoId; 
        });

        return id;
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
            telefone: 'telefone'
        });

        const dadosFiltradosPaciente = filtraDadosPermitidos(data, {
            dataNascimento: 'data_nascimento'
        });

        await knex.transaction(async (trx) => {
            if (Object.keys(dadosFiltradosUsuario).length > 0) {
                await trx('usuarios')
                    .join('pacientes', 'pacientes.usuario_id', 'usuarios.id')
                    .where('pacientes.id', id)
                    .update(dadosFiltradosUsuario);
            }

            if (Object.keys(dadosFiltradosPaciente).length > 0) {
                await trx('pacientes')
                    .where('pacientes.id', id)
                    .update(dadosFiltradosPaciente);
            }
        });
    }

    // verificar a questão do id, pois terá que enviar, após excluir o paciente, o id do usuário
    // se não o usuário não será excluído
    // ele só poderá ser excluído se o paciente for o último tipo dele
    async delete(id) {
        // aqui vai excluir o paciente com certeza, mas só vai excluir o usuário se ele tiver apenas um tipo restante
        // se ele tiver mais de um tipo, deve continuar existindo
        await knex.transaction(async (trx) => {
            await trx('pacientes')
                .where('pacientes.id', id)
                .delete();
        });
    }
}
