import { Repository } from 'typeorm';
import { AppDataSource } from '../dataSource';
import { EnvironmentPresence } from '../entities/environmentPresence.entity';
import { User } from '../entities/user.entity';
import bcrypt from 'bcryptjs';

export class CommonService {
    private environmentPresenceRepository: Repository<EnvironmentPresence>;

    constructor() {
        this.environmentPresenceRepository = AppDataSource.getRepository(EnvironmentPresence);
    }

    async generateRegisterAndPasswordHash(name: string, pwd: string, isAdmin: boolean) {
        const userRepository = AppDataSource.getRepository(User);

        let registerLocal: string;
        let exists = true;

        while (exists) {
            registerLocal = Math.floor(1000 + Math.random() * 9000).toString();
            const userExists = await userRepository.findOne({
                where: { register: registerLocal },
            });
            exists = !!userExists;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(pwd, salt);
        const user = userRepository.create({
            name,
            register: registerLocal!,
            admin: isAdmin,
            password: passwordHash
        });

        await userRepository.save(user);
        return user;
    }

    async checkin(id: string) {
        const user = await this.environmentPresenceRepository.findOne({
            where: { id },
        });

        return user;
    }

    async checkout(id: string) {
        const user = await this.environmentPresenceRepository.findOne({
            where: { id },
        });

        return user;
    }
}
