import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsBoolean()
  @IsOptional()
  is_active: false;
}
