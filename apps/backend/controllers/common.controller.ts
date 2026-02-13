import { Request, Response } from 'express';
import { CommonService } from "../services/common.service";
import logger from '../utils/logger';

export default class CommonController {
    constructor(private commonService = new CommonService()) { }

    register = async (req: Request, res: Response) => {
        try {
            const { name, password } = req.body;

            if (!name || !password) {
                return res.status(400).json({
                    message: 'Nome e senha são obrigatórios',
                });
            }
            const user = await this.commonService.generateRegisterAndPasswordHash(name, password, true);

            return res.status(201).json({
                id: user.id,
                register: user.register,
                name: user.name,
            });

        } catch (err) {
            logger.error(err);
            return res.status(500).json({
                message: 'Erro no servidor',
            });
        }
    }

    checkin = async (req: Request<{ id: string }>, res: Response) => {
        await this.commonService.checkin(req.params.id);
        return res.json();
    };

    checkout = async (req: Request<{ id: string }>, res: Response) => {
        await this.commonService.checkout(req.params.id);
        return res.json();
    }
}