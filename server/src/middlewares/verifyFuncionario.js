import CustomError from '../helpers/customError.js';
import { Usuario } from '../models/Usuario.js';

function verifyFuncionario(req, res, next)
{
    try {
        // valida se o usuário logado é um adm
        if (!req.userPayload?.role.includes(Usuario.tipos.FUNCIONARIO)) {
            throw new CustomError('Somente funcionários têm acesso a esse recurso!', 403);
        }

        next();
    } catch (error) {
        next(error);
    }
}

export default verifyFuncionario;
