import { BadRequestException, ConflictException, HttpCode, HttpStatus, Injectable, InternalServerErrorException, Next, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  async singUp(userPayload: CreateUserDto) {
    const { username, password } = userPayload;
    if (username && password) {
      try {
        const existUser = await this.userRepository.findOne({ where: { username: username } })
        if (existUser) throw new ConflictException('User with that username already exists')

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = this.userRepository.create({ ...userPayload, password: hashedPassword });
        await this.userRepository.save(newUser);
        return { message: "User signedUp successfully", statusCode: HttpStatus.CREATED }
      } catch (error) {
        if (error instanceof ConflictException) {
          throw error
        }
        console.log('Error Occur While Signing Up', error);
        throw new Error('Internal Server Error');
      }
    } else {
      throw new BadRequestException('Username and Password is required')
    }
  }


  async generateTokens(payload : {refreshToken? : string}) : Promise<{}>{
    try {
      const {refreshToken} = payload;
      if(refreshToken){
      const decode = await this.jwtService.verifyAsync(refreshToken, {secret : process.env.REFRESH_TOKEN_SECRET});
      if(decode){
        const user = await this.userRepository.findOne({where : {id : decode.id}});
        if(!user) throw new UnauthorizedException('User not found');
        const accessToken = await this.generateAccessToken(user.id);
        return {status : 201, data : {accessToken : accessToken, refreshToken : refreshToken}, message : 'Token generated Successfully' }
      }
    } else {
      throw new BadRequestException('Token not found')
    }

    } catch (error) {
        throw new UnauthorizedException('User is not Authorized')
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
    return await this.jwtService.signAsync({ id: id }, { secret: process.env.ACCESS_TOKEN_SECRET });
  }

  private async generateRefreshToken(id: number) {
    return await this.jwtService.signAsync({ id: id }, { secret: process.env.REFRESH_TOKEN_SECRET });
  }

}
