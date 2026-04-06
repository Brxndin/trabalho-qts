import CustomError from '../helpers/customError.js';
import customSuccess from '../helpers/customSuccess.js';

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
            const { nome, email, tipos, senha } = req.body;

            // necessário validar os tipos, que será um array
            // esse array servirá para definir se vai criar médicos, funcionários ou pacientes
            // ou seja, ao criar ou buscar o usuário, deverá consultar a tabela de ligação e colocar na model
            // isso faz com que a model e a tabela no banco não dependam um do outro pois não tem a exata estrutura
            if (!nome || !email || !senha) {
                throw new CustomError('Nome, E-mail e Senha são obrigatórios!', 400);
            }

            if (tipos.length <= 0) {
                throw new CustomError('Informe ao menos um Tipo para o usuário!', 400);
            }

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

            const { email, cpf } = req.body;

            if (email) {
                usuario = await this.usuarioRepository.findByEmail(email, id);

                if (usuario) {
                    throw new CustomError('O e-mail informado não pode ser usado!', 400);
                }
            }

            if (cpf) {
                usuario = await this.usuarioRepository.findByCPF(cpf, id);

                if (usuario) {
                    throw new CustomError('O CPF informado não pode ser usado!', 400);
                }
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
            if (id == req.payload.id) {
                throw new CustomError('O usuário não pode se excluir!', 400);
            }

            // to do
            // verificar regras específicas de usuário
            // exemplo: não da pra remover pacientes que tem consultas relacionadas
            // isso por que consultas não podem ser removidas
            // na verdade, o próprio usuário não pode ser removido, então apesar de ter a função, não será acessada

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
