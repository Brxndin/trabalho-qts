import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { UserRepository } from '../repositories/UserRepository.js';

const router = express.Router();

// injeção de repositório (segue o padrão da clean architecture)
const userRepository = new UserRepository();
const userController = new UserController(userRepository);

router.get('/', userController.index);
router.get('/:id', userController.show);
router.post('/', userController.store);

export default router;