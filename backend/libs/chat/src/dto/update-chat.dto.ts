import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { BaseChatDto } from './base-chat.dto';

export class UpdateChatDto extends IntersectionType(
  OmitType(PartialType(BaseChatDto), ['id']),
) {}
