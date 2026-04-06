import knex from '../config/knex.js';
import { Consulta } from '../models/Consulta.js';

export class ConsultaRepository {
    async findAll() {
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
            .join('usuarios as usuarios_pacientes', 'usuarios_pacientes.id', 'pacientes.usuario_id');

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

    async findById(id) {
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
