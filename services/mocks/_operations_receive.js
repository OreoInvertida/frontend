/**
 * Mock response for /operations/receive endpoint
 * Handles POST requests to confirm document receipt
 */

// Import the mock operations and requests collections
import { mockOperations } from './_operations.js';
import { mockRequests } from './_operations_requests.js';

export default function(options) {
  // Handle POST request to confirm document receipt
  if (options.method === 'POST') {
    try {
      // Parse request body
      const requestData = typeof options.body === 'string' 
        ? JSON.parse(options.body || '{}') 
        : (options.body || {});
      
      // Get receive code
      const receiveCode = requestData.receiveCode;
      const receiveNotes = requestData.receiveNotes || '';
      
      if (!receiveCode) {
        throw {
          status: 400,
          statusText: 'Bad Request',
          data: {
            success: false,
            message: 'Código de recepción es requerido'
          }
        };
      }
      
      // Create new operation for the received document
      const newOperation = {
        id: `OP${Date.now().toString().slice(-6)}`,
        type: 'Recepción',
        document: 'Documento Recibido',
        entity: 'Entidad Remitente',
        status: 'completed'
      };
      
      // Add to mock operations
      mockOperations.unshift(newOperation);
      
      return {
        success: true,
        operation: newOperation,
        message: 'Recepción confirmada correctamente'
      };
    } catch (error) {
      if (error.status) {
        throw error;
      }
      
      throw {
        status: 500,
        statusText: 'Internal Server Error',
        data: {
          success: false,
          message: 'Error procesando la confirmación de recepción'
        }
      };
    }
  }
  
  // Handle unsupported methods
  throw {
    status: 405,
    statusText: 'Method Not Allowed',
    data: {
      success: false,
      message: `Method ${options.method} not supported for /operations/receive endpoint`
    }
  };
}