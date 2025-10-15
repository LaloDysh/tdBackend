import { CustomerId } from '../value-objects/CustomerId';
import { Email } from '../value-objects/Email';
import { PhoneNumber } from '../value-objects/PhoneNumber';
import { Money } from '../value-objects/Money';
import { Address } from '../value-objects/Address';

/**
 * Customer Entity - Aggregate Root
 * Represents a customer of the online motorbike shop
 * Following DDD principles with rich domain model
 */
export class Customer {
  private readonly id: CustomerId;
  private firstName: string;
  private lastName: string;
  private email: Email;
  private phoneNumber: PhoneNumber;
  private address: Address;
  private availableCredit: Money;
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(
    id: CustomerId,
    firstName: string,
    lastName: string,
    email: Email,
    phoneNumber: PhoneNumber,
    address: Address,
    availableCredit: Money,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.ensureIsValid(firstName, lastName);
    this.id = id;
    this.firstName = firstName.trim();
    this.lastName = lastName.trim();
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.availableCredit = availableCredit;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static create(
    firstName: string,
    lastName: string,
    email: Email,
    phoneNumber: PhoneNumber,
    address: Address,
    availableCredit?: Money
  ): Customer {
    const now = new Date();
    return new Customer(
      CustomerId.create(),
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      availableCredit || Money.zero(),
      now,
      now
    );
  }

  public static reconstitute(
    id: CustomerId,
    firstName: string,
    lastName: string,
    email: Email,
    phoneNumber: PhoneNumber,
    address: Address,
    availableCredit: Money,
    createdAt: Date,
    updatedAt: Date
  ): Customer {
    return new Customer(
      id,
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      availableCredit,
      createdAt,
      updatedAt
    );
  }

  // Business logic: Add credit to customer account
  public addCredit(amount: Money): void {
    if (amount.getAmountInCents() <= 0) {
      throw new Error('Credit amount must be positive');
    }
    this.availableCredit = this.availableCredit.add(amount);
    this.updatedAt = new Date();
  }

  // Business logic: Update customer information
  public updateInformation(
    firstName: string,
    lastName: string,
    email: Email,
    phoneNumber: PhoneNumber,
    address: Address
  ): void {
    this.ensureIsValid(firstName, lastName);
    this.firstName = firstName.trim();
    this.lastName = lastName.trim();
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.updatedAt = new Date();
  }

  // Getters
  public getId(): CustomerId {
    return this.id;
  }

  public getFirstName(): string {
    return this.firstName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getPhoneNumber(): PhoneNumber {
    return this.phoneNumber;
  }

  public getAddress(): Address {
    return this.address;
  }

  public getAvailableCredit(): Money {
    return this.availableCredit;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  private ensureIsValid(firstName: string, lastName: string): void {
    if (!firstName || firstName.trim().length === 0) {
      throw new Error('First name cannot be empty');
    }
    if (!lastName || lastName.trim().length === 0) {
      throw new Error('Last name cannot be empty');
    }
  }

  public equals(other: Customer): boolean {
    return this.id.equals(other.id);
  }
}
