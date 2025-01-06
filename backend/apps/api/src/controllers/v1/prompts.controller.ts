import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PromptsService } from '../../../../../libs/prompts/src';
import {
  CreatePromptTemplateDto,
  UpdatePromptTemplateDto,
} from '../../../../../libs/prompts/src/dtos/prompt.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/auth.guard';

@ApiTags('Prompts')
@ApiBearerAuth()
@Controller({
  path: '/prompts',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class PromptsController {
  constructor(private promptsService: PromptsService) {}

  @Get('')
  async getPrompts() {
    return this.promptsService.getPrompts();
  }

  @Get(':id')
  async getPromptTemplate(@Param('id') name: string) {
    return this.promptsService.getPromptTemplate(name);
  }

  @Post()
  async createPromptTemplate(@Body() createDto: CreatePromptTemplateDto) {
    return this.promptsService.createPromptTemplate(createDto);
  }

  @Put(':id')
  async updatePromptTemplate(
    @Param('id') id: string,
    @Body() updateDto: UpdatePromptTemplateDto,
  ) {
    return this.promptsService.updatePromptTemplate(id, updateDto);
  }
}
