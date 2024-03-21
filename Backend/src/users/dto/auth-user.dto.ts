import { ApiProperty } from '@nestjs/swagger';
import {IsString, isString} from 'class-validator'

export class AuthUserDto{
    @ApiProperty()
    @IsString()
    username : string;

    @ApiProperty()
    @IsString()
    password : string
}