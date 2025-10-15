import { GetCustomerUseCase } from '../GetCustomerUseCase';
import { CreateCustomerUseCase } from '../CreateCustomerUseCase';
import { InMemoryCustomerRepository } from '../../../infrastructure/persistence/InMemoryCustomerRepository';

describe('GetCustomerUseCase', () => {
  let repository: InMemoryCustomerRepository;
  let getUseCase: GetCustomerUseCase;
  let createUseCase: CreateCustomerUseCase;

  beforeEach(() => {
    repository = new InMemoryCustomerRepository();
    getUseCase = new GetCustomerUseCase(repository);
    createUseCase = new CreateCustomerUseCase(repository);
  });

  it('should get an existing customer by ID', async () => {
    const customer = await createUseCase.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '+34612345678',
      address: {
        street: 'Main St 123',
        city: 'Madrid',
        postalCode: '28001',
        country: 'Spain',
      },
    });

    const retrieved = await getUseCase.execute(customer.getId().getValue());

    expect(retrieved.getId().equals(customer.getId())).toBe(true);
    expect(retrieved.getFirstName()).toBe('John');
    expect(retrieved.getLastName()).toBe('Doe');
  });

  it('should throw error for non-existent customer', async () => {
    await expect(getUseCase.execute('non-existent-id')).rejects.toThrow(
      'Customer with id non-existent-id not found'
    );
  });
});
