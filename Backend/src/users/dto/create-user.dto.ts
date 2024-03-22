import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsString} from 'class-validator'

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    username : string;

    @ApiProperty()
    @IsString()
    email : string;
    
    @ApiProperty()
    @IsEmail()
    password : string;
}
