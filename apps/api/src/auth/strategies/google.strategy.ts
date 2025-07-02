import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Profile, OAuth2Strategy, VerifyFunction } from 'passport-google-oauth';
import { User } from '@ecorally/dal';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(OAuth2Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyFunction) {
    try {
      const user = User.create({
        email: profile.emails[0].value,
        googleId: profile.id,
      });

      done(null, user);
    } catch (error: unknown) {
      done(error, null);
    }
  }
}
