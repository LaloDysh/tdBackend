import { ListCustomersByCreditUseCase } from '../ListCustomersByCreditUseCase';
import { CreateCustomerUseCase } from '../CreateCustomerUseCase';
import { InMemoryCustomerRepository } from '../../../infrastructure/persistence/InMemoryCustomerRepository';

describe('ListCustomersByCreditUseCase', () => {
  let repository: InMemoryCustomerRepository;
  let listUseCase: ListCustomersByCreditUseCase;
  let createUseCase: CreateCustomerUseCase;

  beforeEach(() => {
    repository = new InMemoryCustomerRepository();
    listUseCase = new ListCustomersByCreditUseCase(repository);
    createUseCase = new CreateCustomerUseCase(repository);
  });

  it('should list customers sorted by credit in descending order by default', async () => {
    await createUseCase.execute({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      phoneNumber: '+34612345678',
      address: { street: 'St 1', city: 'Madrid', postalCode: '28001', country: 'Spain' },
      availableCredit: 50,
    });

    await createUseCase.execute({
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob@example.com',
      phoneNumber: '+34687654321',
      address: { street: 'St 2', city: 'Madrid', postalCode: '28002', country: 'Spain' },
      availableCredit: 100,
    });

    await createUseCase.execute({
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie@example.com',
      phoneNumber: '+34623456789',
      address: { street: 'St 3', city: 'Madrid', postalCode: '28003', country: 'Spain' },
      availableCredit: 75,
    });

    const customers = await listUseCase.execute(false);

    expect(customers).toHaveLength(3);
    expect(customers[0].getFirstName()).toBe('Bob');
    expect(customers[0].getAvailableCredit().getAmount()).toBe(100);
    expect(customers[1].getFirstName()).toBe('Charlie');
    expect(customers[1].getAvailableCredit().getAmount()).toBe(75);
    expect(customers[2].getFirstName()).toBe('Alice');
    expect(customers[2].getAvailableCredit().getAmount()).toBe(50);
  });

  it('should list customers sorted by credit in ascending order', async () => {
    await createUseCase.execute({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      phoneNumber: '+34612345678',
      address: { street: 'St 1', city: 'Madrid', postalCode: '28001', country: 'Spain' },
      availableCredit: 50,
    });

    await createUseCase.execute({
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob@example.com',
      phoneNumber: '+34687654321',
      address: { street: 'St 2', city: 'Madrid', postalCode: '28002', country: 'Spain' },
      availableCredit: 100,
    });

    const customers = await listUseCase.execute(true);

    expect(customers).toHaveLength(2);
    expect(customers[0].getFirstName()).toBe('Alice');
    expect(customers[0].getAvailableCredit().getAmount()).toBe(50);
    expect(customers[1].getFirstName()).toBe('Bob');
    expect(customers[1].getAvailableCredit().getAmount()).toBe(100);
  });

  it('should return empty array when no customers exist', async () => {
    const customers = await listUseCase.execute();

    expect(customers).toHaveLength(0);
  });
});
