import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { CryptoService } from 'src/utils/CyrptoService';
import { FileModule } from 'src/file/file.module';
import { MailModule } from 'src/mail/mail.module';
import { TokenService } from 'src/utils/TokenService';

@Module({
  imports: [SequelizeModule.forFeature([Admin]), FileModule, MailModule],
  controllers: [AdminController],
  providers: [AdminService, CryptoService, TokenService],
})
export class AdminModule {}
