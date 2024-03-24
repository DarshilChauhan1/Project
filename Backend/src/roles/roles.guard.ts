import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ConflictException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './roles.enum';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    console.log('Enter')
    const requireRole = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass()
    ])
    console.log(requireRole);
    const request = context.switchToHttp().getRequest();
    const Token = this.extractTokenFromHeader(request);

    try {
      if (!Token) throw new ConflictException('Token is not found')
      const decode = await this.jwtService.decode(Token)

      const getUserRole = await this.userRepository.find({where : {id : decode.id}, select : ["roles"]});

      if(requireRole.includes(getUserRole[0].roles)) return true;

    } catch (error) {
      throw new UnauthorizedException('User is not authorized')
    }
    return false;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ");
    return type == 'Bearer' ? token : undefined;
  }
}
