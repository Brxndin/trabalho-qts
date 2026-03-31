import CustomError from '../helpers/customError.js';
import { enviarEmailDefinicaoSenha } from '../services/emailServices.js';

export class PacienteController {
    constructor(pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    index = async (req, res, next) => {
        try {
            const pacientes = await this.pacienteRepository.findAll();

            return res.status(200).json(pacientes);
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

            return res.status(200).json(paciente);
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

            const [pacienteId, emailCadastrado, token] = await this.pacienteRepository.create(req.body);

            // se não tem token o usuário já existe
            if (token) {
                enviarEmailDefinicaoSenha(emailCadastrado, token);
            }

            return res.status(201).json({
                id: pacienteId,
                mensagem: 'Paciente criado com sucesso!',
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
