/**
 * Mock response for /files/{fileId} endpoint
 * Handles DELETE requests for specific files
 */

// Set to track deleted file IDs
const deletedFileIds = new Set();

export default function(options) {
  // Extract fileId from the endpoint
  // Endpoint pattern: /files/{fileId}
  const urlParts = options.url?.split('/') || [];
  const fileId = urlParts[urlParts.length - 1];
  
  // Handle DELETE request to remove a file
  if (options.method === 'DELETE') {
    // Check if file has already been deleted
    if (deletedFileIds.has(fileId)) {
      throw {
        status: 404,
        statusText: 'Not Found',
        data: {
          success: false,
          message: `File with ID ${fileId} not found or has already been deleted`
        }
      };
    }
    
    // Mark file as deleted
    deletedFileIds.add(fileId);
    
    return {
      success: true,
      message: `File ${fileId} deleted successfully`,
      id: fileId
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