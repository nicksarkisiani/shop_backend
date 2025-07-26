import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, MinLength} from "class-validator";
import {userDto} from "../../types/dto/user.dto";

export class registrationDto extends userDto{
    @ApiProperty({ example: 'MySecret123', description: 'Repeat password' })
    @IsNotEmpty()
    repeatPassword: string;
}

export class loginDto {
    @ApiProperty({example: 'bla@gmail.com', description: 'User email' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'MySecret123', description: 'Password (min 8 symbols)' })
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}
