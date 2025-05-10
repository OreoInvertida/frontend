/**
 * Mock response for /operations/{operationId} endpoint
 * Handles GET requests for specific operation details
 */

// Import the mock operations collection 
import { mockOperations } from './_operations.js';

export default function(options) {
  // Extract operationId from the endpoint
  // Endpoint pattern: /operations/{operationId}
  const urlParts = options.url?.split('/') || [];
  const operationId = urlParts[urlParts.length - 1];
  
  // Handle GET request to get operation details
  if (!options.method || options.method === 'GET') {
    // Find the operation in the mock operations collection
    const operation = mockOperations.find(op => op.id === operationId);
    
    if (!operation) {
      throw {
        status: 404,
        statusText: 'Not Found',
        data: {
          success: false,
          message: `Operation with ID ${operationId} not found`
        }
      };
    }
    
    // Create a more detailed response for the operation details
    return {
      success: true,
      operation: {
        id: operation.id,
        type: operation.type,
        document: operation.document,
        entity: operation.entity,
        createdDate: '2025-05-01T10:30:00',
        status: operation.status,
        description: `${operation.type} de ${operation.document}`,
        requestedBy: 'Juan Pérez',
        events: [
          { date: '2025-05-01T10:30:00', description: 'Solicitud creada' },
          { date: '2025-05-01T10:35:00', description: 'Solicitud enviada a la entidad' },
          { date: '2025-05-01T11:45:00', description: 'Solicitud recibida por la entidad' }
        ]
      }
    };
  }
  
  // Handle DELETE request to remove an operation
  if (options.method === 'DELETE') {
    // Find the operation in the mock operations collection
    const operationIndex = mockOperations.findIndex(op => op.id === operationId);
    
    if (operationIndex === -1) {
      throw {
        status: 404,
        statusText: 'Not Found',
        data: {
          success: false,
          message: `Operation with ID ${operationId} not found or has already been deleted`
        }
      };
    }
    
    // Remove the operation from the collection
    const deletedOperation = mockOperations.splice(operationIndex, 1)[0];
    
    return {
      success: true,
      message: `Operation ${operationId} deleted successfully`,
      id: operationId,
      operation: deletedOperation
    };
  }
  
  // Handle unsupported methods
  throw {
    status: 405,
    statusText: 'Method Not Allowed',
    data: {
      success: false,
      message: `Method ${options.method} not supported for /operations/${operationId} endpoint`
    }
  };
}