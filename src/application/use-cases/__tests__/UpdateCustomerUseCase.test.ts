import { UpdateCustomerUseCase } from '../UpdateCustomerUseCase';
import { CreateCustomerUseCase } from '../CreateCustomerUseCase';
import { InMemoryCustomerRepository } from '../../../infrastructure/persistence/InMemoryCustomerRepository';

describe('UpdateCustomerUseCase', () => {
  let repository: InMemoryCustomerRepository;
  let updateUseCase: UpdateCustomerUseCase;
  let createUseCase: CreateCustomerUseCase;

  beforeEach(() => {
    repository = new InMemoryCustomerRepository();
    updateUseCase = new UpdateCustomerUseCase(repository);
    createUseCase = new CreateCustomerUseCase(repository);
  });

  it('should update an existing customer', async () => {
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

    const updated = await updateUseCase.execute({
      id: customer.getId().getValue(),
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phoneNumber: '+34687654321',
      address: {
        street: 'New St 456',
        city: 'Barcelona',
        postalCode: '08001',
        country: 'Spain',
      },
    });

    expect(updated.getFirstName()).toBe('Jane');
    expect(updated.getLastName()).toBe('Smith');
    expect(updated.getEmail().getValue()).toBe('jane@example.com');
  });

  it('should throw error for non-existent customer', async () => {
    await expect(
      updateUseCase.execute({
        id: 'non-existent-id',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phoneNumber: '+34687654321',
        address: {
          street: 'New St 456',
          city: 'Barcelona',
          postalCode: '08001',
          country: 'Spain',
        },
      })
    ).rejects.toThrow('Customer with id non-existent-id not found');
  });

  it('should throw error for invalid email', async () => {
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

    await expect(
      updateUseCase.execute({
        id: customer.getId().getValue(),
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'invalid-email',
        phoneNumber: '+34687654321',
        address: {
          street: 'New St 456',
          city: 'Barcelona',
          postalCode: '08001',
          country: 'Spain',
        },
      })
    ).rejects.toThrow('Invalid email format');
  });
});
