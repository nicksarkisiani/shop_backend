import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, MinLength} from "class-validator";


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
