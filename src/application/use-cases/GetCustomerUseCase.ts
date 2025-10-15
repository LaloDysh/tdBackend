import { Customer } from '../../domain/entities/Customer';
import { CustomerId } from '../../domain/value-objects/CustomerId';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';

/**
 * Use Case: Get a customer by ID
 */
export class GetCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(id: string): Promise<Customer> {
    const customerId = CustomerId.fromString(id);
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new Error(`Customer with id ${id} not found`);
    }

    return customer;
  }
}
