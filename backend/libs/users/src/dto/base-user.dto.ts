import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  IsUUID,
  Length,
} from 'class-validator';
import { UserRole } from '../interfaces/role.interface';

export class BaseUserDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword({}, { message: 'Weak Password' })
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsPhoneNumber('AR')
  @IsOptional()
  mobile: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 4,
  })
  @IsString()
  @IsOptional()
  @Length(1, 4)
  mobileCode: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 30,
  })
  @IsString()
  @Length(1, 30)
  @IsOptional()
  firstName: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 30,
  })
  @IsString()
  @Length(1, 30)
  @IsOptional()
  lastName: string;

  @ApiProperty({
    enum: UserRole,
    isArray: true,
  })
  @IsArray()
  roles: UserRole[];

  @ApiProperty()
  @IsDate()
  lastLoginAt: Date;

  @ApiProperty()
  @IsBoolean()
  isFirstLogin: boolean;

  @ApiProperty()
  @IsBoolean()
  emailVerified: boolean;

  @ApiProperty()
  @IsBoolean()
  phoneVerified: boolean;
}
