import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class RegisterDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        "Password isn't strong enough. It must contain at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol.",
    },
  )
  password: string;

  @IsNotEmpty()
  @Match('password', { message: 'password does not match' })
  confirmPassword: string;
}
