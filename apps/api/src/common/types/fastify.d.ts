import { User } from '@ecorally/dal';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
    cookies: {
      refreshToken?: string;
    };
  }
}
