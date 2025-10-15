/**
 * Value Object representing an Email address
 * Immutable and self-validating
 */
export class Email {
  private readonly value: string;

  private constructor(value: string) {
    const trimmedValue = value?.trim() || '';
    this.ensureIsValid(trimmedValue);
    this.value = trimmedValue.toLowerCase();
  }

  public static create(value: string): Email {
    return new Email(value);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }

  private ensureIsValid(value: string): void {
    if (!value || value.length === 0) {
      throw new Error('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error('Invalid email format');
    }
  }

  public toString(): string {
    return this.value;
  }
}
