import CustomError from '../helpers/customError.js';

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

            const userId = await this.funcionarioRepository.create(req.body);

            return res.status(201).json({
                id: userId,
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
