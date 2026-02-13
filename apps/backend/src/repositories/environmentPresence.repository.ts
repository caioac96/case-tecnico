import { AppDataSource } from "../dataSource"
import { EnvironmentPresence } from "../entities/environmentPresence.entity"

export const EnvironmentPresenceRepository = AppDataSource.getRepository(EnvironmentPresence)