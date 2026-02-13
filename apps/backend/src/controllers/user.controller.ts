import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export default class UserController {
    constructor(private userService = new UserService()) { }

    createUser = async (req: Request, res: Response) => {
        const user = await this.userService.createUser(req.body);
        return res.status(201).json(user);
    };

    getUsers = async (req: Request, res: Response) => {
        const users = await this.userService.getUsers();
        return res.json(users);
    };

    getUser = async (req: Request<{ id: string }>, res: Response) => {
        const user = await this.userService.getUser(req.params.id);
        return res.json(user);
    }

    updateUser = async (req: Request<{ id: string }>, res: Response) => {
        const user = await this.userService.updateUser(req.params.id, req.body);
        return res.json(user);
    }

    deleteUser = async (req: Request<{ id: string }>, res: Response) => {
        await this.userService.deleteUser(req.params.id);
        return res.status(200).json();
    }
}