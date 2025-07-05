import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { GoogleConfig } from '../../../config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleService {
  private readonly oauth2Client: OAuth2Client;

  constructor(private googleConfig: GoogleConfig) {
    this.oauth2Client = new OAuth2Client(
      googleConfig.clientId,
      googleConfig.clientSecret,
      googleConfig.redirectUri,
    );
  }

  getAuthUrl(): string {
    const scopes = this.googleConfig.scopes;
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }

  async getUserData(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: this.oauth2Client,
      version: 'v2',
    });

    const userInfo = await oauth2.userinfo.get();
    return {
      id: userInfo.data.id,
      email: userInfo.data.email,
      name: userInfo.data.name,
    };
  }
}
