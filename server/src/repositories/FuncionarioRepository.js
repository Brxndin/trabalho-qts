import knex from '../config/knex.js';
import { filtraDadosPermitidos } from '../helpers/customValidators.js';
import { Funcionario } from '../models/Funcionario.js';
import { Usuario } from '../models/Usuario.js';

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
                    endereco: data.endereco,
                    telefone: data.telefone,
                });

            const [medicoId] = await trx('funcionarios')
                .insert({
                    funcao: data.funcao,
                    usuario_id: usuarioId
                });

            return medicoId; 
        });

        return id;
    }

    async update(id, data) {
        await knex.transaction(async (trx) => {
            await trx('usuarios')
                .join('funcionarios', 'funcionarios.usuario_id', 'usuarios.id')
                .where('funcionarios.id', id)
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

            await trx('funcionarios')
                .where('funcionarios.id', id)
                .update({
                    funcao: data.funcao,
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
            await trx('funcionarios')
                .where('funcionarios.id', id)
                .delete();
        });
    }
}
