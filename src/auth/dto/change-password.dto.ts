import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  oldPassword: string;

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
        "New password isn't strong enough. It must contain at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol.",
    },
  )
  newPassword: string;
}
