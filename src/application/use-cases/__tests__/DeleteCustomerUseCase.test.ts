import { DeleteCustomerUseCase } from '../DeleteCustomerUseCase';
import { CreateCustomerUseCase } from '../CreateCustomerUseCase';
import { GetCustomerUseCase } from '../GetCustomerUseCase';
import { InMemoryCustomerRepository } from '../../../infrastructure/persistence/InMemoryCustomerRepository';

describe('DeleteCustomerUseCase', () => {
  let repository: InMemoryCustomerRepository;
  let deleteUseCase: DeleteCustomerUseCase;
  let createUseCase: CreateCustomerUseCase;
  let getUseCase: GetCustomerUseCase;

  beforeEach(() => {
    repository = new InMemoryCustomerRepository();
    deleteUseCase = new DeleteCustomerUseCase(repository);
    createUseCase = new CreateCustomerUseCase(repository);
    getUseCase = new GetCustomerUseCase(repository);
  });

  it('should delete an existing customer', async () => {
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

    await deleteUseCase.execute(customer.getId().getValue());

    await expect(getUseCase.execute(customer.getId().getValue())).rejects.toThrow('not found');
  });

  it('should throw error when deleting non-existent customer', async () => {
    await expect(deleteUseCase.execute('non-existent-id')).rejects.toThrow(
      'Customer with id non-existent-id not found'
    );
  });
});
