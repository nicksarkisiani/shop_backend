import {ConflictException, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {User} from "./user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {encodePassword} from "../utils/bcrypt";
import {userDto} from "../types/dto/user.dto";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    async createUser (dto: userDto) {
        await this.checkExisting(dto.email, dto.phoneNumber);

        const hashedPassword = encodePassword(dto.password);

        const user = this.userRepository.create({...dto, password: hashedPassword});
        await this.userRepository.save(user);
        const {password, ...userWithoutPassword} = user;
        return userWithoutPassword;
    }

    async checkExisting (email: string, phoneNumber: string) {
        const candidateByEmail = await this.findByEmail(email);
        const candidateByPhoneNumber = await this.findByPhoneNumber(phoneNumber);
        if (candidateByEmail) throw new ConflictException('Email already used');
        if (candidateByPhoneNumber) throw new ConflictException('Phone Number already used');
    }

    private async findByEmail(email: string) {
        return await this.userRepository.findOneBy({email})
    }

    private async findByPhoneNumber(phoneNumber: string) {
        return await this.userRepository.findOneBy({phoneNumber})
    }


}
