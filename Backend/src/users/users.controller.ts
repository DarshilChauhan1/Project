import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';


@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() userPayload : CreateUserDto){
     return this.usersService.singUp(userPayload)
  }

  @Post('refresh')
  async generateTokens(@Body() payload : {refreshToken : string}){
    return this.usersService.generateTokens(payload);
  }
}

@ApiBearerAuth()
@Controller('api')
@UseGuards(AuthGuard)
export class UserCloseController{
  constructor(private readonly usersService : UsersService){}
  @Get('users')
  async getAllUsers(){
    return this.usersService.getAllUsers()
  }

  @Post('logout')
  async logoutUser(@Body() userPayload : {userId : number}){
      return this.usersService.logoutUser(userPayload);
  }
}
