import { AddCreditUseCase } from '../AddCreditUseCase';
import { CreateCustomerUseCase } from '../CreateCustomerUseCase';
import { InMemoryCustomerRepository } from '../../../infrastructure/persistence/InMemoryCustomerRepository';

describe('AddCreditUseCase', () => {
  let repository: InMemoryCustomerRepository;
  let addCreditUseCase: AddCreditUseCase;
  let createCustomerUseCase: CreateCustomerUseCase;

  beforeEach(() => {
    repository = new InMemoryCustomerRepository();
    addCreditUseCase = new AddCreditUseCase(repository);
    createCustomerUseCase = new CreateCustomerUseCase(repository);
  });

  it('should add credit to existing customer', async () => {
    const customer = await createCustomerUseCase.execute({
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

    const updatedCustomer = await addCreditUseCase.execute({
      customerId: customer.getId().getValue(),
      amount: 50,
    });

    expect(updatedCustomer.getAvailableCredit().getAmount()).toBe(50);
  });

  it('should accumulate credit from multiple additions', async () => {
    const customer = await createCustomerUseCase.execute({
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
    });

    await addCreditUseCase.execute({
      customerId: customer.getId().getValue(),
      amount: 30,
    });

    const updatedCustomer = await addCreditUseCase.execute({
      customerId: customer.getId().getValue(),
      amount: 20,
    });

    expect(updatedCustomer.getAvailableCredit().getAmount()).toBe(150);
  });

  it('should throw error for non-existent customer', async () => {
    await expect(
      addCreditUseCase.execute({
        customerId: 'non-existent-id',
        amount: 50,
      })
    ).rejects.toThrow('Customer with id non-existent-id not found');
  });

  it('should throw error for zero or negative amount', async () => {
    const customer = await createCustomerUseCase.execute({
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

    await expect(
      addCreditUseCase.execute({
        customerId: customer.getId().getValue(),
        amount: 0,
      })
    ).rejects.toThrow('Credit amount must be positive');

    await expect(
      addCreditUseCase.execute({
        customerId: customer.getId().getValue(),
        amount: -10,
      })
    ).rejects.toThrow();
  });
});
