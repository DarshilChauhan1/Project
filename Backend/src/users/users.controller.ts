import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException, Query, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { AbilityFactory } from 'src/ability/ability.factory';
import { Request } from 'express';
import { Action } from 'src/ability/ability.enum';
import { User } from './entities/user.entity';
import { ForbiddenError } from '@casl/ability';
import { ChechkAbilities } from 'src/ability/ability.decorator';
import { AbilityGuard } from 'src/ability/ability.guard';
import { AllExceptionFiler } from 'src/exceptionfilter/exceptionhandling.middleware';


@Controller()
@UseFilters(AllExceptionFiler)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly abilityFactory : AbilityFactory
    ) {}

  @Post('signup')
  async signup(@Body() userPayload: CreateUserDto) {
    return this.usersService.singUp(userPayload)
  }

  @Post('refresh')
  async generateTokens(@Body() payload: { refreshToken: string }) {
    return this.usersService.generateTokens(payload);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('api/users')
  async getAllUsers(@Req() req : any ) {
    try {
      const ability = await this.abilityFactory.defineAbility(req.user);
      ForbiddenError.from(ability).setMessage('Only Admins are Allowed').throwUnlessCan(Action.Create, User);
      return this.usersService.getAllUsers();
    } catch (error) {
      if(error instanceof ForbiddenError){
        throw new ForbiddenException(error.message);
      }
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, AbilityGuard)
  @ChechkAbilities({action : [Action.Create], subjects : User})
  @Post('api/logout')
  async logoutUser(@Body() userPayload: { userId: number }) {
    return this.usersService.logoutUser(userPayload);
  }
}

