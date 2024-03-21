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

            const accessToken = await this.generateAccessToken(authUser.id);
            const refreshToken = await this.generateRefreshToken(authUser.id);

            authUser.refreshToken = refreshToken;
            await this.userRepository.save(authUser);

            const userData = {
                id : authUser.id,
                username : authUser.username,
                email : authUser.email
            }
            
            return {status : 201, data : {accessToken : accessToken, refreshToken : refreshToken, userData : userData}, message : 'User loggedIn successfully'}
        } catch (error) {
            return error
        }
    }

    private async generateAccessToken(id : number){
        return await this.jwtService.signAsync({id : id}, {secret : process.env.ACCESS_TOKEN_SECRET});
    }

    private async generateRefreshToken(id : number){
        return await this.jwtService.signAsync({id : id}, {secret : process.env.REFRESH_TOKEN_SECRET});
    }
        
}
