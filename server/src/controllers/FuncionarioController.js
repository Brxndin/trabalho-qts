import CustomError from '../helpers/customError.js';
import { enviarEmailDefinicaoSenha } from '../services/emailServices.js';

export class FuncionarioController {
    constructor(funcionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
    }

    index = async (req, res, next) => {
        try {
            const funcionarios = await this.funcionarioRepository.findAll();

            return res.status(200).json(funcionarios);
        } catch (error) {
            next(error);
        }
    };

    show = async (req, res, next) => {
        try {
            const { id } = req.params;
            const funcionario = await this.funcionarioRepository.findById(id);

            if (!funcionario) {
                throw new CustomError('Funcionário não encontrado.', 404);
            }

            return res.status(200).json(funcionario);
        } catch (error) {
            next(error);
        }
    };

    store = async (req, res, next) => {
        try {
            const { nome, email, cpf, funcao } = req.body;

            if (!nome || !email || !cpf || !funcao) {
                throw new CustomError('Nome, E-mail, CPF e Função são obrigatórios!', 400);
            }

            const [funcionarioId, emailCadastrado, token] = await this.funcionarioRepository.create(req.body);

            enviarEmailDefinicaoSenha(emailCadastrado, token);

            return res.status(201).json({
                id: funcionarioId,
                mensagem: 'Funcionário criado com sucesso!',
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);


        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            
        } catch (error) {
            next(error);
        }
    };
}
