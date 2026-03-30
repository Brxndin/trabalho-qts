import express from 'express';
import { ConsultaController } from '../controllers/ConsultaController.js';
import { ConsultaRepository } from '../repositories/ConsultaRepository.js';
import verifyJWT from '../middlewares/verifyJWT.js';

const router = express.Router();

// injeção de repositório (ideia baseada na clean architecture)
const consultaRepository = new ConsultaRepository();
const consultaController = new ConsultaController(consultaRepository);

router.get('/', verifyJWT, consultaController.index);
router.get('/:id', verifyJWT, consultaController.show);
router.post('/', verifyJWT, consultaController.store);
router.put('/:id', verifyJWT, consultaController.update);
router.delete('/:id', verifyJWT, consultaController.delete);

export default router;
