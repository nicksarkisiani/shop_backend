import {Injectable, UnauthorizedException} from '@nestjs/common';
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

        const user = await this.userRepository.create({...dto, password: hashedPassword});
        await this.userRepository.save(user);
        return user;
    }

    async checkExisting (email: string, phoneNumber: string) {
        const candidateByEmail = await this.findByEmail(email);
        const candidateByUsername = await this.findByPhoneNumber(phoneNumber);
        if (!candidateByEmail) throw new UnauthorizedException('Email already used');
        if (!candidateByUsername) throw new UnauthorizedException('Username already used');
    }

    async findByEmail(email) {
        return await this.userRepository.findOneBy({email})
    }

    async findByPhoneNumber(phoneNumber) {
        return await this.userRepository.findOneBy({phoneNumber})
    }


}
