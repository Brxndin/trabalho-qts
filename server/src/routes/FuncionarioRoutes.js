import express from 'express';
import { FuncionarioController } from '../controllers/FuncionarioController.js';
import { FuncionarioRepository } from '../repositories/FuncionarioRepository.js';

const router = express.Router();

// injeção de repositório (ideia baseada na clean architecture)
const funcionarioRepository = new FuncionarioRepository();
const funcionarioController = new FuncionarioController(funcionarioRepository);

router.get('/', funcionarioController.index);
router.get('/:id', funcionarioController.show);
router.post('/', funcionarioController.store);
router.put('/:id', funcionarioController.update);
router.delete('/:id', funcionarioController.delete);

export default router;
