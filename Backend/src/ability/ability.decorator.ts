import { SetMetadata } from "@nestjs/common"
import { Action } from "./ability.enum";
import { Subjects } from "./ability.factory";


export interface RequiredRule{
    action : Action[],
    subjects : Subjects
}

export const CHECK_ABILITY = 'check_ability'

export const ChechkAbilities = (...requirements : RequiredRule[])=> SetMetadata(CHECK_ABILITY, requirements);