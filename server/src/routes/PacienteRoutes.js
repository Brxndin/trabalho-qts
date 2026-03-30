import express from 'express';
import { PacienteController } from '../controllers/PacienteController.js';
import { PacienteRepository } from '../repositories/PacienteRepository.js';
import verifyJWT from '../middlewares/verifyJWT.js';

const router = express.Router();

// injeção de repositório (ideia baseada na clean architecture)
const pacienteRepository = new PacienteRepository();
const pacienteController = new PacienteController(pacienteRepository);

router.get('/', verifyJWT, pacienteController.index);
router.get('/:id', verifyJWT, pacienteController.show);
router.post('/', verifyJWT, pacienteController.store);
router.put('/:id', verifyJWT, pacienteController.update);
router.delete('/:id', verifyJWT, pacienteController.delete);

export default router;
