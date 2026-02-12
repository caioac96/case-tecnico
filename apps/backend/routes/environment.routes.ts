import { Router } from 'express';
import UserController from '../controllers/user.controller';

const router = Router();
const usersController = new UserController();

router.post('/environment', (req, res) => {
    const user = {};
    usersController.create(user);
}
);

export default router;