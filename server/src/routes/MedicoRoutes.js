import express from 'express';
import { MedicoController } from '../controllers/MedicoController.js';
import { MedicoRepository } from '../repositories/MedicoRepository.js';

const router = express.Router();

// injeção de repositório (ideia baseada na clean architecture)
const medicoRepository = new MedicoRepository();
const medicoController = new MedicoController(medicoRepository);

router.get('/', medicoController.index);
router.get('/:id', medicoController.show);
router.post('/', medicoController.store);
router.put('/:id', medicoController.update);
router.delete('/:id', medicoController.delete);

export default router;
