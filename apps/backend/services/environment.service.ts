import { Repository } from 'typeorm';
import { AppDataSource } from '../dataSource';
import { Environment } from '../entities/environment.entity';

export class EnvironmentService {
    private environmentRepository: Repository<Environment>;

    constructor() {
        this.environmentRepository = AppDataSource.getRepository(Environment);
    }

    async createEnvironment(data: Partial<Environment>) {
        const environment = this.environmentRepository.create(data);
        return await this.environmentRepository.save(environment);
    }

    async getEnvironments() {
        return await this.environmentRepository.find({
            order: {
                description: "ASC",
            },
        });
    }

    async getEnvironment(id: string) {
        const environment = await this.environmentRepository.findOne({
            where: { id },
        });

        if (!environment) {
            throw new Error('Environment not found');
        }

        return environment;
    }

    async updateEnvironment(id: string, data: Partial<Environment>) {
        const environment = await this.getEnvironment(id);

        Object.assign(environment, data);

        return await this.environmentRepository.save(environment);
    }

    async deleteEnvironment(id: string) {
        await this.environmentRepository.softDelete(id);

        return { message: 'Environment deleted successfully' };
    }
}
