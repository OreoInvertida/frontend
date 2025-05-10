/**
 * Mock response for /operators/transfers endpoint
 * Provides transfer history data and handles transfer requests
 */

// In-memory storage for mock transfer history
export const mockTransferHistory = [
    {
        id: 'transfer-001',
        date: '2023-01-15',
        fromOperator: 'DocuCloud',
        toOperator: 'OREO-FRONT',
        status: 'completed'
    },
    {
        id: 'transfer-002',
        date: '2022-08-22',
        fromOperator: 'GobDigital',
        toOperator: 'DocuCloud',
        status: 'completed'
    }
];

export default function(options) {
  // Handle GET request to list transfer history
  if (!options.method || options.method === 'GET') {
    return {
      success: true,
      transfers: [...mockTransferHistory]
    };
  }
  
  // Handle POST request to create a new transfer
  if (options.method === 'POST') {
    try {
      // Parse request body
      const requestData = typeof options.body === 'string' 
        ? JSON.parse(options.body || '{}') 
        : (options.body || {});
      
      // Get target operator ID
      const targetOperatorId = requestData.targetOperatorId;
      
      if (!targetOperatorId) {
        throw {
          status: 400,
          statusText: 'Bad Request',
          data: {
            success: false,
            message: 'Target operator ID is required for transfer requests'
          }
        };
      }
      
      // Import mock operators to get operator names
      const { mockOperators } = require('./_operators.js');
      
      // Find target operator name
      const targetOperator = mockOperators.find(op => op.id === targetOperatorId);
      if (!targetOperator) {
        throw {
          status: 404,
          statusText: 'Not Found',
          data: {
            success: false,
            message: `Operator with ID ${targetOperatorId} not found`
          }
        };
      }
      
      // Current date for the new transfer
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Create new transfer record
      const newTransfer = {
        id: `transfer-${Date.now().toString().slice(-6)}`,
        date: dateStr,
        fromOperator: 'OREO-FRONT', // Current operator
        toOperator: targetOperator.name,
        status: 'pending'
      };
      
      // Add to mock data store
      mockTransferHistory.unshift(newTransfer);
      
      return {
        success: true,
        transfer: newTransfer,
        message: `Transfer request to ${targetOperator.name} has been submitted successfully`
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
          message: 'Error processing transfer request'
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
      message: `Method ${options.method} not supported for /operators/transfers endpoint`
    }
  };
}