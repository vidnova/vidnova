import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';

export abstract class BaseCommand {
  static create<T extends BaseCommand>(this: new (...args: unknown[]) => T, data: T): T {
    const convertedObject = plainToInstance<T, unknown>(this, { ...data });

    const errors = validateSync(convertedObject);
    const flattenedErrors = flattenErrors(errors);
    if (Object.keys(flattenedErrors).length > 0) {
      throw new CommandValidationException(this.name, flattenedErrors);
    }

    return convertedObject;
  }
}

export class ConstraintValidation {
  messages: string[];
  value?: string | number | boolean | object | object[] | null;
}

function flattenErrors(
  errors: ValidationError[],
  prefix: string = '',
): Record<string, ConstraintValidation> {
  const result: Record<string, ConstraintValidation> = {};

  for (const error of errors) {
    const currentKey = prefix ? `${prefix}.${error.property}` : error.property;

    if (error.constraints) {
      result[currentKey] = {
        messages: Object.values(error.constraints),
        value: error.value,
      };
    }

    if (error.children && error.children.length > 0) {
      const childErrors = flattenErrors(error.children, currentKey);
      for (const [key, value] of Object.entries(childErrors)) {
        if (result[key]) {
          result[key].messages = result[key].messages.concat(value.messages);
        } else {
          result[key] = value;
        }
      }
    }
  }

  return result;
}

export class CommandValidationException extends Error {
  constructor(
    public readonly className: string,
    public readonly constraintsViolated: Record<string, ConstraintValidation>,
  ) {
    super('Validation failed');
    Object.setPrototypeOf(this, CommandValidationException.prototype);
    this.name = 'CommandValidationException';
  }
}
