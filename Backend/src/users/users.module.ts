import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AbilityFactory } from 'src/ability/ability.factory';
import { AllExceptionFiler } from 'src/exceptionfilter/exceptionhandling.middleware';

@Module({
  imports : [
    JwtModule,
    ConfigModule.forRoot(),
    forwardRef(()=> AuthModule),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AbilityFactory,
    AllExceptionFiler
  ],
  exports : [UsersService,TypeOrmModule]
})
export class UsersModule {}
