import { Customer } from '../../domain/entities/Customer';
import { Email } from '../../domain/value-objects/Email';
import { PhoneNumber } from '../../domain/value-objects/PhoneNumber';
import { Address } from '../../domain/value-objects/Address';
import { Money } from '../../domain/value-objects/Money';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';

/**
 * Use Case: Create a new customer
 * Following Single Responsibility Principle
 */
export interface CreateCustomerDTO {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  availableCredit?: number;
}

export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(dto: CreateCustomerDTO): Promise<Customer> {
    // Create value objects from primitives
    const email = Email.create(dto.email);
    const phoneNumber = PhoneNumber.create(dto.phoneNumber);
    const address = Address.create(
      dto.address.street,
      dto.address.city,
      dto.address.postalCode,
      dto.address.country
    );
    const availableCredit = dto.availableCredit
      ? Money.fromAmount(dto.availableCredit)
      : undefined;

    // Create customer entity
    const customer = Customer.create(
      dto.firstName,
      dto.lastName,
      email,
      phoneNumber,
      address,
      availableCredit
    );

    // Persist customer
    await this.customerRepository.save(customer);

    return customer;
  }
}
