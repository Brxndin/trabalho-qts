import express from 'express';
import { UsuarioController } from '../controllers/UsuarioController.js';
import { UsuarioRepository } from '../repositories/UsuarioRepository.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';
import verifyJWT from '../middlewares/verifyJWT.js';

const router = express.Router();

// injeção de repositório (ideia baseada na clean architecture)
const usuarioRepository = new UsuarioRepository();
const usuarioController = new UsuarioController(usuarioRepository);

router.get('/', verifyJWT, verifyAdmin, usuarioController.index);
router.get('/:id', verifyJWT, verifyAdmin, usuarioController.show);
router.post('/', verifyJWT, verifyAdmin, usuarioController.store);
router.put('/:id', verifyJWT, verifyAdmin, usuarioController.update);
router.delete('/:id', verifyJWT, verifyAdmin, usuarioController.delete);

export default router;
