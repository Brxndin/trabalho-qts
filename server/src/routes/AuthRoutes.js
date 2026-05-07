import express from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '../controllers/AuthController.js';
import { UsuarioRepository } from '../repositories/UsuarioRepository.js';

const router = express.Router();

// limita o número de requisições por IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message: 'Muitas requisições realizadas. Tente novamente em 15 minutos.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const limiterInjection = (req, res, next) => {
    req.limiter = authLimiter;

    next();
};

const normalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: {
        message: 'Muitas requisições realizadas. Tente novamente em 15 minutos.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// injeção de repositório (ideia baseada na clean architecture)
const usuarioRepository = new UsuarioRepository();
const authController = new AuthController(usuarioRepository);

router.post('/login', limiterInjection, authLimiter, authController.login);
router.post('/definir-senha/:token', normalLimiter, authController.definirSenha);
router.post('/enviar-email-troca-senha', normalLimiter, authController.enviarEmailTrocaSenha);

export default router;
