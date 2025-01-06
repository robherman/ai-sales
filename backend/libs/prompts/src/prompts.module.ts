import { Module } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromptTemplateEntity } from './entites/prompt-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PromptTemplateEntity])],
  providers: [PromptsService],
  exports: [PromptsService],
})
export class PromptsModule {}
