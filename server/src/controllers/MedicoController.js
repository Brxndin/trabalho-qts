import CustomError from '../helpers/customError.js';
import customSuccess from '../helpers/customSuccess.js';
import { isCPFValido, isEmailValido, isEmptyObject, multiConcat } from '../helpers/customValidators.js';
import { enviarEmailDefinicaoSenha } from '../services/emailServices.js';

export class MedicoController {
    constructor(medicoRepository) {
        this.medicoRepository = medicoRepository;
    }

    index = async (req, res, next) => {
        try {
            const medicos = await this.medicoRepository.findAll();

            return customSuccess(res, {
                data: medicos,
            });
        } catch (error) {
            next(error);
        }
    };

    show = async (req, res, next) => {
        try {
            const { id } = req.params;
            const medico = await this.medicoRepository.findById(id);

            if (isEmptyObject(medico)) {
                throw new CustomError('Médico não encontrado.', 404);
            }

            return customSuccess(res, {
                data: medico,
            });
        } catch (error) {
            next(error);
        }
    };

    store = async (req, res, next) => {
        try {
            const { nome, email, cpf, crm } = req.body;

            if (!nome) {
                throw new CustomError('Nome é obrigatório!', 400);
            }
            
            if (!email) {
                throw new CustomError('E-mail é obrigatório!', 400);
            }

            isEmailValido(email);

            if (!cpf) {
                throw new CustomError('CPF é obrigatório!', 400);
            }

            isCPFValido(cpf);

            if (!crm) {
                throw new CustomError('CRM é obrigatório!', 400);
            }

            // valida se já há médico com esse email e cpf
            let medico = await this.medicoRepository.findByCPF(cpf);

            if (!isEmptyObject(medico)) {
                throw new CustomError('Já existe um médico com o CPF informado!', 400);
            }

            medico = await this.medicoRepository.findByEmail(email);

            if (!isEmptyObject(medico)) {
                throw new CustomError('Já existe um médico com o E-mail informado!', 400);
            }

            const [medicoId, emailCadastrado, token] = await this.medicoRepository.create(req.body);

            let mensagemEmail = null;

            // se não tem token o usuário já existe
            if (token) {
                mensagemEmail = await enviarEmailDefinicaoSenha(emailCadastrado, token);
            }

            return customSuccess(res, {
                message: multiConcat(' ', 'Médico criado com sucesso!', mensagemEmail),
                data: {
                    id: medicoId,
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
                throw new CustomError('É preciso informar o ID do médico!', 400);
            }

            const medico = await this.medicoRepository.findById(id);

            if (isEmptyObject(medico)) {
                throw new CustomError('O médico informado não existe!', 404);
            }

            const { nome, email, cpf, crm } = req.body;

            if (nome !== undefined && nome === null) {
                throw new CustomError('Nome é obrigatório!', 400);
            }
            
            if (email !== undefined && email === null) {
                throw new CustomError('E-mail é obrigatório!', 400);
            }

            if (cpf !== undefined && cpf === null) {
                throw new CustomError('CPF é obrigatório!', 400);
            }

            if (crm !== undefined && crm === null) {
                throw new CustomError('CRM é obrigatório!', 400);
            }

            let usuario = null;

            if (email) {
                isEmailValido(email);

                usuario = await this.medicoRepository.findUsuarioByEmail(email, id);

                if (!isEmptyObject(usuario)) {
                    throw new CustomError('O e-mail informado não pode ser usado!', 400);
                }
            }

            if (cpf) {
                isCPFValido(cpf);

                usuario = await this.medicoRepository.findUsuarioByCPF(cpf, id);

                if (!isEmptyObject(usuario)) {
                    throw new CustomError('O CPF informado não pode ser usado!', 400);
                }
            }

            const linhasAfetadas = await this.medicoRepository.update(id, req.body);

            if (linhasAfetadas === 0) {
                return customSuccess(res, {
                    message: 'Nenhum dado novo foi informado!',
                });
            }

            return customSuccess(res, {
                message: 'Médico atualizado com sucesso!',
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            if (!id) {
                throw new CustomError('É preciso informar o ID do médico!', 400);
            }

            const consultas = await this.medicoRepository.findConsultasByMedicoID(id);

            if (consultas.length > 0) {
                throw new CustomError('O médico não pode ser removido pois tem consultas vinculadas!', 400);
            }

            const linhasAfetadas = await this.medicoRepository.delete(id);

            if (linhasAfetadas === 0) {
                throw new CustomError('O médico informado não existe!', 404);
            }

            return customSuccess(res, {
                message: 'Médico excluído com sucesso!',
            });
        } catch (error) {
            next(error);
        }
    };
}
