import CustomError from '../helpers/customError.js';
import customSuccess from '../helpers/customSuccess.js';
import { multiConcat } from '../helpers/customValidators.js';
import { enviarEmailDefinicaoSenha } from '../services/emailServices.js';

export class PacienteController {
    constructor(pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    index = async (req, res, next) => {
        try {
            const pacientes = await this.pacienteRepository.findAll();

            return customSuccess(res, {
                data: pacientes,
            });
        } catch (error) {
            next(error);
        }
    };

    show = async (req, res, next) => {
        try {
            const { id } = req.params;
            const paciente = await this.pacienteRepository.findById(id);

            if (!paciente) {
                throw new CustomError('Paciente não encontrado.', 404);
            }

            return customSuccess(res, {
                data: paciente,
            });
        } catch (error) {
            next(error);
        }
    };

    store = async (req, res, next) => {
        try {
            const { nome, email, cpf, dataNascimento } = req.body;

            if (!nome || !email || !cpf || !dataNascimento) {
                throw new CustomError('Nome, E-mail, CPF e Data de Nascimento são obrigatórios!', 400);
            }

            // valida se já há paciente com esse email e cpf
            let paciente = await this.pacienteRepository.findByCPF(cpf);

            if (paciente) {
                throw new CustomError('Já existe um paciente com o CPF informado!', 400);
            }

            paciente = await this.pacienteRepository.findByEmail(email);

            if (paciente) {
                throw new CustomError('Já existe um paciente com o E-mail informado!', 400);
            }

            const [pacienteId, emailCadastrado, token] = await this.pacienteRepository.create(req.body);

            let mensagemEmail = null;

            // se não tem token o usuário já existe
            if (token) {
                mensagemEmail = await enviarEmailDefinicaoSenha(emailCadastrado, token);
            }

            return customSuccess(res, {
                message: multiConcat(' ', 'Paciente criado com sucesso!', mensagemEmail),
                data: {
                    id: pacienteId,
                },
                statusCode: 201,
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            if (!id) {
                throw new CustomError('É preciso informar o ID do paciente!', 400);
            }

            const paciente = await this.pacienteRepository.findById(id);

            // to do
            // verificar regras específicas de pacientes (se tiver alguma)
            if (!paciente) {
                throw new CustomError('O paciente informado não existe!', 404);
            }

            const linhasAfetadas = await this.pacienteRepository.update(id, req.body);

            if (linhasAfetadas === 0) {
                return customSuccess(res, {
                    message: 'Nenhum dado novo foi informado!',
                });
            }

            return customSuccess(res, {
                message: 'Paciente atualizado com sucesso!',
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            if (!id) {
                throw new CustomError('É preciso informar o ID do paciente!', 400);
            }

            // to do
            // verificar regras específicas de paciente
            // exemplo: não da pra remover pacientes que tem consultas relacionadas
            // isso por que consultas não podem ser removidas
            // na verdade, o próprio paciente não pode ser removido, então apesar de ter a função, não será acessada

            const linhasAfetadas = await this.pacienteRepository.delete(id);

            if (linhasAfetadas === 0) {
                throw new CustomError('O paciente informado não existe!', 404);
            }

            return customSuccess(res, {
                message: 'Paciente excluído com sucesso!',
            });
        } catch (error) {
            next(error);
        }
    };
}
