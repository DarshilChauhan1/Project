import { Injectable } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { Action } from './ability.enum'
import { AbilityBuilder, CreateAbility, InferSubjects, MongoAbility, PureAbility, AbilityClass, detectSubjectType, ExtractSubjectType } from "@casl/ability";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

export type Subjects = InferSubjects<typeof User> | 'all'

export type AllAbility = PureAbility<[Action, Subjects]>;
@Injectable()
export class AbilityFactory {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }
    async defineAbility(user: User) {
        const { can, cannot, build } = new AbilityBuilder(PureAbility as AbilityClass<AllAbility>);
        const verifyAdmin = await this.userRepository.findOne({ where: { id: user.id }, select: ['IsAdmin'] });

        console.log(verifyAdmin);

        if (verifyAdmin.IsAdmin == 1) {
            can(Action.Manage, 'all')
        } else {
            can(Action.Read, 'all')
        }

        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        })
    }
}
