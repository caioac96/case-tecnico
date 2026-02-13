import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import env from '../config/env';
import { AppDataSource } from '../dataSource';

interface JwtPayload {
    sub: string;
    role: string;
}

export const requireAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Não autorizado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(
            token,
            env.jwt_access_secret
        ) as JwtPayload;

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({
            where: { id: payload.sub },
        });

        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        req.user = user;

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};