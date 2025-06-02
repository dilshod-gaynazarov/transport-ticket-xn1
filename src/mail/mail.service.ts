import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  async sendOTP(email: string, otp: string): Promise<void> {
    await this.mailService.sendMail({
      to: email,
      subject: 'Transport-ticket',
      text: otp,
    });
  }
}
