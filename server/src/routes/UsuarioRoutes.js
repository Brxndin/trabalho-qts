import express from 'express';
import { UsuarioController } from '../controllers/UsuarioController.js';
import { UsuarioRepository } from '../repositories/UsuarioRepository.js';
import verifyJWT from '../middlewares/verifyJWT.js';

const router = express.Router();

// injeção de repositório (ideia baseada na clean architecture)
const usuarioRepository = new UsuarioRepository();
const usuarioController = new UsuarioController(usuarioRepository);

router.get('/', verifyJWT, usuarioController.index);
router.get('/:id', verifyJWT, usuarioController.show);
router.post('/', verifyJWT, usuarioController.store);
router.put('/:id', verifyJWT, usuarioController.update);
router.delete('/:id', verifyJWT, usuarioController.delete);

export default router;
