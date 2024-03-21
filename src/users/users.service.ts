import { BadRequestException, ConflictException, HttpCode, HttpStatus, Injectable, Next } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

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

  async getAllUsers(): Promise<User[]> {
    try {
      const allUsers = await this.userRepository.find()
      return allUsers;
    } catch (error) {
      console.log("Error--->", error)
      throw new Error(error)
    }
  }

}
