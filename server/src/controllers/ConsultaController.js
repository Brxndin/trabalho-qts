import dayjs from 'dayjs';
import CustomError from '../helpers/customError.js';
import customSuccess from '../helpers/customSuccess.js';

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
                codigo,
                dataHoraAtendimento,
                pacienteCPF,
                medicoCPF,
                descricaoSintomas,
                diagnosticoETratamentoSugerido,
                statusPagamento
            } = req.body;

            // to do
            // verificar sobre código, como vai funcionar, se gera no momento que entra na tela, no momento do salvamento
            // importante ver que, se outra pessoa abrir a mesma tela, há uma chance pequena de o código gerado ser igual e, quando for salvar vai dar erro de repetição

            // verificar para criar um helper que liste os obrigatórios em formato singular ao invés de todos juntos
            if (!codigo || !dataHoraAtendimento || !medicoCPF || !pacienteCPF || !descricaoSintomas || !diagnosticoETratamentoSugerido || !statusPagamento) {
                throw new CustomError('Código, Data e Hora de Atendimento, CPF do Médico, CPF do Paciente, Descrição dos Sintomas, Diagnóstico e Tratamento Sugerido e Status do Pagamento são obrigatórios!', 400);
            }
            
            if (medicoCPF == pacienteCPF) {
                throw new CustomError('O médico e o paciente não podem ser a mesma pessoa!', 400);
            }

            let dataHoraAtendimentoTratada = dayjs(dataHoraAtendimento);

            if (!dataHoraAtendimentoTratada.isValid()) {
                throw new CustomError('A data e hora de atendimento está num formato inválido!', 400);
            }

            const medico = this.consultaRepository.findMedicoByCPF(medicoCPF);

            if (!medico) {
                throw new CustomError('O médico informado não foi encontrado!', 404);
            }

            const paciente = this.consultaRepository.findPacienteByCPF(pacienteCPF);

            if (!paciente) {
                throw new CustomError('O paciente informado não foi encontrado!', 404);
            }

            req.body.medicoId = medico.id;
            req.body.pacienteId = paciente.id;

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
