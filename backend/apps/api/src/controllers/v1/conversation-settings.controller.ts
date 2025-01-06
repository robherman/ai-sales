import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ConversationSettingsService } from '../../../../../libs/conversation/src/services/conversation-settings.service';
import {
  CreateSettingsDto,
  UpdateSettingsDto,
} from '../../../../../libs/conversation/src/dtos/settings.dto';
import {
  CreateGreetingDto,
  UpdateGreetingDto,
} from '../../../../../libs/conversation/src/dtos/greetings.dto';
import { GreetingsService } from '../../../../../libs/conversation/src/services/greetings.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/auth.guard';

@ApiTags('Conversation Settings')
@ApiBearerAuth()
@Controller({
  path: '/conversation-settings',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class ConversationSettingsController {
  constructor(
    private conversationSettingsService: ConversationSettingsService,
    private greetingsService: GreetingsService,
  ) {}

  @Get(':name')
  async getSettings(@Param('name') name: string) {
    return this.conversationSettingsService.getSettings(name);
  }

  @Post()
  async createSettings(@Body() createDto: CreateSettingsDto) {
    return this.conversationSettingsService.createSettings(createDto);
  }

  @Put(':id')
  async updateSettings(
    @Param('id') id: string,
    @Body() updateDto: UpdateSettingsDto,
  ) {
    return this.conversationSettingsService.updateSettings(id, updateDto);
  }

  @Post('/greetings')
  async createGreeting(@Body() createDto: CreateGreetingDto) {
    return this.greetingsService.createGreeting(createDto);
  }

  @Put('/greetings/:id')
  async updateGreeting(
    @Param('id') id: string,
    @Body() updateDto: UpdateGreetingDto,
  ) {
    return this.greetingsService.updateGreeting(id, updateDto);
  }
}
