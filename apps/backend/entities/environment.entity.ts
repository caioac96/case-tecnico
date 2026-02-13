import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm"
import { EnvironmentPresence } from "./environmentPresence.entity"

@Entity()
export class Environment {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    description: string

    @Column()
    occupancyLimit: number

    @Column({ nullable: true })
    currentOccupancy?: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt?: Date

    @OneToMany(() => EnvironmentPresence, presence => presence.environment)
    presences: EnvironmentPresence[];
}