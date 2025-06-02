import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValiationPipe } from 'src/pipes/image-validation.pipe';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ConfirmSignInAdminDto } from './dto/confirm-signin-admin.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { CheckRoles } from 'src/decorators/role.decorator';
import { AdminRoles } from 'src/enums';
import { RolesGuard } from 'src/guards/roles.guard';

@UseInterceptors(CacheInterceptor)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @UploadedFile(new ImageValiationPipe()) file?: Express.Multer.File,
  ) {
    return this.adminService.createAdmin(createAdminDto, file);
  }

  @Post('signin')
  async signInAdmin(@Body() signInDto: CreateAdminDto) {
    return this.adminService.signInAdmin(signInDto);
  }

  @Post('confirm-signin')
  async confirmSignInAdmin(
    @Body() confirmSignInAdminDto: ConfirmSignInAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.confirmSignInAdmin(confirmSignInAdminDto, res);
  }
}
