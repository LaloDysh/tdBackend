import { Customer } from '../../domain/entities/Customer';
import { CustomerId } from '../../domain/value-objects/CustomerId';
import { Money } from '../../domain/value-objects/Money';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';

/**
 * Use Case: Add available credit to a customer
 */
export interface AddCreditDTO {
  customerId: string;
  amount: number;
}

export class AddCreditUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(dto: AddCreditDTO): Promise<Customer> {
    const customerId = CustomerId.fromString(dto.customerId);
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new Error(`Customer with id ${dto.customerId} not found`);
    }

    if (dto.amount <= 0) {
      throw new Error('Credit amount must be positive');
    }

    // Use domain method to add credit
    const credit = Money.fromAmount(dto.amount);
    customer.addCredit(credit);

    // Persist changes
    await this.customerRepository.update(customer);

    return customer;
  }
}
