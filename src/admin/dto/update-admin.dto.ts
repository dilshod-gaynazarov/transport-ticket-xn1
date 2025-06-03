import { IsBoolean, IsEmail, IsOptional } from 'class-validator';

export class UpdateAdminDto {
  @IsBoolean()
  @IsOptional()
  is_active?: false;

  @IsEmail()
  @IsOptional()
  email?: string;
}
