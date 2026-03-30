import 'dotenv/config';
import jwt from 'jsonwebtoken';
import CustomError from '../helpers/customError.js';

function verifyJWT(req, res, next)
{
    // cabeçalho authorization
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        // aqui usa status específico para que o front capture o erro
        throw new CustomError('É preciso informar o token de acesso!', 401);
    } else {
        // aqui substitui pois o header vem em texto puro
        const token = authHeader.replace('Bearer ', '');

        jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
            if (error) {
                // aqui usa status específico para que o front capture o erro
                throw new CustomError(`Falha ao autenticar o token: ${error.message}`, 401);
            }

            // aqui pega as informações do token que foram salvas no login
            // é usado posteriormente quando precisa saber se o usuário é adm
            req.userPayload = payload;
        });

        next();
    }
}

export default verifyJWT;
