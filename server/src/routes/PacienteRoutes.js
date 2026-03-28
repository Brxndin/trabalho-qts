import express from 'express';
import { PacienteController } from '../controllers/PacienteController.js';
import { PacienteRepository } from '../repositories/PacienteRepository.js';

const router = express.Router();

// injeção de repositório (ideia baseada na clean architecture)
const pacienteRepository = new PacienteRepository();
const pacienteController = new PacienteController(pacienteRepository);

router.get('/', pacienteController.index);
router.get('/:id', pacienteController.show);
router.post('/', pacienteController.store);
router.put('/:id', pacienteController.update);
router.delete('/:id', pacienteController.delete);

export default router;
