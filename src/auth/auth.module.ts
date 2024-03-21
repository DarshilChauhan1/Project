import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from './auth.guard';

@Module({
  imports : [
    forwardRef(()=> UsersModule),
    ConfigModule.forRoot(),
    JwtModule.register({
      global : true,
      secret : process.env.ACCESS_TOKEN_SECRET,
      signOptions : {
        expiresIn : "1d"
      }
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
