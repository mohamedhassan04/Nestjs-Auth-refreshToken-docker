import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRegistrationEmail(email: string, password: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Info Account',
        text: 'Thank you for registering!',
        html: `<p>Thank you for registering!</p> voici votre login info : <br/> <b>email : </b> <span>${email}</span> <br/> <b> password :</b> <span>${password}</span>`,
      });
      console.log('Registration email sent successfully');
    } catch (error) {
      console.error('Error sending registration email:', error);
      throw new InternalServerErrorException(
        'Failed to send registration email',
      );
    }
  }
}
