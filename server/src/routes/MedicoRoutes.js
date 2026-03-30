import express from 'express';
import { MedicoController } from '../controllers/MedicoController.js';
import { MedicoRepository } from '../repositories/MedicoRepository.js';
import verifyJWT from '../middlewares/verifyJWT.js';

const router = express.Router();

// injeção de repositório (ideia baseada na clean architecture)
const medicoRepository = new MedicoRepository();
const medicoController = new MedicoController(medicoRepository);

router.get('/', verifyJWT, medicoController.index);
router.get('/:id', verifyJWT, medicoController.show);
router.post('/', verifyJWT, medicoController.store);
router.put('/:id', verifyJWT, medicoController.update);
router.delete('/:id', verifyJWT, medicoController.delete);

export default router;
