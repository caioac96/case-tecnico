import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();
const usersController = new UserController();

router.get('/', requireAuth, usersController.getUsers);

router.get('/:id', requireAuth, usersController.getUser);

router.post('/', requireAuth, usersController.createUser);

router.patch('/:id', requireAuth, usersController.updateUser);

router.delete('/:id', requireAuth, usersController.deleteUser);

export default router;