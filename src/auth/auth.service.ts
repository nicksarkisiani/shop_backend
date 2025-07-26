import {BadRequestException, Injectable} from '@nestjs/common';
import {registrationDto} from "./dto/registration.dto";
import {UserService} from "../user/user.service";

@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService) {
    }

    async registration(dto: registrationDto) {
        if(dto.password !== dto.repeatPassword) {
            throw new BadRequestException('Password is not match');
        }

        const {repeatPassword, ...userDto} = dto;

        const user = await this.userService.createUser(userDto);

        return user;
    }

}
