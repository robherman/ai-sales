import { Injectable, Logger } from '@nestjs/common';
import { BedrockService } from '../providers/ai-sdk/bedrock';

@Injectable()
export class PromptService {
  private logger = new Logger();

  constructor(private bedrockService: BedrockService) {}
}
