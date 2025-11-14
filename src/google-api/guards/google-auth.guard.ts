import { Injectable, ExecutionContext, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if Google credentials are configured
    // Try config first, then fallback to env
    let clientID = this.configService.get<string>('google.clientId');
    let clientSecret = this.configService.get<string>('google.clientSecret');

    if (!clientID || clientID === 'NO_GOOGLE_CLIENT_ID') {
      clientID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    }
    if (!clientSecret || clientSecret === 'NO_GOOGLE_CLIENT_SECRET') {
      clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    }
    
    if (!clientID || !clientSecret) {
      throw new BadRequestException('Google OAuth2 is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.');
    }
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err) {
      throw err instanceof UnauthorizedException ? err : new UnauthorizedException('Google authentication failed');
    }
    if (!user) {
      throw new UnauthorizedException('Google authentication failed');
    }
    return user;
  }
}

