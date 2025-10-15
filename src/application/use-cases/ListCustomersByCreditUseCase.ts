import { Customer } from '../../domain/entities/Customer';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';

/**
 * Use Case: List all customers sorted by available credit
 */
export class ListCustomersByCreditUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(ascending: boolean = false): Promise<Customer[]> {
    return await this.customerRepository.findAllSortedByCredit(ascending);
  }
}
