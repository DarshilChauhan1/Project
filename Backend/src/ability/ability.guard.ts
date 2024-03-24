import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { CHECK_ABILITY, RequiredRule } from "./ability.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { AbilityFactory } from "./ability.factory";

export class AbilityGuard implements CanActivate{
    constructor(
        private readonly reflector : Reflector,
        @InjectRepository(User) private userRepository : Repository<User>,
        private readonly abilityFactory : AbilityFactory
        ){}
    async canActivate(context: ExecutionContext): Promise<any> {
        const rules = this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler());
        const {user} = context.switchToHttp().getRequest();

        const ability = await this.abilityFactory.defineAbility(user);

        console.log('Ability----->', ability)
        console.log(rules);
    }
}