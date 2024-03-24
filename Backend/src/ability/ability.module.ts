import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { AbilityFactory } from './ability.factory';

@Module({
    imports : [TypeOrmModule.forFeature([User])],
    providers : [AbilityFactory],
    exports : [AbilityFactory]
})
export class AbilityModule {}
