import crypto from 'crypto';
import dayjs from 'dayjs';
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

        if (!funcionario || !funcionario?.id) {
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

    async findByCPF(cpf) {
        const funcionario = await knex('funcionarios')
            .select(
                'funcionarios.*',
                'usuarios.nome',
                'usuarios.cpf',
                'usuarios.telefone',
                'usuarios.endereco',
            )
            .join('usuarios', 'usuarios.id', 'funcionarios.usuario_id')
            .where('usuarios.cpf', cpf)
            .first();

        if (!funcionario || !funcionario?.id) {
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

    async findByEmail(email) {
        const funcionario = await knex('funcionarios')
            .select(
                'funcionarios.*',
                'usuarios.nome',
                'usuarios.cpf',
                'usuarios.telefone',
                'usuarios.endereco',
            )
            .join('usuarios', 'usuarios.id', 'funcionarios.usuario_id')
            .where('usuarios.email', email)
            .first();

        if (!funcionario || !funcionario?.id) {
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

    async findUsuarioByEmail(email) {
        const usuario = await knex('usuarios')
            .select(
                'usuarios.*',
                knex.raw('JSON_ARRAYAGG(usuarios_tipos.tipo) as tipos')
            )
            .join('usuarios_tipos', 'usuarios_tipos.usuario_id', 'usuarios.id')
            .where('usuarios.email', email)
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

        const [id, emailCadastrado, token] = await knex.transaction(async (trx) => {
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
                        tipo: Usuario.tipos.FUNCIONARIO,
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
                
            const [funcionarioId] = await trx('funcionarios')
                .insert({
                    funcao: data.funcao,
                    usuario_id: usuarioId
                });

            return [funcionarioId, emailCadastrado, token]; 
        });

        return [id, emailCadastrado, token];
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

        const dadosFiltradosFuncionario = filtraDadosPermitidos(data, {
            funcao: 'funcao'
        });

        await knex.transaction(async (trx) => {
            await trx('usuarios')
                .join('funcionarios', 'funcionarios.usuario_id', 'usuarios.id')
                .where('funcionarios.id', id)
                .update(dadosFiltradosUsuario);

            await trx('funcionarios')
                .where('funcionarios.id', id)
                .update(dadosFiltradosFuncionario);
        });
    }

    // # to do
    // verificar a questão do id, pois terá que enviar, após excluir o médico, o id do usuário
    // se não o usuário não será excluído
    // ele só poderá ser excluído se o médico for o último tipo dele
    async delete(id) {
        // # to do
        // aqui vai excluir o médico com certeza, mas só vai excluir o usuário se ele tiver apenas um tipo restante
        // se ele tiver mais de um tipo, deve continuar existindo
        await knex.transaction(async (trx) => {
            await trx('funcionarios')
                .where('funcionarios.id', id)
                .delete();
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
