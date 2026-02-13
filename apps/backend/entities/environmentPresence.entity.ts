import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Environment } from "./environment.entity";

@Entity()
export class EnvironmentPresence {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, user => user.presences, { onDelete: "CASCADE" })
    @JoinColumn({ name: "register" })
    user!: User;

    @Column({ nullable: false })
    userRegister!: string;

    @ManyToOne(() => Environment, env => env.presences, { onDelete: "CASCADE" })
    @JoinColumn({ name: "environmentId" })
    environment!: Environment;

    @Column({ nullable: false })
    environmentId!: string;

    @Column({ type: "timestamp" })
    checkInAt!: Date;

    @Column({ type: "timestamp", nullable: true })
    checkOutAt!: Date | null;
}
