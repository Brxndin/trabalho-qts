import CustomError from '../helpers/customError.js';
import { Usuario } from '../models/Usuario.js';

function verifyMedico(req, res, next)
{
    try {
        // valida se o usuário logado é um adm
        if (!req.userPayload?.role.includes(Usuario.tipos.MEDICO)) {
            throw new CustomError('Somente médicos têm acesso a esse recurso!', 403);
        }

        next();
    } catch (error) {
        next(error);
    }
}

export default verifyMedico;
