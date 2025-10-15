/**
 * Local test script to verify repository singleton behavior
 * Run with: npx ts-node test-local.ts
 */

import { createCustomer, getCustomer, listCustomers } from './src/infrastructure/api/handler';
import { APIGatewayProxyEvent } from 'aws-lambda';

async function testRepositorySingleton() {
  console.log('=== Testing Repository Singleton ===\n');

  // Test 1: Create a customer
  console.log('1. Creating a customer...');
  const createEvent: Partial<APIGatewayProxyEvent> = {
    body: JSON.stringify({
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
    }),
  } as APIGatewayProxyEvent;

  const createResult = await createCustomer(createEvent as APIGatewayProxyEvent);
  console.log('Create response:', createResult);

  if (createResult.statusCode !== 201) {
    console.error('❌ Failed to create customer');
    return;
  }

  const createdCustomer = JSON.parse(createResult.body);
  const customerId = createdCustomer.data.id;
  console.log(`✅ Customer created with ID: ${customerId}\n`);

  // Test 2: Get the customer
  console.log('2. Getting the customer...');
  const getEvent = {
    pathParameters: {
      id: customerId,
    },
  } as unknown as APIGatewayProxyEvent;

  const getResult = await getCustomer(getEvent);
  console.log('Get response:', getResult);

  if (getResult.statusCode === 200) {
    console.log('✅ Customer retrieved successfully!\n');
  } else {
    console.error('❌ Failed to retrieve customer - Singleton not working!\n');
  }

  // Test 3: List all customers
  console.log('3. Listing all customers...');
  const listResult = await listCustomers();
  console.log('List response:', listResult);

  const customers = JSON.parse(listResult.body);
  console.log(`✅ Found ${customers.data.length} customer(s)\n`);

  console.log('=== Test Complete ===');
}

testRepositorySingleton().catch(console.error);
