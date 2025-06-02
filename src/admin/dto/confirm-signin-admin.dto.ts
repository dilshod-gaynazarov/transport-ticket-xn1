import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmSignInAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
