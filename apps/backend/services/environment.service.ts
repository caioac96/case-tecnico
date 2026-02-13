import { Repository } from 'typeorm';
import { AppDataSource } from '../dataSource';
import { Environment } from '../entities/environment.entity';

export class EnvironmentService {
    private environmentRepository: Repository<Environment>;

    constructor() {
        this.environmentRepository = AppDataSource.getRepository(Environment);
    }

    async createEnvironment(data: Partial<Environment>) {
        const user = this.environmentRepository.create(data);
        return await this.environmentRepository.save(user);
    }

    async getEnvironments() {
        return await this.environmentRepository.find();
    }

    async getEnvironment(id: string) {
        const user = await this.environmentRepository.findOne({
            where: { id },
        });

        if (!user) {
            throw new Error('Environment not found');
        }

        return user;
    }

    async updateEnvironment(id: string, data: Partial<Environment>) {
        const user = await this.getEnvironment(id);

        Object.assign(user, data);

        return await this.environmentRepository.save(user);
    }

    async deleteEnvironment(id: string) {
        await this.environmentRepository.softDelete(id);

        return { message: 'Environment deleted successfully' };
    }
}
