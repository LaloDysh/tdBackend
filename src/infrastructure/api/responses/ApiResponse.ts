import { APIGatewayProxyResult } from 'aws-lambda';

/**
 * Standardized API Response format
 * Ensures consistency across all endpoints
 */
export class ApiResponse {
  public static success(data: unknown, statusCode: number = 200): APIGatewayProxyResult {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        success: true,
        data,
      }),
    };
  }

  public static created(data: unknown): APIGatewayProxyResult {
    return this.success(data, 201);
  }

  public static noContent(): APIGatewayProxyResult {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: '',
    };
  }

  public static error(message: string, statusCode: number = 400): APIGatewayProxyResult {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        success: false,
        error: {
          message,
        },
      }),
    };
  }

  public static badRequest(message: string): APIGatewayProxyResult {
    return this.error(message, 400);
  }

  public static notFound(message: string): APIGatewayProxyResult {
    return this.error(message, 404);
  }

  public static internalError(message: string = 'Internal server error'): APIGatewayProxyResult {
    return this.error(message, 500);
  }
}
