import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(private jwtService: JwtService) {}

  async login(user: { email: string; id: string }) {
    const payload = { email: user.email, sub: user.id };
    this.logger.log(`Login by: ${user.id}`);
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
