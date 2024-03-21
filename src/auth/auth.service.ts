import { ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUserDto } from 'src/users/dto/auth-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository : Repository<User>,
        private jwtService : JwtService
    ) {}

    async login(userPayload : AuthUserDto){
        try {
            const {username, password} = userPayload;
            const authUser = await this.userRepository.findOne({where : {username : username}});
            if(!authUser) throw new ConflictException('Username or password is incorrect');

            const verifyPassword = await bcrypt.compare(password, authUser.password);

            if(!verifyPassword) throw new ConflictException('Password is incorrect')

            const jwtToken = await this.jwtService.signAsync({username : username});

            return {accessToken : jwtToken, statusCode : HttpStatus.ACCEPTED}
        } catch (error) {
            if(error instanceof ConflictException){
                throw error
            }
            console.log("Error---->", error)
            throw new Error('Internal Server Error')
        }
    }

}
