import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get<string>('SMTP_SERVICE'),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendVerificationEmail(toEmail: string, name: string, code: string) {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM'),
        to: toEmail,
        subject: 'Code de vérification',
        text: `Salut ${name}, ton code de vérification est : ${code}`,
      });
      return { message: 'Email envoyé avec succès !' };
    } catch (error) {
      console.error('Erreur Nodemailer:', error);
      throw new InternalServerErrorException(
        'Impossible d’envoyer l’email via SMTP',
      );
    }
  }
}
