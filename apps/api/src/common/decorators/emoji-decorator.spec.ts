import { IsEmojiConstraint } from './emoji.decorator';

describe('IsEmojiConstraint', () => {
  let constraint: IsEmojiConstraint;

  beforeEach(() => {
    constraint = new IsEmojiConstraint();
  });

  it('should return true for a valid single emoji', () => {
    expect(constraint.validate('🔥')).toBe(true);
  });

  it('should return false for a double emoji', () => {
    expect(constraint.validate('🔥🔥')).toBe(false);
  });

  it('should return false for plain text', () => {
    expect(constraint.validate('hello')).toBe(false);
    expect(constraint.validate('123')).toBe(false);
  });
});
