import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'User ID received after registration',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit OTP sent to email',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Length(6, 6)
  otp: string;
}
