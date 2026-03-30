import express from 'express';
import { FuncionarioController } from '../controllers/FuncionarioController.js';
import { FuncionarioRepository } from '../repositories/FuncionarioRepository.js';
import verifyJWT from '../middlewares/verifyJWT.js';

const router = express.Router();

// injeção de repositório (ideia baseada na clean architecture)
const funcionarioRepository = new FuncionarioRepository();
const funcionarioController = new FuncionarioController(funcionarioRepository);

router.get('/', verifyJWT, funcionarioController.index);
router.get('/:id', verifyJWT, funcionarioController.show);
router.post('/', verifyJWT, funcionarioController.store);
router.put('/:id', verifyJWT, funcionarioController.update);
router.delete('/:id', verifyJWT, funcionarioController.delete);

export default router;
