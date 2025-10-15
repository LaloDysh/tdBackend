/**
 * Value Object representing a physical Address
 * Important for motorbike delivery
 */
export class Address {
  private readonly street: string;
  private readonly city: string;
  private readonly postalCode: string;
  private readonly country: string;

  private constructor(street: string, city: string, postalCode: string, country: string) {
    this.ensureIsValid(street, city, postalCode, country);
    this.street = street.trim();
    this.city = city.trim();
    this.postalCode = postalCode.trim();
    this.country = country.trim();
  }

  public static create(street: string, city: string, postalCode: string, country: string): Address {
    return new Address(street, city, postalCode, country);
  }

  public getStreet(): string {
    return this.street;
  }

  public getCity(): string {
    return this.city;
  }

  public getPostalCode(): string {
    return this.postalCode;
  }

  public getCountry(): string {
    return this.country;
  }

  public equals(other: Address): boolean {
    return (
      this.street === other.street &&
      this.city === other.city &&
      this.postalCode === other.postalCode &&
      this.country === other.country
    );
  }

  private ensureIsValid(street: string, city: string, postalCode: string, country: string): void {
    if (!street || street.trim().length === 0) {
      throw new Error('Street cannot be empty');
    }
    if (!city || city.trim().length === 0) {
      throw new Error('City cannot be empty');
    }
    if (!postalCode || postalCode.trim().length === 0) {
      throw new Error('Postal code cannot be empty');
    }
    if (!country || country.trim().length === 0) {
      throw new Error('Country cannot be empty');
    }
  }

  public toString(): string {
    return `${this.street}, ${this.city}, ${this.postalCode}, ${this.country}`;
  }
}
