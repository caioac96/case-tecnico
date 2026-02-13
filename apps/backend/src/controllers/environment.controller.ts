import { Request, Response } from 'express';
import { EnvironmentService } from '../services/environment.service';

export default class EnvironmentController {
    constructor(private userService = new EnvironmentService()) { }

    createEnvironment = async (req: Request, res: Response) => {
        const user = await this.userService.createEnvironment(req.body);
        return res.status(201).json(user);
    };

    getEnvironments = async (req: Request, res: Response) => {
        const users = await this.userService.getEnvironments();
        return res.json(users);
    };

    getEnvironment = async (req: Request<{ id: string }>, res: Response) => {
        const user = await this.userService.getEnvironment(req.params.id);
        return res.json(user);
    }

    updateEnvironment = async (req: Request<{ id: string }>, res: Response) => {
        const user = await this.userService.updateEnvironment(req.params.id, req.body);
        return res.json(user);
    }

    deleteEnvironment = async (req: Request<{ id: string }>, res: Response) => {
        await this.userService.deleteEnvironment(req.params.id);
        return res.status(204).send();
    }
}