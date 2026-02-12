import { UserRepository } from "../repositories/user.repository";

export default class UserController {

    public async create (user: any) {

    }

    public async get () {
        
    }

    public async update () {

    }

    public async delete (id: string) {
        UserRepository.softDelete(id)
    }
    
}