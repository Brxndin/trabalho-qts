import dayjs from 'dayjs';
import CustomError from '../helpers/customError.js';
import customSuccess from '../helpers/customSuccess.js';
import { multiConcat } from '../helpers/customValidators.js';
import { enviarEmailDefinicaoSenha } from '../services/emailServices.js';

export class PacienteController {
    constructor(pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    index = async (req, res, next) => {
        try {
            const pacientes = await this.pacienteRepository.findAll();

            return customSuccess(res, {
                data: pacientes,
            });
        } catch (error) {
            next(error);
        }
    };

    show = async (req, res, next) => {
        try {
            const { id } = req.params;
            const paciente = await this.pacienteRepository.findById(id);

            if (!paciente) {
                throw new CustomError('Paciente não encontrado.', 404);
            }

            return customSuccess(res, {
                data: paciente,
            });
        } catch (error) {
            next(error);
        }
    };

    store = async (req, res, next) => {
        try {
            const { nome, email, cpf, dataNascimento } = req.body;

            if (!nome) {
                throw new CustomError('Nome é obrigatório!', 400);
            }

            if (!email) {
                throw new CustomError('E-mail é obrigatório!', 400);
            }

            if (!cpf) {
                throw new CustomError('CPF é obrigatório!', 400);
            }

            if (!dataNascimento) {
                throw new CustomError('Data de Nascimento é obrigatória!', 400);
            }

            let dataNascimentoTratada = dayjs(dataNascimento);

            if (!dataNascimentoTratada.isValid()) {
                throw new CustomError('A data de nascimento está num formato inválido!', 400);
            }

            if (dataNascimentoTratada.isAfter(dayjs())) {
                throw new CustomError('A data de nascimento não pode ser uma data futura!', 400);
            }

            if (dayjs().diff(dataNascimentoTratada, 'year') > 130) {
                throw new CustomError('A idade do paciente não pode ser superior a 130 anos!', 400);
            }

            // valida se já há paciente com esse email e cpf
            let paciente = await this.pacienteRepository.findByCPF(cpf);

            if (paciente) {
                throw new CustomError('Já existe um paciente com o CPF informado!', 400);
            }

            paciente = await this.pacienteRepository.findByEmail(email);

            if (paciente) {
                throw new CustomError('Já existe um paciente com o E-mail informado!', 400);
            }

            const [pacienteId, emailCadastrado, token] = await this.pacienteRepository.create(req.body);

            let mensagemEmail = null;

            // se não tem token o usuário já existe
            if (token) {
                mensagemEmail = await enviarEmailDefinicaoSenha(emailCadastrado, token);
            }

            return customSuccess(res, {
                message: multiConcat(' ', 'Paciente criado com sucesso!', mensagemEmail),
                data: {
                    id: pacienteId,
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
                throw new CustomError('É preciso informar o ID do paciente!', 400);
            }

            const paciente = await this.pacienteRepository.findById(id);

            if (!paciente) {
                throw new CustomError('O paciente informado não existe!', 404);
            }

            const { nome, email, cpf, dataNascimento } = req.body;

            if (nome !== undefined && nome === null) {
                throw new CustomError('Nome é obrigatório!', 400);
            }

            if (email !== undefined && email === null) {
                throw new CustomError('E-mail é obrigatório!', 400);
            }

            if (cpf !== undefined && cpf === null) {
                throw new CustomError('CPF é obrigatório!', 400);
            }

            if (dataNascimento !== undefined && dataNascimento === null) {
                throw new CustomError('Data de Nascimento é obrigatória!', 400);
            }

            let dataNascimentoTratada = dayjs(dataNascimento);

            if (!dataNascimentoTratada.isValid()) {
                throw new CustomError('A data de nascimento está num formato inválido!', 400);
            }

            if (dataNascimentoTratada.isAfter(dayjs())) {
                throw new CustomError('A data de nascimento não pode ser uma data futura!', 400);
            }

            if (dayjs().diff(dataNascimentoTratada, 'year') > 130) {
                throw new CustomError('A idade do paciente não pode ser superior a 130 anos!', 400);
            }

            let usuario = null;

            if (email) {
                usuario = await this.pacienteRepository.findUsuarioByEmail(email, id);

                if (usuario) {
                    throw new CustomError('O e-mail informado não pode ser usado!', 400);
                }
            }

            if (cpf) {
                usuario = await this.pacienteRepository.findUsuarioByCPF(cpf, id);

                if (usuario) {
                    throw new CustomError('O CPF informado não pode ser usado!', 400);
                }
            }

            const linhasAfetadas = await this.pacienteRepository.update(id, req.body);

            if (linhasAfetadas === 0) {
                return customSuccess(res, {
                    message: 'Nenhum dado novo foi informado!',
                });
            }

            return customSuccess(res, {
                message: 'Paciente atualizado com sucesso!',
            });
        } catch (error) {
            next(error);
        }
    };
}
