/**
 * Mock response for /files/{fileId}/download endpoint
 * Handles GET requests for downloading specific files
 */

// Import shared mock files collection
import { mockFiles } from './_files.js';

export default function(options) {
  // Extract fileId from the endpoint
  // Endpoint pattern: /files/{fileId}/download
  const urlParts = options.url?.split('/') || [];
  const fileId = urlParts[urlParts.length - 2]; // -2 because the last part is "download"
  
  // Handle GET request to download a file
  if (!options.method || options.method === 'GET') {
    // Find the file in the mock files collection
    const file = mockFiles.find(file => file.id === fileId);
    
    if (file) {
      // Generate a mock download URL that includes file name for realism
      const downloadUrl = `https://example.com/download/${fileId}/${file.name}?token=mock-token-${Date.now()}`;
      
      // Include information about certification status in the response
      return {
        success: true,
        documentTitle: file.documentTitle,
        mimeType: file.mimeType,
        isCertified: file.isCertified,
        downloadUrl: downloadUrl
      };
    } else {
      // File doesn't exist
      throw {
        status: 404,
        statusText: 'Not Found',
        data: {
          success: false,
          message: `File with ID ${fileId} not found`
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
      message: `Method ${options.method} not supported for /files/${fileId}/download endpoint`
    }
  };
}