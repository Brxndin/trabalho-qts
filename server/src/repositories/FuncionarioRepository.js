import knex from '../config/knex.js';
import { Funcionario } from '../models/Funcionario.js';

export class FuncionarioRepository {
    async findAll() {
        const funcionarios = await knex('funcionarios')
            .select(
                'funcionarios.*',
                'usuarios.nome',
                'usuarios.cpf',
                'usuarios.endereco',
                'usuarios.telefone',
            )
            .leftJoin('usuarios', 'usuarios.id', 'funcionarios.usuario_id');

        return funcionarios.map((funcionario) => new Funcionario({
            id: funcionario.id,
            nome: funcionario.nome,
            cpf: funcionario.cpf,
            funcao: funcionario.funcao,
            telefone: funcionario.telefone,
            endereco: funcionario.endereco,
        }));
    }

    async findById(id) {
        const funcionario = await knex('funcionarios')
            .select(
                'funcionarios.*',
                'usuarios.nome',
                'usuarios.cpf',
                'usuarios.endereco',
                'usuarios.telefone',
            )
            .leftJoin('usuarios', 'usuarios.id', 'funcionarios.usuario_id')
            .where('funcionarios.id', id)
            .first();

        if (!funcionario) {
            return null;
        }

        return new Funcionario({
            id: funcionario.id,
            nome: funcionario.nome,
            cpf: funcionario.cpf,
            funcao: funcionario.funcao,
            telefone: funcionario.telefone,
            endereco: funcionario.endereco,
        });
    }

    async create(data) {
        const [id] = await knex('funcionarios')
            .insert({
                funcao: data.funcao,
                usuario_id: data.usuarioId,
            });

        return id;
    }

    // verificar a questão do id, pois terá que enviar, após atualizar o funcionário, o id do usuário
    // os dois compartilham dados, por isso é necessário ter
    async update(id, data) {
        // verificar o que irá retornar
        // talvez seja interessante retornar os campos modificados
        await knex('funcionarios')
            .where('funcionarios.id', id)
            .update({
                funcao: data.funcao
            });
    }

    // verificar a questão do id, pois terá que enviar, após excluir o funcionário, o id do usuário
    // se não o usuário não será excluído
    // ele só poderá ser excluído se o funcionário for o último tipo dele
    async delete(id) {
        await knex('funcionarios')
            .where('funcionarios.id', id)
            .delete();
    }
}
