import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  SalesConfigService,
  UserConfigService,
} from '../../../../../libs/config/src';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { CurrentUser } from '../../decorators/user.decorator';

@ApiTags('Config')
@ApiBearerAuth()
@Controller({
  path: '/config',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class ConfigController {
  constructor(
    private userSettingsService: UserConfigService,
    private salesConfigService: SalesConfigService,
  ) {}

  @Get('/user')
  async getUserSettings(@CurrentUser('userId') userId: string) {
    return this.userSettingsService.getUserSettings(userId);
  }

  @Put('/user')
  async updateUserSettings(
    @CurrentUser('userId') userId: string,
    @Body() settings: Record<string, any>,
  ) {
    return this.userSettingsService.updateUserSettings(userId, settings);
  }

  @Put('/user/active-chatbot')
  async setActiveChatbot(
    @CurrentUser('userId') userId: string,
    @Body('chatbotId') chatbotId: string,
  ) {
    return this.userSettingsService.setActiveChatbot(userId, chatbotId);
  }

  @Get('/sales')
  async getSalesSettings(@CurrentUser('userId') userId: string) {
    return this.salesConfigService.getConfig();
  }

  @Put('/sales')
  async updateSalesSettings(
    @CurrentUser('userId') userId: string,
    @Body() settings: Record<string, any>,
  ) {
    return this.salesConfigService.updateConfig(settings);
  }
}
