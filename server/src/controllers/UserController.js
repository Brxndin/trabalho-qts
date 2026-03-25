import CustomError from "../../helpers/customError.js";

export class UserController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    index = async (req, res, next) => {
        try {
            const usuarios = await this.userRepository.findAll();

            return res.status(200).json(usuarios);
        } catch (error) {
            next(error);
        }
    };

    show = async (req, res, next) => {
        try {
            const { id } = req.params;
            const usuario = await this.userRepository.findById(id);

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
            const { nome, email, tipo, senha } = req.body;

            if (!nome || !email || !tipo) {
                throw new CustomError('Nome, E-mail e Tipo são obrigatórios!', 400);
            }

            const userId = await this.userRepository.create({ nome, email, tipo, senha });

            return res.status(201).json({
                id: userId,
                mensagem: 'Usuário criado com sucesso!',
            });
        } catch (error) {
            next(error);
        }
    };
}
