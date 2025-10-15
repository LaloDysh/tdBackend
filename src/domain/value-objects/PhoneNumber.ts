/**
 * Value Object representing a Phone Number
 * Immutable and self-validating
 */
export class PhoneNumber {
  private readonly value: string;

  private constructor(value: string) {
    this.ensureIsValid(value);
    this.value = value.trim();
  }

  public static create(value: string): PhoneNumber {
    return new PhoneNumber(value);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }

  private ensureIsValid(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Phone number cannot be empty');
    }

    // Allow international format with +, spaces, hyphens, and parentheses
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      throw new Error('Invalid phone number format');
    }
  }

  public toString(): string {
    return this.value;
  }
}
