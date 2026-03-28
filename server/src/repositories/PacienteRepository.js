import knex from '../config/knex.js';
import { Paciente } from '../models/Paciente.js';

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

    async create(data) {
        const [id] = await knex('pacientes')
            .insert({
                data_nascimento: data.dataNascimento,
                usuario_id: data.usuarioId,
            });

        return id;
    }

    // verificar a questão do id, pois terá que enviar, após atualizar o paciente, o id do usuário
    // os dois compartilham dados, por isso é necessário ter
    async update(id, data) {
        // verificar o que irá retornar
        // talvez seja interessante retornar os campos modificados
        await knex('pacientes')
            .where('pacientes.id', id)
            .update({
                data_nascimento: data.dataNascimento
            });
    }

    // verificar a questão do id, pois terá que enviar, após excluir o paciente, o id do usuário
    // se não o usuário não será excluído
    // ele só poderá ser excluído se o paciente for o último tipo dele
    async delete(id) {
        await knex('pacientes')
            .where('pacientes.id', id)
            .delete();
    }
}
