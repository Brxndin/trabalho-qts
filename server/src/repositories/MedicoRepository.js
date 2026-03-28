import knex from '../config/knex.js';
import { Medico } from '../models/Medico.js';

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

        if (!medico) {
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

    async create(data) {
        const [id] = await knex('medicos')
            .insert({
                crm: data.crm,
                usuario_id: data.usuarioId,
            });

        return id;
    }

    // verificar a questão do id, pois terá que enviar, após atualizar o médico, o id do usuário
    // os dois compartilham dados, por isso é necessário ter
    async update(id, data) {
        // verificar o que irá retornar
        // talvez seja interessante retornar os campos modificados
        await knex('medicos')
            .where('medicos.id', id)
            .update({
                crm: data.crm
            });
    }

    // verificar a questão do id, pois terá que enviar, após excluir o médico, o id do usuário
    // se não o usuário não será excluído
    // ele só poderá ser excluído se o médico for o último tipo dele
    async delete(id) {
        await knex('medicos')
            .where('medicos.id', id)
            .delete();
    }
}
