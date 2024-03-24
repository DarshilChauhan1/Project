import { BadRequestException, ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { NotFoundError } from 'rxjs';
import { AllExceptionFiler } from 'src/exceptionfilter/exceptionhandling.middleware';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly exceptionFilter: AllExceptionFiler
  ) { }

  async singUp(userPayload: CreateUserDto) {
    try {
      const { username, password, email } = userPayload;
      if (username && password && email) {
        try {
          const existUser = await this.userRepository.findOne({ where: { username: username } })
          console.log(existUser)
          if (existUser) throw new ConflictException('User Already Exits')
  
          const hashedPassword = await bcrypt.hash(password, 10);
  
          const newUser = this.userRepository.create({ ...userPayload, password: hashedPassword });
          await this.userRepository.save(newUser);
          return { message: "User signedUp successfully", statusCode: HttpStatus.CREATED }
        } catch (error) {
          return error
        }
      } else {
        throw new BadRequestException('All fields are required')
      }
    } catch (error) {
      throw error
    }
  }


  async generateTokens(payload : {refreshToken : string}) : Promise<{}>{
    try {
      const {refreshToken} = payload;
      console.log(refreshToken);
      if(refreshToken){
      const decode = await this.jwtService.verifyAsync(refreshToken, {secret : process.env.REFRESH_TOKEN_SECRET});
      if(decode){
        const user = await this.userRepository.findOne({where : {id : decode.id}});
        if(!user) throw new UnauthorizedException('User not found');
        if(refreshToken == user.refreshToken) {
        const accessToken = await this.generateAccessToken(user.id);
        return {status : 201, data : {accessToken : accessToken, refreshToken : refreshToken}, message : 'Token generated Successfully' }
        } else {
          throw new UnauthorizedException('User is not authorized')
        }
      } else {
        throw new UnauthorizedException('Refresh Token Expired')
      }
    } else {
      throw new BadRequestException('Token not found')
    }

    } catch (error) {
        throw error
    }
  }

  async logoutUser(userPayload : {userId : number}) : Promise<any>{
    try {
      const {userId} = userPayload;
      const verifyUser = await this.userRepository.findOne({where : {id : userId}});
      console.log(verifyUser);
      if(!verifyUser) throw new ConflictException('User not found');
      console.log(verifyUser);
      await this.userRepository.save({...verifyUser, refreshToken : null})
    } catch (error) {
      return error
    }
  }

  

  async getAllUsers(): Promise<User[]> {
    try {
      const allUsers = await this.userRepository.find()
      return allUsers;
    } catch (error) {
      console.log("Error--->", error)
      throw new Error(error)
    }
  }

  private async generateAccessToken(id: number) {
    return await this.jwtService.signAsync({ id: id }, { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn : '50s'});
  }

}
