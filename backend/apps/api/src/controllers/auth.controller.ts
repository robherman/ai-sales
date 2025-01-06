import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '@lib/users';
import { AuthService } from '@lib/auth';
import { AuthLoginDto } from '@lib/auth/auth.dto';
import * as bcrypt from 'bcrypt';

@ApiTags('Auth')
@Controller({
  path: '/auth',
})
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: AuthLoginDto) {
    try {
      const { data: user } = await this.usersService.findByEmail(
        loginDto.email,
      );

      if (user && (await bcrypt.compare(loginDto.password!, user.password!))) {
        const loginRepsonse = await this.authService.login(user);
        return loginRepsonse;
      } else {
        throw new UnauthorizedException(`User/Password invalid`);
      }
    } catch (error) {
      throw new UnauthorizedException(`Failed login`);
    }
  }
}
