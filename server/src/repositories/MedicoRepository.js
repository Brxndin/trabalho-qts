import dayjs from 'dayjs';
import knex from '../config/knex.js';
import { Medico } from '../models/Medico.js';
import { Usuario } from '../models/Usuario.js';
import { filtraDadosPermitidos } from '../helpers/customValidators.js';

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
        // # to do
        // deve validar se já não existe médico pro usuário informado
        // isso garante que não duplique
        const usuario = this.findUsuarioByCPF(data.cpf);

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
                        tipo: Usuario.tipos.MEDICO,
                    });

                // token pra recuperação de senha ou primeiro acesso
                token = crypto.randomBytes(32).toString('hex');
                
                await trx('recuperacao_senhas').insert({
                    usuario_id: usuarioId,
                    token: token,
                    // data atual + 24 horas
                    data_expiracao: dayjs().add(1, 'day').format(),
                });

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

            // verificar forma de retornar o email também
            return [medicoId, emailCadastrado, token]; 
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

        const dadosFiltradosMedico = filtraDadosPermitidos(data, {
            crm: 'crm'
        });

        await knex.transaction(async (trx) => {
            await trx('usuarios')
                .join('medicos', 'medicos.usuario_id', 'usuarios.id')
                .where('medicos.id', id)
                .update(dadosFiltradosUsuario);

            await trx('medicos')
                .where('medicos.id', id)
                .update(dadosFiltradosMedico);
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
            await trx('medicos')
                .where('medicos.id', id)
                .delete();
        });
    }
}
