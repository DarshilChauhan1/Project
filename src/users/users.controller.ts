import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() userPayload : CreateUserDto){
     return this.usersService.singUp(userPayload)
  }

  @Post('refresh')
  async generateTokens(@Body() payload : {}){
    
  }
}

@Controller('api')
@UseGuards(AuthGuard)
export class UserCloseController{
  constructor(private readonly usersService : UsersService){}
  @Get('users')
  async getAllUsers(){
    return this.usersService.getAllUsers()
  }
}
