import {IsEmail, IsString} from 'class-validator'

export class CreateUserDto {
    @IsString()
    username : string;

    @IsString()
    email : string;

    @IsEmail()
    password : string;
}
