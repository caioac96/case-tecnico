import { Router } from 'express';
import UserController from '../controllers/user.controller';

const router = Router();
const usersController = new UserController();

router.get('/users', (req, res) => {
    usersController.get();
}
);

export default router;