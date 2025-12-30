import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'otp must be exactly 6 characters' })
  otp: string;

  @IsEmail()
  email: string;
}
