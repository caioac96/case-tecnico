import { IsNull, Repository } from 'typeorm';
import { AppDataSource } from '../dataSource';
import { EnvironmentPresence } from '../entities/environmentPresence.entity';
import { User } from '../entities/user.entity';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger';
import { Environment } from '../entities/environment.entity';

export class CommonService {
    private userRepository: Repository<User>;
    private environmentRepository: Repository<Environment>;
    private environmentPresenceRepository: Repository<EnvironmentPresence>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
        this.environmentRepository = AppDataSource.getRepository(Environment);
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

    async checkin(register: string, password: string, environmentId: string) {
        try {
            const user = await this.userRepository.findOne({
                where: { register: register },
            });

            if (!user) {
                return ({ success: false, message: "Usuário não encontrado" });
            }

            const isValid = await bcrypt.compare(password, user.password);

            if (!isValid) {
                return ({ success: false, message: "Credenciais inválidas" });

            }

            const environment = await this.environmentRepository.findOneBy({ id: environmentId });

            if (!environment) {
                return ({ success: false, message: "Ambiente não encontrado" });
            }

            if ((environment.currentOccupancy || 0) >= environment.occupancyLimit) {
                return ({ success: false, message: "Ambiente atingiu ocupação máxima" });
            }

            Object.assign(environment, { currentOccupancy: (environment.currentOccupancy || 0) + 1 });
            await this.environmentRepository.save(environment);

            const environmentPresence = await this.environmentPresenceRepository.find({
                where: {
                    userRegister: register,
                    checkOutAt: IsNull(),
                },
            });

            if (environmentPresence.length > 0) {
                return ({ success: false, message: "Aluno já está em algum ambiente! Faça check-out para continuar" });
            }

            const checkin = await this.environmentPresenceRepository.create({
                userRegister: register,
                environmentId: environmentId,
                checkInAt: new Date(),
                checkOutAt: null
            });

            await this.environmentPresenceRepository.save(checkin);

            logger.log(`[checkin][${register}]`);

            return { ...checkin, success: true };
        } catch (error: any) {
            throw new Error(error?.message || "Erro interno");
        }
    }

    async checkout(register: string, password: string, environmentId: string) {
        try {
            const user = await this.userRepository.findOne({
                where: { register: register },
            });

            if (!user) {
                return ({ success: false, message: "Usuário não encontrado" });
            }

            const isValid = await bcrypt.compare(password, user.password);

            if (!isValid) {
                return ({ success: false, message: "Credenciais inválidas" });

            }

            const environment = await this.environmentRepository.findOneBy({ id: environmentId });

            if (!environment) {
                return ({ success: false, message: "Ambiente não encontrado" });
            }

            const environmentPresence = await this.environmentPresenceRepository.findOne({
                where: {
                    userRegister: register,
                    checkOutAt: IsNull(),
                },
            });

            if (!environmentPresence) {
                return ({ success: false, message: "Aluno não está em nenhum ambiente!" });
            }

            if (environmentPresence.environmentId != environmentId) {
                return ({ success: false, message: "Aluno está em outro ambiente!" });
            }

            Object.assign(environment, { currentOccupancy: Math.max((environment.currentOccupancy ?? 0) - 1, 0) });
            await this.environmentRepository.save(environment);

            const checkout = await this.environmentPresenceRepository.save({ ...environmentPresence, checkOutAt: new Date() });

            logger.log(`[checkout][${register}]`);

            return { ...checkout, success: true };
        } catch (error: any) {
            throw new Error(error?.message || "Erro interno");
        }
    }
}
