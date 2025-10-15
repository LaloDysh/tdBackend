import * as fs from 'fs';
import * as path from 'path';
import { Customer } from '../../domain/entities/Customer';
import { CustomerId } from '../../domain/value-objects/CustomerId';
import { Email } from '../../domain/value-objects/Email';
import { PhoneNumber } from '../../domain/value-objects/PhoneNumber';
import { Money } from '../../domain/value-objects/Money';
import { Address } from '../../domain/value-objects/Address';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';

/**
 * File-based implementation of CustomerRepository
 * Stores customer data in a JSON file for persistence across serverless-offline restarts
 * This is ideal for local development
 */

interface CustomerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  availableCreditInCents: number;
  createdAt: string;
  updatedAt: string;
}

export class FileCustomerRepository implements CustomerRepository {
  private readonly dbPath: string;

  constructor(dbPath: string = path.join(process.cwd(), 'data', 'customers.db.json')) {
    this.dbPath = dbPath;
    this.ensureDbExists();
  }

  private ensureDbExists(): void {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.dbPath)) {
      fs.writeFileSync(this.dbPath, JSON.stringify([], null, 2), 'utf-8');
      console.log(`[FileCustomerRepository] Created database file at ${this.dbPath}`);
    }
  }

  private readDb(): CustomerData[] {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('[FileCustomerRepository] Error reading database:', error);
      return [];
    }
  }

  private writeDb(customers: CustomerData[]): void {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(customers, null, 2), 'utf-8');
    } catch (error) {
      console.error('[FileCustomerRepository] Error writing database:', error);
      throw error;
    }
  }

  private customerToData(customer: Customer): CustomerData {
    return {
      id: customer.getId().getValue(),
      firstName: customer.getFirstName(),
      lastName: customer.getLastName(),
      email: customer.getEmail().getValue(),
      phoneNumber: customer.getPhoneNumber().getValue(),
      address: {
        street: customer.getAddress().getStreet(),
        city: customer.getAddress().getCity(),
        postalCode: customer.getAddress().getPostalCode(),
        country: customer.getAddress().getCountry(),
      },
      availableCreditInCents: customer.getAvailableCredit().getAmountInCents(),
      createdAt: customer.getCreatedAt().toISOString(),
      updatedAt: customer.getUpdatedAt().toISOString(),
    };
  }

  private dataToCustomer(data: CustomerData): Customer {
    return Customer.reconstitute(
      CustomerId.fromString(data.id),
      data.firstName,
      data.lastName,
      Email.create(data.email),
      PhoneNumber.create(data.phoneNumber),
      Address.create(
        data.address.street,
        data.address.city,
        data.address.postalCode,
        data.address.country
      ),
      Money.fromCents(data.availableCreditInCents),
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }

  public async save(customer: Customer): Promise<void> {
    const customers = this.readDb();
    const customerData = this.customerToData(customer);
    customers.push(customerData);
    this.writeDb(customers);
    console.log(`[FileCustomerRepository] Saved customer ${customer.getId().getValue()}, total count: ${customers.length}`);
  }

  public async findById(id: CustomerId): Promise<Customer | null> {
    const customers = this.readDb();
    const customerData = customers.find((c) => c.id === id.getValue());

    if (!customerData) {
      console.log(`[FileCustomerRepository] Customer ${id.getValue()} not found, total count: ${customers.length}`);
      return null;
    }

    console.log(`[FileCustomerRepository] Found customer ${id.getValue()}`);
    return this.dataToCustomer(customerData);
  }

  public async findAll(): Promise<Customer[]> {
    const customers = this.readDb();
    console.log(`[FileCustomerRepository] Found ${customers.length} customers`);
    return customers.map((data) => this.dataToCustomer(data));
  }

  public async update(customer: Customer): Promise<void> {
    const customers = this.readDb();
    const index = customers.findIndex((c) => c.id === customer.getId().getValue());

    if (index === -1) {
      throw new Error(`Customer with id ${customer.getId().getValue()} not found`);
    }

    customers[index] = this.customerToData(customer);
    this.writeDb(customers);
    console.log(`[FileCustomerRepository] Updated customer ${customer.getId().getValue()}`);
  }

  public async delete(id: CustomerId): Promise<void> {
    const customers = this.readDb();
    const index = customers.findIndex((c) => c.id === id.getValue());

    if (index === -1) {
      throw new Error(`Customer with id ${id.getValue()} not found`);
    }

    customers.splice(index, 1);
    this.writeDb(customers);
    console.log(`[FileCustomerRepository] Deleted customer ${id.getValue()}, remaining count: ${customers.length}`);
  }

  public async findAllSortedByCredit(ascending: boolean = false): Promise<Customer[]> {
    const customers = this.readDb();

    const sorted = customers.sort((a, b) => {
      return ascending
        ? a.availableCreditInCents - b.availableCreditInCents
        : b.availableCreditInCents - a.availableCreditInCents;
    });

    console.log(`[FileCustomerRepository] Found ${sorted.length} customers sorted by credit`);
    return sorted.map((data) => this.dataToCustomer(data));
  }

  // Test helper methods
  public clear(): void {
    this.writeDb([]);
    console.log('[FileCustomerRepository] Cleared all customers');
  }

  public getCount(): number {
    return this.readDb().length;
  }
}
