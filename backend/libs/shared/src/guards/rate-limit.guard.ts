import {
  Injectable,
  CanActivate,
  Inject,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    @Inject('CACHE_MANAGER') private cacheManager: any,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const limit =
      this.reflector.get<number>('rateLimit', context.getHandler()) || 100;
    const ttl =
      this.reflector.get<number>('rateLimitTtl', context.getHandler()) || 3600;

    const key = `rateLimit:${request.ip}`;
    const currentCount = (await this.cacheManager.get(key)) || 0;

    if (currentCount >= limit) {
      throw new HttpException(
        'Too Many Requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // await this.cacheManager.set(key, currentCount + 1, ttl);
    return true;
  }
}
