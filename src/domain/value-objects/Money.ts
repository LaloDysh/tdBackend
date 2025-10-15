/**
 * Value Object representing Money (Available Credit)
 * Immutable and self-validating
 * Uses cents to avoid floating point precision issues
 */
export class Money {
  private readonly amountInCents: number;
  private readonly currency: string;

  private constructor(amountInCents: number, currency: string = 'EUR') {
    this.ensureIsValid(amountInCents);
    this.amountInCents = Math.round(amountInCents);
    this.currency = currency;
  }

  public static fromCents(amountInCents: number, currency: string = 'EUR'): Money {
    return new Money(amountInCents, currency);
  }

  public static fromAmount(amount: number, currency: string = 'EUR'): Money {
    return new Money(amount * 100, currency);
  }

  public static zero(currency: string = 'EUR'): Money {
    return new Money(0, currency);
  }

  public getAmountInCents(): number {
    return this.amountInCents;
  }

  public getAmount(): number {
    return this.amountInCents / 100;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amountInCents + other.amountInCents, this.currency);
  }

  public subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amountInCents - other.amountInCents, this.currency);
  }

  public isGreaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.amountInCents > other.amountInCents;
  }

  public isLessThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.amountInCents < other.amountInCents;
  }

  public equals(other: Money): boolean {
    return this.amountInCents === other.amountInCents && this.currency === other.currency;
  }

  private ensureIsValid(amountInCents: number): void {
    if (amountInCents < 0) {
      throw new Error('Money amount cannot be negative');
    }

    if (!Number.isFinite(amountInCents)) {
      throw new Error('Money amount must be a finite number');
    }
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot operate on different currencies: ${this.currency} and ${other.currency}`);
    }
  }

  public toString(): string {
    return `${this.getAmount().toFixed(2)} ${this.currency}`;
  }
}
