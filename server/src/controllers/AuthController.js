import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import CustomError from '../helpers/customError.js';
import customSuccess from '../helpers/customSuccess.js';
import { isEmailValido, isSenhaValida } from '../helpers/customValidators.js';
import { enviarEmailDefinicaoSenha } from '../services/emailServices.js';

export class AuthController {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    login = async (req, res, next) => {
        try {
            const { email, senha } = req.body;

            if (!email) {
                throw new CustomError('O e-mail é obrigatório!');
            }

            isEmailValido(email);

            if (!senha) {
                throw new CustomError('A senha é obrigatória!');
            }

            const usuario = await this.usuarioRepository.findByEmail(email);

            if (!usuario) {
                throw new CustomError('Dados incorretos!', 400);
            }

            // a senha é salva nula ao cadastrar o usuário
            // assim, é necessário acessar o link que chega no e-mail e definir a senha
            if (!usuario.senha) {
                throw new CustomError('O usuário ainda não fez o primeiro acesso! Verifique o e-mail ou clique em "Recuperar Senha".');
            }

            // valida a senha criptografada
            const senhaValida = await bcrypt.compare(senha, usuario.senha);

            if (!usuario || !senhaValida) {
                throw new CustomError('Dados incorretos!', 400);
            }

            // aqui chamo de payload mas é o que vai ser transformado em token
            const payload = {
                id: usuario.id,
                name: usuario.nome,
                role: usuario.tipos,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            return customSuccess(res, {
                message: 'Login efetuado com sucesso!',
                data: {
                    auth: true,
                    user: payload,
                    token: token,
                },
            });
        } catch (error) {
            error.auth = false;

            next(error);
        }
    };

    definirSenha = async (req, res, next) => {
        try {
            const token = req.params.token;

            const { senha } = req.body;

            isSenhaValida(senha);

            // # to do
            // verificar sobre o dado retornado, pois não está num objeto, é só o json que vem direito do banco
            // ou seja, não retorna uma model igual os outros
            const tokenEncontrado = await this.usuarioRepository.findToken(token);

            if (!tokenEncontrado) {
                throw new CustomError('O token informado está incorreto ou não existe mais!', 400);
            }

            const dataExpiracao = dayjs(tokenEncontrado.data_expiracao);

            if (dataExpiracao.isBefore(dayjs())) {
                await this.usuarioRepository.deleteToken(token);

                throw new CustomError('O token informado já expirou!', 400);
            }

            const usuario = await this.usuarioRepository.findById(tokenEncontrado.usuario_id);

            if (!usuario) {
                throw new CustomError('Erro ao buscar o usuário!', 400);
            }

            const saltRounds = 12;
            
            const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

            await this.usuarioRepository.update(usuario.id, { senha: senhaCriptografada });

            // remove todos os tokens do usuário, mesmo que estejam ativos
            await this.usuarioRepository.deleteTokenByUsuario(usuario.id);

            return customSuccess(res, {
                message: 'Senha definida com sucesso!',
            });
        } catch (error) {
            next(error);
        }
    };

    enviarEmailTrocaSenha = async (req, res, next) => {
        try {
            const { email } = req.body;

            if (!email) {
                throw new CustomError('É preciso informar o e-mail para definição de senha!', 400);
            }

            const usuario = await this.usuarioRepository.findByEmail(email);

            if (!usuario) {
                throw new CustomError('Erro ao buscar usuário com o e-mail informado!', 400);
            }

            // cria novo token e remove os antigos do mesmo usuário
            const token = await this.usuarioRepository.createToken(usuario.id);

            const mensagemRetorno = await enviarEmailDefinicaoSenha(usuario.email, token, 'troca');

            return customSuccess(res, {
                message: mensagemRetorno
            });
        } catch (error) {
            next(error);
        }
    };
}
