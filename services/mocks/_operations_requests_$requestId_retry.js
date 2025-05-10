/**
 * Mock response for /operations/requests/{requestId}/retry endpoint
 * Handles POST requests to retry a failed document request
 */

// Import the mock requests collection
import { mockRequests } from './_operations_requests.js';

export default function(options) {
  // Extract requestId from the endpoint
  // Endpoint pattern: /operations/requests/{requestId}/retry
  const urlParts = options.url?.split('/') || [];
  const requestId = urlParts[urlParts.length - 2]; // Second-to-last part is the requestId
  
  // Handle POST request to retry a failed request
  if (options.method === 'POST') {
    // Find the request in the mock requests collection
    const requestIndex = mockRequests.findIndex(req => req.id === requestId);
    
    if (requestIndex === -1) {
      throw {
        status: 404,
        statusText: 'Not Found',
        data: {
          success: false,
          message: `Request with ID ${requestId} not found`
        }
      };
    }
    
    // Update the request status to pending
    mockRequests[requestIndex].status = 'pending';
    
    return {
      success: true,
      request: mockRequests[requestIndex],
      message: `Request ${requestId} has been retried and is now pending`
    };
  }
  
  // Handle unsupported methods
  throw {
    status: 405,
    statusText: 'Method Not Allowed',
    data: {
      success: false,
      message: `Method ${options.method} not supported for /operations/requests/${requestId}/retry endpoint`
    }
  };
}