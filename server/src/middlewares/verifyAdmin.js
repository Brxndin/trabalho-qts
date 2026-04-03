import CustomError from '../helpers/customError.js';
import { Usuario } from '../models/Usuario.js';

function verifyAdmin(req, res, next)
{
    // valida se o usuário logado é um adm
    if (!req.userPayload?.role.includes(Usuario.tipos.ADM)) {
        throw new CustomError('Somente administradores têm acesso a esse recurso!', 403);
    }

    next();
}

export default verifyAdmin;
