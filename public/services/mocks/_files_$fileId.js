/**
 * Mock response for /files/{fileId} endpoint
 * Handles DELETE requests for specific files
 */

// Import shared mock files collection
import { mockFiles } from './_files.js';

export default function(options) {
  // Extract fileId from the endpoint
  // Endpoint pattern: /files/{fileId}
  const urlParts = options.url?.split('/') || [];
  const fileId = urlParts[urlParts.length - 1];
  
  // Handle GET request to get a specific file
  if (!options.method || options.method === 'GET') {
    // Find the file in the mock files collection
    const file = mockFiles.find(file => file.id === fileId);
    
    if (!file) {
      throw {
        status: 404,
        statusText: 'Not Found',
        data: {
          success: false,
          message: `File with ID ${fileId} not found`
        }
      };
    }
    
    return {
      success: true,
      file: {...file}
    };
  }
  
  // Handle DELETE request to remove a file
  if (options.method === 'DELETE') {
    // Find the file in the mock files collection
    const fileIndex = mockFiles.findIndex(file => file.id === fileId);
    
    if (fileIndex === -1) {
      throw {
        status: 404,
        statusText: 'Not Found',
        data: {
          success: false,
          message: `File with ID ${fileId} not found or has already been deleted`
        }
      };
    }
    
    // Remove the file from the collection
    const deletedFile = mockFiles.splice(fileIndex, 1)[0];
    
    return {
      success: true,
      message: `File ${fileId} deleted successfully`,
      id: fileId,
      file: deletedFile
    };
  }
  
  // Handle unsupported methods
  throw {
    status: 405,
    statusText: 'Method Not Allowed',
    data: {
      success: false,
      message: `Method ${options.method} not supported for /files/${fileId} endpoint`
    }
  };
}