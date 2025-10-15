import { CustomerId } from '../../domain/value-objects/CustomerId';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';

/**
 * Use Case: Delete a customer
 */
export class DeleteCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(id: string): Promise<void> {
    const customerId = CustomerId.fromString(id);
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new Error(`Customer with id ${id} not found`);
    }

    await this.customerRepository.delete(customerId);
  }
}
