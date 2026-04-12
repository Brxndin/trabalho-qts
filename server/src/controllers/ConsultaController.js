import dayjs from 'dayjs';
import CustomError from '../helpers/customError.js';
import customSuccess from '../helpers/customSuccess.js';
import { isCPFValido } from '../helpers/customValidators.js';

export class ConsultaController {
    constructor(consultaRepository) {
        this.consultaRepository = consultaRepository;
    }

    index = async (req, res, next) => {
        try {
            // o médico logado só pode ver as próprias consultas
            const consultas = await this.consultaRepository.findAll(req.userPayload.id);

            return customSuccess(res, {
                data: consultas
            });
        } catch (error) {
            next(error);
        }
    };

    show = async (req, res, next) => {
        try {
            const { id } = req.params;

            // o médico logado só pode ver as próprias consultas
            const consulta = await this.consultaRepository.findById(id, req.userPayload.id);

            if (!consulta) {
                throw new CustomError('Consulta não encontrada.', 404);
            }

            return customSuccess(res, {
                data: consulta,
            });
        } catch (error) {
            next(error);
        }
    };

    store = async (req, res, next) => {
        try {
            const {
                pacienteCPF,
                medicoCPF,
                peso,
                temperatura,
                descricaoSintomas,
                diagnosticoETratamentoSugerido,
                statusPagamento
            } = req.body;

            if (!medicoCPF) {
                throw new CustomError('CPF do Médico é obrigatório!', 400);
            }

            isCPFValido(medicoCPF);

            if (!pacienteCPF) {
                throw new CustomError('CPF do Paciente é obrigatório!', 400);
            }

            isCPFValido(pacienteCPF);

            if (!peso) {
                throw new CustomError('Peso é obrigatório!', 400);
            }

            if (!temperatura) {
                throw new CustomError('Temperatura é obrigatória!', 400);
            }

            if (!descricaoSintomas) {
                throw new CustomError('Descrição dos Sintomas é obrigatória!', 400);
            }

            if (!diagnosticoETratamentoSugerido) {
                throw new CustomError('Diagnóstico e Tratamento Sugerido são obrigatórios!', 400);
            }

            if (!statusPagamento) {
                throw new CustomError('Status do Pagamento é obrigatório!', 400);
            }
            
            if (medicoCPF == pacienteCPF) {
                throw new CustomError('O médico e o paciente não podem ser a mesma pessoa!', 400);
            }

            const medico = await this.consultaRepository.findMedicoByCPF(medicoCPF);

            if (!medico) {
                throw new CustomError('O médico informado não foi encontrado!', 404);
            }

            const paciente = await this.consultaRepository.findPacienteByCPF(pacienteCPF);

            if (!paciente) {
                throw new CustomError('O paciente informado não foi encontrado!', 404);
            }

            req.body.medicoId = medico.id;
            req.body.pacienteId = paciente.id;
            req.body.dataHoraAtendimento = dayjs().format('YYYY-MM-DD HH:mm:ss');

            const codigo = await this.consultaRepository.findMaiorCodigo();

            // adiciona 1 pra aumentar sequência pois não tem regra no banco de dados
            req.body.codigo = codigo + 1;

            const consultaId = await this.consultaRepository.create(req.body);

            return customSuccess(res, {
                message: 'Consulta criada com sucesso!',
                data: {
                    id: consultaId,
                },
                statusCode: 201,
            });
        } catch (error) {
            next(error);
        }
    };
}
