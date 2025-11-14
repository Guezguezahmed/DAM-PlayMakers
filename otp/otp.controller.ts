import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('otp')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('send')
  @ApiBody({ type: SendOtpDto }) // Required for Swagger to show JSON input
  @ApiResponse({ status: 201, description: 'OTP envoyé avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur de validation' })
  async sendOtp(@Body() dto: SendOtpDto) {
    // Validate phone number presence
    if (!dto.phone) {
      return { success: false, message: 'Le numéro de téléphone est requis' };
    }

    // Format phone number for Tunisia if not already international
    const formattedPhone = dto.phone.startsWith('+') ? dto.phone : '+216' + dto.phone;

    try {
      // Send OTP
      return await this.otpService.sendOtp(formattedPhone);
    } catch (error) {
      // Catch errors from SMS service
      return {
        success: false,
        message: error?.message || 'Erreur lors de l’envoi de l’OTP',
      };
    }
  }

  @Post('verify')
  @ApiBody({ type: VerifyOtpDto }) // Required for Swagger to show JSON input
  @ApiResponse({ status: 200, description: 'OTP vérifié avec succès' })
  @ApiResponse({ status: 400, description: 'OTP invalide ou expiré' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    // Validate phone and code presence
    if (!dto.phone || !dto.code) {
      return { success: false, message: 'Numéro ou code manquant' };
    }

    try {
      // Verify OTP
      return this.otpService.verifyOtp(dto.phone, dto.code);
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Erreur lors de la vérification de l’OTP',
      };
    }
  }
}
