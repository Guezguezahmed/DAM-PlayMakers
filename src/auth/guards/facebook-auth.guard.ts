import { Injectable, ExecutionContext, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookAuthGuard extends AuthGuard('facebook') {
  constructor(private configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if Facebook credentials are configured
    const appID = this.configService.get<string>('FACEBOOK_APP_ID');
    const appSecret = this.configService.get<string>('FACEBOOK_APP_SECRET');
    
    if (!appID || !appSecret) {
      throw new BadRequestException('Facebook OAuth2 is not configured. Please set FACEBOOK_APP_ID and FACEBOOK_APP_SECRET in your .env file.');
    }
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err) {
      throw err instanceof UnauthorizedException ? err : new UnauthorizedException('Facebook authentication failed');
    }
    if (!user) {
      throw new UnauthorizedException('Facebook authentication failed');
    }
    return user;
  }
}

