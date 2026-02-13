import { AppDataSource } from "../dataSource"
import { Environment } from "../entities/environment.entity"

export const EnvironmentRepository = AppDataSource.getRepository(Environment)