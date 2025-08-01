import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";

export class UserType {

    @ApiProperty({ example: '1', description: 'User ID' })
    @IsNotEmpty()
    @IsString()
    id: number;

    @ApiProperty({ example: 'Luka', description: 'User first name' })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({ example: 'Sokhadze', description: 'User last name' })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty({example: 'bla@gmail.com', description: 'User email' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({example: '+9956452135', description: 'User phone number' })
    @IsNotEmpty()
    @IsEmail()
    phoneNumber: string;

    @ApiProperty({ example: 'sdfsdfs565', description: 'Hashed Refresh Token' })
    @IsNotEmpty()
    @IsString()
    refreshToken?: string;
}

export class userDto extends UserType {
    @ApiProperty({ example: 'MySecret123', description: 'Password (min 8 symbols)' })
    @IsNotEmpty()
    @MinLength(8)
    password: string;

}
