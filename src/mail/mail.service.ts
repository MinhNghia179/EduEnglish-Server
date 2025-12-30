import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(options: {
    to: string;
    subject: string;
    template: string;
    context: Record<string, any>;
    from?: string;
  }) {
    await this.mailerService
      .sendMail({
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: { ...options.context, subject: options.subject },
        ...(options.from && { from: options.from }),
      })
      .then(() => {
        console.log('Success');
      })
      .catch(() => {
        throw new ServiceUnavailableException();
      });
  }
}
