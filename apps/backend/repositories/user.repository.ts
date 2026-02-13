import { AppDataSource } from "../dataSource"
import { User } from "../entities/user.entity"

export const UserRepository = AppDataSource.getRepository(User);