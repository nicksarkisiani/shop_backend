import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

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

    @Column({type: 'varchar', nullable: true, default: null})
    refreshToken: string

    @Column({ default: false })
    isEmailVerified: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}