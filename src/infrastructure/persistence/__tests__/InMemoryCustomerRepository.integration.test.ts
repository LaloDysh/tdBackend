import { InMemoryCustomerRepository } from '../InMemoryCustomerRepository';
import { Customer } from '../../../domain/entities/Customer';
import { Email } from '../../../domain/value-objects/Email';
import { PhoneNumber } from '../../../domain/value-objects/PhoneNumber';
import { Address } from '../../../domain/value-objects/Address';
import { Money } from '../../../domain/value-objects/Money';

describe('InMemoryCustomerRepository Integration Tests', () => {
  let repository: InMemoryCustomerRepository;

  beforeEach(() => {
    repository = new InMemoryCustomerRepository();
  });

  afterEach(() => {
    repository.clear();
  });

  it('should save and retrieve a customer', async () => {
    const customer = Customer.create(
      'John',
      'Doe',
      Email.create('john@example.com'),
      PhoneNumber.create('+34612345678'),
      Address.create('Main St 123', 'Madrid', '28001', 'Spain')
    );

    await repository.save(customer);
    const retrieved = await repository.findById(customer.getId());

    expect(retrieved).toBeDefined();
    expect(retrieved?.getId().equals(customer.getId())).toBe(true);
  });

  it('should return null for non-existent customer', async () => {
    const customer = Customer.create(
      'John',
      'Doe',
      Email.create('john@example.com'),
      PhoneNumber.create('+34612345678'),
      Address.create('Main St 123', 'Madrid', '28001', 'Spain')
    );

    const retrieved = await repository.findById(customer.getId());
    expect(retrieved).toBeNull();
  });

  it('should update an existing customer', async () => {
    const customer = Customer.create(
      'John',
      'Doe',
      Email.create('john@example.com'),
      PhoneNumber.create('+34612345678'),
      Address.create('Main St 123', 'Madrid', '28001', 'Spain')
    );

    await repository.save(customer);

    customer.addCredit(Money.fromAmount(100));
    await repository.update(customer);

    const retrieved = await repository.findById(customer.getId());
    expect(retrieved?.getAvailableCredit().getAmount()).toBe(100);
  });

  it('should throw error when updating non-existent customer', async () => {
    const customer = Customer.create(
      'John',
      'Doe',
      Email.create('john@example.com'),
      PhoneNumber.create('+34612345678'),
      Address.create('Main St 123', 'Madrid', '28001', 'Spain')
    );

    await expect(repository.update(customer)).rejects.toThrow('not found');
  });

  it('should delete a customer', async () => {
    const customer = Customer.create(
      'John',
      'Doe',
      Email.create('john@example.com'),
      PhoneNumber.create('+34612345678'),
      Address.create('Main St 123', 'Madrid', '28001', 'Spain')
    );

    await repository.save(customer);
    await repository.delete(customer.getId());

    const retrieved = await repository.findById(customer.getId());
    expect(retrieved).toBeNull();
  });

  it('should find all customers', async () => {
    const customer1 = Customer.create(
      'John',
      'Doe',
      Email.create('john@example.com'),
      PhoneNumber.create('+34612345678'),
      Address.create('Main St 123', 'Madrid', '28001', 'Spain')
    );

    const customer2 = Customer.create(
      'Jane',
      'Smith',
      Email.create('jane@example.com'),
      PhoneNumber.create('+34687654321'),
      Address.create('Second St 456', 'Barcelona', '08001', 'Spain')
    );

    await repository.save(customer1);
    await repository.save(customer2);

    const customers = await repository.findAll();
    expect(customers).toHaveLength(2);
  });

  it('should sort customers by credit', async () => {
    const customer1 = Customer.create(
      'Alice',
      'Low',
      Email.create('alice@example.com'),
      PhoneNumber.create('+34612345678'),
      Address.create('St 1', 'Madrid', '28001', 'Spain'),
      Money.fromAmount(50)
    );

    const customer2 = Customer.create(
      'Bob',
      'High',
      Email.create('bob@example.com'),
      PhoneNumber.create('+34687654321'),
      Address.create('St 2', 'Madrid', '28002', 'Spain'),
      Money.fromAmount(150)
    );

    const customer3 = Customer.create(
      'Charlie',
      'Medium',
      Email.create('charlie@example.com'),
      PhoneNumber.create('+34623456789'),
      Address.create('St 3', 'Madrid', '28003', 'Spain'),
      Money.fromAmount(100)
    );

    await repository.save(customer1);
    await repository.save(customer2);
    await repository.save(customer3);

    const sortedDesc = await repository.findAllSortedByCredit(false);
    expect(sortedDesc[0].getFirstName()).toBe('Bob');
    expect(sortedDesc[1].getFirstName()).toBe('Charlie');
    expect(sortedDesc[2].getFirstName()).toBe('Alice');

    const sortedAsc = await repository.findAllSortedByCredit(true);
    expect(sortedAsc[0].getFirstName()).toBe('Alice');
    expect(sortedAsc[1].getFirstName()).toBe('Charlie');
    expect(sortedAsc[2].getFirstName()).toBe('Bob');
  });
});
