import { Router } from 'express';
import logger from '../utils/logger';

const router = Router();

router.get('/health', (req, res) => {
    logger.info('Server running!');
    res.status(200).json({ status: 'Server running!' });
});

export default router;