import CustomError from '../helpers/customError.js';

export class ConsultaController {
    constructor(consultaRepository) {
        this.consultaRepository = consultaRepository;
    }

    index = async (req, res, next) => {
        try {
            const consultas = await this.consultaRepository.findAll();

            return res.status(200).json(consultas);
        } catch (error) {
            next(error);
        }
    };

    show = async (req, res, next) => {
        try {
            const { id } = req.params;
            const consulta = await this.consultaRepository.findById(id);

            if (!consulta) {
                throw new CustomError('Consulta não encontrada.', 404);
            }

            return res.status(200).json(consulta);
        } catch (error) {
            next(error);
        }
    };

    store = async (req, res, next) => {
        try {
            const { nome, email, tipos, senha } = req.body;

            // # to do
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

            const userId = await this.consultaRepository.create(req.body);

            return res.status(201).json({
                id: userId,
                mensagem: 'Consulta criada com sucesso!',
            });
        } catch (error) {
            next(error);
        }
    };
}
