import { Injectable } from '@nestjs/common';
import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo';

@Injectable()
export class MailService {
  private apiInstance: TransactionalEmailsApi;

  constructor() {
    const apiKey = process.env.BREVO_API_KEY;
    
    if (!apiKey) {
      console.error('❌ BREVO_API_KEY n\'est pas défini dans les variables d\'environnement');
      throw new Error('BREVO_API_KEY is required');
    } else {
      console.log('✅ Configuration Brevo API chargée');
    }

    this.apiInstance = new TransactionalEmailsApi();
    // Configurer la clé API
    this.apiInstance.setApiKey(0, apiKey);
  }

  async sendVerificationEmail(to: string, url: string) {
    const sendSmtpEmail: SendSmtpEmail = {
      sender: { email: 'faidifakhri9@gmail.com', name: 'DAM Backend' },
      to: [{ email: to }],
      subject: 'Vérification de votre email',
      htmlContent: `
        <h1>Bienvenue</h1>
        <p>Veuillez cliquer sur ce lien pour vérifier votre email :</p>
        <a href="${url}">${url}</a>
      `,
    };

    try {
      console.log('📧 Tentative d\'envoi d\'email de vérification à:', to);
      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('✅ Email envoyé avec succès via Brevo API !', response.body?.messageId);
      return response;
    } catch (error) {
      console.error('❌ Erreur API Brevo:', error);
      console.error('❌ Détails:', {
        message: error.message,
        response: error.response?.body,
        status: error.status,
      });
      throw error;
    }
  }

  async sendLoginNotificationEmail(to: string, loginInfo?: { date?: Date; ip?: string }) {
    const loginDate = loginInfo?.date || new Date();
    const formattedDate = loginDate.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const sendSmtpEmail: SendSmtpEmail = {
      sender: { email: 'faidifakhri9@gmail.com', name: 'DAM Backend' },
      to: [{ email: to }],
      subject: '🔐 Notification de connexion',
      htmlContent: `
        <h2>Nouvelle connexion détectée 🔐</h2>
        <p>Bonjour,</p>
        <p>Une connexion à votre compte a été effectuée avec succès.</p>
        <div style="background:#f5f5f5;padding:15px;border-radius:5px;margin:20px 0;">
          <p><strong>Date et heure :</strong> ${formattedDate}</p>
          ${loginInfo?.ip ? `<p><strong>Adresse IP :</strong> ${loginInfo.ip}</p>` : ''}
        </div>
        <p>Si vous n'êtes pas à l'origine de cette connexion, veuillez changer votre mot de passe immédiatement.</p>
        <p style="color:#666;font-size:12px;margin-top:30px;">
          Ceci est un email automatique, merci de ne pas y répondre.
        </p>
      `,
    };

    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('✅ Email de notification de connexion envoyé via Brevo API');
    } catch (error) {
      // Ne pas bloquer le login si l'email échoue
      console.error('❌ Erreur lors de l\'envoi de l\'email de notification de connexion:', error.message);
    }
  }
}
