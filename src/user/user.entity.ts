import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Token} from "../token/token.entity";

@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', unique: false, length: 100})
    firstName: string;

    @Column({type: 'varchar', unique: false, length: 100})
    lastName: string;

    @Column({type: "varchar", unique: true})
    email: string;

    @Column({type: "varchar", unique: true})
    phoneNumber: string;

    @Column({type: 'varchar'})
    password: string;

    @OneToMany(() => Token, (token) => token.user, {onDelete: 'CASCADE' })
    tokens: Token[];

    @Column({ default: false })
    isEmailVerified: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}