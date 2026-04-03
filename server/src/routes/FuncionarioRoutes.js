import express from 'express';
import { FuncionarioController } from '../controllers/FuncionarioController.js';
import { FuncionarioRepository } from '../repositories/FuncionarioRepository.js';
import verifyJWT from '../middlewares/verifyJWT.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';

const router = express.Router();

// injeção de repositório (ideia baseada na clean architecture)
const funcionarioRepository = new FuncionarioRepository();
const funcionarioController = new FuncionarioController(funcionarioRepository);

router.get('/', verifyJWT, funcionarioController.index);
router.get('/:id', verifyJWT, funcionarioController.show);
router.post('/', verifyJWT, verifyAdmin, funcionarioController.store);
router.put('/:id', verifyJWT, verifyAdmin, funcionarioController.update);
router.delete('/:id', verifyJWT, verifyAdmin, funcionarioController.delete);

export default router;
