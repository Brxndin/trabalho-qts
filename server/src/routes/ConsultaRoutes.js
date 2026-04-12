import express from 'express';
import { ConsultaController } from '../controllers/ConsultaController.js';
import { ConsultaRepository } from '../repositories/ConsultaRepository.js';
import verifyJWT from '../middlewares/verifyJWT.js';
import verifyMedico from '../middlewares/verifyMedico.js';

const router = express.Router();

// injeção de repositório (ideia baseada na clean architecture)
const consultaRepository = new ConsultaRepository();
const consultaController = new ConsultaController(consultaRepository);

router.get('/', verifyJWT, verifyMedico, consultaController.index);
router.get('/:id', verifyJWT, verifyMedico, consultaController.show);
router.get('/medico/:usuarioId', verifyJWT, verifyMedico, consultaController.getMedico);
router.get('/paciente/:cpf', verifyJWT, verifyMedico, consultaController.getPaciente);
router.post('/', verifyJWT, verifyMedico, consultaController.store);

export default router;
