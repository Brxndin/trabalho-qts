import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import CustomError from '../helpers/customError.js';

export class AuthController {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    login = async (req, res, next) => {
        try {
            const { email, senha } = req.body;

            const usuario = await this.usuarioRepository.findByEmail(email);

            if (!usuario) {
                throw new CustomError('Dados incorretos!', 500);
            }

            // a senha é salva nula ao cadastrar o usuário
            // assim, é necessário acessar o link que chega no e-mail e definir a senha
            if (!usuario.senha) {
                throw new CustomError('O usuário ainda não fez o primeiro acesso! Verifique o e-mail ou clique em "Recuperar Senha".');
            }

            // valida a senha criptografada
            const senhaValida = await bcrypt.compare(senha, usuario.senha);

            if (!usuario || !senhaValida) {
                throw new CustomError('Dados incorretos!', 500);
            }

            // aqui chamo de payload mas é o que vai ser transformado em token
            const payload = {
                id: usuario.id,
                name: usuario.nome,
                // # to do
                // verificar se vai ser um pra cada login ou se pode ser todos ao mesmo tempo
                role: usuario.tipos,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            res.status(200).json({
                message: 'Login efetuado com sucesso!',
                auth: true,
                user: payload,
                token: token
            });
        } catch (error) {
            error.auth = false;

            next(error);
        }
    };

    definirSenha = async (req, res, next) => {
        try {
            const { token, senha } = req.body;

            // # to do
            // verificar sobre isso, mas acho interessante a regra
            // verificar se vale a pena usar regex pra ver sobre maiúisculas, minúsculas, números e símbolos
            if (senha.length < 7) {
                throw new CustomError('A senha deve ter no mínimo 7 dígitos!', 400);
            }

            // # to do
            // aqui é necessário validar a data de expiração do token
            // a função removeToken aceita tanto usuarioId quanto token, então se o token venceu, é só mandar ele que rmove
            // depois, dar um throw falando que o token expirou
            // verificar se o transaction do knex funciona mesmo com o throw posterior, mas na teoria sim, pois ele termina a transaction
            const usuario = this.usuarioRepository.findByToken(token);

            if (!usuario) {
                throw new CustomError('Erro ao buscar o usuário!', 400);
            }

            const saltRounds = 10; 
            
            const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

            await this.usuarioRepository.update(usuario.id, { senha: senhaCriptografada });

            await this.usuarioRepository.removeToken(token);

            res.json({ mensagem: 'Senha definida com sucesso!' });
        } catch (error) {
            next(error);
        }
    };
}
