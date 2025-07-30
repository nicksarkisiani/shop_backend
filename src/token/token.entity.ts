import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user/user.entity";


@Entity('token')
export class Token {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true, unique: true, type: 'varchar'})
    refreshToken: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    expiresAt: Date;

    @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
    user: User;


}