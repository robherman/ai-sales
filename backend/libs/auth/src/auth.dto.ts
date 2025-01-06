import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword, IsOptional } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword({}, { message: 'Weak Password' })
  @IsOptional()
  password?: string;
}
