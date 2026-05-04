import CustomError from '../helpers/customError.js';
import { Usuario } from '../models/Usuario.js';

function verifyMedicoOrPaciente(req, res, next)
{
    try {
        // valida se o usuário logado é médico ou paciente
        if (
            !(
                req.userPayload?.role.includes(Usuario.tiposUsuario.MEDICO) ||
                req.userPayload?.role.includes(Usuario.tiposUsuario.PACIENTE)
            )
        ) {
            throw new CustomError('Somente médicos e pacientes têm acesso a esse recurso!', 403);
        }

        next();
    } catch (error) {
        next(error);
    }
}

export default verifyMedicoOrPaciente;
