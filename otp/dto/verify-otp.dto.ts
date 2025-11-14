import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    example: '+21650000000',
    description: 'Numéro de téléphone du destinataire',
  })
  phone: string;

  @ApiProperty({
    example: '123456',
    description: 'Code OTP reçu par SMS',
  })
  code: string;
}
