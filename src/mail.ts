import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
  constructor(private configService: ConfigService) { }

  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: this.configService.get<string>('EMAIL_SMTP_HOST'),
        port: this.configService.get<number>('EMAIL_SMTP_PORT'),
        secure: this.configService.get<boolean>('EMAIL_SMTP_SECURE'),
        auth: {
          user: this.configService.get<string>('EMAIL_SMTP_USER'),
          pass: this.configService.get<string>('EMAIL_SMTP_PASSWORD'),
        },
      },
      defaults: {
        from: this.configService.get<string>('EMAIL_SMTP_FROM_NAME'),
      },
      template: {
        dir: join(process.cwd(), 'src/common/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
