/**
 * Mock response for /operations/{operationId}/retry endpoint
 * Handles POST requests to retry a failed operation
 */

// Import the mock operations collection
import { mockOperations } from './_operations.js';

export default function(options) {
  // Extract operationId from the endpoint
  // Endpoint pattern: /operations/{operationId}/retry
  const urlParts = options.url?.split('/') || [];
  const operationId = urlParts[urlParts.length - 2]; // Second-to-last part is the operationId
  
  // Handle POST request to retry a failed operation
  if (options.method === 'POST') {
    // Find the operation in the mock operations collection
    const operationIndex = mockOperations.findIndex(op => op.id === operationId);
    
    if (operationIndex === -1) {
      throw {
        status: 404,
        statusText: 'Not Found',
        data: {
          success: false,
          message: `Operation with ID ${operationId} not found`
        }
      };
    }
    
    // Update the operation status to pending
    mockOperations[operationIndex].status = 'pending';
    
    return {
      success: true,
      operation: mockOperations[operationIndex],
      message: `Operation ${operationId} has been retried and is now pending`
    };
  }
  
  // Handle unsupported methods
  throw {
    status: 405,
    statusText: 'Method Not Allowed',
    data: {
      success: false,
      message: `Method ${options.method} not supported for /operations/${operationId}/retry endpoint`
    }
  };
}