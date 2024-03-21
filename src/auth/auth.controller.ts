import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from 'src/users/dto/auth-user.dto';

@Controller()
export class AuthController {
    constructor(private authService : AuthService){}
    @Post('login')
    async login(@Body() authPayload : AuthUserDto){
        return this.authService.login(authPayload)
    }
}
