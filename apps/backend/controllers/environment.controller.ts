import { EnvironmentRepository } from "../repositories/environment.repository";

export default class EnvironmentController {

    public async create(user: any) {

    }

    public async get() {

    }

    public async update() {

    }

    public async delete(id: string) {
        EnvironmentRepository.softDelete(id)
    }

}