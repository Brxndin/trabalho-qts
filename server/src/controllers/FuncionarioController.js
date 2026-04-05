import CustomError from '../helpers/customError.js';
import customSuccess from '../helpers/customSuccess.js';
import { multiConcat } from '../helpers/customValidators.js';
import { enviarEmailDefinicaoSenha } from '../services/emailServices.js';

export class FuncionarioController {
    constructor(funcionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
    }

    index = async (req, res, next) => {
        try {
            const funcionarios = await this.funcionarioRepository.findAll();

            return customSuccess(res, {
                data: funcionarios
            });
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

            return customSuccess(res, {
                data: funcionario,
            });
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

            // valida se já há funcionario com esse email e cpf
            let funcionario = await this.funcionarioRepository.findByCPF(cpf);

            if (funcionario) {
                throw new CustomError('Já existe um funcionário com o CPF informado!', 400);
            }

            funcionario = await this.funcionarioRepository.findByEmail(email);

            if (funcionario) {
                throw new CustomError('Já existe um funcionário com o E-mail informado!', 400);
            }

            const [funcionarioId, emailCadastrado, token] = await this.funcionarioRepository.create(req.body);

            let mensagemEmail = null;

            // se não tem token o usuário já existe
            if (token) {
                mensagemEmail = await enviarEmailDefinicaoSenha(emailCadastrado, token);
            }

            return customSuccess(res, {
                message: multiConcat(' ', 'Funcionário criado com sucesso!', mensagemEmail),
                data: {
                    id: funcionarioId,
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
