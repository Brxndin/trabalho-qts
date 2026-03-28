import express from 'express';
import { ConsultaController } from '../controllers/ConsultaController.js';
import { ConsultaRepository } from '../repositories/ConsultaRepository.js';

const router = express.Router();

// injeção de repositório (ideia baseada na clean architecture)
const consultaRepository = new ConsultaRepository();
const consultaController = new ConsultaController(consultaRepository);

router.get('/', consultaController.index);
router.get('/:id', consultaController.show);
router.post('/', consultaController.store);
router.put('/:id', consultaController.update);
router.delete('/:id', consultaController.delete);

export default router;
