/**
 * Mock response for /files/{fileId}/certify endpoint
 * Handles certification requests for specific files
 */

// Import the mock files collection from the main files mock
import { mockFiles } from './_files.js';

export default function(options) {
  // Extract fileId from the endpoint
  // Endpoint pattern: /files/{fileId}/certify
  const urlParts = options.url?.split('/') || [];
  const fileId = urlParts[urlParts.length - 2]; // Second-to-last part is the fileId
  
  // Handle POST request to certify a file
  if (options.method === 'POST') {
    try {
      // Parse request body
      const requestData = typeof options.body === 'string' 
        ? JSON.parse(options.body || '{}') 
        : (options.body || {});
      
      // Get document name from request (which may come as documentTitle)
      const documentName = requestData.documentTitle || requestData.name;
      
      if (!documentName) {
        throw {
          status: 400,
          statusText: 'Bad Request',
          data: {
            success: false,
            message: 'Document name is required for certification'
          }
        };
      }
      
      // Find the file in the mock files collection
      const fileIndex = mockFiles.findIndex(file => file.id === fileId);
      
      if (fileIndex === -1) {
        throw {
          status: 404,
          statusText: 'Not Found',
          data: {
            success: false,
            message: `File with ID ${fileId} not found`
          }
        };
      }
      
      // Toggle certification status
      const newStatus = !mockFiles[fileIndex].isCertified;
      mockFiles[fileIndex].isCertified = newStatus;
      
      return {
        success: true,
        fileId: fileId,
        name: documentName,
        isCertified: newStatus,
        message: newStatus 
          ? `File "${documentName}" (ID: ${fileId}) has been certified successfully` 
          : `Certification for file "${documentName}" (ID: ${fileId}) has been removed`
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
          message: 'Error processing certification request'
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
      message: `Method ${options.method} not supported for /files/${fileId}/certify endpoint`
    }
  };
}