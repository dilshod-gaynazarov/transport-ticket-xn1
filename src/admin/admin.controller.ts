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
  ParseIntPipe,
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
import { GetCookie } from 'src/decorators/cookie.decorator';
import { SelfGuard } from 'src/guards/self.guard';
import { StatusAdminDto } from './dto/status-admin.dto';

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

  @Post('token')
  async refreshTokenAdmin(
    @GetCookie('refreshTokenAdmin') refreshToken: string,
  ) {
    return this.adminService.refreshTokenAdmin(refreshToken);
  }

  @Post('signout')
  async signOutAdmin(
    @GetCookie('refreshTokenAdmin') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.signOutAdmin(refreshToken, res);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN)
  @Get()
  async getAllAdmins() {
    return this.adminService.getAllAdmins();
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Get(':id')
  async getAdminById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getAdminById(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN)
  @Patch('status/:id')
  async activeDeactiveAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: StatusAdminDto,
  ) {
    return this.adminService.activeDeactiveAdmin(id, statusDto);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  async updateAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
    @UploadedFile(new ImageValiationPipe()) file?: Express.Multer.File,
  ) {
    return this.adminService.updateAdmin(id, updateAdminDto, file);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN)
  @Delete(':id')
  async deleteAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteAdmin(id);
  }
}
