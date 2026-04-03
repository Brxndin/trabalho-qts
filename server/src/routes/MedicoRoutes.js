import express from 'express';
import { MedicoController } from '../controllers/MedicoController.js';
import { MedicoRepository } from '../repositories/MedicoRepository.js';
import verifyJWT from '../middlewares/verifyJWT.js';
import verifyFuncionario from '../middlewares/verifyFuncionario.js';

const router = express.Router();

// injeção de repositório (ideia baseada na clean architecture)
const medicoRepository = new MedicoRepository();
const medicoController = new MedicoController(medicoRepository);

router.get('/', verifyJWT, medicoController.index);
router.get('/:id', verifyJWT, medicoController.show);
router.post('/', verifyJWT, verifyFuncionario, medicoController.store);
router.put('/:id', verifyJWT, verifyFuncionario, medicoController.update);
router.delete('/:id', verifyJWT, verifyFuncionario, medicoController.delete);

export default router;
