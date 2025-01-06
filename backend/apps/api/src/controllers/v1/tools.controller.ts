import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { ToolsService } from '@lib/tools';

@ApiTags('AI Tools')
@ApiBearerAuth()
@Controller({
  path: '/tools',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class ToolsController {
  constructor(private toolsService: ToolsService) {}

  @Get('')
  async getAllTools() {
    const result = await this.toolsService.getTools();
    return result;
  }

  @Get(':id')
  async getToolById(@Param('id') toolId: string) {
    try {
      const result = await this.toolsService.getToolById(toolId);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  @Post(':name/run')
  async runTool(@Body() dto: any, @Param('name') toolName: string) {
    try {
      const result = await this.toolsService.executeToolByName(
        toolName,
        dto.params,
      );
      return result;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
