import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { CommandValidationException } from '@ecorally/shared';
import { FastifyReply } from 'fastify';

@Catch(CommandValidationException)
export class CommandValidationFilter implements ExceptionFilter {
  catch(exception: CommandValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: FastifyReply = ctx.getResponse();

    const errors = Object.entries(exception.constraintsViolated).map(([field, constraint]) => ({
      field,
      messages: constraint.messages,
      value: constraint.value,
    }));

    const allMessages = errors.flatMap((e) => e.messages);
    const messageString = allMessages.join('\n');

    response.status(400).send({
      statusCode: 400,
      message: messageString,
      error: 'Bad Request',
    });
  }
}
