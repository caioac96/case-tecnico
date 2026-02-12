import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm"
import { EnvironmentPresence } from "./environmentPresence.entity"

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    passwordHash: string

    @Column({ unique: true })
    register: string

    @Column()
    admin: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt?: Date

    @OneToMany(() => EnvironmentPresence, presence => presence.user)
    presences: EnvironmentPresence[];
}