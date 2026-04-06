import knex from '../config/knex.js';
import { Consulta } from '../models/Consulta.js';
import { Medico } from '../models/Medico.js';
import { Paciente } from '../models/Paciente.js';

export class ConsultaRepository {
    async findAll(idUsuario = null) {
        const consultas = await knex('consultas')
            .select(
                'consultas.*',
                'usuarios_pacientes.nome as paciente_nome',
                'usuarios_pacientes.cpf as paciente_cpf',
                'usuarios_medicos.nome as medico_nome',
                'usuarios_medicos.cpf as medico_cpf',
                'medicos.crm as medico_crm',
            )
            .join('medicos', 'medicos.id', 'consultas.medico_id')
            .join('usuarios as usuarios_medicos', 'usuarios_medicos.id', 'medicos.usuario_id')
            .join('pacientes', 'pacientes.id', 'consultas.paciente_id')
            .join('usuarios as usuarios_pacientes', 'usuarios_pacientes.id', 'pacientes.usuario_id')
            .modify((query) => {
                if (idUsuario) {
                    query
                        .where('usuarios_medicos.id', idUsuario);
                }
            });

        return consultas.map((consulta) => new Consulta({
            id: consulta.id,
            codigo: consulta.codigo,
            dataHoraAtendimento: consulta.data_hora_atendimento,
            pacienteCPF: consulta.paciente_cpf,
            pacienteNome: consulta.paciente_nome,
            medicoCPF: consulta.medico_cpf,
            medicoNome: consulta.medico_nome,
            medicoCRM: consulta.medico_crm,
            descricaoSintomas: consulta.descricao_sintomas,
            temperatura: consulta.temperatura,
            peso: consulta.peso,
            diagnosticoETratamentoSugerido: consulta.diagnostico_e_tratamento_sugerido,
            statusPagamento: consulta.status_pagamento,
        }));
    }

    async findById(id, idUsuario = null) {
        const consulta = await knex('consultas')
            .select(
                'consultas.*',
                'usuarios_pacientes.nome as paciente_nome',
                'usuarios_pacientes.cpf as paciente_cpf',
                'usuarios_medicos.nome as medico_nome',
                'usuarios_medicos.cpf as medico_cpf',
                'usuarios_medicos.crm as medico_crm',
            )
            .join('medicos', 'medicos.id', 'consultas.medico_id')
            .join('usuarios as usuarios_medicos', 'usuarios_medicos.id', 'medicos.usuario_id')
            .join('pacientes', 'pacientes.id', 'consultas.paciente_id')
            .join('usuarios as usuarios_pacientes', 'usuarios_pacientes.id', 'pacientes.usuario_id')
            .where('consultas.id', id)
            .modify((query) => {
                if (idUsuario) {
                    query
                        .where('usuarios_medicos.id', idUsuario);
                }
            })
            .first();

        if (!consulta || !consulta?.id) {
            return null;
        }

        return new Consulta({
            id: consulta.id,
            codigo: consulta.codigo,
            dataHoraAtendimento: consulta.data_hora_atendimento,
            pacienteCPF: consulta.paciente_cpf,
            pacienteNome: consulta.paciente_nome,
            medicoCPF: consulta.medico_cpf,
            medicoNome: consulta.medico_nome,
            medicoCRM: consulta.medico_crm,
            descricaoSintomas: consulta.descricao_sintomas,
            temperatura: consulta.temperatura,
            peso: consulta.peso,
            diagnosticoETratamentoSugerido: consulta.diagnostico_e_tratamento_sugerido,
            statusPagamento: consulta.status_pagamento,
        });
    }

    async findMedicoByCPF(cpf) {
        const medico = await knex('medicos')
            .select(
                'medicos.*',
                'usuarios.nome',
                'usuarios.cpf',
                'usuarios.telefone',
                'usuarios.endereco',
            )
            .join('usuarios', 'usuarios.id', 'medicos.usuario_id')
            .where('usuarios.cpf', cpf)
            .first();

        if (!medico || !medico?.id) {
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

    async findPacienteByCPF(cpf) {
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
            dataNascimento: paciente.data_nascimento,
            telefone: paciente.telefone,
        });
    }

    async create(data) {
        return await knex.transaction(async (trx) => {
            const [id] = await trx('consultas')
                .insert({
                    codigo: data.codigo,
                    data_hora_atendimento: data.dataHoraAtendimento,
                    paciente_id: data.pacienteId,
                    medico_id: data.medicoId,
                    descricao_sintomas: data.descricaoSintomas,
                    temperatura: data.temperatura,
                    peso: data.peso,
                    diagnostico_e_tratamento_sugerido: data.diagnosticoETratamentoSugerido,
                    status_pagamento: data.statusPagamento,
                });

            return id;
        });
    }
}
