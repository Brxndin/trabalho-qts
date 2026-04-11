import CustomError from '../helpers/customError.js';
import customSuccess from '../helpers/customSuccess.js';
import { isCPFValido, isEmailValido, isSenhaValida } from '../helpers/customValidators.js';
import { Usuario } from '../models/Usuario.js';

export class UsuarioController {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    index = async (req, res, next) => {
        try {
            const usuarios = await this.usuarioRepository.findAll();

            return customSuccess(res, {
                data: usuarios,
            });
        } catch (error) {
            next(error);
        }
    };

    show = async (req, res, next) => {
        try {
            const { id } = req.params;
            const usuario = await this.usuarioRepository.findById(id);

            if (!usuario) {
                throw new CustomError('Usuário não encontrado.', 404);
            }

            return customSuccess(res, {
                data: usuario,
            });
        } catch (error) {
            next(error);
        }
    };

    store = async (req, res, next) => {
        try {
            const { nome, email, senha } = req.body;

            if (!nome) {
                throw new CustomError('Nome é obrigatório!', 400);
            }

            if (!email) {
                throw new CustomError('E-mail é obrigatório!', 400);
            }

            isEmailValido(email);

            if (!senha) {
                throw new CustomError('Senha é obrigatória!', 400);
            }

            isSenhaValida(senha);

            const userId = await this.usuarioRepository.create(req.body);

            return customSuccess(res, {
                message: 'Usuário criado com sucesso!',
                data: {
                    id: userId,
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
                throw new CustomError('É preciso informar o ID do usuário!', 400);
            }

            let usuario = await this.usuarioRepository.findById(id);

            if (!usuario) {
                throw new CustomError('O usuário informado não existe!', 404);
            }

            // rotas diretas de usuários servem somente para administradores
            if (!usuario.tipos.includes(Usuario.tipos.ADM)) {
                throw new CustomError('Não é possível editar usuários que não são administradores!', 400);
            }

            const { nome, email, senha, cpf } = req.body;

            if (nome !== undefined && nome === null) {
                throw new CustomError('Nome é obrigatório!', 400);
            }

            if (email !== undefined && email === null) {
                throw new CustomError('E-mail é obrigatório!', 400);
            }

            if (senha !== undefined && senha === null) {
                throw new CustomError('Senha é obrigatória!', 400);
            }

            if (email) {
                isEmailValido(email);

                usuario = await this.usuarioRepository.findByEmail(email, id);

                if (usuario) {
                    throw new CustomError('O e-mail informado não pode ser usado!', 400);
                }
            }

            if (cpf) {
                isCPFValido(cpf);

                usuario = await this.usuarioRepository.findByCPF(cpf, id);

                if (usuario) {
                    throw new CustomError('O CPF informado não pode ser usado!', 400);
                }
            }

            if (senha) {
                isSenhaValida(senha);
            }

            const linhasAfetadas = await this.usuarioRepository.update(id, req.body);

            if (linhasAfetadas === 0) {
                return customSuccess(res, {
                    message: 'Nenhum dado novo foi informado!',
                });
            }

            return customSuccess(res, {
                message: 'Usuário atualizado com sucesso!',
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            if (!id) {
                throw new CustomError('É preciso informar o ID do usuário!', 400);
            }
            
            // impede que um usuário (como o administrador) se exclua
            if (id == req.userPayload.id) {
                throw new CustomError('O usuário não pode se excluir!', 400);
            }

            const usuario = await this.usuarioRepository.findById(id);

            if (!usuario) {
                throw new CustomError('O usuário informado não existe!', 404);
            }

            if (!usuario.tipos.includes(Usuario.tipos.ADM)) {
                throw new CustomError('Não é possível excluir usuários que não são administradores!', 400);
            }

            if (usuario.tipos.length > 1) {
                throw new CustomError('Não é possível remover usuários que, além de administradores, são médicos, funcionários ou pacientes!', 400);
            }

            const linhasAfetadas = await this.usuarioRepository.delete(id);

            if (linhasAfetadas === 0) {
                throw new CustomError('O usuário informado não existe!', 404);
            }

            return customSuccess(res, {
                message: 'Usuário excluído com sucesso!',
            });
        } catch (error) {
            next(error);
        }
    };
}
