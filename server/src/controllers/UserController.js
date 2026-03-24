export class UserController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    index = async (req, res) => {
        try {
            const usuarios = await this.userRepository.findAll();
            
            return res.status(200).json(usuarios);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro interno ao buscar usuários' });
        }
    }

    show = async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await this.userRepository.findById(id);

            if (!usuario) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado' });
            }

            return res.status(200).json(usuario);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao buscar usuário' });
        }
    }

    store = async (req, res) => {
        try {
            const { nome, email, senha } = req.body;
            
            if (!nome || !email) {
                return res.status(400).json({ erro: 'Nome e Email são obrigatórios' });
            }

            const userId = await this.userRepository.create({ nome, email, senha });

            return res.status(201).json({ 
                id: userId, 
                mensagem: 'Usuário criado com sucesso!' 
            });
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao salvar usuário' });
        }
    }
}