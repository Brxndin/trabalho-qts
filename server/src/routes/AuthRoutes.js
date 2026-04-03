import express from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { UsuarioRepository } from '../repositories/UsuarioRepository.js';

const router = express.Router();

// injeção de repositório (ideia baseada na clean architecture)
const usuarioRepository = new UsuarioRepository();
const authController = new AuthController(usuarioRepository);

router.post('/login', authController.login);
router.post('/definir-senha', authController.definirSenha);
router.post('/enviar-email-troca-senha', authController.enviarEmailTrocaSenha);

export default router;
