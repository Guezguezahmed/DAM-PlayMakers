import { Injectable } from '@nestjs/common';
import { Vonage } from '@vonage/server-sdk';

@Injectable()
export class OtpService {
  private vonage: Vonage;

  private otpStore: Map<string, { code: string; expires: number }> = new Map();

  constructor() {
    this.vonage = new Vonage({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
    });
  }

  async sendOtp(phone: string) {
    if (!phone) {
      throw new Error('Phone number is required');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      const response = await this.vonage.sms.send({
        to: phone,
        from: process.env.VONAGE_BRAND_NAME || 'Vonage',
        text: `Your OTP code is: ${otpCode}`,
      });

      if (response.messages[0].status !== '0') {
        throw new Error(`Failed to send OTP: ${response.messages[0]['error-text']}`);
      }

      // Stocker OTP 2 minutes
      this.otpStore.set(phone, {
        code: otpCode,
        expires: Date.now() + 2 * 60 * 1000,
      });

      return { success: true, message: 'OTP envoyé avec succès' };
    } catch (err) {
      console.error('Erreur lors de l\'envoi OTP:', err);
      return { success: false, message: 'Échec de l\'envoi OTP', error: err.message };
    }
  }

  verifyOtp(phone: string, code: string) {
    const entry = this.otpStore.get(phone);

    if (!entry) {
      return { success: false, message: 'OTP non trouvé' };
    }

    if (Date.now() > entry.expires) {
      this.otpStore.delete(phone);
      return { success: false, message: 'OTP expiré' };
    }

    if (entry.code !== code) {
      return { success: false, message: 'OTP invalide' };
    }

    this.otpStore.delete(phone);

    return { success: true, message: 'OTP vérifié avec succès' };
  }
}

