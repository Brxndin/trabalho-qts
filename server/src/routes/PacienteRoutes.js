import express from 'express';
import { PacienteController } from '../controllers/PacienteController.js';
import { PacienteRepository } from '../repositories/PacienteRepository.js';
import verifyJWT from '../middlewares/verifyJWT.js';
import verifyFuncionario from '../middlewares/verifyFuncionario.js';

const router = express.Router();

// injeção de repositório (ideia baseada na clean architecture)
const pacienteRepository = new PacienteRepository();
const pacienteController = new PacienteController(pacienteRepository);

router.get('/', verifyJWT, pacienteController.index);
router.get('/:id', verifyJWT, pacienteController.show);
router.post('/', verifyJWT, verifyFuncionario, pacienteController.store);
router.put('/:id', verifyJWT, verifyFuncionario, pacienteController.update);
// router.delete('/:id', verifyJWT, pacienteController.delete);

export default router;
