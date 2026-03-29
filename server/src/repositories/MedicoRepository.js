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
        const id = await knex.transaction(async (trx) => {
            const [usuarioId] = await trx('usuarios')
                .insert({
                    nome: data.nome,
                    email: data.email,
                    // sobre a senha, será melhor gerar um e-mail e mandar pra pessoa escolher quando ela quiser
                    // senha: data.senha,
                    cpf: data.cpf,
                    endereco: data.endereco,
                    telefone: data.telefone,
                });

            const [medicoId] = await trx('medicos')
                .insert({
                    crm: data.crm,
                    usuario_id: usuarioId
                });

            return medicoId; 
        });

        return id;
    }

    async update(id, data) {
        await knex.transaction(async (trx) => {
            await trx('usuarios')
                .join('medicos', 'medicos.usuario_id', 'usuarios.id')
                .where('medicos.id', id)
                .update({
                    nome: data.nome,
                    email: data.email,
                    // sobre a senha, será melhor gerar um e-mail e mandar pra pessoa escolher quando ela quiser
                    // senha: data.senha,
                    // cpf deverá ter validação pra não duplicar
                    cpf: data.cpf,
                    endereco: data.endereco,
                    telefone: data.telefone,
                });

            await trx('medicos')
                .where('medicos.id', id)
                .update({
                    crm: data.crm,
                });
        });
    }

    // verificar a questão do id, pois terá que enviar, após excluir o médico, o id do usuário
    // se não o usuário não será excluído
    // ele só poderá ser excluído se o médico for o último tipo dele
    async delete(id) {
        // aqui vai excluir o médico com certeza, mas só vai excluir o usuário se ele tiver apenas um tipo restante
        // se ele tiver mais de um tipo, deve continuar existindo
        await knex.transaction(async (trx) => {
            await trx('medicos')
                .where('medicos.id', id)
                .delete();
        });
    }
}
