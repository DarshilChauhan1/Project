import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const Token = this.extractTokenFromHeader(request);

        if (!Token) throw new UnauthorizedException('Token Expired')

        try {
            const payload = await this.jwtService.verifyAsync(
                Token,
                {
                    secret: this.configService.get('ACCESS_TOKEN_SECRET')
                }
            )
            request.user = {id : payload.id};
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid Token')
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ");
        return type == 'Bearer' ? token : undefined;
    }
}