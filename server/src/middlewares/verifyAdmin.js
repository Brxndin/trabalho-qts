import CustomError from '../helpers/customError.js';
import { Usuario } from '../models/Usuario.js';

function verifyAdmin(req, res, next)
{
    try {
        // valida se o usuário logado é um adm
        if (!req.userPayload?.role.includes(Usuario.tiposUsuario.ADM)) {
            throw new CustomError('Somente administradores têm acesso a esse recurso!', 403);
        }

        next();
    } catch (error) {
        next(error);
    }
}

export default verifyAdmin;
