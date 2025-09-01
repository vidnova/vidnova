import { registerDecorator, ValidationOptions, ValidatorConstraint } from 'class-validator';
import emojiRegex from 'emoji-regex';

@ValidatorConstraint({ name: 'IsEmoji', async: false })
export class IsEmojiConstraint {
  validate(value: string): boolean {
    const regex = emojiRegex();
    const matches = Array.from(value.matchAll(regex));

    return matches.length === 1 && matches[0][0] === value;
  }

  defaultMessage(): string {
    return 'The value must be an emoji';
  }
}

export function IsEmoji(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string | symbol) {
    registerDecorator({
      name: 'IsEmoji',
      target: target.constructor,
      propertyName: propertyName as string,
      constraints: [],
      options: validationOptions,
      validator: IsEmojiConstraint,
    });
  };
}
