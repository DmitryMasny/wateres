import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const smtpConfig = {
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true,
      auth: {
        user: 'digital25pro',
        pass: 'ecxwvuhkzmkxcgwh',
      },
    };
    this.transporter = nodemailer.createTransport(smtpConfig);
  }

  async sendAuthCode(email: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"digital25pro" <digital25pro@yandex.ru>`,
      to: email,
      subject: 'Код авторизации',
      text: `Ваш код: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Здравствуйте!</h2>
          <p>Ваш код авторизации:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-size: 24px; text-align: center; letter-spacing: 5px; font-weight: bold;">
            ${code}
          </div>
          <p style="margin-top: 20px;">Код действителен в течение 10 минут.</p>
          <p>Если вы не запрашивали этот код, пожалуйста, проигнорируйте это сообщение.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #777;">
            С уважением,<br>
            Команда ${this.configService.get<string>('APP_NAME', 'Wateres')}
          </p>
        </div>
      `,
    });
  }
}
