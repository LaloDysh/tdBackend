import { Customer } from '../../domain/entities/Customer';
import { CustomerId } from '../../domain/value-objects/CustomerId';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';

/**
 * In-Memory implementation of CustomerRepository
 * Adapter for the Repository Port - Hexagonal Architecture
 * For production, this should be replaced with a real database (DynamoDB, MongoDB, PostgreSQL, etc.)
 */
export class InMemoryCustomerRepository implements CustomerRepository {
  private customers: Map<string, Customer> = new Map();

  public async save(customer: Customer): Promise<void> {
    this.customers.set(customer.getId().getValue(), customer);
  }

  public async findById(id: CustomerId): Promise<Customer | null> {
    return this.customers.get(id.getValue()) || null;
  }

  public async findAll(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  public async update(customer: Customer): Promise<void> {
    const id = customer.getId().getValue();
    if (!this.customers.has(id)) {
      throw new Error(`Customer with id ${id} not found`);
    }
    this.customers.set(id, customer);
  }

  public async delete(id: CustomerId): Promise<void> {
    const deleted = this.customers.delete(id.getValue());
    if (!deleted) {
      throw new Error(`Customer with id ${id.getValue()} not found`);
    }
  }

  public async findAllSortedByCredit(ascending: boolean = false): Promise<Customer[]> {
    const customers = Array.from(this.customers.values());

    return customers.sort((a, b) => {
      const creditA = a.getAvailableCredit().getAmountInCents();
      const creditB = b.getAvailableCredit().getAmountInCents();

      return ascending ? creditA - creditB : creditB - creditA;
    });
  }

  // Test helper methods
  public clear(): void {
    this.customers.clear();
  }

  public getCount(): number {
    return this.customers.size;
  }
}
