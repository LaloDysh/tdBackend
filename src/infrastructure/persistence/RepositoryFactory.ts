import { CustomerRepository } from '../../domain/repositories/CustomerRepository';
import { FileCustomerRepository } from './FileCustomerRepository';
import { InMemoryCustomerRepository } from './InMemoryCustomerRepository';

/**
 * Repository Factory
 * Returns the appropriate repository implementation based on environment
 *
 * - Local development (serverless-offline): Uses FileCustomerRepository for persistence
 * - Testing: Uses InMemoryCustomerRepository for isolation
 * - Production: Should use DynamoDB or another persistent database
 */

const USE_FILE_STORAGE = process.env.USE_FILE_STORAGE !== 'false';

let customerRepositoryInstance: CustomerRepository | null = null;

export function getCustomerRepository(): CustomerRepository {
  if (!customerRepositoryInstance) {
    if (process.env.NODE_ENV === 'test') {
      // Use in-memory for tests
      customerRepositoryInstance = new InMemoryCustomerRepository();
      console.log('[RepositoryFactory] Created InMemoryCustomerRepository for testing');
    } else if (USE_FILE_STORAGE) {
      // Use file-based storage for local development
      customerRepositoryInstance = new FileCustomerRepository();
      console.log('[RepositoryFactory] Created FileCustomerRepository for local development');
    } else {
      // Fallback to in-memory
      customerRepositoryInstance = new InMemoryCustomerRepository();
      console.log('[RepositoryFactory] Created InMemoryCustomerRepository');
    }
  }

  return customerRepositoryInstance;
}

// For testing purposes only
export function resetRepository(): void {
  customerRepositoryInstance = null;
}
