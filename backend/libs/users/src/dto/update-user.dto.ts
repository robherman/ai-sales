import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { BaseUserDto } from './base-user.dto';

export class UpdateUserDto extends IntersectionType(
  OmitType(PartialType(BaseUserDto), ['id']),
) {}
