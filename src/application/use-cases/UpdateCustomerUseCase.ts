import { Customer } from '../../domain/entities/Customer';
import { CustomerId } from '../../domain/value-objects/CustomerId';
import { Email } from '../../domain/value-objects/Email';
import { PhoneNumber } from '../../domain/value-objects/PhoneNumber';
import { Address } from '../../domain/value-objects/Address';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';

/**
 * Use Case: Update an existing customer
 */
export interface UpdateCustomerDTO {
  id: string;
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
}

export class UpdateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(dto: UpdateCustomerDTO): Promise<Customer> {
    const customerId = CustomerId.fromString(dto.id);
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new Error(`Customer with id ${dto.id} not found`);
    }

    // Create value objects from primitives
    const email = Email.create(dto.email);
    const phoneNumber = PhoneNumber.create(dto.phoneNumber);
    const address = Address.create(
      dto.address.street,
      dto.address.city,
      dto.address.postalCode,
      dto.address.country
    );

    // Update customer using domain method
    customer.updateInformation(dto.firstName, dto.lastName, email, phoneNumber, address);

    // Persist changes
    await this.customerRepository.update(customer);

    return customer;
  }
}
