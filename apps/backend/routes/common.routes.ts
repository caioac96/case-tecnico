import { Router } from 'express';
import logger from '../utils/logger';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../utils/auth';
import { AppDataSource } from '../dataSource';
import { User } from '../entities/user.entity';
import CommonController from '../controllers/common.controller';

const router = Router();
const commonController = new CommonController();

router.get('/health', (req, res) => {
    logger.info('Server running!');
    res.status(200).json({ status: 'Server running!' });
});

router.post('/auth/register', commonController.register);

router.post("/auth/login", async (req, res) => {
    try {
        const { register, password } = req.body;

        if (!register || !password) {
            return res.status(400).json({
                message: "Registro e senha são obrigatórios",
            });
        }

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({
            where: { register: register },
        });

        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        if (!user.admin) {
            return res.status(403).json({ message: "Acesso negado!" });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await userRepository.save(user);

        logger.log(`[login][${register}] logged into the system`);

        return res.json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                register: user.register,
                admin: user.admin
            },
        });

    } catch (err) {
        logger.error(err);
        return res.status(500).json({
            message: "Erro no servidor",
        });
    }
});

router.post("/auth/logout", (req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        logger.log("[logout] logged out successfully");

        return res.status(200).json({
            message: "Logout efetuado com sucesso",
        });
    } catch (err) {
        logger.error("[logout] erro:", err);
        return res.status(500).json({
            message: "Erro no servidor ao desconectar",
        });
    }
});

router.post('/checkin', commonController.checkin);

router.post('/checkout', commonController.checkout);

export default router;