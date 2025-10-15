import { CreateCustomerUseCase } from '../CreateCustomerUseCase';
import { InMemoryCustomerRepository } from '../../../infrastructure/persistence/InMemoryCustomerRepository';

describe('CreateCustomerUseCase', () => {
  let repository: InMemoryCustomerRepository;
  let useCase: CreateCustomerUseCase;

  beforeEach(() => {
    repository = new InMemoryCustomerRepository();
    useCase = new CreateCustomerUseCase(repository);
  });

  it('should create a customer with valid data', async () => {
    const dto = {
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
    };

    const customer = await useCase.execute(dto);

    expect(customer.getFirstName()).toBe('John');
    expect(customer.getLastName()).toBe('Doe');
    expect(customer.getEmail().getValue()).toBe('john@example.com');
    expect(customer.getAvailableCredit().getAmount()).toBe(0);
  });

  it('should create a customer with initial credit', async () => {
    const dto = {
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
      availableCredit: 100,
    };

    const customer = await useCase.execute(dto);

    expect(customer.getAvailableCredit().getAmount()).toBe(100);
  });

  it('should persist customer in repository', async () => {
    const dto = {
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
    };

    const customer = await useCase.execute(dto);
    const savedCustomer = await repository.findById(customer.getId());

    expect(savedCustomer).toBeDefined();
    expect(savedCustomer?.getId().equals(customer.getId())).toBe(true);
  });

  it('should throw error for invalid email', async () => {
    const dto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      phoneNumber: '+34612345678',
      address: {
        street: 'Main St 123',
        city: 'Madrid',
        postalCode: '28001',
        country: 'Spain',
      },
    };

    await expect(useCase.execute(dto)).rejects.toThrow('Invalid email format');
  });
});
