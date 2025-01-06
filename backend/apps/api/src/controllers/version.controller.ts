import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Version')
@Controller('version')
export class VersionController {
  @Get()
  getVersion() {
    return {
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      // Add any other relevant information
    };
  }
}
