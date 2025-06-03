import { IsBoolean, IsNotEmpty } from 'class-validator';

export class StatusAdminDto {
  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean;
}
