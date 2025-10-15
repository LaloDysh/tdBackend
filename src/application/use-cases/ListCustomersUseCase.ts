import { Customer } from '../../domain/entities/Customer';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';

/**
 * Use Case: List all customers
 */
export class ListCustomersUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(): Promise<Customer[]> {
    return await this.customerRepository.findAll();
  }
}
