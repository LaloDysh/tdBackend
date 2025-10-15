import { Customer } from '../entities/Customer';
import { CustomerId } from '../value-objects/CustomerId';

/**
 * Repository Port (Interface) - Hexagonal Architecture
 * Defines the contract for customer persistence
 * Infrastructure adapters will implement this interface
 */
export interface CustomerRepository {
  save(customer: Customer): Promise<void>;
  findById(id: CustomerId): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  update(customer: Customer): Promise<void>;
  delete(id: CustomerId): Promise<void>;
  findAllSortedByCredit(ascending?: boolean): Promise<Customer[]>;
}
