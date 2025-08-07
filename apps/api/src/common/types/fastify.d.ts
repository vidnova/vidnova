import { User } from '@vidnova/dal';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
    cookies: {
      refreshToken?: string;
    };
  }
}
