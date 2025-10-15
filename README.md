# TaxDown Motorbike Shop - Customer Management API

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- AWS CLI configured (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/LaloDysh/tdBackend.git
cd td

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Local Development

```bash
# Start serverless offline (simulates API Gateway locally)
npm run dev

# The API will be available at http://localhost:3000
```

## API Documentation

### Base URL

- **Local**: `http://localhost:3000`
- **Production**: `https://<api-id>.execute-api.<region>.amazonaws.com/<stage>`

### Endpoints

#### 1. Create Customer

**POST** `/customers`

Creates a new customer in the system.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+34612345678",
  "address": {
    "street": "Calle Gran Via 123",
    "city": "Madrid",
    "postalCode": "28013",
    "country": "Spain"
  },
  "availableCredit": 100.50
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+34612345678",
    "address": {
      "street": "Calle Gran Via 123",
      "city": "Madrid",
      "postalCode": "28013",
      "country": "Spain"
    },
    "availableCredit": {
      "amount": 100.50,
      "currency": "EUR"
    },
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### 2. Get Customer

**GET** `/customers/{id}`

Retrieves a customer by ID.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "John",
    "lastName": "Doe",
    ...
  }
}
```

#### 3. Update Customer

**PUT** `/customers/{id}`

Updates an existing customer's information.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phoneNumber": "+34687654321",
  "address": {
    "street": "Calle Nueva 456",
    "city": "Barcelona",
    "postalCode": "08001",
    "country": "Spain"
  }
}
```

**Response:** `200 OK`

#### 4. Delete Customer

**DELETE** `/customers/{id}`

Deletes a customer from the system.

**Response:** `204 No Content`

#### 5. List All Customers

**GET** `/customers`

Retrieves all customers.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "firstName": "John",
      "lastName": "Doe",
      ...
    }
  ]
}
```

#### 6. Add Credit to Customer

**POST** `/customers/{id}/credit`

Adds available credit to a customer's account.

**Request Body:**
```json
{
  "amount": 50.00
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "availableCredit": {
      "amount": 150.50,
      "currency": "EUR"
    },
    ...
  }
}
```

#### 7. List Customers by Credit

**GET** `/customers/sorted/by-credit?order=desc`

Lists all customers sorted by available credit.

**Query Parameters:**
- `order`: `asc` (ascending) or `desc` (descending, default)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "firstName": "HighCredit",
      "availableCredit": {
        "amount": 500.00,
        "currency": "EUR"
      },
      ...
    },
    {
      "id": "...",
      "firstName": "LowCredit",
      "availableCredit": {
        "amount": 50.00,
        "currency": "EUR"
      },
      ...
    }
  ]
}
```

### Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

**Status Codes:**
- `400 Bad Request`: Invalid input or validation error
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Testing

This project has comprehensive test coverage including unit and integration tests.

### Run All Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Specific Test Suites

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Watch mode for TDD
npm run test:watch
```

### Test Coverage Goals

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%