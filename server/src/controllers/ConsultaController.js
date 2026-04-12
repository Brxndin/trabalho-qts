import dayjs from 'dayjs';
import CustomError from '../helpers/customError.js';
import customSuccess from '../helpers/customSuccess.js';
import { isCPFValido, isEmptyObject } from '../helpers/customValidators.js';

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

            if (isEmptyObject(consulta)) {
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
                codigo,
                pacienteCPF,
                medicoCPF,
                peso,
                temperatura,
                descricaoSintomas,
                diagnosticoETratamentoSugerido,
                statusPagamento
            } = req.body;

            // to do
            // gerar o código no momento de salvar o registro
            // importante validar pra ser único
            // verificar se deve ser uma hash, algo baseado em datas ou se é sequencial através do banco de dados 
            
            // if (!codigo) {
            //     throw new CustomError('Código é obrigatório!', 400);
            // }

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

            if (isEmptyObject(medico)) {
                throw new CustomError('O médico informado não foi encontrado!', 404);
            }

            const paciente = await this.consultaRepository.findPacienteByCPF(pacienteCPF);

            if (isEmptyObject(paciente)) {
                throw new CustomError('O paciente informado não foi encontrado!', 404);
            }

            req.body.medicoId = medico.id;
            req.body.pacienteId = paciente.id;
            req.body.dataHoraAtendimento = dayjs().format('YYYY-MM-DD HH:mm:ss');

            // to do
            // criar função para gerar
            // req.body.codigo = null;

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
