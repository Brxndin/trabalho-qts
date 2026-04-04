import CustomError from '../helpers/customError.js';
import { enviarEmailDefinicaoSenha } from '../services/emailServices.js';

export class MedicoController {
    constructor(medicoRepository) {
        this.medicoRepository = medicoRepository;
    }

    index = async (req, res, next) => {
        try {
            const medicos = await this.medicoRepository.findAll();

            return res.status(200).json(medicos);
        } catch (error) {
            next(error);
        }
    };

    show = async (req, res, next) => {
        try {
            const { id } = req.params;
            const medico = await this.medicoRepository.findById(id);

            if (!medico) {
                throw new CustomError('Médico não encontrado.', 404);
            }

            return res.status(200).json(medico);
        } catch (error) {
            next(error);
        }
    };

    store = async (req, res, next) => {
        try {
            const { nome, email, cpf, crm } = req.body;

            if (!nome || !email || !cpf || !crm) {
                throw new CustomError('Nome, E-mail, CPF e CRM são obrigatórios!', 400);
            }

            // valida se já há médico com esse email e cpf
            let medico = await this.medicoRepository.findByCPF(cpf);

            if (medico) {
                throw new CustomError('Já existe um médico com o CPF informado!', 400);
            }

            medico = await this.medicoRepository.findByEmail(email);

            if (medico) {
                throw new CustomError('Já existe um médico com o E-mail informado!', 400);
            }

            const [medicoId, emailCadastrado, token] = await this.medicoRepository.create(req.body);

            // se não tem token o usuário já existe
            if (token) {
                enviarEmailDefinicaoSenha(emailCadastrado, token);
            }

            return res.status(201).json({
                message: 'Médico criado com sucesso!',
                data: {
                    id: medicoId,
                },
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
