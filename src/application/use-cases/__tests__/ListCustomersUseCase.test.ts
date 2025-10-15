import { ListCustomersUseCase } from '../ListCustomersUseCase';
import { CreateCustomerUseCase } from '../CreateCustomerUseCase';
import { InMemoryCustomerRepository } from '../../../infrastructure/persistence/InMemoryCustomerRepository';

describe('ListCustomersUseCase', () => {
  let repository: InMemoryCustomerRepository;
  let listUseCase: ListCustomersUseCase;
  let createUseCase: CreateCustomerUseCase;

  beforeEach(() => {
    repository = new InMemoryCustomerRepository();
    listUseCase = new ListCustomersUseCase(repository);
    createUseCase = new CreateCustomerUseCase(repository);
  });

  it('should list all customers', async () => {
    await createUseCase.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '+34612345678',
      address: {
        street: 'St 1',
        city: 'Madrid',
        postalCode: '28001',
        country: 'Spain',
      },
    });

    await createUseCase.execute({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phoneNumber: '+34687654321',
      address: {
        street: 'St 2',
        city: 'Barcelona',
        postalCode: '08001',
        country: 'Spain',
      },
    });

    const customers = await listUseCase.execute();

    expect(customers).toHaveLength(2);
  });

  it('should return empty array when no customers exist', async () => {
    const customers = await listUseCase.execute();

    expect(customers).toHaveLength(0);
  });
});
