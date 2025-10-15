import { v4 as uuidv4 } from 'uuid';

/**
 * Value Object representing a Customer's unique identifier
 * Following DDD principles: immutable and validates its own state
 */
export class CustomerId {
  private readonly value: string;

  private constructor(value: string) {
    this.ensureIsValid(value);
    this.value = value;
  }

  public static create(value?: string): CustomerId {
    return new CustomerId(value || uuidv4());
  }

  public static fromString(value: string): CustomerId {
    return new CustomerId(value);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: CustomerId): boolean {
    return this.value === other.value;
  }

  private ensureIsValid(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('CustomerId cannot be empty');
    }
  }

  public toString(): string {
    return this.value;
  }
}
