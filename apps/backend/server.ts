import "reflect-metadata"
import express from 'express';
import commonRoutes from './routes/common.routes';
import userRoutes from './routes/user.routes';
import environmentRoutes from './routes/environment.routes';
import logger from './utils/logger';
import env from './config/env';
import { AppDataSource } from "./dataSource";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use('/', commonRoutes);
app.use('/users', userRoutes);
app.use('/environments', environmentRoutes);

async function startServer() {
    try {
        await AppDataSource.initialize();

        app.listen(env.port, () => {
            logger.info(`Server running on port ${env.port}`);
        });

    } catch (error) {
        logger.error('Error run application.', error);
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    logger.info('Closing application...');
    process.exit(0);
});

startServer();

export default app;