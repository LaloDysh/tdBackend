import { Customer } from '../Customer';
import { Email } from '../../value-objects/Email';
import { PhoneNumber } from '../../value-objects/PhoneNumber';
import { Address } from '../../value-objects/Address';
import { Money } from '../../value-objects/Money';

describe('Customer Entity', () => {
  const validEmail = Email.create('john@example.com');
  const validPhone = PhoneNumber.create('+34612345678');
  const validAddress = Address.create('Main St 123', 'Madrid', '28001', 'Spain');

  describe('create', () => {
    it('should create a customer with valid data', () => {
      const customer = Customer.create('John', 'Doe', validEmail, validPhone, validAddress);

      expect(customer.getFirstName()).toBe('John');
      expect(customer.getLastName()).toBe('Doe');
      expect(customer.getFullName()).toBe('John Doe');
      expect(customer.getEmail()).toBe(validEmail);
      expect(customer.getPhoneNumber()).toBe(validPhone);
      expect(customer.getAddress()).toBe(validAddress);
      expect(customer.getAvailableCredit().getAmount()).toBe(0);
    });

    it('should create a customer with initial credit', () => {
      const credit = Money.fromAmount(100);
      const customer = Customer.create('John', 'Doe', validEmail, validPhone, validAddress, credit);

      expect(customer.getAvailableCredit().getAmount()).toBe(100);
    });

    it('should throw error for empty first name', () => {
      expect(() =>
        Customer.create('', 'Doe', validEmail, validPhone, validAddress)
      ).toThrow('First name cannot be empty');
    });

    it('should throw error for empty last name', () => {
      expect(() =>
        Customer.create('John', '', validEmail, validPhone, validAddress)
      ).toThrow('Last name cannot be empty');
    });

    it('should trim whitespace from names', () => {
      const customer = Customer.create('  John  ', '  Doe  ', validEmail, validPhone, validAddress);

      expect(customer.getFirstName()).toBe('John');
      expect(customer.getLastName()).toBe('Doe');
    });
  });

  describe('addCredit', () => {
    it('should add credit to customer', () => {
      const customer = Customer.create('John', 'Doe', validEmail, validPhone, validAddress);
      const creditToAdd = Money.fromAmount(50);

      customer.addCredit(creditToAdd);

      expect(customer.getAvailableCredit().getAmount()).toBe(50);
    });

    it('should accumulate multiple credit additions', () => {
      const customer = Customer.create('John', 'Doe', validEmail, validPhone, validAddress);

      customer.addCredit(Money.fromAmount(30));
      customer.addCredit(Money.fromAmount(20));

      expect(customer.getAvailableCredit().getAmount()).toBe(50);
    });

    it('should throw error for non-positive credit amount', () => {
      const customer = Customer.create('John', 'Doe', validEmail, validPhone, validAddress);

      expect(() => customer.addCredit(Money.zero())).toThrow('Credit amount must be positive');
    });

    it('should update updatedAt timestamp', (done) => {
      const customer = Customer.create('John', 'Doe', validEmail, validPhone, validAddress);
      const originalUpdatedAt = customer.getUpdatedAt();

      setTimeout(() => {
        customer.addCredit(Money.fromAmount(10));
        expect(customer.getUpdatedAt().getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
        done();
      }, 10);
    });
  });

  describe('updateInformation', () => {
    it('should update customer information', () => {
      const customer = Customer.create('John', 'Doe', validEmail, validPhone, validAddress);

      const newEmail = Email.create('jane@example.com');
      const newPhone = PhoneNumber.create('+34687654321');
      const newAddress = Address.create('New St 456', 'Barcelona', '08001', 'Spain');

      customer.updateInformation('Jane', 'Smith', newEmail, newPhone, newAddress);

      expect(customer.getFirstName()).toBe('Jane');
      expect(customer.getLastName()).toBe('Smith');
      expect(customer.getEmail()).toBe(newEmail);
      expect(customer.getPhoneNumber()).toBe(newPhone);
      expect(customer.getAddress()).toBe(newAddress);
    });

    it('should update updatedAt timestamp', (done) => {
      const customer = Customer.create('John', 'Doe', validEmail, validPhone, validAddress);
      const originalUpdatedAt = customer.getUpdatedAt();

      setTimeout(() => {
        customer.updateInformation('Jane', 'Smith', validEmail, validPhone, validAddress);
        expect(customer.getUpdatedAt().getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
        done();
      }, 10);
    });
  });

  describe('equals', () => {
    it('should return true for customers with same ID', () => {
      const customer1 = Customer.create('John', 'Doe', validEmail, validPhone, validAddress);
      const customer2 = Customer.reconstitute(
        customer1.getId(),
        'Jane',
        'Smith',
        validEmail,
        validPhone,
        validAddress,
        Money.zero(),
        new Date(),
        new Date()
      );

      expect(customer1.equals(customer2)).toBe(true);
    });

    it('should return false for customers with different IDs', () => {
      const customer1 = Customer.create('John', 'Doe', validEmail, validPhone, validAddress);
      const customer2 = Customer.create('Jane', 'Smith', validEmail, validPhone, validAddress);

      expect(customer1.equals(customer2)).toBe(false);
    });
  });
});
