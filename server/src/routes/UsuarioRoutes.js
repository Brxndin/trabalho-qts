import express from 'express';
import { UsuarioController } from '../controllers/UsuarioController.js';
import { UsuarioRepository } from '../repositories/UsuarioRepository.js';

const router = express.Router();

// injeção de repositório (ideia baseada na clean architecture)
const usuarioRepository = new UsuarioRepository();
const usuarioController = new UsuarioController(usuarioRepository);

router.get('/', usuarioController.index);
router.get('/:id', usuarioController.show);
router.post('/', usuarioController.store);
router.put('/:id', usuarioController.update);
router.delete('/:id', usuarioController.delete);

export default router;
