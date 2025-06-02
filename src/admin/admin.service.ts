import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { handleError } from 'src/helpers/error-handle';
import { CryptoService } from 'src/utils/CyrptoService';
import config from 'src/config';
import { AdminRoles } from 'src/enums';
import { FileService } from 'src/file/file.service';
import { generateOTP } from 'src/helpers/generate-otp';
import { successRes } from 'src/helpers/success-response';
import { MailService } from 'src/mail/mail.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfirmSignInAdminDto } from './dto/confirm-signin-admin.dto';
import { TokenService } from 'src/utils/TokenService';
import { Response } from 'express';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectModel(Admin) private adminModel: typeof Admin,
    private readonly cryptoService: CryptoService,
    private readonly fileService: FileService,
    private readonly mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly tokenService: TokenService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      const isSuperAdmin = await this.adminModel.findOne({
        where: { role: AdminRoles.SUPERADMIN },
      });
      if (!isSuperAdmin) {
        const hashedPassword = await this.cryptoService.encrypt(
          config.SUPERADMIN_PASSWORD,
        );
        await this.adminModel.create({
          email: config.SUPERADMIN_EMAIL,
          hashed_password: hashedPassword,
          role: AdminRoles.SUPERADMIN,
        });
      }
    } catch (error) {
      return handleError(error);
    }
  }

  async createAdmin(
    createAdminDto: CreateAdminDto,
    file?: Express.Multer.File,
  ): Promise<object> {
    try {
      const { email, password } = createAdminDto;
      const existsEmail = await this.adminModel.findOne({
        where: { email },
      });
      if (existsEmail) {
        throw new ConflictException('Email address already exists');
      }
      const hashedPassword = await this.cryptoService.encrypt(password);
      let image: undefined | string;
      if (file) {
        image = await this.fileService.createFile(file);
      }
      const admin = await this.adminModel.create({
        email,
        hashed_password: hashedPassword,
        image,
      });
      return successRes(admin, 201);
    } catch (error) {
      return handleError(error);
    }
  }

  async signInAdmin(signInDto: CreateAdminDto): Promise<object> {
    try {
      const { email, password } = signInDto;
      const admin = await this.adminModel.findOne({ where: { email } });
      if (!admin) {
        throw new BadRequestException('Email address or password incorrect');
      }
      const isMatchPassword = await this.cryptoService.decrypt(
        password,
        admin.dataValues?.hashed_password,
      );
      if (!isMatchPassword) {
        throw new BadRequestException('Email address or password incorrect');
      }
      const otp = generateOTP();
      await this.mailService.sendOTP(email, otp);
      await this.cacheManager.set(email, otp, 120000);
      return successRes(email);
    } catch (error) {
      return handleError(error);
    }
  }

  async confirmSignInAdmin(
    confirmSignInAdminDto: ConfirmSignInAdminDto,
    res: Response,
  ): Promise<object> {
    try {
      const { email, otp } = confirmSignInAdminDto;
      const admin = await this.adminModel.findOne({ where: { email } });
      if (!admin) {
        throw new BadRequestException('Wrong email address');
      }
      const isTrueOTP = await this.cacheManager.get(email);
      if (!isTrueOTP || isTrueOTP != otp) {
        throw new BadRequestException('OTP expired');
      }
      const { id, role, is_active } = admin.dataValues;
      const payload = { id, role, is_active };
      const accessToken = await this.tokenService.generateAccessToken(payload);
      const refreshToken =
        await this.tokenService.generateRefreshToken(payload);
      await this.tokenService.writeToCookie(
        res,
        'refreshTokenAdmin',
        refreshToken,
      );
      return successRes(accessToken);
    } catch (error) {
      return handleError(error);
    }
  }
}
