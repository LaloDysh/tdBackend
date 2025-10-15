import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getCustomerRepository } from '../persistence/RepositoryFactory';
import { CreateCustomerUseCase } from '../../application/use-cases/CreateCustomerUseCase';
import { GetCustomerUseCase } from '../../application/use-cases/GetCustomerUseCase';
import { UpdateCustomerUseCase } from '../../application/use-cases/UpdateCustomerUseCase';
import { DeleteCustomerUseCase } from '../../application/use-cases/DeleteCustomerUseCase';
import { ListCustomersUseCase } from '../../application/use-cases/ListCustomersUseCase';
import { AddCreditUseCase } from '../../application/use-cases/AddCreditUseCase';
import { ListCustomersByCreditUseCase } from '../../application/use-cases/ListCustomersByCreditUseCase';
import { CustomerMapper } from './mappers/CustomerMapper';
import { ApiResponse } from './responses/ApiResponse';

// Get repository instance at module load time to ensure it's shared
const repository = getCustomerRepository();

/**
 * Lambda Handler: Create Customer
 */
export const createCustomer = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return ApiResponse.badRequest('Request body is required');
    }

    const dto = JSON.parse(event.body);
    const useCase = new CreateCustomerUseCase(repository);
    const customer = await useCase.execute(dto);

    return ApiResponse.created(CustomerMapper.toResponse(customer));
  } catch (error) {
    if (error instanceof Error) {
      return ApiResponse.badRequest(error.message);
    }
    return ApiResponse.internalError();
  }
};

/**
 * Lambda Handler: Get Customer by ID
 */
export const getCustomer = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return ApiResponse.badRequest('Customer ID is required');
    }

    const useCase = new GetCustomerUseCase(repository);
    const customer = await useCase.execute(id);

    return ApiResponse.success(CustomerMapper.toResponse(customer));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return ApiResponse.notFound(error.message);
      }
      return ApiResponse.badRequest(error.message);
    }
    return ApiResponse.internalError();
  }
};

/**
 * Lambda Handler: Update Customer
 */
export const updateCustomer = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return ApiResponse.badRequest('Customer ID is required');
    }

    if (!event.body) {
      return ApiResponse.badRequest('Request body is required');
    }

    const dto = { ...JSON.parse(event.body), id };
    const useCase = new UpdateCustomerUseCase(repository);
    const customer = await useCase.execute(dto);

    return ApiResponse.success(CustomerMapper.toResponse(customer));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return ApiResponse.notFound(error.message);
      }
      return ApiResponse.badRequest(error.message);
    }
    return ApiResponse.internalError();
  }
};

/**
 * Lambda Handler: Delete Customer
 */
export const deleteCustomer = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return ApiResponse.badRequest('Customer ID is required');
    }

    const useCase = new DeleteCustomerUseCase(repository);
    await useCase.execute(id);

    return ApiResponse.noContent();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return ApiResponse.notFound(error.message);
      }
      return ApiResponse.badRequest(error.message);
    }
    return ApiResponse.internalError();
  }
};

/**
 * Lambda Handler: List All Customers
 */
export const listCustomers = async (): Promise<APIGatewayProxyResult> => {
  try {
    const useCase = new ListCustomersUseCase(repository);
    const customers = await useCase.execute();

    return ApiResponse.success(CustomerMapper.toResponseList(customers));
  } catch (error) {
    if (error instanceof Error) {
      return ApiResponse.badRequest(error.message);
    }
    return ApiResponse.internalError();
  }
};

/**
 * Lambda Handler: Add Credit to Customer
 */
export const addCredit = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return ApiResponse.badRequest('Customer ID is required');
    }

    if (!event.body) {
      return ApiResponse.badRequest('Request body is required');
    }

    const body = JSON.parse(event.body);
    const dto = {
      customerId: id,
      amount: body.amount,
    };

    const useCase = new AddCreditUseCase(repository);
    const customer = await useCase.execute(dto);

    return ApiResponse.success(CustomerMapper.toResponse(customer));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return ApiResponse.notFound(error.message);
      }
      return ApiResponse.badRequest(error.message);
    }
    return ApiResponse.internalError();
  }
};

/**
 * Lambda Handler: List Customers Sorted by Available Credit
 */
export const listCustomersByCredit = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const ascending = event.queryStringParameters?.order === 'asc';
    const useCase = new ListCustomersByCreditUseCase(repository);
    const customers = await useCase.execute(ascending);

    return ApiResponse.success(CustomerMapper.toResponseList(customers));
  } catch (error) {
    if (error instanceof Error) {
      return ApiResponse.badRequest(error.message);
    }
    return ApiResponse.internalError();
  }
};
