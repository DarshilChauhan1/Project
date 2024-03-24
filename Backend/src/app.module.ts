import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { AbilityModule } from './ability/ability.module';
import { AllExceptionFiler } from './exceptionfilter/exceptionhandling.middleware';

@Module({
  imports: [
    JwtModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities : true,
        synchronize: true,
        logging : true
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    AbilityModule,
    ],
  controllers: [AppController],
  providers: [
    {
      provide : APP_FILTER,
      useClass : AllExceptionFiler
    },
    AppService],
})
export class AppModule {}
