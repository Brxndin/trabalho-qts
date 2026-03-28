import knex from '../config/knex.js';
import { Usuario } from '../models/Usuario.js';

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
        // verificar o que irá retornar
        // talvez seja interessante retornar os campos modificados
        await knex('usuarios')
            .where('usuarios.id', id)
            .update({
                nome: data.nome,
                email: data.email,
                senha: data.senha,
                cpf: data.cpf,
                endereco: data.endereco,
                telefone: data.telefone,
            });
    }

    // verificar pois só pode excluir o usuário se não tiver mais relações
    // por exemplo: um usuário pode ser médico e paciente
    // se eu excluir paciente, o usuário deve continuar existindo pois é médico também
    // nesse caso, só vai excluir na tabela paciente E na tabela de tipos o tipo paciente pro usuário em questão
    async delete(id) {
        await knex('usuarios_tipos')
            .where('usuarios_tipos.usuario_id', id)
            .delete();

        await knex('usuarios')
            .where('usuarios.id', id)
            .delete();
    }
}
