import CustomError from '../helpers/customError.js';

export class UsuarioController {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    index = async (req, res, next) => {
        try {
            const usuarios = await this.usuarioRepository.findAll();

            return res.status(200).json(usuarios);
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

            return res.status(200).json(usuario);
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

            return res.status(201).json({
                id: userId,
                mensagem: 'Usuário criado com sucesso!',
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {};

    delete = async (req, res, next) => {};
}
