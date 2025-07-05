import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleConfig {
  public readonly clientId: string;
  public readonly clientSecret: string;
  public readonly redirectUri: string;
  public readonly scopes: string[];

  constructor(configService: ConfigService) {
    this.clientId = configService.get<string>('GOOGLE_CLIENT_ID');
    this.clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    this.redirectUri = configService.get<string>('GOOGLE_REDIRECT_URI');
    this.scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];
  }
}
