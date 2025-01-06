import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from '@lib/users';
import { CurrentUser } from '../../decorators/user.decorator';
import { JwtAuthGuard } from '../../guards/auth.guard';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller({
  path: '/profile',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private usersService: UsersService) {}

  @Get('')
  async getUserProfile(@CurrentUser('userId') userId: string) {
    const { data: user } = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }
}
