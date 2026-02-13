import { Router } from 'express';
import EnvironmentController from '../controllers/environment.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();
const environmentController = new EnvironmentController();

router.get('/', environmentController.getEnvironments);

router.get('/:id', requireAuth, environmentController.getEnvironment);

router.post('/', requireAuth, environmentController.createEnvironment);

router.patch('/:id', requireAuth, environmentController.updateEnvironment);

router.delete('/:id', requireAuth, environmentController.deleteEnvironment);

export default router;