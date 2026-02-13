import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../dataSource';
import { CommonService } from './common.service';

export class UserService {
    private userRepository: Repository<User>;
    private commonService: CommonService;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
        this.commonService = new CommonService();
    }

    async createUser(data: User) {
        const user = await this.commonService.generateRegisterAndPasswordHash(data.name, data.password, false);
        return user;
    }

    async getUsers() {
        return await this.userRepository.find();
    }

    async getUser(id: string) {
        const user = await this.userRepository.findOne({
            where: { id },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async updateUser(id: string, data: Partial<User>) {
        const user = await this.getUser(id);

        Object.assign(user, data);

        return await this.userRepository.save(user);
    }

    async deleteUser(id: string) {
        await this.userRepository.softDelete(id);

        return { message: 'User deleted successfully' };
    }
}
