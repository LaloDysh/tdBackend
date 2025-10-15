import { Customer } from '../../../domain/entities/Customer';

/**
 * Mapper to convert Customer entity to API response format
 * Separates domain model from API representation
 */
export class CustomerMapper {
  public static toResponse(customer: Customer): Record<string, unknown> {
    return {
      id: customer.getId().getValue(),
      firstName: customer.getFirstName(),
      lastName: customer.getLastName(),
      fullName: customer.getFullName(),
      email: customer.getEmail().getValue(),
      phoneNumber: customer.getPhoneNumber().getValue(),
      address: {
        street: customer.getAddress().getStreet(),
        city: customer.getAddress().getCity(),
        postalCode: customer.getAddress().getPostalCode(),
        country: customer.getAddress().getCountry(),
      },
      availableCredit: {
        amount: customer.getAvailableCredit().getAmount(),
        currency: customer.getAvailableCredit().getCurrency(),
      },
      createdAt: customer.getCreatedAt().toISOString(),
      updatedAt: customer.getUpdatedAt().toISOString(),
    };
  }

  public static toResponseList(customers: Customer[]): Record<string, unknown>[] {
    return customers.map((customer) => this.toResponse(customer));
  }
}
