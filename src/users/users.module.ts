import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCloseController, UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports : [
    ConfigModule.forRoot(),
    forwardRef(()=> AuthModule),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController, UserCloseController],
  providers: [UsersService],
  exports : [UsersService,TypeOrmModule]
})
export class UsersModule {}
