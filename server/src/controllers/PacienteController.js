import CustomError from '../helpers/customError.js';
import customSuccess from '../helpers/customSuccess.js';
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

            // se não tem token o usuário já existe
            if (token) {
                enviarEmailDefinicaoSenha(emailCadastrado, token);
            }

            return customSuccess(res, {
                message: 'Paciente criado com sucesso!',
                data: {
                    id: pacienteId,
                },
                statusCode: 201,
            });
        } catch (error) {
            next(error);
        }
    };

    // # to do
    // criar a lógica pra atualizar
    update = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);


        } catch (error) {
            next(error);
        }
    };

    // # to do
    // criar a lógica pra deletar
    delete = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            
        } catch (error) {
            next(error);
        }
    };
}
